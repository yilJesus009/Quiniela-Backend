"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const groups_module_1 = require("./groups/groups.module");
const matches_module_1 = require("./matches/matches.module");
const stadiums_module_1 = require("./stadiums/stadiums.module");
const predictions_module_1 = require("./predictions/predictions.module");
const admin_module_1 = require("./admin/admin.module");
const sync_module_1 = require("./sync/sync.module");
const user_entity_1 = require("./users/user.entity");
const token_entity_1 = require("./auth/token.entity");
const stadium_entity_1 = require("./stadiums/stadium.entity");
const match_entity_1 = require("./matches/match.entity");
const group_entity_1 = require("./groups/group.entity");
const group_member_entity_1 = require("./groups/group-member.entity");
const prediction_entity_1 = require("./predictions/prediction.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: +(config.get('DB_PORT') ?? 5432),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_DATABASE'),
                    entities: [user_entity_1.User, token_entity_1.Token, stadium_entity_1.Stadium, match_entity_1.Match, group_entity_1.Group, group_member_entity_1.GroupMember, prediction_entity_1.Prediction],
                    synchronize: false,
                    logging: config.get('NODE_ENV') === 'development',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            groups_module_1.GroupsModule,
            matches_module_1.MatchesModule,
            stadiums_module_1.StadiumsModule,
            predictions_module_1.PredictionsModule,
            admin_module_1.AdminModule,
            sync_module_1.SyncModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map