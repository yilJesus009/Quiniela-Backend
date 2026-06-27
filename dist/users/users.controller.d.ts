import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: {
        id: number;
    }): Promise<{
        name: string;
        email: string;
        total_score: number;
        groups_count: number;
        predictions_count: number;
    }>;
}
