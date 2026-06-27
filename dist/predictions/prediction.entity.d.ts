import { User } from '../users/user.entity';
import { Match } from '../matches/match.entity';
export type PredictionStatus = 'pending' | 'correct_score' | 'correct_winner' | 'incorrect';
export declare class Prediction {
    id: number;
    userId: number;
    matchId: number;
    homeScore: number;
    awayScore: number;
    pointsEarned: number;
    status: PredictionStatus;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    match: Match;
}
