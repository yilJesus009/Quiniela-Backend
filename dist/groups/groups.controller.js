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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const groups_service_1 = require("./groups.service");
const groups_dto_1 = require("./groups.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let GroupsController = class GroupsController {
    groupsService;
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    findMyGroups(user) {
        return this.groupsService.findMyGroups(user.id);
    }
    create(dto, user) {
        return this.groupsService.create(dto, user.id);
    }
    join(dto, user) {
        return this.groupsService.join(dto, user.id);
    }
    findOne(id, user) {
        return this.groupsService.findOne(id, user.id);
    }
    leaderboard(id, user) {
        return this.groupsService.getLeaderboard(id, user.id);
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findMyGroups", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [groups_dto_1.CreateGroupDto, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [groups_dto_1.JoinGroupDto, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "join", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/leaderboard'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "leaderboard", null);
exports.GroupsController = GroupsController = __decorate([
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [groups_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map