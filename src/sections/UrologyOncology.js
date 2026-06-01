import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesBySubsection } from '../data/sectionData';

const PRIORITY_ONCOLOGY_IDS = [
  'prostate-cancer',
  'bladder-cancer',
  'kidney-cancer',
  'testicular-cancer',
  'penile-cancer',
  'upper-tract-uc',
  'elevated-psa',
];

const UrologyOncology = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(
    () => getSectionDiseasesBySubsection('urology', 'oncology', PRIORITY_ONCOLOGY_IDS),
    [],
  );

  return (
    <DiseaseSection
      data={data}
      title="Урологическая онкология"
      subtitle="Злокачественные опухоли почек, мочевого пузыря, простаты, яичка, полового члена и верхних мочевых путей"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default UrologyOncology;
