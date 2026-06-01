import {
  clearTelemetryEvents,
  getTelemetryEvents,
  getTelemetrySnapshot,
  trackModal,
  trackSectionPathway,
} from './analytics';

describe('analytics telemetry snapshot', () => {
  beforeEach(() => {
    clearTelemetryEvents();
  });

  afterEach(() => {
    clearTelemetryEvents();
  });

  it('records section pathway events and summarizes recommendation-to-modal conversion', () => {
    trackSectionPathway({
      step: 'focus_cta',
      section: 'andrology',
      subsection: 'fertility',
      source: 'section_retained_focus_cta',
      retained: true,
    });
    trackSectionPathway({
      step: 'disease_recommendation',
      section: 'andrology',
      subsection: 'fertility',
      targetId: 'male-infertility',
      source: 'section_retained_disease_recommendation',
      retained: true,
    });
    trackModal('male-infertility', 'open', 'section_retained_disease_recommendation', {
      section: 'andrology',
      subsection: 'fertility',
    });

    const snapshot = getTelemetrySnapshot();

    expect(getTelemetryEvents()).toHaveLength(3);
    expect(snapshot.sectionPathwayEvents).toBe(2);
    expect(snapshot.modalOpenEvents).toBe(1);
    expect(snapshot.topPathways[0]).toMatchObject({
      label: 'andrology / fertility',
      step: 'focus_cta',
      source: 'section_retained_focus_cta',
      retained: 'retained',
      count: 1,
      progressRate: 100,
    });
    expect(snapshot.topRecommendations[0]).toMatchObject({
      label: 'andrology / fertility -> male-infertility',
      targetId: 'male-infertility',
      source: 'section_retained_disease_recommendation',
      retained: 'retained',
      recommendations: 1,
      modalRate: 100,
    });
  });

  it('clears telemetry events', () => {
    trackSectionPathway({
      step: 'subsection_card',
      section: 'urology',
      subsection: 'stones',
      source: 'section_retention_cluster',
      retained: true,
    });

    expect(getTelemetryEvents()).toHaveLength(1);

    clearTelemetryEvents();

    expect(getTelemetryEvents()).toEqual([]);
    expect(getTelemetrySnapshot().totalEvents).toBe(0);
  });
});
