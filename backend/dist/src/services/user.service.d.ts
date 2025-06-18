import { IUser } from '../types/user.types';
export declare const userService: {
    createUser: (userData: Partial<IUser>) => Promise<IUser>;
    getUserById: (id: string) => Promise<IUser | null>;
    getUserByEmail: (email: string) => Promise<IUser | null>;
};
//# sourceMappingURL=user.service.d.ts.map