"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("../matches/match.entity");
let AdminService = class AdminService {
    matchRepo;
    constructor(matchRepo) {
        this.matchRepo = matchRepo;
    }
    async createMatch(dto) {
        const match = this.matchRepo.create({
            homeTeam: dto.home_team,
            awayTeam: dto.away_team,
            matchDate: new Date(dto.match_date),
            phase: dto.phase,
            groupName: dto.group_name,
            stadiumId: dto.stadium_id,
            externalId: dto.external_id,
        });
        return this.matchRepo.save(match);
    }
    async updateMatch(id, dto) {
        const match = await this.matchRepo.findOne({ where: { id } });
        if (!match)
            throw new common_1.NotFoundException('Partido no encontrado.');
        if (dto.home_score !== undefined || dto.away_score !== undefined) {
            delete dto.home_score;
            delete dto.away_score;
        }
        if (dto.home_team)
            match.homeTeam = dto.home_team;
        if (dto.away_team)
            match.awayTeam = dto.away_team;
        if (dto.match_date)
            match.matchDate = new Date(dto.match_date);
        if (dto.phase)
            match.phase = dto.phase;
        if (dto.group_name !== undefined)
            match.groupName = dto.group_name;
        if (dto.stadium_id !== undefined)
            match.stadiumId = dto.stadium_id;
        if (dto.status)
            match.status = dto.status;
        if (dto.external_id)
            match.externalId = dto.external_id;
        return this.matchRepo.save(match);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map