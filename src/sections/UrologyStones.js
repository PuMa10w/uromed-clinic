import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const UrologyStones = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'urolithiasis',
    'kidney-stone',
    'kidney-ureter-stones',
    'renal-colic',
    'bladder-stones',
    'urethral-stones',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="МОЧЕКАМЕННАЯ БОЛЕЗНЬ"
      subtitle="Конкременты в почках, мочеточниках и мочевом пузыре"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default UrologyStones;
