import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    logout(req: any): Promise<{
        message: string;
    }>;
}
