import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterWrapper, AppRoutes } from './router';

// Global query client instance config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterWrapper>
        <AppRoutes />
      </RouterWrapper>
    </QueryClientProvider>
  );
};

export default App;
