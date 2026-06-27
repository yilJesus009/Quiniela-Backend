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
exports.Group = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const group_member_entity_1 = require("./group-member.entity");
let Group = class Group {
    id;
    name;
    inviteCode;
    ownerId;
    createdAt;
    updatedAt;
    owner;
    members;
};
exports.Group = Group;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Group.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invite_code', length: 8, unique: true }),
    __metadata("design:type", String)
], Group.prototype, "inviteCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_id' }),
    __metadata("design:type", Number)
], Group.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Group.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Group.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Group.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => group_member_entity_1.GroupMember, (gm) => gm.group),
    __metadata("design:type", Array)
], Group.prototype, "members", void 0);
exports.Group = Group = __decorate([
    (0, typeorm_1.Entity)('groups')
], Group);
//# sourceMappingURL=group.entity.js.map