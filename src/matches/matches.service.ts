import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(Match) private matchRepo: Repository<Match>) {}

  async findAll(filters: {
    phase?: string;
    status?: string;
    date?: string;
    next?: string;
  }) {
    const qb = this.matchRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.stadium', 's')
      .orderBy('m.match_date', 'ASC');

    // ?next=true → próximos 10 partidos programados con fecha futura
    const NEXT_MATCHES_LIMIT = 10;
    if (filters.next === 'true') {
      qb.where('m.status = :status', { status: 'scheduled' })
        .andWhere('m.match_date > NOW()')
        .limit(NEXT_MATCHES_LIMIT);
      return qb.getMany();
    }

    if (filters.phase)
      qb.andWhere('m.phase = :phase', { phase: filters.phase });
    if (filters.status)
      qb.andWhere('m.status = :status', { status: filters.status });
    if (filters.date) {
      qb.andWhere('DATE(m.match_date) = :date', { date: filters.date });
    }

    return qb.getMany();
  }

  async findUpdates(since?: string) {
    const qb = this.matchRepo
      .createQueryBuilder('m')
      .select([
        'm.id',
        'm.homeTeam',
        'm.awayTeam',
        'm.status',
        'm.homeScore',
        'm.awayScore',
      ]);

    if (since) {
      // Devuelve partidos cuyo resultado cambió después del timestamp dado
      qb.where('m.updated_at_score > :since', { since: new Date(since) });
    } else {
      // Sin parámetro: devuelve todos los no programados (live o finished)
      qb.where("m.status != 'scheduled'");
    }

    const matches = await qb.getMany();
    return { synced_at: new Date().toISOString(), matches };
  }

  async findOne(id: number) {
    const match = await this.matchRepo.findOne({
      where: { id },
      relations: { stadium: true },
    });
    if (!match) throw new NotFoundException('Partido no encontrado.');
    return match;
  }
}
