import { Repository } from 'typeorm';
import { Match } from './match.entity';
export declare class MatchesService {
    private matchRepo;
    constructor(matchRepo: Repository<Match>);
    findAll(filters: {
        phase?: string;
        status?: string;
        date?: string;
        next?: string;
    }): Promise<Match[]>;
    findUpdates(since?: string): Promise<{
        synced_at: string;
        matches: Match[];
    }>;
    findOne(id: number): Promise<Match>;
}
