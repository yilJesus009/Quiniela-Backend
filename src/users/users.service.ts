import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Prediction } from '../predictions/prediction.entity';
import { GroupMember } from '../groups/group-member.entity';
import { UpdateProfileDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Prediction) private predRepo: Repository<Prediction>,
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
        .getRawOne<{ total: string }>(),
    ]);

    return {
      name: user.name,
      email: user.email,
      total_score: parseInt(scoreResult?.total ?? '0', 10),
      groups_count: groupsCount,
      predictions_count: predictionsCount,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException({
          message: 'El correo ya esta registrado.',
          errors: { email: ['El correo ya esta registrado.'] },
        });
      }
      user.email = dto.email;
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    await this.userRepo.save(user);

    return {
      message: 'Perfil actualizado correctamente.',
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }
}
