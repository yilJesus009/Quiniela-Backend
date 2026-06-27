import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { Prediction } from '../predictions/prediction.entity';
import { CreateGroupDto, JoinGroupDto } from './groups.dto';
export declare class GroupsService {
    private groupRepo;
    private gmRepo;
    private predRepo;
    constructor(groupRepo: Repository<Group>, gmRepo: Repository<GroupMember>, predRepo: Repository<Prediction>);
    private generateInviteCode;
    create(dto: CreateGroupDto, userId: number): Promise<{
        id: number;
        name: string;
        invite_code: string;
        created_at: Date;
    }>;
    findMyGroups(userId: number): Promise<{
        id: number;
        name: string;
        participants_count: number;
        user_score: number;
    }[]>;
    findOne(groupId: number, userId: number): Promise<{
        id: number;
        name: string;
        invite_code: string;
        participants: {
            id: number;
            name: string;
        }[];
        next_matches: {
            id: any;
            home_team: any;
            away_team: any;
            match_date: any;
            phase: any;
            status: any;
        }[];
    }>;
    getLeaderboard(groupId: number, userId: number): Promise<{
        id: number;
        name: string;
        score: number;
        position: number;
    }[]>;
    join(dto: JoinGroupDto, userId: number): Promise<{
        message: string;
        group: {
            id: number;
            name: string;
            participants_count: number;
        };
    }>;
}
