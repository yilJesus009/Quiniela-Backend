import { Repository } from 'typeorm';
import { Stadium } from './stadium.entity';
import { Match } from '../matches/match.entity';
export declare class StadiumsService {
    private stadiumRepo;
    private matchRepo;
    constructor(stadiumRepo: Repository<Stadium>, matchRepo: Repository<Match>);
    findAll(): Promise<Stadium[]>;
    findOne(id: number): Promise<Stadium>;
    findMatchesByStadium(id: number): Promise<Match[]>;
}
