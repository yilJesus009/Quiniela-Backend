import { Match } from '../matches/match.entity';
export declare class Stadium {
    id: number;
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    capacity: number;
    createdAt: Date;
    matches: Match[];
}
