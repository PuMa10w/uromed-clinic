import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const UrologyReconstructive = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'urethral-stricture',
    'postprocedural-urethral-stricture',
    'vesicoureteral-reflux',
    'hydronephrosis',
    'leukoplakia',
    'retroperitoneal-fibrosis',
    'hematuria',
    'urogenital-fistula',
    'urethral-diverticulum',
    'paraphimosis',
    'meatal-stenosis',
    'testicular-torsion',
    'ureteral-stricture-benign',
    'vesicovaginal-fistula',
    'urethral-caruncle',
    'pelvic-fracture-urethral-injury',
    'penile-fracture',
    'scrotal-trauma',
    'urethral-prolapse',
    'bladder-exstrophy',
    'vesicocutaneous-fistula',
    'upj-obstruction',
    'bladder-endometriosis',
    'chyluria',
    'catheter-complication',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="РЕКОНСТРУКТИВНАЯ УРОЛОГИЯ"
      subtitle="Стриктуры, рефлюкс, гидронефроз, гематурия и другие заболевания"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default UrologyReconstructive;
