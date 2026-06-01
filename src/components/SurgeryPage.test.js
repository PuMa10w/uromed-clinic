import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SurgeryPage from './SurgeryPage';

describe('SurgeryPage', () => {
  it('renders procedural hero and routes to stones pathway from hero CTA', () => {
    const onNavigate = jest.fn();

    render(<SurgeryPage onNavigate={onNavigate} />);

    expect(screen.getByText('Хирургия в урологии и андрологии')).toBeInTheDocument();
    expect(screen.getByText('Procedure-focused')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Открыть stones pathway'));

    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', null, {
      source: 'service_surgery_hero',
    });
  });
});
