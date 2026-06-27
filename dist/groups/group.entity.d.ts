import { User } from '../users/user.entity';
import { GroupMember } from './group-member.entity';
export declare class Group {
    id: number;
    name: string;
    inviteCode: string;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    members: GroupMember[];
}
