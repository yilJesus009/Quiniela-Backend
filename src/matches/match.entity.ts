import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Stadium } from '../stadiums/stadium.entity';
import { Prediction } from '../predictions/prediction.entity';

export type MatchStatus = 'scheduled' | 'live' | 'finished';
export type MatchPhase =
  | 'group' | 'round_of_32' | 'round_of_16'
  | 'quarter' | 'semi' | 'third_place' | 'final';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'home_team', length: 100 })
  homeTeam: string;

  @Column({ name: 'away_team', length: 100 })
  awayTeam: string;

  @Column({ name: 'match_date', type: 'timestamp' })
  matchDate: Date;

  @Column({ length: 50 })
  phase: MatchPhase;

  @Column({ name: 'group_name', length: 10, nullable: true })
  groupName: string;

  @Column({ name: 'stadium_id', nullable: true })
  stadiumId: number;

  @Column({ length: 20, default: 'scheduled' })
  status: MatchStatus;

  @Column({ name: 'home_score', type: 'int', nullable: true })
  homeScore: number | null;

  @Column({ name: 'away_score', type: 'int', nullable: true })
  awayScore: number | null;

  @Column({ name: 'external_id', length: 100, nullable: true })
  externalId: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_at_score', type: 'timestamp', nullable: true })
  updatedAtScore: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Stadium, (stadium) => stadium.matches, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'stadium_id' })
  stadium: Stadium;

  @OneToMany(() => Prediction, (p) => p.match)
  predictions: Prediction[];
}
