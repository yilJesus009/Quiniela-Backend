import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Prediction } from '../predictions/prediction.entity';
import { GroupMember } from '../groups/group-member.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)        private userRepo: Repository<User>,
    @InjectRepository(Prediction)  private predRepo: Repository<Prediction>,
    @InjectRepository(GroupMember) private gmRepo: Repository<GroupMember>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    // Calcular estadísticas en paralelo
    const [predictionsCount, groupsCount, scoreResult] = await Promise.all([
      this.predRepo.count({ where: { userId } }),
      this.gmRepo.count({ where: { userId } }),
      this.predRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.points_earned), 0)', 'total')
        .where('p.user_id = :userId', { userId })
        .getRawOne(),
    ]);

    return {
      name: user.name,
      email: user.email,
      total_score: parseInt(scoreResult.total, 10),
      groups_count: groupsCount,
      predictions_count: predictionsCount,
    };
  }
}
