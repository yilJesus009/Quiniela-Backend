import { Repository } from 'typeorm';
import { Prediction } from './prediction.entity';
import { Match } from '../matches/match.entity';
import { CreatePredictionDto } from './predictions.dto';
export declare class PredictionsService {
    private predRepo;
    private matchRepo;
    constructor(predRepo: Repository<Prediction>, matchRepo: Repository<Match>);
    upsert(dto: CreatePredictionDto, userId: number): Promise<{
        message: string;
        prediction: {
            id: number;
            match_id: number;
            home_score: number;
            away_score: number;
            status: import("./prediction.entity").PredictionStatus;
        };
    }>;
    findMyPredictions(userId: number): Promise<{
        id: number;
        match_id: number;
        home_score: number;
        away_score: number;
        points_earned: number;
        status: import("./prediction.entity").PredictionStatus;
        match: {
            id: number;
            home_team: string;
            away_team: string;
            match_date: Date;
            status: import("../matches/match.entity").MatchStatus;
            home_score: number | null;
            away_score: number | null;
            phase: import("../matches/match.entity").MatchPhase;
        } | null;
    }[]>;
    calculatePointsForMatch(matchId: number): Promise<void>;
}
