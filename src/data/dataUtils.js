/**
 * UroMed Data Index
 * Central entry point for all disease data with lazy loading optimization
 */

import { allDiseases } from './index';
import { searchDiseases as searchDiseasesFromIndex } from './index';

// Re-export all data modules
export * from './index';

// Data validation utility
export function validateDiseaseData(diseases) {
  const errors = [];
  const idSet = new Set();

  diseases.forEach((disease, index) => {
    if (!disease.id) {
      errors.push(`Disease at index ${index}: missing id`);
      return;
    }

    if (idSet.has(disease.id)) {
      errors.push(`Duplicate disease id: ${disease.id}`);
    }
    idSet.add(disease.id);

    const required = ['name', 'section', 'icd'];
    required.forEach(field => {
      if (!disease[field]) {
        errors.push(`Disease ${disease.id}: missing ${field}`);
      }
    });
  });

  return errors;
}

export function getDiseasesBySection(section) {
  return allDiseases.filter(d => d.section === section);
}

export function getDiseasesBySubsection(section, subsection) {
  return allDiseases.filter(d => d.section === section && d.subsection === subsection);
}

export function searchDiseases(query) {
  return searchDiseasesFromIndex(query);
}
