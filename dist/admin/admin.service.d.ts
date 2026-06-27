import { Repository } from 'typeorm';
import { Match } from '../matches/match.entity';
import { CreateMatchDto, UpdateMatchDto } from './admin.dto';
export declare class AdminService {
    private matchRepo;
    constructor(matchRepo: Repository<Match>);
    createMatch(dto: CreateMatchDto): Promise<Match>;
    updateMatch(id: number, dto: UpdateMatchDto): Promise<Match>;
}
