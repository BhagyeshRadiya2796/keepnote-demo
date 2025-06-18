/**
 * Query keys for notes
 * Used to organize and manage React Query cache
 */
export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  list: (filters: string) => [...notesKeys.lists(), { filters }] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: string) => [...notesKeys.details(), id] as const,
};
