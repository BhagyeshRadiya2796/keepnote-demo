import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../../../api/notes';
import { ICreateNoteDto, IUpdateNoteDto } from '../types';
import { notesKeys } from './queryKeys';

/**
 * Hook to fetch all notes
 */
export const useGetNotes = () => {
  return useQuery({
    queryKey: notesKeys.lists(),
    queryFn: getAllNotes,
  });
};

/**
 * Hook to fetch a single note by ID
 */
export const useGetNoteById = (id: string) => {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateNoteDto }) => 
      updateNote(id, data),
    onSuccess: (data, variables) => {
      // Update the note in the cache
      queryClient.setQueryData(notesKeys.detail(variables.id), data);
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

/**
 * Hook to delete a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, id) => {
      // Remove the note from the cache
      queryClient.removeQueries({ queryKey: notesKeys.detail(id) });
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};
