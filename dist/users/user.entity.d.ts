import { Token } from '../auth/token.entity';
import { GroupMember } from '../groups/group-member.entity';
import { Prediction } from '../predictions/prediction.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    tokens: Token[];
    groupMembers: GroupMember[];
    predictions: Prediction[];
}
