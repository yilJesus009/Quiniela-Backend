import { User } from '../users/user.entity';
export declare class Token {
    id: number;
    userId: number;
    token: string;
    createdAt: Date;
    user: User;
}
