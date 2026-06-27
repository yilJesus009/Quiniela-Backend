import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../matches/match.entity';
import { CreateMatchDto, UpdateMatchDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
  ) {}

  async createMatch(dto: CreateMatchDto) {
    const match = this.matchRepo.create({
      homeTeam:   dto.home_team,
      awayTeam:   dto.away_team,
      matchDate:  new Date(dto.match_date),
      phase:      dto.phase as any,
      groupName:  dto.group_name,
      stadiumId:  dto.stadium_id,
      externalId: dto.external_id,
    });
    return this.matchRepo.save(match);
  }

  async updateMatch(id: number, dto: UpdateMatchDto) {
    const match = await this.matchRepo.findOne({ where: { id } });
    if (!match) throw new NotFoundException('Partido no encontrado.');

    // El resultado (home_score / away_score) NO se puede modificar desde el admin.
    // Los resultados solo se actualizan via la sincronización con thesportsdb.com
    if ((dto as any).home_score !== undefined || (dto as any).away_score !== undefined) {
      delete (dto as any).home_score;
      delete (dto as any).away_score;
    }

    if (dto.home_team)   match.homeTeam  = dto.home_team;
    if (dto.away_team)   match.awayTeam  = dto.away_team;
    if (dto.match_date)  match.matchDate = new Date(dto.match_date);
    if (dto.phase)       match.phase     = dto.phase as any;
    if (dto.group_name !== undefined) match.groupName  = dto.group_name;
    if (dto.stadium_id !== undefined) match.stadiumId  = dto.stadium_id;
    if (dto.status)      match.status    = dto.status as any;
    if (dto.external_id) match.externalId = dto.external_id;

    return this.matchRepo.save(match);
  }
}
