import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../matches/match.entity';
import { User } from '../users/user.entity'; // NUEVO
import { Group } from '../groups/group.entity'; // NUEVO
import { SyncService } from '../sync/sync.service'; // NUEVO
import { CreateMatchDto, UpdateMatchDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(User) private userRepo: Repository<User>, // NUEVO
    @InjectRepository(Group) private groupRepo: Repository<Group>, // NUEVO
    private syncService: SyncService, // NUEVO
  ) {}

  async createMatch(dto: CreateMatchDto) {
    const match = this.matchRepo.create({
      homeTeam: dto.home_team,
      awayTeam: dto.away_team,
      matchDate: new Date(dto.match_date),
      phase: dto.phase,
      groupName: dto.group_name,
      stadiumId: dto.stadium_id,
      externalId: dto.external_id,
    });

    return this.matchRepo.save(match);
  }

  async updateMatch(id: number, dto: UpdateMatchDto) {
    const match = await this.matchRepo.findOne({ where: { id } });
    if (!match) throw new NotFoundException('Partido no encontrado.');

    if (dto.home_team) match.homeTeam = dto.home_team;
    if (dto.away_team) match.awayTeam = dto.away_team;
    if (dto.match_date) match.matchDate = new Date(dto.match_date);
    if (dto.phase) match.phase = dto.phase;
    if (dto.group_name !== undefined) match.groupName = dto.group_name;
    if (dto.stadium_id !== undefined) match.stadiumId = dto.stadium_id;
    if (dto.status) match.status = dto.status;
    if (dto.external_id) match.externalId = dto.external_id;

    return this.matchRepo.save(match);
  }

  //admin/dashboard.
  async getDashboardStats() {
    const [totalUsers, totalGroups, totalMatches, pendingMatches] =
      await Promise.all([
        this.userRepo.count(),
        this.groupRepo.count(),
        this.matchRepo.count(),
        this.matchRepo.count({ where: { status: 'scheduled' } }),
      ]);

    return {
      total_users: totalUsers,
      total_groups: totalGroups,
      total_matches: totalMatches,
      pending_matches: pendingMatches,
      last_sync: this.syncService.getLastSyncedAt(),
    };
  }
}
