import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PaymentReminders } from './PaymentReminders';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }
}));

describe('PaymentReminders Component', () => {
  it('renders without crashing and displays the title', () => {
    render(<PaymentReminders />);
    expect(screen.getByText('Payment Reminders')).toBeInTheDocument();
    expect(screen.getByText('Track recurring facility bills and operational dues.')).toBeInTheDocument();
  });
});
