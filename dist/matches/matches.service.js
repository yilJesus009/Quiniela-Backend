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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("./match.entity");
let MatchesService = class MatchesService {
    matchRepo;
    constructor(matchRepo) {
        this.matchRepo = matchRepo;
    }
    async findAll(filters) {
        const qb = this.matchRepo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.stadium', 's')
            .orderBy('m.match_date', 'ASC');
        if (filters.next === 'true') {
            qb.where('m.status = :status', { status: 'scheduled' })
                .andWhere('m.match_date > NOW()')
                .limit(10);
            return qb.getMany();
        }
        if (filters.phase)
            qb.andWhere('m.phase = :phase', { phase: filters.phase });
        if (filters.status)
            qb.andWhere('m.status = :status', { status: filters.status });
        if (filters.date) {
            qb.andWhere('DATE(m.match_date) = :date', { date: filters.date });
        }
        return qb.getMany();
    }
    async findUpdates(since) {
        const qb = this.matchRepo
            .createQueryBuilder('m')
            .select([
            'm.id', 'm.homeTeam', 'm.awayTeam',
            'm.status', 'm.homeScore', 'm.awayScore',
        ]);
        if (since) {
            qb.where('m.updated_at_score > :since', { since: new Date(since) });
        }
        else {
            qb.where("m.status != 'scheduled'");
        }
        const matches = await qb.getMany();
        return { synced_at: new Date().toISOString(), matches };
    }
    async findOne(id) {
        const match = await this.matchRepo.findOne({
            where: { id },
            relations: { stadium: true },
        });
        if (!match)
            throw new common_1.NotFoundException('Partido no encontrado.');
        return match;
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MatchesService);
//# sourceMappingURL=matches.service.js.map