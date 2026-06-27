import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as cron from 'node-cron';
import axios from 'axios';
import { Match } from '../matches/match.entity';
import { PredictionsService } from '../predictions/predictions.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    private predictionsService: PredictionsService,
    private config: ConfigService,
  ) {
    this.startCronJob();
  }

  private startCronJob() {
    // Ejecutar cada 20 minutos
    cron.schedule('*/20 * * * *', async () => {
      this.logger.log('⚽ Iniciando sincronización de resultados...');
      await this.syncTodayMatches();
    });
    this.logger.log('✅ Cron de sincronización activo (cada 20 min)');
  }

  async syncTodayMatches() {
    // Obtener partidos del día con external_id asignado
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const matches = await this.matchRepo
      .createQueryBuilder('m')
      .where('DATE(m.match_date) = :date', { date: dateStr })
      .andWhere('m.external_id IS NOT NULL')
      .andWhere("m.status != 'finished'")
      .getMany();

    if (matches.length === 0) {
      this.logger.log('Sin partidos para sincronizar hoy.');
      return;
    }

    const baseUrl = this.config.get('SPORTSDB_BASE_URL');

    for (const match of matches) {
      try {
        const url = `${baseUrl}/lookupevent.php?id=${match.externalId}`;
        const { data } = await axios.get(url, { timeout: 5000 });
        const event = data?.events?.[0];

        if (!event) continue;

        const homeScore = parseInt(event.intHomeScore, 10);
        const awayScore = parseInt(event.intAwayScore, 10);
        const status    = this.mapStatus(event.strStatus);

        const scoreChanged =
          match.homeScore !== homeScore || match.awayScore !== awayScore;

        match.status    = status;
        match.homeScore = isNaN(homeScore) ? null : homeScore;
        match.awayScore = isNaN(awayScore) ? null : awayScore;

        if (scoreChanged && !isNaN(homeScore)) {
          match.updatedAtScore = new Date();
        }

        await this.matchRepo.save(match);

        // Si el partido terminó, calcular puntos de los pronósticos
        if (status === 'finished' && scoreChanged) {
          await this.predictionsService.calculatePointsForMatch(match.id);
          this.logger.log(`✅ Puntos calculados para partido ${match.id}`);
        }
      } catch (err) {
        this.logger.error(`Error sincronizando partido ${match.id}: ${err.message}`);
      }
    }

    this.logger.log(`Sincronización completada. ${matches.length} partido(s) procesados.`);
  }

  private mapStatus(strStatus: string): 'scheduled' | 'live' | 'finished' {
    if (!strStatus) return 'scheduled';
    const s = strStatus.toLowerCase();
    if (s === 'ft' || s === 'aet' || s === 'pen') return 'finished';
    if (s === 'live' || s === '1h' || s === '2h' || s === 'ht') return 'live';
    return 'scheduled';
  }
}
