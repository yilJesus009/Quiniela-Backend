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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const matches_service_1 = require("./matches.service");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    findAll(phase, status, date, next) {
        return this.matchesService.findAll({ phase, status, date, next });
    }
    findUpdates(since) {
        return this.matchesService.findUpdates(since);
    }
    findOne(id) {
        return this.matchesService.findOne(id);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('phase')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('next')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('updates'),
    __param(0, (0, common_1.Query)('since')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findUpdates", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findOne", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.Controller)('matches'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map