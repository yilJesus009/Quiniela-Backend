import { Stadium } from '../stadiums/stadium.entity';
import { Prediction } from '../predictions/prediction.entity';
export type MatchStatus = 'scheduled' | 'live' | 'finished';
export type MatchPhase = 'group' | 'round_of_32' | 'round_of_16' | 'quarter' | 'semi' | 'third_place' | 'final';
export declare class Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
    matchDate: Date;
    phase: MatchPhase;
    groupName: string;
    stadiumId: number;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    externalId: string;
    updatedAt: Date;
    updatedAtScore: Date;
    createdAt: Date;
    stadium: Stadium;
    predictions: Prediction[];
}
