import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LeaveManager } from './LeaveManager';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

describe('LeaveManager Component', () => {
  it('renders without crashing and displays the title', () => {
    render(<LeaveManager />);
    expect(screen.getByText('Leave Management')).toBeInTheDocument();
    expect(screen.getByText('Track and manage staff leave requests.')).toBeInTheDocument();
  });
});
