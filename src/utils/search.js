const CYRILLIC_TO_LATIN = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ы: 'y',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ь: '',
  ъ: '',
};

const LATIN_KEYBOARD_TO_CYRILLIC = {
  q: 'й',
  w: 'ц',
  e: 'у',
  r: 'к',
  t: 'е',
  y: 'н',
  u: 'г',
  i: 'ш',
  o: 'щ',
  p: 'з',
  '[': 'х',
  ']': 'ъ',
  a: 'ф',
  s: 'ы',
  d: 'в',
  f: 'а',
  g: 'п',
  h: 'р',
  j: 'о',
  k: 'л',
  l: 'д',
  ';': 'ж',
  "'": 'э',
  z: 'я',
  x: 'ч',
  c: 'с',
  v: 'м',
  b: 'и',
  n: 'т',
  m: 'ь',
  ',': 'б',
  '.': 'ю',
  '/': '.',
};

function transliterate(value) {
  return String(value || '')
    .split('')
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join('');
}

function switchLatinKeyboardToCyrillic(value) {
  return String(value || '')
    .toLowerCase()
    .split('')
    .map((char) => LATIN_KEYBOARD_TO_CYRILLIC[char] ?? char)
    .join('');
}

function getLimitedEditDistance(left, right, maxDistance = 2) {
  if (Math.abs(left.length - right.length) > maxDistance) {
    return maxDistance + 1;
  }

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    let rowMinimum = current[0];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      const distance = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );

      current[rightIndex] = distance;
      rowMinimum = Math.min(rowMinimum, distance);
    }

    if (rowMinimum > maxDistance) {
      return maxDistance + 1;
    }

    previous = current;
  }

  return previous[right.length];
}

function scoreTokenCoverage(queryTokens, candidateTokens) {
  if (!queryTokens.length || !candidateTokens.length) {
    return -1;
  }

  let fuzzyPenalty = 0;

  const allTokensMatched = queryTokens.every((queryToken) => {
    if (candidateTokens.some((candidateToken) => candidateToken === queryToken)) {
      return true;
    }

    if (candidateTokens.some((candidateToken) => candidateToken.startsWith(queryToken))) {
      fuzzyPenalty += 2;
      return true;
    }

    if (queryToken.length >= 3 && candidateTokens.some((candidateToken) => candidateToken.includes(queryToken))) {
      fuzzyPenalty += 6;
      return true;
    }

    if (queryToken.length < 4) {
      return false;
    }

    const maxDistance = queryToken.length >= 7 ? 2 : 1;
    const fuzzyMatch = candidateTokens.some((candidateToken) => {
      if (candidateToken.length < 4) return false;
      const distance = getLimitedEditDistance(queryToken, candidateToken, maxDistance);
      return distance <= maxDistance;
    });

    if (fuzzyMatch) {
      fuzzyPenalty += maxDistance === 2 ? 14 : 10;
    }

    return fuzzyMatch;
  });

  if (!allTokensMatched) {
    return -1;
  }

  const compactBonus = Math.max(0, 12 - candidateTokens.length);
  return 62 + compactBonus - fuzzyPenalty;
}

export function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}.-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchVariants(value) {
  const rawValue = String(value || '');
  const sourceValues = new Set([rawValue]);
  const keyboardSwitched = switchLatinKeyboardToCyrillic(rawValue);

  if (keyboardSwitched && keyboardSwitched !== rawValue.toLowerCase()) {
    sourceValues.add(keyboardSwitched);
  }

  const variants = new Set();

  sourceValues.forEach((sourceValue) => {
    const normalized = normalizeSearchText(sourceValue);
    if (!normalized) {
      return;
    }

    variants.add(normalized);
    const transliterated = transliterate(normalized);

    if (transliterated && transliterated !== normalized) {
      variants.add(transliterated);
    }

    normalized
      .split(/[\s.-]+/g)
      .filter((part) => part.length >= 2)
      .forEach((part) => {
        variants.add(part);

        const partTransliterated = transliterate(part);
        if (partTransliterated && partTransliterated !== part) {
          variants.add(partTransliterated);
        }
      });
  });

  if (!variants.size) {
    return [];
  }

  return [...variants];
}

export function scoreSearchMatch(query, candidate) {
  if (!query || !candidate) {
    return -1;
  }

  const queryWeight = Math.min(query.length, 24);

  if (candidate === query) return 120 + queryWeight;
  if (candidate.startsWith(`${query} `)) return 102 + queryWeight;
  if (candidate.startsWith(query)) return 92 + queryWeight;
  if (candidate.includes(` ${query} `)) return 74 + queryWeight;
  if (candidate.endsWith(` ${query}`)) return 68 + queryWeight;
  if (candidate.includes(query)) return 56 + queryWeight;

  const queryTokens = query.split(/[\s.-]+/g).filter(Boolean);
  const candidateTokens = candidate.split(/[\s.-]+/g).filter(Boolean);
  const tokenCoverageScore = scoreTokenCoverage(queryTokens, candidateTokens);

  if (tokenCoverageScore >= 0) {
    return tokenCoverageScore + queryWeight;
  }

  return -1;
}
