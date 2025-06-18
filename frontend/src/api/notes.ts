import { apiClient } from './client';
import { INote, ICreateNoteDto, IUpdateNoteDto } from '../features/notes/types';

/**
 * Notes API methods
 * Uses the centralized API client with environment configuration
 */

export const getAllNotes = async (): Promise<INote[]> => {
  return apiClient.get<INote[]>('/notes');
};

export const getNoteById = async (id: string): Promise<INote> => {
  return apiClient.get<INote>(`/notes/${id}`);
};

export const createNote = async (data: ICreateNoteDto): Promise<INote> => {
  return apiClient.post<INote>('/notes', data);
};

export const updateNote = async (id: string, data: IUpdateNoteDto): Promise<INote> => {
  return apiClient.put<INote>(`/notes/${id}`, data);
};

export const deleteNote = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/notes/${id}`);
};
