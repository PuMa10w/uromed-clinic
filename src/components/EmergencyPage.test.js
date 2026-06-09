import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EmergencyPage from './EmergencyPage';

describe('EmergencyPage', () => {
  it('renders hero routes and navigates from hero and expanded protocol', () => {
    const onNavigate = jest.fn();

    render(<EmergencyPage onNavigate={onNavigate} />);

    expect(screen.getByText('Экстренные состояния')).toBeInTheDocument();
    expect(screen.getByText('Time-critical pathways')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('Приапизм')[0]);

    expect(onNavigate).toHaveBeenCalledWith('andrology', 'sexual', 'priapism', {
      source: 'service_emergency_hero',
    });

    fireEvent.click(screen.getAllByText('Перекрут яичка')[1]);
    fireEvent.click(screen.getByText('Открыть полную нозологию'));

    expect(onNavigate).toHaveBeenCalledWith('urology', 'reconstructive', 'testicular-torsion', {
      source: 'service_emergency_detail',
    });
  });
});
