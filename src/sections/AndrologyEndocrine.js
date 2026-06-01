import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const AndrologyEndocrine = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'hypogonadism',
    'male-climacterium',
    'klein-felter',
    'hyperprolactinemia-male',
    'hyperthyroidism-ed',
    'metabolic-syndrome-ed',
    'kallmann-syndrome',
    'subclinical-hypogonadism',
    'androgen-resistance-syndrome',
    'male-osteoporosis-hypogonadism',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="АНДРОЛОГИЧЕСКАЯ ЭНДОКРИНОЛОГИЯ"
      subtitle="Мужской гипогонадизм и гормональные нарушения"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default AndrologyEndocrine;
