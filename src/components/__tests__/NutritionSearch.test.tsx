import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NutritionSearch } from '../NutritionSearch';
import { describe, it, expect, vi } from 'vitest';

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

describe('NutritionSearch Component', () => {
  it('should render the search input and welcome instructions initially', () => {
    const mockOnAddFood = vi.fn();
    render(<NutritionSearch onAddFood={mockOnAddFood} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Analizador de Nutrientes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej. Ensalada, Manzana...')).toBeInTheDocument();
    expect(screen.queryByTitle('Agregar al Balance Diario')).not.toBeInTheDocument();
  });

  it('should perform search and display resulting compound Cards when search query is submitted', async () => {
    const mockOnAddFood = vi.fn();
    render(<NutritionSearch onAddFood={mockOnAddFood} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Ej. Ensalada, Manzana...');
    const button = screen.getByRole('button', { name: /buscar/i });

    // Type query "apple" and submit
    fireEvent.change(input, { target: { value: 'apple' } });
    fireEvent.click(button);

    // Verify search indicator is shown
    expect(screen.getByText(/buscando información/i)).toBeInTheDocument();

    // Wait until result Card finishes rendering
    await waitFor(() => {
      expect(screen.getByText('Manzana')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify the portion size is rendered (inside Card.Header)
    expect(screen.getByText('Porción: 100g')).toBeInTheDocument();

    // Verify nutrient statistics (inside Card.Body)
    expect(screen.getByText(/Carbs/i)).toBeInTheDocument();

    // Verify add button is rendered (inside Card.Footer) and click it
    const addBtn = screen.getByTitle('Agregar al Balance Diario');
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);

    // Verify callback was triggered with the correct NutritionItem
    expect(mockOnAddFood).toHaveBeenCalledTimes(1);
    expect(mockOnAddFood).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Manzana',
        serving_size_g: 100,
      })
    );
  });

  it('should instantly show local suggestions for common foods without clicking search', async () => {
    const mockOnAddFood = vi.fn();
    render(<NutritionSearch onAddFood={mockOnAddFood} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Ej. Ensalada, Manzana...');

    // Simulate typing partial word "ens" to test local filter
    fireEvent.change(input, { target: { value: 'ens' } });

    // Result should appear instantly from local cache
    // Result should appear instantly from local cache dropdown
    expect(screen.getByText('ensalada')).toBeInTheDocument();
  });
});
