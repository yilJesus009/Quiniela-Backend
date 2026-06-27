import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Match } from '../matches/match.entity';
import { PredictionsService } from '../predictions/predictions.service';
export declare class SyncService {
    private matchRepo;
    private predictionsService;
    private config;
    private readonly logger;
    constructor(matchRepo: Repository<Match>, predictionsService: PredictionsService, config: ConfigService);
    private startCronJob;
    syncTodayMatches(): Promise<void>;
    private mapStatus;
}
