import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Navbar from './Navbar';
import { searchDiseases } from '../data';
import { trackSearch, trackSearchSelect, trackSymptomRoute } from '../utils/analytics';

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      const mockReact = require('react');
      const Component = ({ children, initial, animate, exit, transition, whileHover, whileTap, viewport, layout, ...props }) => (
        mockReact.createElement(tag, props, children)
      );
      Component.displayName = `motion.${String(tag)}`;
      return Component;
    },
  }),
  AnimatePresence: ({ children }) => {
    const mockReact = require('react');
    return mockReact.createElement(mockReact.Fragment, null, children);
  },
}));

jest.mock('../hooks/useLocalStorage', () => ({
  useDarkMode: () => [false, jest.fn()],
}));

jest.mock('../data', () => ({
  searchDiseases: jest.fn(),
}));

jest.mock('../utils/analytics', () => ({
  trackSearch: jest.fn(),
  trackSearchSelect: jest.fn(),
  trackSymptomRoute: jest.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    searchDiseases.mockReset();
    trackSearch.mockReset();
    trackSearchSelect.mockReset();
    trackSymptomRoute.mockReset();
    searchDiseases.mockImplementation((query) => {
      if (!query || query.length < 2) return [];
      if (query === 'zz') return [];

      return [
        { id: 'urolithiasis', name: 'Мочекаменная болезнь', section: 'urology', subsection: 'stones', icd: 'N20', icon: '💎' },
      ];
    });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('opens search and selects a disease from results', async () => {
    const onNavigate = jest.fn();

    render(
      <Navbar
        activeSection="home"
        setActiveSection={jest.fn()}
        setActiveSubsection={jest.fn()}
        onNavigate={onNavigate}
        favorites={{}}
        viewHistory={[]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Открыть поиск'));
    fireEvent.change(screen.getByLabelText('Поиск по названию, МКБ, симптому, аббревиатуре или идентификатору'), {
      target: { value: 'мо' },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(searchDiseases).toHaveBeenCalledWith('мо');
    expect(trackSearch).toHaveBeenCalledWith('мо', 1);

    const resultText = await screen.findByText('Мочекаменная болезнь');
    fireEvent.click(resultText.closest('button'));

    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', 'urolithiasis', { source: 'search' });
    expect(trackSearchSelect).toHaveBeenCalledWith('мо', 'urolithiasis');
  });

  it('shows no-results state for unmatched query', async () => {
    render(
      <Navbar
        activeSection="home"
        setActiveSection={jest.fn()}
        setActiveSubsection={jest.fn()}
        onNavigate={jest.fn()}
        favorites={{}}
        viewHistory={[]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Открыть поиск'));
    fireEvent.change(screen.getByLabelText('Поиск по названию, МКБ, симптому, аббревиатуре или идентификатору'), {
      target: { value: 'zz' },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    });

    expect(trackSearch).toHaveBeenCalledWith('zz', 0);
  });

  it('shows symptom-first andrology routes in search and navigates from a complaint', () => {
    const onNavigate = jest.fn();

    render(
      <Navbar
        activeSection="home"
        setActiveSection={jest.fn()}
        setActiveSubsection={jest.fn()}
        onNavigate={onNavigate}
        favorites={{}}
        viewHistory={[]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Открыть поиск'));

    expect(screen.getByText('По симптомам')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Плохая спермограмма'));

    expect(onNavigate).toHaveBeenCalledWith('andrology', 'fertility', 'male-infertility', { source: 'search_overlay_symptom' });
    expect(trackSymptomRoute).toHaveBeenCalledWith('Плохая спермограмма', 'male-infertility', 'search_overlay');
  });

  it('navigates to favorites when favorites button is clicked', () => {
    const onNavigate = jest.fn();

    render(
      <Navbar
        activeSection="home"
        setActiveSection={jest.fn()}
        setActiveSubsection={jest.fn()}
        onNavigate={onNavigate}
        favorites={{ a: true, b: false }}
        viewHistory={[]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Избранное: 1 нозологий'));

    expect(onNavigate).toHaveBeenCalledWith('favorites', null, null, { skipHistory: true });
  });

  it('shows retention-aware routes in search overlay and opens them', () => {
    const onNavigate = jest.fn();

    render(
      <Navbar
        activeSection="home"
        setActiveSection={jest.fn()}
        setActiveSubsection={jest.fn()}
        onNavigate={onNavigate}
        favorites={{}}
        viewHistory={[
          {
            id: 'urolithiasis',
            name: 'Мочекаменная болезнь',
            section: 'urology',
            subsection: 'stones',
            openCount: 4,
            icon: '💎',
          },
          {
            id: 'renal-colic',
            name: 'Почечная колика',
            section: 'urology',
            subsection: 'stones',
            openCount: 2,
            icon: '💎',
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Открыть поиск'));

    expect(screen.getByText('История')).toBeInTheDocument();
    expect(screen.getByText('Группы по истории')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('Мочекаменная болезнь')[0].closest('button'));

    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', 'urolithiasis', { source: 'search_retention' });

    fireEvent.click(screen.getByText('6 откр. из истории').closest('button'));

    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', null, { source: 'search_retention_cluster' });
  });
});
