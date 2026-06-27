import { MatchesService } from './matches.service';
export declare class MatchesController {
    private matchesService;
    constructor(matchesService: MatchesService);
    findAll(phase?: string, status?: string, date?: string, next?: string): Promise<import("./match.entity").Match[]>;
    findUpdates(since?: string): Promise<{
        synced_at: string;
        matches: import("./match.entity").Match[];
    }>;
    findOne(id: number): Promise<import("./match.entity").Match>;
}
