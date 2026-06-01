import {
  getCardDescription,
  getCardTags,
  getFavoriteDescription,
  getFavoriteTags,
  getHeaderTags,
  cardMetadataDefaults,
} from './cardMetadata';

describe('cardMetadata helpers', () => {
  it('returns disease description when present', () => {
    expect(getCardDescription({ description: 'Test description' })).toBe('Test description');
    expect(getFavoriteDescription({ description: 'Favorite description' })).toBe('Favorite description');
  });

  it('returns fallback descriptions when missing', () => {
    expect(getCardDescription({})).toBe(cardMetadataDefaults.DEFAULT_CARD_DESCRIPTION);
    expect(getFavoriteDescription({})).toBe(cardMetadataDefaults.DEFAULT_FAVORITE_DESCRIPTION);
    expect(getCardDescription(null)).toBe(cardMetadataDefaults.DEFAULT_CARD_DESCRIPTION);
  });

  it('returns real tags when present', () => {
    const tags = ['EAU', 'AUA'];
    expect(getCardTags({ tags })).toEqual(tags);
    expect(getFavoriteTags({ tags })).toEqual(tags);
    expect(getHeaderTags({ tags })).toEqual(tags);
  });

  it('returns fallback tags when missing or empty', () => {
    expect(getCardTags({})).toEqual(cardMetadataDefaults.DEFAULT_CARD_TAGS);
    expect(getCardTags({ tags: [] })).toEqual(cardMetadataDefaults.DEFAULT_CARD_TAGS);
    expect(getFavoriteTags({})).toEqual(cardMetadataDefaults.DEFAULT_FAVORITE_TAGS);
    expect(getHeaderTags({})).toEqual(cardMetadataDefaults.DEFAULT_HEADER_TAGS);
  });
});
