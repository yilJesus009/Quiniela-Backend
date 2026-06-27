import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Prediction } from '../predictions/prediction.entity';
import { GroupMember } from '../groups/group-member.entity';
export declare class UsersService {
    private userRepo;
    private predRepo;
    private gmRepo;
    constructor(userRepo: Repository<User>, predRepo: Repository<Prediction>, gmRepo: Repository<GroupMember>);
    getProfile(userId: number): Promise<{
        name: string;
        email: string;
        total_score: number;
        groups_count: number;
        predictions_count: number;
    }>;
}
