import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from '../groups/group-member.entity';
import { Match } from '../matches/match.entity';
import { Prediction } from '../predictions/prediction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(GroupMember)
    private groupMemberRepo: Repository<GroupMember>,
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
    @InjectRepository(Prediction)
    private predictionRepo: Repository<Prediction>,
  ) {}

  async getDashboard(userId: number) {
    const [groups, pendingMatches, totalScoreResult, positions] =
      await Promise.all([
        this.getUserGroups(userId),
        this.getPendingUpcomingMatches(userId),
        this.getTotalScore(userId),
        this.getPositionsByGroup(userId),
      ]);

    return {
      groups_count: groups.length,
      pending_predictions: pendingMatches,
      positions,
      total_score: parseInt(totalScoreResult?.total ?? '0', 10),
    };
  }

  private getUserGroups(userId: number) {
    return this.groupMemberRepo.find({
      where: { userId },
      relations: { group: true },
      order: { joinedAt: 'DESC' },
    });
  }

  private getTotalScore(userId: number) {
    return this.predictionRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.points_earned), 0)', 'total')
      .where('p.user_id = :userId', { userId })
      .getRawOne<{ total: string }>();
  }

  private getPendingUpcomingMatches(userId: number) {
    return this.matchRepo
      .createQueryBuilder('m')
      .leftJoin(Prediction, 'p', 'p.match_id = m.id AND p.user_id = :userId', {
        userId,
      })
      .leftJoinAndSelect('m.stadium', 's')
      .where('m.status = :status', { status: 'scheduled' })
      .andWhere('m.match_date > NOW()')
      .andWhere('p.id IS NULL')
      .orderBy('m.match_date', 'ASC')
      .limit(10)
      .getMany();
  }

  private async getPositionsByGroup(userId: number) {
    const memberships = await this.getUserGroups(userId);

    return Promise.all(
      memberships.map(async (membership) => {
        const scores = await this.groupMemberRepo
          .createQueryBuilder('gm')
          .innerJoin('gm.user', 'u')
          .leftJoin(Prediction, 'p', 'p.user_id = gm.user_id')
          .select('gm.user_id', 'user_id')
          .addSelect('u.name', 'name')
          .addSelect('COALESCE(SUM(p.points_earned), 0)', 'score')
          .where('gm.group_id = :groupId', { groupId: membership.groupId })
          .groupBy('gm.user_id')
          .addGroupBy('u.name')
          .orderBy('score', 'DESC')
          .getRawMany<{
            user_id: number;
            name: string;
            score: string;
          }>();

        const ranked = scores.map((score, index) => ({
          position: index + 1,
          user_id: Number(score.user_id),
          name: score.name,
          score: parseInt(score.score, 10),
        }));

        const currentUser = ranked.find((score) => score.user_id === userId);

        return {
          group_id: membership.groupId,
          group_name: membership.group.name,
          position: currentUser?.position ?? null,
          score: currentUser?.score ?? 0,
          participants_count: ranked.length,
        };
      }),
    );
  }
}
