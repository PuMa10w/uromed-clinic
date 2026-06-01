const DEFAULT_CARD_DESCRIPTION =
  'Откройте карточку, чтобы посмотреть диагностику, лечение и клинические рекомендации.';
const DEFAULT_CARD_TAGS = ['Справочник', 'Клиника'];
const DEFAULT_FAVORITE_DESCRIPTION =
  'Откройте карточку, чтобы посмотреть клиническое описание, диагностику и лечение.';
const DEFAULT_FAVORITE_TAGS = ['Избранное'];
const DEFAULT_HEADER_TAGS = ['Справочник'];

export function getCardDescription(disease) {
  return disease?.description || DEFAULT_CARD_DESCRIPTION;
}

export function getCardTags(disease) {
  return Array.isArray(disease?.tags) && disease.tags.length > 0 ? disease.tags : DEFAULT_CARD_TAGS;
}

export function getFavoriteDescription(disease) {
  return disease?.description || DEFAULT_FAVORITE_DESCRIPTION;
}

export function getFavoriteTags(disease) {
  return Array.isArray(disease?.tags) && disease.tags.length > 0 ? disease.tags : DEFAULT_FAVORITE_TAGS;
}

export function getHeaderTags(disease) {
  return Array.isArray(disease?.tags) && disease.tags.length > 0 ? disease.tags : DEFAULT_HEADER_TAGS;
}

export const cardMetadataDefaults = {
  DEFAULT_CARD_DESCRIPTION,
  DEFAULT_CARD_TAGS,
  DEFAULT_FAVORITE_DESCRIPTION,
  DEFAULT_FAVORITE_TAGS,
  DEFAULT_HEADER_TAGS,
};
