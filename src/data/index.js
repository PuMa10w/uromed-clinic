/**
 * ЕДИНЫЙ ИСТОЧНИК ДАННЫХ — UroAndro
 * Все мета-данные болезней для навигации, поиска, избранного и истории.
 */

import { buildSearchVariants, normalizeSearchText, scoreSearchMatch } from '../utils/search';
import { allDiseases, sectionNames, sections, subsectionLabels } from './diseases';
export { allDiseases, sectionNames, sections, subsectionLabels };

// ===== СЕКЦИИ И ПОДРАЗДЕЛЫ =====



export const sectionIcons = {
  urology: '🔬', andrology: '⚡', pediatric: '👶',
  emergency: '🚨', surgery: '🔪', metaphylaxis: '🥗',
  tools: '📊', games: '🎮', drugs: '💊', glossary: '📖', calculators: '🧮',
  sitemap: '🗺️', home: '🏠',
};

// ===== ВСЕ БОЛЕЗНИ — единый массив =====

// ===== MAP для быстрого поиска по ID =====
export const diseaseById = {};
if (Array.isArray(allDiseases)) {
  allDiseases.forEach(d => { diseaseById[d.id] = d; });
}

const SEARCH_SYNONYMS = {
  bph: ['дгпж', 'аденома простаты', 'доброкачественная гиперплазия простаты', 'доброкачественная гиперплазия предстательной железы', 'benign prostatic hyperplasia', 'bph', 'luts', 'нижние мочевые пути', 'затрудненное мочеиспускание'],
  'erectile-dysfunction': ['эд', 'эректильная дисфункция', 'нарушение эрекции', 'слабая эрекция', 'ухудшение эрекции', 'потенция', 'ed', 'impotence', 'erection'],
  'premature-ejaculation': ['пэ', 'преждевременная эякуляция', 'ранняя эякуляция', 'быстрая эякуляция', 'pe'],
  'male-infertility': ['мужское бесплодие', 'нарушение фертильности', 'плохая спермограмма', 'спермограмма', 'male infertility', 'spermogram', 'semen analysis'],
  'prostate-cancer': ['рак простаты', 'рпж', 'рак предстательной железы', 'prostate cancer', 'pca', 'psa', 'пса', 'повышенный пса'],
  prostatitis: ['хтбс', 'схтб', 'cpps', 'chronic prostatitis', 'тазовая боль', 'боль в промежности'],
  urolithiasis: ['мкб', 'камни', 'камень', 'камни в почках', 'уролитиаз', 'нефролитиаз', 'мочекаменная болезнь', 'urolithiasis', 'kidney stone', 'stone disease'],
  'renal-colic': ['почечная колика', 'renal colic', 'камень боль', 'боль в боку'],
  pyelonephritis: ['пиелонефрит', 'pyelonephritis', 'инфекция почки', 'температура боль в пояснице'],
  cystitis: ['цистит', 'cystitis', 'uti', 'жжение при мочеиспускании', 'дизурия'],
  'uti-unspecified': ['имп без уточнения', 'инфекция мочевых путей', 'uti unspecified', 'uti', 'мочевая инфекция'],
  'acute-bacterial-prostatitis': ['острый простатит', 'бактериальный простатит', 'acute prostatitis', 'температура простатит'],
  'epididymo-orchitis': ['эпидидимоорхит', 'epididymo orchitis', 'боль в яичке', 'отек мошонки'],
  'overactive-bladder': ['гамп', 'гиперактивный мочевой пузырь', 'oab', 'частое мочеиспускание', 'ургентность', 'позывы'],
  ckd: ['хбп', 'хроническая болезнь почек', 'ckd'],
  'acute-kidney-injury': ['опп', 'острое повреждение почек', 'aki'],
  'testicular-torsion': ['перекрут яичка', 'torsion'],
  priapism: ['приапизм', 'priapism'],
  'ureteral-stone': ['камень мочеточника', 'камень в мочеточнике', 'уретеролитиаз', 'ureter stone', 'ureteral stone'],
  'bladder-stones': ['камни мочевого пузыря', 'камень мочевого пузыря', 'bladder stones'],
  'urethral-stones': ['камень уретры', 'камни уретры', 'urethral stones'],
  'bladder-diverticulum': ['дивертикул мочевого пузыря', 'bladder diverticulum'],
  'bladder-rupture': ['разрыв мочевого пузыря', 'bladder rupture'],
  'bladder-cancer': ['рак мочевого пузыря', 'рак мочевого', 'bladder cancer', 'гематурия'],
  'enterovesical-fistula': ['кишечно пузырный свищ', 'пузырно кишечный свищ', 'enterovesical fistula'],
  'urethral-trauma': ['травма уретры', 'разрыв уретры', 'urethral trauma'],
  'underactive-bladder': ['гипоактивный мочевой пузырь', 'детрузорная недостаточность', 'underactive bladder'],
  'prostatic-calculi': ['камни простаты', 'кальцинаты простаты', 'prostatic calculi'],
  'elevated-psa': ['пса', 'psa', 'повышенный пса', 'простатический специфический антиген'],
  hematuria: ['гематурия', 'кровь в моче', 'blood in urine'],
  nocturia: ['никтурия', 'ночное мочеиспускание', 'встаю ночью мочиться'],
  'urinary-retention': ['задержка мочи', 'не могу помочиться', 'острая задержка мочи'],
  'stress-incontinence': ['стрессовое недержание', 'недержание мочи', 'подтекание мочи'],
  'urge-incontinence': ['ургентное недержание', 'недержание мочи', 'позывы подтекание'],
  varicocele: ['варикоцеле', 'вены мошонки', 'расширение вен мошонки', 'тяжесть в мошонке', 'varicocele'],
  azoospermia: ['азооспермия', 'нет сперматозоидов', 'спермограмма', 'azoospermia'],
  oligospermia: ['олигозооспермия', 'мало сперматозоидов', 'спермограмма', 'oligospermia'],
  asthenozoospermia: ['астенозооспермия', 'низкая подвижность сперматозоидов', 'спермограмма', 'asthenozoospermia'],
  teratozoospermia: ['тератозооспермия', 'морфология сперматозоидов', 'спермограмма', 'teratozoospermia'],
  hypogonadism: ['гипогонадизм', 'низкий тестостерон', 'дефицит тестостерона', 'снижение либидо', 'low testosterone'],
  'subclinical-hypogonadism': ['субклинический гипогонадизм', 'низкий тестостерон', 'пограничный тестостерон'],
  'hyperprolactinemia-male': ['гиперпролактинемия', 'пролактин', 'высокий пролактин'],
  'testicular-atrophy': ['атрофия яичка', 'уменьшение яичка', 'testicular atrophy'],
};

