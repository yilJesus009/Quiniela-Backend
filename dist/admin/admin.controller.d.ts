import { AdminService } from './admin.service';
import { CreateMatchDto, UpdateMatchDto } from './admin.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    createMatch(dto: CreateMatchDto): Promise<import("../matches/match.entity").Match>;
    updateMatch(id: number, dto: UpdateMatchDto): Promise<import("../matches/match.entity").Match>;
}
