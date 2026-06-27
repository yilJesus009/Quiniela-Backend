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
exports.Stadium = void 0;
const typeorm_1 = require("typeorm");
const match_entity_1 = require("../matches/match.entity");
let Stadium = class Stadium {
    id;
    name;
    city;
    country;
    latitude;
    longitude;
    capacity;
    createdAt;
    matches;
};
exports.Stadium = Stadium;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stadium.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Stadium.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Stadium.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Stadium.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Stadium.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Stadium.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Stadium.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Stadium.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, (match) => match.stadium),
    __metadata("design:type", Array)
], Stadium.prototype, "matches", void 0);
exports.Stadium = Stadium = __decorate([
    (0, typeorm_1.Entity)('stadiums')
], Stadium);
//# sourceMappingURL=stadium.entity.js.map