function getDiseaseSearchTerms(disease) {
  const baseTerms = [
    disease.name,
    disease.icd,
    disease.id,
    sectionNames[disease.section],
    subsectionLabels[disease.subsection],
    ...(SEARCH_SYNONYMS[disease.id] || []),
  ].filter(Boolean);

  return [...new Set(baseTerms.flatMap((term) => buildSearchVariants(term)))];
}

// ===== Хелперы =====
export function getDiseaseById(id) {
  if (!diseaseById || !id) return null;
  return diseaseById[id] || null;
}

export function getDiseasesBySection(section) {
  return Array.isArray(allDiseases) ? allDiseases.filter(d => d.section === section);
}

export function getDiseasesBySubsection(section, subsection) {
  return Array.isArray(allDiseases) ? allDiseases.filter(d => d.section === section && d.subsection === subsection);
}

export function searchDiseases(query) {
  if (!query || query.length < 2) return [];
  const queryVariants = buildSearchVariants(query);
  if (!queryVariants.length) return [];

  return allDiseases
    .map((disease) => {
      const searchableTerms = getDiseaseSearchTerms(disease);
      const synonymTerms = (SEARCH_SYNONYMS[disease.id] || [])
        .flatMap((term) => buildSearchVariants(term));
      let bestScore = -1;

      queryVariants.forEach((queryVariant) => {
        searchableTerms.forEach((term) => {
          const score = scoreSearchMatch(queryVariant, term);
          if (score > bestScore) {
            bestScore = score;
          }
        });

        const normalizedName = normalizeSearchText(disease.name);
        const normalizedIcd = normalizeSearchText(disease.icd);
        const normalizedId = normalizeSearchText(disease.id);

        if (normalizedIcd === queryVariant) bestScore = Math.max(bestScore, 130);
        if (normalizedName === queryVariant) bestScore = Math.max(bestScore, 125);
        if (normalizedId === queryVariant) bestScore = Math.max(bestScore, 118);

        if (synonymTerms.some((term) => scoreSearchMatch(queryVariant, term) >= 0)) {
          bestScore += 4;
        }
      });

      return bestScore >= 0 ? { disease, score: bestScore } : null;
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.disease.name.localeCompare(right.disease.name, 'ru');
    })
    .map(({ disease }) => disease);
}
