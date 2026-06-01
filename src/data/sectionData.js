import { allDiseases } from './index';
import { enrichDiseaseMetadataList } from './enrichMetadata';

export function getSectionDiseasesByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const lookup = new Map(allDiseases.map((disease) => [disease.id, disease]));
  return enrichDiseaseMetadataList(ids.map((id) => lookup.get(id)).filter(Boolean));
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
