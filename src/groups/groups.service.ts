import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { Prediction } from '../predictions/prediction.entity';
import { CreateGroupDto, JoinGroupDto } from './groups.dto';

type ScoreRaw = { total: string };
type NextMatchRaw = {
  m_id: number;
  home_team: string;
  away_team: string;
  match_date: Date;
  m_phase: string;
  m_status: string;
};

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private gmRepo: Repository<GroupMember>,
    @InjectRepository(Prediction) private predRepo: Repository<Prediction>,
  ) {}

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  }

  async create(dto: CreateGroupDto, userId: number) {
    let inviteCode: string;
    let exists: boolean;
    do {
      inviteCode = this.generateInviteCode();
      exists = !!(await this.groupRepo.findOne({ where: { inviteCode } }));
    } while (exists);

    const group = await this.groupRepo.save(
      this.groupRepo.create({ name: dto.name, inviteCode, ownerId: userId }),
    );

    await this.gmRepo.save(this.gmRepo.create({ groupId: group.id, userId }));

    return {
      id: group.id,
      name: group.name,
      invite_code: group.inviteCode,
      created_at: group.createdAt,
    };
  }

  async findMyGroups(userId: number) {
    const memberships = await this.gmRepo.find({
      where: { userId },
      relations: { group: { members: true } },
    });

    return Promise.all(
      memberships.map(async (gm) => {
        const scoreResult = await this.predRepo
          .createQueryBuilder('p')
          .select('COALESCE(SUM(p.points_earned), 0)', 'total')
          .where('p.user_id = :userId', { userId })
          .getRawOne<ScoreRaw>();

        return {
          id: gm.group.id,
          name: gm.group.name,
          participants_count: gm.group.members.length,
          user_score: parseInt(scoreResult?.total ?? '0', 10),
        };
      }),
    );
  }

  async findOne(groupId: number, userId: number) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: { members: { user: true } },
    });
    if (!group) throw new NotFoundException('Grupo no encontrado.');

    const isMember = group.members.some((gm) => gm.userId === userId);
    if (!isMember) throw new ForbiddenException('No autorizado.');

    const nextMatches = await this.groupRepo.manager

      .createQueryBuilder()
      .select([
        'm.id',
        'm.home_team',
        'm.away_team',
        'm.match_date',
        'm.phase',
        'm.status',
      ])
      .from('matches', 'm')
      .where("m.status = 'scheduled'")
      .andWhere('m.match_date > NOW()')
      .orderBy('m.match_date', 'ASC')
      .limit(5)
      .getRawMany<NextMatchRaw>();

    return {
      id: group.id,
      name: group.name,
      invite_code: group.inviteCode,
      participants: group.members.map((gm) => ({
        id: gm.user.id,
        name: gm.user.name,
      })),
      next_matches: nextMatches.map((m) => ({
        id: m.m_id,
        home_team: m.home_team,
        away_team: m.away_team,
        match_date: m.match_date,
        phase: m.m_phase,
        status: m.m_status,
      })),
    };
  }

  async getLeaderboard(groupId: number, userId: number) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: { members: { user: true } },
    });
    if (!group) throw new NotFoundException('Grupo no encontrado.');

    const isMember = group.members.some((gm) => gm.userId === userId);
    if (!isMember) throw new ForbiddenException('No autorizado.');

    const scores = await Promise.all(
      group.members.map(async (gm) => {
        const result = await this.predRepo
          .createQueryBuilder('p')
          .select('COALESCE(SUM(p.points_earned), 0)', 'total')
          .where('p.user_id = :uid', { uid: gm.userId })
          .getRawOne<ScoreRaw>();
        return {
          id: gm.user.id,
          name: gm.user.name,
          score: parseInt(result?.total ?? '0', 10),
        };
      }),
    );

    scores.sort((a, b) => b.score - a.score);
    return scores.map((s, i) => ({ position: i + 1, ...s }));
  }

  async getMyPosition(groupId: number, userId: number) {
    const leaderboard = await this.getLeaderboard(groupId, userId);
    const position = leaderboard.find((item) => item.id === userId);

    if (!position) {
      throw new ForbiddenException('No autorizado.');
    }

    return {
      group_id: groupId,
      ...position,
    };
  }
  async join(dto: JoinGroupDto, userId: number) {
    const group = await this.groupRepo.findOne({
      where: { inviteCode: dto.invite_code },
      relations: { members: true },
    });
    if (!group) throw new NotFoundException('Código de invitación inválido.');

    const alreadyMember = group.members.some((gm) => gm.userId === userId);
    if (alreadyMember)
      throw new ConflictException('Ya eres miembro de este grupo.');

    await this.gmRepo.save(this.gmRepo.create({ groupId: group.id, userId }));

    return {
      message: 'Te has unido al grupo correctamente.',
      group: {
        id: group.id,
        name: group.name,
        participants_count: group.members.length + 1,
      },
    };
  }
}
