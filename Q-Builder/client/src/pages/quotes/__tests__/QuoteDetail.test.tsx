import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import QuoteDetail from '../QuoteDetail';

// Mock the stores and hooks
vi.mock('../../../stores/quoteStore', () => ({
  useQuoteStore: () => ({
    getClientById: vi.fn(),
    updateQuoteStatus: vi.fn(),
  }),
}));

vi.mock('../../../hooks/usePageTitle', () => ({
  default: vi.fn(),
}));

vi.mock('../../../services/api', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock useParams to return a test ID
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('QuoteDetail', () => {
  it('renders loading state initially', () => {
    renderWithRouter(<QuoteDetail />);
    
    // Should show loading skeletons
    expect(document.querySelector('.loading-skeleton')).toBeInTheDocument();
  });

  it('renders component without crashing', () => {
    renderWithRouter(<QuoteDetail />);
    
    // Component should render without throwing errors
    expect(document.body).toBeInTheDocument();
  });
});