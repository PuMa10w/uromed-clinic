import { buildFollowUpFallback, buildRedFlagsFallback } from './clinicalFallbacks';

export const clinicalMinimumIds = new Set([
  'kidney-stone',
  'renal-colic',
  'kidney-ureter-stones',
  'acute-cystitis',
  'chronic-cystitis',
  'chronic-pyelonephritis',
  'recurrent-uti',
  'asymptomatic-bacteriuria',
  'device-associated-uti',
  'urethritis',
  'epididymo-orchitis',
  'balanoposthitis',
  'trichomoniasis-gu',
  'genital-mycoplasma',
  'genital-herpes',
  'condyloma-acuminata',
  'candida-balanitis',
  'cowperitis',
  'schistosomiasis-gu',
  'elevated-psa',
  'benign-bladder-neoplasm',
  'bladder-carcinoma-in-situ',
  'urethral-cancer',
  'urge-incontinence',
  'postprocedural-urethral-stricture',
  'renal-trauma',
  'ureteral-trauma',
  'bladder-rupture',
  'urethral-trauma',
  'pelvic-fracture-urethral-injury',
  'scrotal-trauma',
  'hydronephrosis',
  'catheter-complication',
  'psychogenic-premature-ejaculation',
  'psychogenic-ed',
  'posterior-urethral-valves',
  'bladder-endometriosis',
  'papillary-rcc',
  'adrenal-incidentaloma',
  'ejaculatory-duct-obstruction',
  'fertility-preservation-male',
  'subclinical-hypogonadism',
  'androgen-resistance-syndrome',
  'male-osteoporosis-hypogonadism',
  'male-pelvic-floor-dysfunction',
  'penile-mondor-disease',
  'male-genital-lichen-planus',
  'chronic-bacterial-prostatitis',
]);

export const sourcePackMinimumIds = new Set([
  'benign-bladder-neoplasm',
  'urogenital-fistula',
  'urethral-diverticulum',
  'paraphimosis',
  'meatal-stenosis',
  'ureteral-stricture-benign',
  'vesicovaginal-fistula',
  'catheter-complication',
  'renal-trauma',
  'ureteral-trauma',
  'bladder-rupture',
  'urethral-trauma',
  'pelvic-fracture-urethral-injury',
  'scrotal-trauma',
  'postprocedural-urethral-stricture',
  'urethritis',
  'epididymo-orchitis',
  'genital-herpes',
  'condyloma-acuminata',
  'trichomoniasis-gu',
  'genital-mycoplasma',
  'candida-balanitis',
  'psychogenic-premature-ejaculation',
  'psychogenic-ed',
  'penile-trauma',
  'phimosis',
  'hypospadias',
]);

const sourcePackByDomain = {
  urology: [
    { body: 'EAU', title: 'EAU Guidelines', url: 'https://uroweb.org/guidelines' },
    { body: 'AUA', title: 'AUA Guidelines & Quality', url: 'https://www.auanet.org/guidelines-and-quality' },
    { body: 'Минздрав РФ', title: 'Рубрикатор клинических рекомендаций', url: 'https://cr.minzdrav.gov.ru/' },
  ],
  andrology: [
    { body: 'EAU', title: 'EAU Sexual and Reproductive Health Guidelines', url: 'https://uroweb.org/guidelines' },
    { body: 'AUA', title: 'AUA Guidelines & Quality', url: 'https://www.auanet.org/guidelines-and-quality' },
    { body: 'CUA/USANZ', title: 'Regional urology guideline portals', url: 'https://www.cua.org/guidelines' },
  ],
  pediatric: [
    { body: 'EAU/ESPU', title: 'Paediatric Urology Guidelines', url: 'https://uroweb.org/guidelines' },
    { body: 'Минздрав РФ', title: 'Рубрикатор клинических рекомендаций', url: 'https://cr.minzdrav.gov.ru/' },
  ],
};

function getSourceDomain(disease) {
  if (disease.section === 'pediatric') return 'pediatric';
  if (disease.section === 'andrology') return 'andrology';
  return 'urology';
}

function buildSourcePack(disease) {
  return {
    status: 'editorial-review-required',
    reviewDate: '2026-05-01',
    note: 'Минимальный source pack фиксирует официальные порталы. Перед добавлением дозировок, порогов и интервальных рекомендаций требуется профильная клиническая сверка.',
    sources: sourcePackByDomain[getSourceDomain(disease)] || sourcePackByDomain.urology,
  };
}

export function applyClinicalContentEnrichment(disease) {
  const enriched = { ...disease };

  if (clinicalMinimumIds.has(enriched.id)) {
    if (!Array.isArray(enriched.redFlags) || enriched.redFlags.length === 0) {
      enriched.redFlags = buildRedFlagsFallback(enriched).items;
    }

    if (!enriched.followUp) {
      enriched.followUp = buildFollowUpFallback(enriched);
    }

    enriched.clinicalMinimum = {
      ...(enriched.clinicalMinimum || {}),
      requiredTabs: true,
      reviewStatus: 'needs guideline editorial review',
    };
  }

  if (sourcePackMinimumIds.has(enriched.id) && !enriched.sourcePack) {
    enriched.sourcePack = buildSourcePack(enriched);
  }

  return enriched;
}
