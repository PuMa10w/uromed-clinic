import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DebugPanel, { buildTelemetryExport, compareTelemetryExports, formatTelemetrySummary, getCompareVerdict } from './DebugPanel';
import { clearTelemetryEvents, getTelemetrySnapshot } from '../utils/analytics';

jest.mock('../utils/analytics', () => ({
  clearTelemetryEvents: jest.fn(),
  getTelemetrySnapshot: jest.fn(),
}));

describe('DebugPanel', () => {
  const snapshot = {
    totalEvents: 12,
    sectionPathwayEvents: 7,
    modalOpenEvents: 3,
    lastUpdatedAt: '2026-04-23T12:00:00.000Z',
    topPathways: [
      {
        label: 'urology / stones',
        source: 'section_retention_cluster',
        retained: 'retained',
        count: 4,
        progressRate: 75,
        step: 'subsection_card',
      },
    ],
    topRecommendations: [
      {
        label: 'urology / stones -> urolithiasis',
        source: 'section_retained_disease_recommendation',
        retained: 'retained',
        recommendations: 2,
        modalRate: 100,
      },
    ],
    weakestDropoffs: [
      {
        label: 'andrology / fertility',
        source: 'section_subsection',
        retained: 'default',
        count: 2,
        dropoffRate: 50,
      },
    ],
  };
  const exportContext = {
    appState: {
      activeSection: 'urology',
      activeSubsection: 'stones',
      selectedDiseaseId: 'urolithiasis',
      navigationSource: 'section_retained_disease_recommendation',
    },
    retention: {
      favoritesCount: 3,
      viewHistory: [
        {
          id: 'urolithiasis',
          name: 'Мочекаменная болезнь',
          section: 'urology',
          subsection: 'stones',
          openCount: 4,
          lastSource: 'search',
        },
      ],
    },
  };

  beforeEach(() => {
    clearTelemetryEvents.mockReset();
    getTelemetrySnapshot.mockReset();
    getTelemetrySnapshot.mockReturnValue(snapshot);
    global.URL.createObjectURL = jest.fn(() => 'blob:telemetry');
    global.URL.revokeObjectURL = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('formats telemetry summary into a compact shareable report', () => {
    const summary = formatTelemetrySummary(snapshot);

    expect(summary).toContain('UroMed telemetry snapshot');
    expect(summary).toContain('Total events: 12');
    expect(summary).toContain('1. urology / stones | section_retention_cluster | retained | 4 opens | 75% progressed');
    expect(summary).toContain('1. urology / stones -> urolithiasis | section_retained_disease_recommendation | retained | 2 recommendations | 100% modal conversion');
    expect(summary).toContain('1. andrology / fertility | section_subsection | default | 2 entries | 50% dropoff');
  });

  it('builds telemetry export json with snapshot payload', () => {
    const exported = JSON.parse(buildTelemetryExport(snapshot, exportContext));

    expect(exported.snapshot).toEqual(snapshot);
    expect(exported.context).toEqual(exportContext);
    expect(typeof exported.exportedAt).toBe('string');
  });

  it('compares two telemetry exports', () => {
    const compareExport = {
      snapshot: {
        ...snapshot,
        totalEvents: 18,
        sectionPathwayEvents: 10,
        modalOpenEvents: 5,
        topPathways: [{ label: 'andrology / fertility' }],
        topRecommendations: [{ label: 'andrology / fertility -> male-infertility' }],
        weakestDropoffs: [{ label: 'urology / stones' }],
      },
      context: {
        appState: {
          activeSection: 'andrology',
        },
        retention: {
          favoritesCount: 5,
          viewHistory: [{ id: 'male-infertility' }, { id: 'varicocele' }],
        },
      },
    };

    const baseExport = JSON.parse(buildTelemetryExport(snapshot, exportContext));
    const comparison = compareTelemetryExports(baseExport, compareExport);

    expect(comparison).toMatchObject({
      totalEventsDelta: 6,
      sectionPathwayDelta: 3,
      modalOpenDelta: 2,
      retentionHistoryDelta: 1,
      favoritesDelta: 2,
    });
    expect(comparison.topPathwayShift).toEqual({
      base: 'urology / stones',
      compare: 'andrology / fertility',
    });
  });

  it('returns an improved verdict for stronger downstream compare results', () => {
    const verdict = getCompareVerdict({
      totalEventsDelta: 4,
      sectionPathwayDelta: 2,
      modalOpenDelta: 2,
      weakestDropoffDelta: -10,
    });

    expect(verdict).toEqual({
      status: 'improved',
      label: 'Improved',
      reason: 'Higher downstream conversion with acceptable pathway quality.',
    });
  });

  it('renders telemetry snapshot, copies summary, and clears it from the panel', async () => {
    const originalCreateElement = document.createElement.bind(document);
    const clickSpy = jest.fn();
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return {
          click: clickSpy,
          set href(value) {
            this._href = value;
          },
          get href() {
            return this._href;
          },
          set download(value) {
            this._download = value;
          },
          get download() {
            return this._download;
          },
        };
      }

      return originalCreateElement(tagName);
    });

    render(
      <DebugPanel
        showTelemetry
        showState
        initialState={{ activeSection: 'urology' }}
        exportContext={exportContext}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open debug panel' }));

    expect(screen.getByText('Telemetry snapshot')).toBeInTheDocument();
    expect(screen.getByText('Total events: 12')).toBeInTheDocument();
    expect(screen.getByText('urology / stones')).toBeInTheDocument();
    expect(screen.getByText('urology / stones -> urolithiasis')).toBeInTheDocument();
    expect(screen.getByText('andrology / fertility')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Export JSON'));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(screen.getByText('JSON exported.')).toBeInTheDocument();
    });

    const comparePayload = JSON.stringify({
      snapshot: {
        ...snapshot,
        totalEvents: 16,
        sectionPathwayEvents: 9,
        modalOpenEvents: 4,
        topPathways: [{ label: 'andrology / fertility' }],
        topRecommendations: [{ label: 'andrology / fertility -> male-infertility' }],
        weakestDropoffs: [{ label: 'urology / stones' }],
      },
      context: {
        appState: {
          activeSection: 'andrology',
        },
        retention: {
          favoritesCount: 4,
          viewHistory: [{ id: 'male-infertility' }, { id: 'varicocele' }],
        },
      },
    });

    const originalFileReader = global.FileReader;
    class MockFileReader {
      readAsText() {
        this.result = comparePayload;
        this.onload();
      }
    }
    global.FileReader = MockFileReader;

    const compareInput = screen.getByLabelText('Compare export file');
    fireEvent.change(compareInput, {
      target: {
        files: [new File(['{}'], 'compare.json', { type: 'application/json' })],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Verdict: Improved')).toBeInTheDocument();
      expect(screen.getByText('Events delta: 4')).toBeInTheDocument();
      expect(screen.getByText('Active section: urology -> andrology')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Copy summary'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(screen.getByText('Summary copied.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Clear telemetry'));

    expect(clearTelemetryEvents).toHaveBeenCalled();
    createElementSpy.mockRestore();
    global.FileReader = originalFileReader;
  });
});
