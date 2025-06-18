import { IUser } from '../types/user.types';
export declare const authService: {
    login: (email: string, password: string) => Promise<{
        user: IUser;
        token: string;
    }>;
    register: (userData: {
        email: string;
        password: string;
    }) => Promise<{
        user: IUser;
        token: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map