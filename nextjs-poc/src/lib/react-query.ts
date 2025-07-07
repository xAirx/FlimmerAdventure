import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys for better cache management
export const queryKeys = {
  stories: {
    all: ['stories'] as const,
    top: (limit: number) => ['stories', 'top', limit] as const,
  },
  story: {
    all: ['story'] as const,
    byId: (id: number) => ['story', id] as const,
  },
  user: {
    all: ['user'] as const,
    byId: (username: string) => ['user', username] as const,
  },
} as const; 