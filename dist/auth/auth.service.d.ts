import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Token } from './token.entity';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthService {
    private userRepo;
    private tokenRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, tokenRepo: Repository<Token>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        name: string;
        email: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        name: string;
        email: string;
    }>;
    logout(rawToken: string): Promise<{
        message: string;
    }>;
    private generateAndStoreToken;
}
