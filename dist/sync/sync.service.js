"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const cron = __importStar(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const match_entity_1 = require("../matches/match.entity");
const predictions_service_1 = require("../predictions/predictions.service");
let SyncService = SyncService_1 = class SyncService {
    matchRepo;
    predictionsService;
    config;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(matchRepo, predictionsService, config) {
        this.matchRepo = matchRepo;
        this.predictionsService = predictionsService;
        this.config = config;
        this.startCronJob();
    }
    startCronJob() {
        cron.schedule('*/20 * * * *', async () => {
            this.logger.log('⚽ Iniciando sincronización de resultados...');
            await this.syncTodayMatches();
        });
        this.logger.log('✅ Cron de sincronización activo (cada 20 min)');
    }
    async syncTodayMatches() {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const matches = await this.matchRepo
            .createQueryBuilder('m')
            .where('DATE(m.match_date) = :date', { date: dateStr })
            .andWhere('m.external_id IS NOT NULL')
            .andWhere("m.status != 'finished'")
            .getMany();
        if (matches.length === 0) {
            this.logger.log('Sin partidos para sincronizar hoy.');
            return;
        }
        const baseUrl = this.config.get('SPORTSDB_BASE_URL');
        for (const match of matches) {
            try {
                const url = `${baseUrl}/lookupevent.php?id=${match.externalId}`;
                const { data } = await axios_1.default.get(url, { timeout: 5000 });
                const event = data?.events?.[0];
                if (!event)
                    continue;
                const homeScore = parseInt(event.intHomeScore, 10);
                const awayScore = parseInt(event.intAwayScore, 10);
                const status = this.mapStatus(event.strStatus);
                const scoreChanged = match.homeScore !== homeScore || match.awayScore !== awayScore;
                match.status = status;
                match.homeScore = isNaN(homeScore) ? null : homeScore;
                match.awayScore = isNaN(awayScore) ? null : awayScore;
                if (scoreChanged && !isNaN(homeScore)) {
                    match.updatedAtScore = new Date();
                }
                await this.matchRepo.save(match);
                if (status === 'finished' && scoreChanged) {
                    await this.predictionsService.calculatePointsForMatch(match.id);
                    this.logger.log(`✅ Puntos calculados para partido ${match.id}`);
                }
            }
            catch (err) {
                this.logger.error(`Error sincronizando partido ${match.id}: ${err.message}`);
            }
        }
        this.logger.log(`Sincronización completada. ${matches.length} partido(s) procesados.`);
    }
    mapStatus(strStatus) {
        if (!strStatus)
            return 'scheduled';
        const s = strStatus.toLowerCase();
        if (s === 'ft' || s === 'aet' || s === 'pen')
            return 'finished';
        if (s === 'live' || s === '1h' || s === '2h' || s === 'ht')
            return 'live';
        return 'scheduled';
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        predictions_service_1.PredictionsService,
        config_1.ConfigService])
], SyncService);
//# sourceMappingURL=sync.service.js.map