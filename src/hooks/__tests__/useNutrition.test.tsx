import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNutrition } from '../useNutrition';
import { describe, it, expect } from 'vitest';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNutrition Custom Hook', () => {
  it('should remain idle when search query is empty', () => {
    const { result } = renderHook(() => useNutrition(''), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should fetch nutrition successfully for non-empty search terms', async () => {
    const { result } = renderHook(() => useNutrition('apple'), {
      wrapper: createWrapper(),
    });

    // Wait until query resolves successfully
    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 2000 });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.[0].name).toBe('apple');
  });
});
