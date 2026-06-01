import React, { useMemo } from 'react';
import DiseaseSection from '../components/DiseaseSection';
import { getSectionDiseasesByIds } from '../data/sectionData';

const AndrologySexual = ({ favorites, onToggleFavorite, onNavigate, selectedDiseaseId, viewHistory }) => {
  const data = useMemo(() => getSectionDiseasesByIds([
    'erectile-dysfunction',
    'psychogenic-ed',
    'premature-ejaculation',
    'psychogenic-premature-ejaculation',
    'peyronie',
    'priapism',
    'cavernous-fibrosis',
    'chronic-prostatitis-cpps',
    'orchialgia',
    'funiculitis',
    'spermatorrhea',
    'aspermatism',
    'penile-trauma',
    'penile-lichen-sclerosus',
    'delayed-ejaculation',
    'anejaculation',
    'retrograde-ejaculation',
    'hematospermia',
    'post-vasectomy-pain',
    'male-pelvic-floor-dysfunction',
    'penile-mondor-disease',
    'male-genital-lichen-planus',
    'chronic-bacterial-prostatitis',
  ]), []);

  return (
    <DiseaseSection
      data={data}
      title="СЕКСУАЛЬНАЯ ДИСФУНКЦИЯ И ЭКСТРЕННЫЕ СОСТОЯНИЯ"
      subtitle="Эректильная дисфункция, преждевременная эякуляция, болезнь Пейрони, приапизм, фиброз"
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onNavigate={onNavigate}
      selectedDiseaseId={selectedDiseaseId}
      viewHistory={viewHistory}
    />
  );
};

export default AndrologySexual;
