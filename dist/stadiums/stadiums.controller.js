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
exports.StadiumsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const stadiums_service_1 = require("./stadiums.service");
let StadiumsController = class StadiumsController {
    stadiumsService;
    constructor(stadiumsService) {
        this.stadiumsService = stadiumsService;
    }
    findAll() {
        return this.stadiumsService.findAll();
    }
    findOne(id) {
        return this.stadiumsService.findOne(id);
    }
    findMatches(id) {
        return this.stadiumsService.findMatchesByStadium(id);
    }
};
exports.StadiumsController = StadiumsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StadiumsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StadiumsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/matches'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StadiumsController.prototype, "findMatches", null);
exports.StadiumsController = StadiumsController = __decorate([
    (0, common_1.Controller)('stadiums'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [stadiums_service_1.StadiumsService])
], StadiumsController);
//# sourceMappingURL=stadiums.controller.js.map