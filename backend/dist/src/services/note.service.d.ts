import { INote } from '../types/note.types';
export declare const noteService: {
    createNote: (noteData: Partial<INote>, userId: string) => Promise<INote>;
    updateNote: (noteId: string, updateData: Partial<INote>, userId: string) => Promise<INote | null>;
    deleteNote: (noteId: string, userId: string) => Promise<INote | null>;
    getNotesByUser: (userId: string) => Promise<INote[]>;
    getNoteById: (noteId: string, userId: string) => Promise<INote | null>;
};
//# sourceMappingURL=note.service.d.ts.map