import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './react-query';

// Placeholder API call – replace with Firestore / Cloud Function
async function approveContent(id: number) {
  console.log('approving content', id);
  // simulate latency
  await new Promise(r => setTimeout(r, 500));
  return { id, status: 'approved' } as const;
}

export const useApproveContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveContent(id),
    onSuccess: () => {
      // invalidate moderation queue so UI refetches fresh list
      qc.invalidateQueries({ queryKey: queryKeys.stories.all });
      qc.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}; 