import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FavoritesPage from './FavoritesPage';

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      const mockReact = require('react');
      const Component = ({ children, whileHover, whileTap, initial, animate, transition, viewport, ...props }) => (
        mockReact.createElement(tag, props, children)
      );
      Component.displayName = `motion.${String(tag)}`;
      return Component;
    },
  }),
}));

describe('FavoritesPage', () => {
  it('renders empty state and navigates home', () => {
    const onNavigate = jest.fn();

    render(<FavoritesPage favorites={{}} allDiseases={[]} onNavigate={onNavigate} />);

    expect(screen.getByText('Избранное пока пустое')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'На главную' }));

    expect(onNavigate).toHaveBeenCalledWith('home');
  });

  it('renders grouped favorites with fallback metadata and handles actions', () => {
    const onNavigate = jest.fn();
    const allDiseases = [
      {
        id: 'urolithiasis',
        name: 'Мочекаменная болезнь',
        icd: 'N20',
        section: 'urology',
        subsection: 'stones',
        icon: '💎',
      },
    ];

    render(
      <FavoritesPage
        favorites={{ urolithiasis: true }}
        allDiseases={allDiseases}
        onNavigate={onNavigate}
      />
    );

    expect(screen.getByText(/Избранное \(1\)/)).toBeInTheDocument();
    expect(screen.getByText('Мочекаменная болезнь')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Открыть карточку: Мочекаменная болезнь' })).toBeInTheDocument();
    expect(screen.getAllByText('Избранное')[0]).toBeInTheDocument();

    fireEvent.click(screen.getByText('Мочекаменная болезнь'));
    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', 'urolithiasis');

    fireEvent.click(screen.getByRole('button', { name: 'Удалить из избранного: Мочекаменная болезнь' }));
    expect(onNavigate).toHaveBeenCalledWith('remove-fav', 'urolithiasis');
  });
});
