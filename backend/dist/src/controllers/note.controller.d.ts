import { Request, Response, NextFunction } from 'express';
export declare const noteController: {
    getNotes: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    createNote: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    updateNote: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    deleteNote: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
//# sourceMappingURL=note.controller.d.ts.map