import {
  Injectable, ConflictException, UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/user.entity';
import { Token } from './token.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)  private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Validar que las contraseñas coincidan
    if (dto.password !== dto.password_confirmation) {
      throw new UnprocessableEntityException({
        message: 'Las contraseñas no coinciden.',
        errors: { password_confirmation: ['Las contraseñas no coinciden.'] },
      });
    }

    // Verificar que el email no esté en uso
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException({
        message: 'El correo ya está registrado.',
        errors: { email: ['El correo ya está registrado.'] },
      });
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ name: dto.name, email: dto.email, password: hashed });
    await this.userRepo.save(user);

    const token = await this.generateAndStoreToken(user);
    return { token, name: user.name, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    const valid = user && (await bcrypt.compare(dto.password, user.password));

    if (!valid) {
      throw new UnprocessableEntityException({
        message: 'Las credenciales son incorrectas.',
        errors: { email: ['Las credenciales son incorrectas.'] },
      });
    }

    // Revocar todos los tokens anteriores del usuario
    await this.tokenRepo.delete({ userId: user.id });

    const token = await this.generateAndStoreToken(user);
    return { token, name: user.name, email: user.email };
  }

  async logout(rawToken: string) {
    await this.tokenRepo.delete({ token: rawToken });
    return { message: 'Sesión cerrada correctamente.' };
  }

  private async generateAndStoreToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    await this.tokenRepo.save(this.tokenRepo.create({ userId: user.id, token }));
    return token;
  }
}
