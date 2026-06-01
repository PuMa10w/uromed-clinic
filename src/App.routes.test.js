import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import App from './App';

const routeSamples = [
  '/andrology/fertility/varicocele-recurrence',
  '/andrology/fertility/male-infertility',
  '/urology/stones/urolithiasis',
  '/urology/infections/pyelonephritis',
  '/andrology/sexual/erectile-dysfunction',
];

describe('App deep-link routes', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState(null, '', '/');
  });

  it.each(routeSamples)('renders without hitting the error boundary for %s', async (path) => {
    window.history.replaceState(null, '', path);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Что-то пошло не так/i)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('supports legacy hash deep links as a fallback', async () => {
    window.history.replaceState(null, '', '/');
    window.location.hash = '#urology/stones/urolithiasis';

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Что-то пошло не так/i)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
