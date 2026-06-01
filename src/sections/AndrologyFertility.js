import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const AndrologyFertility = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'male-infertility',
    'varicocele',
    'cryptorchidism',
    'orchitis',
    'oligospermia',
    'male-contraception',
    'azoospermia',
    'teratozoospermia',
    'asthenozoospermia',
    'leukocytospermia',
    'varicocele-recurrence',
    'ejaculatory-duct-obstruction',
    'fertility-preservation-male',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="МУЖСКАЯ ФЕРТИЛЬНОСТЬ"
      subtitle="Мужское бесплодие, варикоцеле, крипторхизм, орхит"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default AndrologyFertility;
