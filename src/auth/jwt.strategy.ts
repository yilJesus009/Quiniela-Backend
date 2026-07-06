import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Token } from './token.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') as string,
      passReqToCallback: true,
    };
    super(options);
  }

  // Se llama automáticamente después de verificar la firma JWT
  async validate(
    req: any,
    payload: { sub: number; email: string; role: string },
  ) {
    // Extraer el token raw del header para verificar que no fue revocado
    const rawToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!rawToken) throw new UnauthorizedException('Token no proporcionado.');

    const stored = await this.tokenRepo.findOne({ where: { token: rawToken } });
    if (!stored) throw new UnauthorizedException('Token revocado o inválido.');

    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
