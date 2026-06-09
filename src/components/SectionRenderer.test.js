import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SectionRenderer from './SectionRenderer';

jest.mock('./LandingPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'LandingPage');
});

jest.mock('./ToolsSection', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'ToolsSection');
});

jest.mock('./FavoritesPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'FavoritesPage');
});

jest.mock('./EmergencyPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'EmergencyPage');
});

jest.mock('./SitemapPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'SitemapPage');
});

jest.mock('./CalculatorsPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'CalculatorsPage');
});

jest.mock('./GamesPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'GamesPage');
});

jest.mock('./SurgeryPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'SurgeryPage');
});

jest.mock('./MetaphylaxisPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'MetaphylaxisPage');
});

jest.mock('./UroHumorPage', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'UroHumorPage');
});

jest.mock('../sections/PediatricUrology', () => () => {
  const mockReact = require('react');
  return mockReact.createElement('div', null, 'PediatricUrology');
});

describe('SectionRenderer', () => {
  const baseProps = {
    activeSubsection: null,
    selectedDiseaseId: null,
    favorites: {},
    toggleFavorite: jest.fn(),
    viewHistory: [],
    clearHistory: jest.fn(),
    onCloseDisease: jest.fn(),
    onNavigate: jest.fn(),
  };

  it('renders urology subsection selector cards', () => {
    render(<SectionRenderer {...baseProps} activeSection="urology" />);

    expect(screen.getByText('УРОЛОГИЯ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Мочекаменная/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Инфекции/i })).toBeInTheDocument();
  });

  it('opens a urology subsection with the neutral subsection source', () => {
    const onNavigate = jest.fn();

    render(<SectionRenderer {...baseProps} activeSection="urology" onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /Инфекции/i }));

    expect(onNavigate).toHaveBeenCalledWith('urology', 'infections', null, {
      source: 'section_subsection',
    });
  });

  it('opens an andrology subsection with the neutral subsection source', () => {
    const onNavigate = jest.fn();

    render(<SectionRenderer {...baseProps} activeSection="andrology" onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /Эндокринология/i }));

    expect(onNavigate).toHaveBeenCalledWith('andrology', 'endocrine', null, {
      source: 'section_subsection',
    });
  });
});
