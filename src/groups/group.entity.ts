import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { GroupMember } from './group-member.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'invite_code', length: 8, unique: true })
  inviteCode: string;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => GroupMember, (gm) => gm.group)
  members: GroupMember[];
}
