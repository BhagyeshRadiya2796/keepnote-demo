import { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isPasswordMatch(password: string): Promise<boolean>;
}
//# sourceMappingURL=user.types.d.ts.map