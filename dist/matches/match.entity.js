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
exports.Match = void 0;
const typeorm_1 = require("typeorm");
const stadium_entity_1 = require("../stadiums/stadium.entity");
const prediction_entity_1 = require("../predictions/prediction.entity");
let Match = class Match {
    id;
    homeTeam;
    awayTeam;
    matchDate;
    phase;
    groupName;
    stadiumId;
    status;
    homeScore;
    awayScore;
    externalId;
    updatedAt;
    updatedAtScore;
    createdAt;
    stadium;
    predictions;
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'home_team', length: 100 }),
    __metadata("design:type", String)
], Match.prototype, "homeTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'away_team', length: 100 }),
    __metadata("design:type", String)
], Match.prototype, "awayTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'match_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Match.prototype, "matchDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Match.prototype, "phase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_name', length: 10, nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stadium_id', nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "stadiumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'scheduled' }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'home_score', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Match.prototype, "homeScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'away_score', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Match.prototype, "awayScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'external_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Match.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at_score', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Match.prototype, "updatedAtScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Match.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stadium_entity_1.Stadium, (stadium) => stadium.matches, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'stadium_id' }),
    __metadata("design:type", stadium_entity_1.Stadium)
], Match.prototype, "stadium", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => prediction_entity_1.Prediction, (p) => p.match),
    __metadata("design:type", Array)
], Match.prototype, "predictions", void 0);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)('matches')
], Match);
//# sourceMappingURL=match.entity.js.map