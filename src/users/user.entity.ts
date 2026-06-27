import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Token } from '../auth/token.entity';
import { GroupMember } from '../groups/group-member.entity';
import { Prediction } from '../predictions/prediction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20, default: 'user' })
  role: string; // 'user' | 'admin'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => GroupMember, (gm) => gm.user)
  groupMembers: GroupMember[];

  @OneToMany(() => Prediction, (p) => p.user)
  predictions: Prediction[];
}
