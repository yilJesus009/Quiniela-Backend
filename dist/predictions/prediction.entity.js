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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prediction = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const match_entity_1 = require("../matches/match.entity");
let Prediction = class Prediction {
    id;
    userId;
    matchId;
    homeScore;
    awayScore;
    pointsEarned;
    status;
    createdAt;
    updatedAt;
    user;
    match;
};
exports.Prediction = Prediction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Prediction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Prediction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'match_id' }),
    __metadata("design:type", Number)
], Prediction.prototype, "matchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'home_score' }),
    __metadata("design:type", Number)
], Prediction.prototype, "homeScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'away_score' }),
    __metadata("design:type", Number)
], Prediction.prototype, "awayScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'points_earned', default: 0 }),
    __metadata("design:type", Number)
], Prediction.prototype, "pointsEarned", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: 'pending' }),
    __metadata("design:type", String)
], Prediction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Prediction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Prediction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.predictions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Prediction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => match_entity_1.Match, (match) => match.predictions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", match_entity_1.Match)
], Prediction.prototype, "match", void 0);
exports.Prediction = Prediction = __decorate([
    (0, typeorm_1.Entity)('predictions'),
    (0, typeorm_1.Unique)(['userId', 'matchId'])
], Prediction);
//# sourceMappingURL=prediction.entity.js.map