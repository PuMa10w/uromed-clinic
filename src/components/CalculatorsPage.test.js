import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CalculatorsPage from './CalculatorsPage';

describe('CalculatorsPage', () => {
  it('renders service hero and routes from hero CTA', () => {
    const onNavigate = jest.fn();

    render(<CalculatorsPage onNavigate={onNavigate} />);

    expect(screen.getByText('Калькуляторы и опросники')).toBeInTheDocument();
    expect(screen.getByText('Questionnaires + calculators')).toBeInTheDocument();
    expect(screen.getByText('Спермограмма: дерево решений')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Открыть андрологию'));

    expect(onNavigate).toHaveBeenCalledWith('andrology', 'fertility', null, {
      source: 'service_calculators_hero',
    });
  });

  it('renders the spermogram tree and source chips', () => {
    render(<CalculatorsPage onNavigate={jest.fn()} />);

    expect(screen.getByText('Ведущий паттерн')).toBeInTheDocument();
    expect(screen.getByText('Преаналитика и повторяемость')).toBeInTheDocument();
    expect(screen.getAllByText('WHO 2021').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AUA/ASRM 2024').length).toBeGreaterThan(0);
  });
});
