import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HistoryPanel from './HistoryPanel';
import { trackHistoryReopen } from '../utils/analytics';

jest.mock('./diseaseIcons', () => ({
  diseaseIcons: {},
}));

jest.mock('../utils/analytics', () => ({
  trackHistoryReopen: jest.fn(),
}));

describe('HistoryPanel', () => {
  it('renders source labels and reopens history items with source metadata', () => {
    const onNavigate = jest.fn();

    render(
      <HistoryPanel
        history={[
          {
            id: 'urolithiasis',
            name: 'Мочекаменная болезнь',
            section: 'urology',
            subsection: 'stones',
            source: 'search',
            lastSource: 'search',
            openCount: 4,
            sourceCounts: { search: 3, history_reopen: 1 },
            time: '5 мин назад',
          },
          {
            id: 'male-infertility',
            name: 'Мужское бесплодие',
            section: 'andrology',
            subsection: 'fertility',
            source: 'landing_symptom_entry',
            lastSource: 'landing_symptom_entry',
            openCount: 3,
            sourceCounts: { landing_symptom_entry: 2, history_reopen: 1 },
            time: '2 мин назад',
          },
        ]}
        onNavigate={onNavigate}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByText('Most revisited: Мочекаменная болезнь')).toBeInTheDocument();
    expect(screen.getByText('Top retained source: Search')).toBeInTheDocument();
    expect(screen.getByText('3 retained opens')).toBeInTheDocument();
    expect(screen.getByText('Retention-aware next reads')).toBeInTheDocument();
    expect(screen.getByText('Based on your strongest returning pathways')).toBeInTheDocument();
    expect(screen.getAllByText('Landing symptom').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3 opens').length).toBeGreaterThan(0);

    const recommendationButtons = screen.getAllByText('Мужское бесплодие');
    fireEvent.click(recommendationButtons[0].closest('button'));
    expect(onNavigate).toHaveBeenCalledWith('andrology', 'fertility', 'male-infertility', { source: 'retention_recommendation' });

    fireEvent.click(recommendationButtons[1].closest('button'));

    expect(trackHistoryReopen).toHaveBeenCalledWith('male-infertility', 'landing_symptom_entry', 3);
    expect(onNavigate).toHaveBeenCalledWith('andrology', 'fertility', 'male-infertility', { source: 'history_reopen' });
  });
});
