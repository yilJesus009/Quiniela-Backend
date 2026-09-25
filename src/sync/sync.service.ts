import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cron from 'node-cron';
import { ILike, Repository } from 'typeorm';
import { Match, MatchPhase, MatchStatus } from '../matches/match.entity';
import { PredictionsService } from '../predictions/predictions.service';
import { Stadium } from '../stadiums/stadium.entity';

type SportsDbEvent = {
  idEvent?: string | null;
  strEvent?: string | null;
  strHomeTeam?: string | null;
  strAwayTeam?: string | null;
  strLeague?: string | null;
  strRound?: string | null;
  intRound?: string | null;
  dateEvent?: string | null;
  strTime?: string | null;
  strTimestamp?: string | null;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
  strStatus?: string | null;

  strVenue?: string | null;
  strCity?: string | null;
};

type SportsDbDayResponse = {
  events?: SportsDbEvent[] | null;
};

type SyncResult = {
  date: string;
  imported: number;
  updated: number;
  skipped: number;
  events_found: number;
};

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  //guarda en memoria la ultima sincronizacion para mostrarla en el dashboard admin.
  private lastSyncedAt: Date | null = null;

  constructor(
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,

    @InjectRepository(Stadium)
    private stadiumRepo: Repository<Stadium>,

    private predictionsService: PredictionsService,
    private config: ConfigService,
  ) {
    if (this.config.get('NODE_ENV') !== 'test') {
      this.startCronJob();
    }
  }

  private startCronJob() {
    cron.schedule('*/20 * * * *', async () => {
      this.logger.log('Iniciando sincronizacion de resultados...');
      await this.syncTodayMatches();
    });
    this.logger.log('Cron de sincronizacion activo (cada 20 min)');
  }
  // ====================================================================================================================================
  //adapta el formato de fecha
  async syncTodayMatches() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const result = await this.syncMatchesByDate(dateStr);

    this.logger.log(
      `Sincronizacion completada. Importados: ${result.imported}, actualizados: ${result.updated}, omitidos: ${result.skipped}.`,
    );
  }
  // ====================================================================================================================================
  async syncMatchesByDate(date: string): Promise<SyncResult> {
    // actualiza la fecha de ultima sincronizacion cuando se ejecuta este flujo.
    this.lastSyncedAt = new Date();

    const events = await this.fetchSportsDbEventsByDate(date);
    let imported = 0;
    let updated = 0;
    let skipped = 0;

    if (events.length === 0) {
      this.logger.log(`Sin eventos de TheSportsDB para ${date}.`);
      return { date, imported, updated, skipped, events_found: 0 };
    }

    for (const event of events) {
      if (!this.isUsableEvent(event)) {
        skipped++;
        continue;
      }

      const before = await this.matchRepo.findOne({
        where: { externalId: event.idEvent as string },
      });
      const match = await this.upsertMatchFromEvent(event);
      if (!before) imported++;

      const changed = await this.updateMatchScoreFromEvent(match, event);
      if (changed) updated++;
    }

    return {
      date,
      imported,
      updated,
      skipped,
      events_found: events.length,
    };
  }

  // ====================================================================================================================================

  private async fetchSportsDbEventsByDate(
    date: string,
  ): Promise<SportsDbEvent[]> {
    const leagueId = this.config.getOrThrow<string>('SPORTSDB_LEAGUE_ID');

    const { data } = await axios.get<SportsDbDayResponse>(
      this.buildSportsDbUrl('eventsday.php'),
      {
        params: {
          d: date,
          s: 'Soccer',
          l: leagueId,
        },
        timeout: 5000,
      },
    );
    console.log(JSON.stringify(data, null, 2));
    return data.events ?? [];
  }

  // ====================================================================================================================================
  async syncMatchesByRange(start: string, end: string) {
    const results: SyncResult[] = [];

    const current = new Date(start);
    const finish = new Date(end);

    while (current <= finish) {
      const date = current.toISOString().split('T')[0];

      this.logger.log(`Sincronizando ${date}`);

      const result = await this.syncMatchesByDate(date);

      results.push(result);

      current.setDate(current.getDate() + 1);
    }

    return {
      start,
      end,
      total_days: results.length,
      imported: results.reduce((a, b) => a + b.imported, 0),
      updated: results.reduce((a, b) => a + b.updated, 0),
      skipped: results.reduce((a, b) => a + b.skipped, 0),
      events_found: results.reduce((a, b) => a + b.events_found, 0),
      details: results,
    };
  }
  // ====================================================================================================================================
  private async upsertMatchFromEvent(event: SportsDbEvent): Promise<Match> {
    const externalId = event.idEvent as string;
    const matchDate = this.parseEventDate(event);

    let stadium: Stadium | null = null;

    if (event.strVenue) {
      stadium = await this.stadiumRepo.findOne({
        where: {
          name: ILike(event.strVenue),
        },
      });
    }

    let match = await this.matchRepo.findOne({ where: { externalId } });
    if (!match) {
      match = await this.findExistingMatchByTeamsAndDate(event, matchDate);
    }

    if (!match) {
      match = this.matchRepo.create({
        homeTeam: event.strHomeTeam as string,
        awayTeam: event.strAwayTeam as string,
        matchDate,
        phase: this.mapPhase(event),
        status: this.mapStatus(event.strStatus ?? ''),
        externalId,
      });
    } else {
      match.externalId = externalId;
      match.homeTeam = event.strHomeTeam ?? match.homeTeam;
      match.awayTeam = event.strAwayTeam ?? match.awayTeam;
      match.matchDate = matchDate;
      match.phase = this.mapPhase(event);
      match.status = this.mapStatus(event.strStatus ?? '');
    }
    if (stadium) {
      match.stadiumId = stadium.id;
    }
    const saved = await this.matchRepo.save(match);
    return saved;
  }
  // ====================================================================================================================================
  private async findExistingMatchByTeamsAndDate(
    event: SportsDbEvent,
    matchDate: Date,
  ): Promise<Match | null> {
    return this.matchRepo
      .createQueryBuilder('m')
      .where('DATE(m.match_date) = :date', {
        date: matchDate.toISOString().split('T')[0],
      })
      .andWhere('LOWER(m.home_team) = LOWER(:homeTeam)', {
        homeTeam: event.strHomeTeam,
      })
      .andWhere('LOWER(m.away_team) = LOWER(:awayTeam)', {
        awayTeam: event.strAwayTeam,
      })
      .getOne();
  }
  // ====================================================================================================================================
  private async updateMatchScoreFromEvent(
    match: Match,
    event: SportsDbEvent,
  ): Promise<boolean> {
    const homeScore = parseInt(event.intHomeScore ?? '', 10);
    const awayScore = parseInt(event.intAwayScore ?? '', 10);
    const status = this.mapStatus(event.strStatus ?? '');
    const nextHomeScore = Number.isNaN(homeScore) ? null : homeScore;
    const nextAwayScore = Number.isNaN(awayScore) ? null : awayScore;
    const scoreChanged =
      match.homeScore !== nextHomeScore || match.awayScore !== nextAwayScore;
    const statusChanged = match.status !== status;

    match.status = status;
    match.homeScore = nextHomeScore;
    match.awayScore = nextAwayScore;

    if (scoreChanged && nextHomeScore !== null) {
      match.updatedAtScore = new Date();
    }

    await this.matchRepo.save(match);

    if (status === 'finished') {
      await this.predictionsService.calculatePointsForMatch(match.id);

      if (scoreChanged || statusChanged) {
        this.logger.log(`Puntos recalculados para partido ${match.id}`);
      }
    }

    return scoreChanged || statusChanged;
  }
  // ====================================================================================================================================
  private buildSportsDbUrl(endpoint: string): string {
    const baseUrl = this.config.getOrThrow<string>('SPORTSDB_BASE_URL');
    return `${baseUrl.replace(/\/$/, '')}/${endpoint}`;
  }
  // ====================================================================================================================================
  private isUsableEvent(event: SportsDbEvent): boolean {
    return !!(
      event.idEvent &&
      event.strHomeTeam &&
      event.strAwayTeam &&
      event.dateEvent
    );
  }

  // ====================================================================================================================================
  private parseEventDate(event: SportsDbEvent): Date {
    if (event.strTimestamp) {
      return new Date(`${event.strTimestamp}Z`);
    }

    const time = event.strTime?.replace('+00:00', '') ?? '00:00:00';
    return new Date(`${event.dateEvent}T${time}Z`);
  }
  // ====================================================================================================================================
  private mapPhase(event: SportsDbEvent): MatchPhase {
    const raw = this.normalize(
      `${event.strRound ?? ''} ${event.intRound ?? ''} ${event.strEvent ?? ''}`,
    );

    if (raw.includes('final') && !raw.includes('semi')) return 'final';
    if (raw.includes('third')) return 'third_place';
    if (raw.includes('semi')) return 'semi';
    if (raw.includes('quarter')) return 'quarter';
    if (raw.includes('round of 16') || raw.includes(' 16 ')) {
      return 'round_of_16';
    }
    if (raw.includes('round of 32') || raw.includes(' 32 ')) {
      return 'round_of_32';
    }
    return 'group';
  }
  // ====================================================================================================================================
  private mapStatus(strStatus: string): MatchStatus {
    if (!strStatus) return 'scheduled';
    const s = strStatus.toLowerCase();
    if (s === 'ft' || s === 'aet' || s === 'pen' || s === 'ap') {
      return 'finished';
    }
    if (s === 'live' || s === '1h' || s === '2h' || s === 'ht') return 'live';
    return 'scheduled';
  }
  // ====================================================================================================================================
  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  // ====================================================================================================================================
  // adminService.getDashboardStats()
  getLastSyncedAt(): string | null {
    return this.lastSyncedAt ? this.lastSyncedAt.toISOString() : null;
  }
  // ====================================================================================================================================

  async syncAutomaticWindow() {
    const today = new Date();

    const start = new Date(today);
    start.setDate(start.getDate() - 7);

    const end = new Date(today);
    end.setDate(end.getDate() + 30);

    return this.syncMatchesByRange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0],
    );
  }
}
