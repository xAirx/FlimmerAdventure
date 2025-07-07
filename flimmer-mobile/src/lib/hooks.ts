import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3000/api'; // In a real app, this would be an environment variable

// --- Types (Ideally imported from a shared types package) ---
interface ActivityItem { id: number; child: string; action: string; content: string; timestamp: Date; riskLevel: string; }
interface ContentApproval { id: number; child: string; title: string; status: string; }

// --- Generic Fetcher ---
const fetchFromAPI = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return response.json();
};

// --- Parent Dashboard Hooks ---
export const useParentDashboardData = () => {
  return useQuery({
    queryKey: ['parentDashboard'],
    queryFn: () => Promise.all([
      fetchFromAPI('admin/operations'), // Reusing for mock data
      fetchFromAPI('admin/platform'),   // Reusing for mock data
    ]).then(([operations, platform]) => ({ ...operations, ...platform })),
  });
};

// --- Child Interface Hooks ---
export const useChildData = (childId: string) => {
    // This would fetch child-specific data
    return useQuery({
        queryKey: ['childData', childId],
        queryFn: () => Promise.resolve({ status: 'active', dailyTimeUsed: 75, dailyTimeLimit: 120 }) // Mocked for now
    });
};

export const useUploadContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (content: { title: string, description: string }) => {
            // In a real app, this would be a POST request
            console.log('Uploading content:', content);
            // Simulate API call
            await new Promise(res => setTimeout(res, 500)); 
            return { success: true };
        },
        onSuccess: () => {
            // When an upload is successful, invalidate the parent's dashboard data so they see the new approval item
            queryClient.invalidateQueries({ queryKey: ['parentDashboard'] });
        }
    });
}; 