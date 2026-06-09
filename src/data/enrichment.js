/**
 * UroMed Disease Data Enrichment
 * Adds medical metadata to disease entries
 */

// Medical enrichment template for common disease fields
const ENRICHMENT_FIELDS = {
  // Base structure for all diseases
  base: {
    description: '',
    symptoms: [],
    diagnosis: [],
    treatment: [],
    prevention: [],
    prevalence: '',
    mortality: '',
    risk: 'moderate', // low | moderate | high
    sources: [],
    clinicalRecommendations: [],
  },

  // Risk levels
  riskLevels: {
    urolithiasis: 'moderate',
    'kidney-stone': 'moderate',
    infection: 'high',
    oncology: 'high',
    'bladder-cancer': 'high',
    'prostate-cancer': 'high',
    functional: 'low',
    pain: 'moderate',
  },

  // Prevalence data
  prevalence: {
    urolithiasis: '1-2% населения',
    'kidney-stone': '0.5-1% населения',
    infection: 'Часто встречается',
    oncology: '0.1-0.5% населения',
    'bladder-cancer': '0.8% населения',
    'prostate-cancer': '2-3% у мужчин',
  },

  // Mortality rates
  mortality: {
    urolithiasis: '<0.01%',
    'kidney-stone': '<0.01%',
    'bladder-cancer': '15-20%',
    'prostate-cancer': '20-25%',
    infection: 'Зависит от типа',
  },
};

// Enrich disease data with medical metadata
export const enrichDisease = (disease) => {
  return {
    ...disease,
    description: disease.description || ENRICHMENT_FIELDS.base.description,
    symptoms: disease.symptoms || ENRICHMENT_FIELDS.base.symptoms,
    diagnosis: disease.diagnosis || ENRICHMENT_FIELDS.base.diagnosis,
    treatment: disease.treatment || ENRICHMENT_FIELDS.base.treatment,
    prevention: disease.prevention || ENRICHMENT_FIELDS.base.prevention,
    prevalence: disease.prevalence || ENRICHMENT_FIELDS.prevalence[disease.id] || '',
    mortality: disease.mortality || ENRICHMENT_FIELDS.mortality[disease.id] || '',
    risk: disease.risk || ENRICHMENT_FIELDS.riskLevels[disease.id] || 'moderate',
    sources: disease.sources || [],
    clinicalRecommendations: disease.clinicalRecommendations || [],
  };
};

// Common diagnostic methods
export const diagnostics = {
  ultrasound: 'УЗИ',
  ct: 'КТ',
  mrt: 'МРТ',
  cystoscopy: 'Цистоскопия',
  urography: 'Урография',
  urineAnalysis: 'Анализ мочи',
  bloodTests: 'Кровные тесты',
};

// Common treatment methods
export const treatments = {
  conservative: 'Консервативное лечение',
  surgical: 'Хирургическое вмешательство',
  lithotripsy: 'Литотрипсия',
  lithology: 'Литология',
  endoscopic: 'Эндоскопия',
  medication: 'Медикаментозное лечение',
};

// Risk level colors
export const riskColors = {
  low: 'var(--medical-low)',
  moderate: 'var(--medical-moderate)',
  high: 'var(--medical-high)',
  severe: 'var(--medical-severe)',
};

export default { enrichDisease, diagnostics, treatments, riskColors };