import { StadiumsService } from './stadiums.service';
export declare class StadiumsController {
    private stadiumsService;
    constructor(stadiumsService: StadiumsService);
    findAll(): Promise<import("./stadium.entity").Stadium[]>;
    findOne(id: number): Promise<import("./stadium.entity").Stadium>;
    findMatches(id: number): Promise<import("../matches/match.entity").Match[]>;
}
