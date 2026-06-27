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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const prediction_entity_1 = require("../predictions/prediction.entity");
const group_member_entity_1 = require("../groups/group-member.entity");
let UsersService = class UsersService {
    userRepo;
    predRepo;
    gmRepo;
    constructor(userRepo, predRepo, gmRepo) {
        this.userRepo = userRepo;
        this.predRepo = predRepo;
        this.gmRepo = gmRepo;
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
        const [predictionsCount, groupsCount, scoreResult] = await Promise.all([
            this.predRepo.count({ where: { userId } }),
            this.gmRepo.count({ where: { userId } }),
            this.predRepo
                .createQueryBuilder('p')
                .select('COALESCE(SUM(p.points_earned), 0)', 'total')
                .where('p.user_id = :userId', { userId })
                .getRawOne(),
        ]);
        return {
            name: user.name,
            email: user.email,
            total_score: parseInt(scoreResult.total, 10),
            groups_count: groupsCount,
            predictions_count: predictionsCount,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(prediction_entity_1.Prediction)),
    __param(2, (0, typeorm_1.InjectRepository)(group_member_entity_1.GroupMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map