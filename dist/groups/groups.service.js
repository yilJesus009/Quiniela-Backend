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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const group_entity_1 = require("./group.entity");
const group_member_entity_1 = require("./group-member.entity");
const prediction_entity_1 = require("../predictions/prediction.entity");
let GroupsService = class GroupsService {
    groupRepo;
    gmRepo;
    predRepo;
    constructor(groupRepo, gmRepo, predRepo) {
        this.groupRepo = groupRepo;
        this.gmRepo = gmRepo;
        this.predRepo = predRepo;
    }
    generateInviteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
    async create(dto, userId) {
        let inviteCode;
        let exists;
        do {
            inviteCode = this.generateInviteCode();
            exists = !!(await this.groupRepo.findOne({ where: { inviteCode } }));
        } while (exists);
        const group = await this.groupRepo.save(this.groupRepo.create({ name: dto.name, inviteCode, ownerId: userId }));
        await this.gmRepo.save(this.gmRepo.create({ groupId: group.id, userId }));
        return {
            id: group.id,
            name: group.name,
            invite_code: group.inviteCode,
            created_at: group.createdAt,
        };
    }
    async findMyGroups(userId) {
        const memberships = await this.gmRepo.find({
            where: { userId },
            relations: { group: { members: true } },
        });
        return Promise.all(memberships.map(async (gm) => {
            const scoreResult = await this.predRepo
                .createQueryBuilder('p')
                .select('COALESCE(SUM(p.points_earned), 0)', 'total')
                .where('p.user_id = :userId', { userId })
                .getRawOne();
            return {
                id: gm.group.id,
                name: gm.group.name,
                participants_count: gm.group.members.length,
                user_score: parseInt(scoreResult.total, 10),
            };
        }));
    }
    async findOne(groupId, userId) {
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: { members: { user: true } },
        });
        if (!group)
            throw new common_1.NotFoundException('Grupo no encontrado.');
        const isMember = group.members.some((gm) => gm.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('No autorizado.');
        const nextMatches = await this.groupRepo.manager
            .createQueryBuilder()
            .select(['m.id', 'm.home_team', 'm.away_team', 'm.match_date', 'm.phase', 'm.status'])
            .from('matches', 'm')
            .where("m.status = 'scheduled'")
            .andWhere('m.match_date > NOW()')
            .orderBy('m.match_date', 'ASC')
            .limit(5)
            .getRawMany();
        return {
            id: group.id,
            name: group.name,
            invite_code: group.inviteCode,
            participants: group.members.map((gm) => ({
                id: gm.user.id,
                name: gm.user.name,
            })),
            next_matches: nextMatches.map((m) => ({
                id: m.m_id,
                home_team: m.m_home_team,
                away_team: m.m_away_team,
                match_date: m.m_match_date,
                phase: m.m_phase,
                status: m.m_status,
            })),
        };
    }
    async getLeaderboard(groupId, userId) {
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: { members: { user: true } },
        });
        if (!group)
            throw new common_1.NotFoundException('Grupo no encontrado.');
        const isMember = group.members.some((gm) => gm.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('No autorizado.');
        const scores = await Promise.all(group.members.map(async (gm) => {
            const result = await this.predRepo
                .createQueryBuilder('p')
                .select('COALESCE(SUM(p.points_earned), 0)', 'total')
                .where('p.user_id = :uid', { uid: gm.userId })
                .getRawOne();
            return { id: gm.user.id, name: gm.user.name, score: parseInt(result.total, 10) };
        }));
        scores.sort((a, b) => b.score - a.score);
        return scores.map((s, i) => ({ position: i + 1, ...s }));
    }
    async join(dto, userId) {
        const group = await this.groupRepo.findOne({
            where: { inviteCode: dto.invite_code },
            relations: { members: true },
        });
        if (!group)
            throw new common_1.NotFoundException('Código de invitación inválido.');
        const alreadyMember = group.members.some((gm) => gm.userId === userId);
        if (alreadyMember)
            throw new common_1.ConflictException('Ya eres miembro de este grupo.');
        await this.gmRepo.save(this.gmRepo.create({ groupId: group.id, userId }));
        return {
            message: 'Te has unido al grupo correctamente.',
            group: {
                id: group.id,
                name: group.name,
                participants_count: group.members.length + 1,
            },
        };
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(1, (0, typeorm_1.InjectRepository)(group_member_entity_1.GroupMember)),
    __param(2, (0, typeorm_1.InjectRepository)(prediction_entity_1.Prediction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GroupsService);
//# sourceMappingURL=groups.service.js.map