import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useOperationsData } from '@/lib/hooks';
import { OperationsTab } from '@/app/dashboard/page'; // Assuming the component is exported for testing

// Mock the react-query hook
jest.mock('@/lib/hooks');

const mockUseOperationsData = useOperationsData as jest.Mock;

describe('OperationsTab Integration Test', () => {

  // A helper to provide a QueryClient wrapper, essential for testing react-query hooks
  const renderWithClient = (ui) => {
      const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      return render(
          <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      );
  };

  it('shows a loading state initially', () => {
    mockUseOperationsData.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    
    renderWithClient(<OperationsTab />);
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('shows an error message if the API call fails', async () => {
    mockUseOperationsData.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'),
    });

    renderWithClient(<OperationsTab />);

    await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('renders the users and moderation queue from the API on success', async () => {
    const mockData = {
      users: [{ id: 'usr_1', name: 'John Doe', email: 'john.doe@email.com', plan: 'Premium', status: 'Active', lastSeen: '1 hour ago' }],
      moderationQueue: [{ id: 1, title: 'Test Video', creator: 'TestUser', family: 'TestFamily', reason: 'Test Reason', aiStatus: 'pending' }],
    };

    mockUseOperationsData.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    renderWithClient(<OperationsTab />);

    // Verify that data from the API is rendered
    await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Test Video')).toBeInTheDocument();
    });
  });

}); 