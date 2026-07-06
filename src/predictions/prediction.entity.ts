import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Match } from '../matches/match.entity';

export type PredictionStatus =
  'pending' | 'correct_score' | 'correct_winner' | 'incorrect';

@Entity('predictions')
@Unique(['userId', 'matchId'])
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'match_id' })
  matchId: number;

  @Column({ name: 'home_score' })
  homeScore: number;

  @Column({ name: 'away_score' })
  awayScore: number;

  @Column({ name: 'points_earned', default: 0 })
  pointsEarned: number;

  @Column({ length: 30, default: 'pending' })
  status: PredictionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.predictions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Match, (match) => match.predictions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  match: Match;
}
