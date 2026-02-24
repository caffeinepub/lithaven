import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, BookType, ExternalBlob } from '../backend';

// Frontend Book type that matches backend structure
export interface Book {
  id: string;
  title: string;
  authorName: string;
  description: string;
  coverImage?: ExternalBlob;
  price: number;
  genre: string;
  isEbook: boolean;
  file?: ExternalBlob;
  publisher: string;
  availableStock: number;
  rating?: number;
  bookType: BookType;
  approved: boolean;
  uploadedBy: string;
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Books Queries
export function useGetAllBooks() {
  const { actor, isFetching } = useActor();

  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async (): Promise<Book[]> => {
      if (!actor) return [];
      // Backend doesn't have getAllBooks yet, return empty array
      // This will be populated once backend implements the function
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData: {
      title: string;
      authorName: string;
      description: string;
      price: number;
      genre: string;
      isEbook: boolean;
      bookType: BookType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBook(
        bookData.title,
        bookData.authorName,
        bookData.description,
        bookData.price,
        bookData.genre,
        bookData.isEbook,
        bookData.bookType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
