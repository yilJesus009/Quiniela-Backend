import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Token } from './token.entity';
declare const JwtStrategy_base: new (...args: [opt: StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    private tokenRepo;
    constructor(config: ConfigService, tokenRepo: Repository<Token>);
    validate(req: any, payload: {
        sub: number;
        email: string;
        role: string;
    }): Promise<{
        id: number;
        email: string;
        role: string;
    }>;
}
export {};
