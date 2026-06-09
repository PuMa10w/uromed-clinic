import allDiseases from './diseases';
import { enrichDiseaseMetadataList } from './enrichMetadata';

export function getSectionDiseasesByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.warn('getSectionDiseasesByIds: ids invalid', ids);
    return [];
  }

  console.log('getSectionDiseasesByIds called with ids:', ids, 'allDiseases length:', allDiseases.length);
  const lookup = new Map(allDiseases.map((disease) => [disease.id, disease]));
  console.log('lookup size:', lookup.size);
  const found = ids.map((id) => lookup.get(id)).filter(Boolean);
  console.log('found count:', found.length);
  if (found.length === 0) {
    console.warn('No diseases found for ids:', ids, 'first few disease ids:', Array.from(lookup.keys()).slice(0, 10));
  }
  return enrichDiseaseMetadataList(found);
}

export function getSectionDiseasesBySubsection(section, subsection, priorityIds = []) {
  const priority = new Map(priorityIds.map((id, index) => [id, index]));
  const priorityFallback = priorityIds.length + 1000;

  const data = allDiseases
    .filter((disease) => disease.section === section && disease.subsection === subsection)
    .sort((left, right) => {
      const leftPriority = priority.has(left.id) ? priority.get(left.id) : priorityFallback;
      const rightPriority = priority.has(right.id) ? priority.get(right.id) : priorityFallback;

      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return left.name.localeCompare(right.name, 'ru');
    });

  return enrichDiseaseMetadataList(data);
}
