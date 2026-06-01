import { preloadDiseaseData } from './lazyData';

export const diseaseModules = {};

export function getDiseaseModule(id) {
  return preloadDiseaseData(id);
}

export async function getDiseaseModuleSync(id) {
  return preloadDiseaseData(id);
}
