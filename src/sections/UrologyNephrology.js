import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const UrologyNephrology = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'glomerulonephritis',
    'ckd',
    'nephroptosis',
    'renal-cysts',
    'renal-abscess',
    'acute-kidney-injury',
    'nephrotic-syndrome',
    'polycystic-kidney',
    'renal-artery-stenosis',
    'renal-infarction',
    'papillary-necrosis',
    'renal-vein-thrombosis',
    'interstitial-nephritis',
    'membranous-nephropathy',
    'iga-nephropathy',
    'diabetic-nephropathy',
    'analgesic-nephropathy',
    'renal-trauma',
    'ureteral-trauma',
    'hypercalciuria',
    'hyperoxaluria',
    'cystinuria',
    'hyperuricosuria',
    'renal-angiomyolipoma',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="НЕФРОЛОГИЯ В УРОЛОГИИ"
      subtitle="Гломерулонефрит, ХБП, тубулопатии, диабетическая и анальгетическая нефропатия"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default UrologyNephrology;
