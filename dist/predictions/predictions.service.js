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
exports.PredictionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prediction_entity_1 = require("./prediction.entity");
const match_entity_1 = require("../matches/match.entity");
let PredictionsService = class PredictionsService {
    predRepo;
    matchRepo;
    constructor(predRepo, matchRepo) {
        this.predRepo = predRepo;
        this.matchRepo = matchRepo;
    }
    async upsert(dto, userId) {
        const match = await this.matchRepo.findOne({ where: { id: dto.match_id } });
        if (!match)
            throw new common_1.NotFoundException('Partido no encontrado.');
        if (match.status !== 'scheduled' || match.matchDate <= new Date()) {
            throw new common_1.UnprocessableEntityException('No se puede pronosticar un partido en curso o finalizado.');
        }
        let prediction = await this.predRepo.findOne({
            where: { userId, matchId: dto.match_id },
        });
        if (prediction) {
            prediction.homeScore = dto.home_score;
            prediction.awayScore = dto.away_score;
            prediction.status = 'pending';
            prediction.pointsEarned = 0;
        }
        else {
            prediction = this.predRepo.create({
                userId,
                matchId: dto.match_id,
                homeScore: dto.home_score,
                awayScore: dto.away_score,
            });
        }
        await this.predRepo.save(prediction);
        return {
            message: 'Pronóstico registrado.',
            prediction: {
                id: prediction.id,
                match_id: prediction.matchId,
                home_score: prediction.homeScore,
                away_score: prediction.awayScore,
                status: prediction.status,
            },
        };
    }
    async findMyPredictions(userId) {
        const predictions = await this.predRepo.find({
            where: { userId },
            relations: { match: true },
            order: { createdAt: 'DESC' },
        });
        return predictions.map((p) => ({
            id: p.id,
            match_id: p.matchId,
            home_score: p.homeScore,
            away_score: p.awayScore,
            points_earned: p.pointsEarned,
            status: p.status,
            match: p.match
                ? {
                    id: p.match.id,
                    home_team: p.match.homeTeam,
                    away_team: p.match.awayTeam,
                    match_date: p.match.matchDate,
                    status: p.match.status,
                    home_score: p.match.homeScore,
                    away_score: p.match.awayScore,
                    phase: p.match.phase,
                }
                : null,
        }));
    }
    async calculatePointsForMatch(matchId) {
        const match = await this.matchRepo.findOne({ where: { id: matchId } });
        if (!match || match.status !== 'finished' || match.homeScore === null || match.awayScore === null)
            return;
        const predictions = await this.predRepo.find({ where: { matchId } });
        for (const pred of predictions) {
            const realHome = match.homeScore;
            const realAway = match.awayScore;
            if (pred.homeScore === realHome && pred.awayScore === realAway) {
                pred.pointsEarned = 3;
                pred.status = 'correct_score';
            }
            else {
                const realWinner = realHome > realAway ? 'home' : realHome < realAway ? 'away' : 'draw';
                const predWinner = pred.homeScore > pred.awayScore ? 'home' : pred.homeScore < pred.awayScore ? 'away' : 'draw';
                if (realWinner === predWinner) {
                    pred.pointsEarned = 1;
                    pred.status = 'correct_winner';
                }
                else {
                    pred.pointsEarned = 0;
                    pred.status = 'incorrect';
                }
            }
        }
        await this.predRepo.save(predictions);
    }
};
exports.PredictionsService = PredictionsService;
exports.PredictionsService = PredictionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prediction_entity_1.Prediction)),
    __param(1, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PredictionsService);
//# sourceMappingURL=predictions.service.js.map