import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const UrologyInfections = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'cystitis',
    'acute-cystitis',
    'chronic-cystitis',
    'prostatitis',
    'pyelonephritis',
    'chronic-pyelonephritis',
    'epididymitis',
    'epididymo-orchitis',
    'urethritis',
    'balanoposthitis',
    'trichomoniasis-gu',
    'genital-mycoplasma',
    'genital-herpes',
    'condyloma-acuminata',
    'candida-balanitis',
    'cowperitis',
    'schistosomiasis-gu',
    'orchitis',
    'prostate-abscess',
    'fournier-gangrene',
    'xanthogranulomatous-pyelonephritis',
    'emphysematous-pyelonephritis',
    'renal-tuberculosis',
    'actinomycosis-gu',
    'prostatovesiculitis',
    'recurrent-uti',
    'asymptomatic-bacteriuria',
    'device-associated-uti',
    'urosepsis',
    'radiation-cystitis',
    'stent-symptoms',
    'urethral-syndrome',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="УРОЛОГИЧЕСКИЕ ИНФЕКЦИИ"
      subtitle="Воспалительные заболевания мочеполовой системы"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default UrologyInfections;
