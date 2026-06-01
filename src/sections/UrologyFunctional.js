import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const UrologyFunctional = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'overactive-bladder',
    'stress-incontinence',
    'neurogenic-bladder',
    'urinary-retention',
    'interstitial-cystitis',
    'bph',
    'seminal-vesicle-disease',
    'prostatic-cyst',
    'post-prostatectomy-incontinence',
    'bladder-neck-obstruction',
    'bladder-outlet-obstruction',
    'stress-incontinence-male',
    'urge-incontinence',
    'neurogenic-bladder-child',
    'nocturia',
    'pollakiuria',
    'vesicocutaneous-fistula',
    'urethral-hypersensitivity',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="ФУНКЦИОНАЛЬНАЯ УРОЛОГИЯ"
      subtitle="СНМП, ДГПЖ, нарушения мочеиспускания, иннервации и функции мочевого пузыря"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default UrologyFunctional;
