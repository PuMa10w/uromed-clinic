import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import DiseaseSection from './DiseaseSection';
import { preloadDiseaseData } from '../data/lazyData';
import { trackSectionPathway } from '../utils/analytics';

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      const mockReact = require('react');
      const Component = ({ children, whileHover, whileTap, whileInView, initial, animate, exit, transition, viewport, layout, ...props }) => (
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

jest.mock('./DiseaseModal', () => ({ disease, onClose, onNavigate }) => {
  const mockReact = require('react');
  return mockReact.createElement(
    'div',
    { 'data-testid': 'disease-modal' },
    mockReact.createElement('span', null, disease.name),
    mockReact.createElement('button', { onClick: () => onNavigate(1) }, 'next'),
    mockReact.createElement('button', { onClick: onClose }, 'close'),
  );
});

jest.mock('../data/lazyData', () => ({
  preloadDiseaseData: jest.fn(),
  preloadDiseaseBatch: jest.fn(),
}));

jest.mock('../utils/analytics', () => ({
  trackSectionPathway: jest.fn(),
}));

describe('DiseaseSection', () => {
  beforeEach(() => {
    preloadDiseaseData.mockReset();
    trackSectionPathway.mockReset();
  });

  it('renders fallback metadata for lightweight cards', () => {
    const { container } = render(
      <DiseaseSection
        title="Тестовый раздел"
        data={[
          { id: 'stone', name: 'Камень', icd: 'N20', section: 'urology', subsection: 'stones', icon: '💎' },
        ]}
        favorites={{}}
        onToggleFavorite={jest.fn()}
        onNavigate={jest.fn()}
      />,
    );

    const diseaseCards = container.querySelectorAll('.disease-card');
    expect(diseaseCards[0]).toHaveTextContent('Камень');
    expect(diseaseCards[0]).toHaveTextContent('Откройте карточку');
    expect(diseaseCards[0]).toHaveTextContent('Справочник');
    expect(screen.getByText('Pathway recommendations')).toBeInTheDocument();
  });

  it('keeps pathway recommendations editorial and hides retained history labels', () => {
    const onNavigate = jest.fn();

    render(
      <DiseaseSection
        title="Stone pathway"
        data={[
          { id: 'urolithiasis', name: 'Urolithiasis', icd: 'N20', section: 'urology', subsection: 'stones', icon: 'stone' },
          { id: 'renal-colic', name: 'Renal colic', icd: 'N23', section: 'urology', subsection: 'stones', icon: 'stone' },
          { id: 'bladder-stones', name: 'Bladder stones', icd: 'N21', section: 'urology', subsection: 'stones', icon: 'stone' },
        ]}
        favorites={{}}
        onToggleFavorite={jest.fn()}
        onNavigate={onNavigate}
        viewHistory={[
          {
            id: 'renal-colic',
            name: 'Renal colic',
            section: 'urology',
            subsection: 'stones',
            openCount: 5,
          },
        ]}
      />,
    );

    const recommendationRegion = screen.getByLabelText('Pathway recommendations');
    expect(recommendationRegion).not.toHaveTextContent('retained opens');

    const recommendationButtons = within(recommendationRegion).getAllByRole('button');
    fireEvent.click(recommendationButtons[0]);

    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', 'urolithiasis', {
      preserveScroll: true,
      source: 'section_disease_recommendation',
    });
    expect(trackSectionPathway).toHaveBeenCalledWith({
      step: 'disease_recommendation',
      section: 'urology',
      subsection: 'stones',
      targetId: 'urolithiasis',
      source: 'section_disease_recommendation',
      retained: false,
    });
  });

  it('uses suggested-start source for fallback recommendations', () => {
    const onNavigate = jest.fn();

    render(
      <DiseaseSection
        title="Stone pathway"
        data={[
          { id: 'urolithiasis', name: 'Мочекаменная болезнь', icd: 'N20', section: 'urology', subsection: 'stones', icon: '💎' },
          { id: 'renal-colic', name: 'Почечная колика', icd: 'N23', section: 'urology', subsection: 'stones', icon: '💎' },
        ]}
        favorites={{}}
        onToggleFavorite={jest.fn()}
        onNavigate={onNavigate}
        viewHistory={[]}
      />,
    );

    const recommendationRegion = screen.getByLabelText('Pathway recommendations');
    const recommendationButtons = within(recommendationRegion).getAllByRole('button');

    fireEvent.click(recommendationButtons[0]);

    expect(onNavigate).toHaveBeenCalledWith('urology', 'stones', 'urolithiasis', {
      preserveScroll: true,
      source: 'section_disease_recommendation',
    });
    expect(trackSectionPathway).toHaveBeenCalledWith({
      step: 'disease_recommendation',
      section: 'urology',
      subsection: 'stones',
      targetId: 'urolithiasis',
      source: 'section_disease_recommendation',
      retained: false,
    });
  });

  it('loads full disease data before opening modal', async () => {
    preloadDiseaseData.mockResolvedValue({
      id: 'stone',
      name: 'Камень полный',
      icd: 'N20',
      section: 'urology',
      subsection: 'stones',
      tags: ['EAU'],
    });

    const { container } = render(
      <DiseaseSection
        title="Тестовый раздел"
        data={[
          { id: 'stone', name: 'Камень', icd: 'N20', section: 'urology', subsection: 'stones', icon: '💎' },
        ]}
        favorites={{}}
        onToggleFavorite={jest.fn()}
        onNavigate={jest.fn()}
      />,
    );

    fireEvent.click(container.querySelector('.disease-card'));

    await waitFor(() => {
      expect(preloadDiseaseData).toHaveBeenCalledWith('stone');
      expect(screen.getByTestId('disease-modal')).toBeInTheDocument();
      expect(screen.getByText('Камень полный')).toBeInTheDocument();
    });
  });

  it('prefetches disease data on hover', () => {
    preloadDiseaseData.mockResolvedValue(null);

    const { container } = render(
      <DiseaseSection
        title="Тестовый раздел"
        data={[
          { id: 'stone', name: 'Камень', icd: 'N20', section: 'urology', subsection: 'stones', icon: '💎' },
        ]}
        favorites={{}}
        onToggleFavorite={jest.fn()}
        onNavigate={jest.fn()}
      />,
    );

    fireEvent.mouseEnter(container.querySelector('.disease-card'));
    expect(preloadDiseaseData).toHaveBeenCalledWith('stone');
  });

  it('closes modal and clears selection', async () => {
    preloadDiseaseData.mockResolvedValue({
      id: 'stone',
      name: 'Камень полный',
      icd: 'N20',
      section: 'urology',
      subsection: 'stones',
      tags: ['EAU'],
    });

    const { container } = render(
      <DiseaseSection
        title="Тестовый раздел"
        data={[
          { id: 'stone', name: 'Камень', icd: 'N20', section: 'urology', subsection: 'stones', icon: '💎' },
        ]}
        favorites={{}}
        onToggleFavorite={jest.fn()}
        onNavigate={jest.fn()}
      />,
    );

    fireEvent.click(container.querySelector('.disease-card'));

    await waitFor(() => expect(screen.getByTestId('disease-modal')).toBeInTheDocument());
    fireEvent.click(screen.getByText('close'));

    await waitFor(() => expect(screen.queryByTestId('disease-modal')).not.toBeInTheDocument());
  });
});
