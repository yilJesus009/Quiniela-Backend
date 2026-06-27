import { Group } from './group.entity';
import { User } from '../users/user.entity';
export declare class GroupMember {
    id: number;
    groupId: number;
    userId: number;
    joinedAt: Date;
    group: Group;
    user: User;
}
