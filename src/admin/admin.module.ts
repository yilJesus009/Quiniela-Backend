import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../matches/match.entity';
import { User } from '../users/user.entity'; // NUEVO
import { Group } from '../groups/group.entity'; // NUEVO
import { SyncModule } from '../sync/sync.module'; // NUEVO
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, User, Group]), // NUEVO: antes solo estaba [Match]
    SyncModule, // NUEVO
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
