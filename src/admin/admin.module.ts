import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../matches/match.entity';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { SyncModule } from '../sync/sync.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Match, User, Group]), SyncModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
