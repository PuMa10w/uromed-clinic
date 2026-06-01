import PropTypes from 'prop-types';

const validateDisease = (disease) => {
  const errors = [];

  if (!disease) {
    return { valid: false, errors: ['Disease is null or undefined'] };
  }

  if (!disease.id || typeof disease.id !== 'string') {
    errors.push('Missing or invalid id');
  }

  if (!disease.name || typeof disease.name !== 'string') {
    errors.push('Missing or invalid name');
  }

  if (!disease.section || typeof disease.section !== 'string') {
    errors.push('Missing or invalid section');
  }

  if (!disease.icd || typeof disease.icd !== 'string') {
    errors.push('Missing or invalid icd');
  }

  const validSections = ['home', 'urology', 'andrology', 'pediatric', 'emergency', 'surgery', 'metaphylaxis', 'tools', 'games', 'drugs', 'glossary', 'calculators', 'sitemap', 'favorites'];
  if (disease.section && !validSections.includes(disease.section)) {
    errors.push(`Invalid section: ${disease.section}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

const validateDiseaseData = (disease) => {
  const result = validateDisease(disease);

  const recommendedFields = ['description', 'tags', 'definition', 'symptoms', 'diagnostics', 'treatment'];
  const missingFields = recommendedFields.filter(field => !disease[field]);

  if (missingFields.length > 0) {
    result.warnings = result.warnings || [];
    result.warnings.push(...missingFields.map(f => `Missing recommended field: ${f}`));
  }

  return result;
};

const validateDiseasesArray = (diseases) => {
  if (!Array.isArray(diseases)) {
    return { valid: false, errors: ['Diseases must be an array'], count: 0 };
  }

  const results = diseases.map((disease, index) => ({
    index,
    ...validateDisease(disease),
  }));

  const validCount = results.filter(r => r.valid).length;
  const invalidResults = results.filter(r => !r.valid);

  return {
    valid: invalidResults.length === 0,
    count: diseases.length,
    validCount,
    invalidCount: invalidResults.length,
    errors: invalidResults.flatMap(r => r.errors.map(e => `[${r.index}] ${e}`)),
    warnings: results.flatMap(r => r.warnings || []),
  };
};

const validateSection = (section) => {
  const errors = [];

  if (!section.id || typeof section.id !== 'string') {
    errors.push('Missing or invalid id');
  }

  if (!section.label || typeof section.label !== 'string') {
    errors.push('Missing or invalid label');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

const validateAppState = (state) => {
  const errors = [];

  if (!state.activeSection) {
    errors.push('Missing activeSection');
  }

  if (state.favorites && typeof state.favorites !== 'object') {
    errors.push('Invalid favorites (must be object)');
  }

  if (state.viewHistory && !Array.isArray(state.viewHistory)) {
    errors.push('Invalid viewHistory (must be array)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export {
  validateDisease,
  validateDiseaseData,
  validateDiseasesArray,
  validateSection,
  validateAppState,
};

export default {
  validateDisease,
  validateDiseaseData,
  validateDiseasesArray,
  validateSection,
  validateAppState,
};