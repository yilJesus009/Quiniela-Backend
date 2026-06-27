import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './predictions.dto';
export declare class PredictionsController {
    private predictionsService;
    constructor(predictionsService: PredictionsService);
    upsert(dto: CreatePredictionDto, user: {
        id: number;
    }): Promise<{
        message: string;
        prediction: {
            id: number;
            match_id: number;
            home_score: number;
            away_score: number;
            status: import("./prediction.entity").PredictionStatus;
        };
    }>;
    findMyPredictions(user: {
        id: number;
    }): Promise<{
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
}
