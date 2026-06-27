// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Prediction } from '../predictions/prediction.entity';
import { GroupMember } from '../groups/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Prediction, GroupMember])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
