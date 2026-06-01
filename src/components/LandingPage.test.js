import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders premium destination cards and opens the andrology section', () => {
    const onNavigate = jest.fn();

    render(<LandingPage onNavigate={onNavigate} />);

    const urologyButton = screen.getAllByRole('button').find((button) => (
      button.classList.contains('is-urology')
    ));
    const andrologyButton = screen.getByRole('button', { name: /Андрология/i });

    expect(urologyButton).toBeInTheDocument();
    expect(andrologyButton).toBeInTheDocument();

    fireEvent.click(andrologyButton);

    expect(onNavigate).toHaveBeenCalledWith('andrology');
  });

  it('routes quick access cards with the landing source', () => {
    const onNavigate = jest.fn();

    render(<LandingPage onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /Мужское бесплодие/i }));

    expect(onNavigate).toHaveBeenCalledWith('andrology', 'fertility', 'male-infertility', {
      source: 'landing_quick_access',
    });
  });
});
