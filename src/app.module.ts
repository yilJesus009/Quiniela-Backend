import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { MatchesModule } from './matches/matches.module';
import { StadiumsModule } from './stadiums/stadiums.module';
import { PredictionsModule } from './predictions/predictions.module';
import { AdminModule } from './admin/admin.module';
import { SyncModule } from './sync/sync.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { User } from './users/user.entity';
import { Token } from './auth/token.entity';
import { Stadium } from './stadiums/stadium.entity';
import { Match } from './matches/match.entity';
import { Group } from './groups/group.entity';
import { GroupMember } from './groups/group-member.entity';
import { Prediction } from './predictions/prediction.entity';

@Module({
  controllers: [AppController],
  imports: [
    // Variables de entorno disponibles globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a PostgreSQL via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') as string,
        port: +(config.get<number>('DB_PORT') ?? 5432),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [User, Token, Stadium, Match, Group, GroupMember, Prediction],
        synchronize: false, // Usamos schema.sql manual — nunca true en producción
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    AuthModule,
    UsersModule,
    GroupsModule,
    MatchesModule,
    StadiumsModule,
    PredictionsModule,
    AdminModule,
    SyncModule,
    DashboardModule,
  ],
})
export class AppModule {}
