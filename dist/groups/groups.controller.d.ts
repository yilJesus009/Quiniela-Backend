import { GroupsService } from './groups.service';
import { CreateGroupDto, JoinGroupDto } from './groups.dto';
export declare class GroupsController {
    private groupsService;
    constructor(groupsService: GroupsService);
    findMyGroups(user: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        participants_count: number;
        user_score: number;
    }[]>;
    create(dto: CreateGroupDto, user: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        invite_code: string;
        created_at: Date;
    }>;
    join(dto: JoinGroupDto, user: {
        id: number;
    }): Promise<{
        message: string;
        group: {
            id: number;
            name: string;
            participants_count: number;
        };
    }>;
    findOne(id: number, user: {
        id: number;
    }): Promise<{
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
    leaderboard(id: number, user: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        score: number;
        position: number;
    }[]>;
}
