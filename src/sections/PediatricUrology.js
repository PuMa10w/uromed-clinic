import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const PediatricUrology = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'enuresis',
    'phimosis',
    'hydrocele',
    'hypospadias',
    'posterior-urethral-valves',
    'spermatocele',
    'balanoposthitis',
    'cryptorchidism',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="ДЕТСКАЯ УРОЛОГИЯ-АНДРОЛОГИЯ"
      subtitle="Врождённые и приобретённые заболевания у детей (Q53-Q64 по МКБ-10)"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default PediatricUrology;
