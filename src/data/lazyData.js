import { allDiseases } from './index';
import { enrichDiseaseGuidelines } from './guidelineEnrichment';
import { applyClinicalContentEnrichment } from './clinicalContentEnrichment';

const loadedModules = new Map();
const loadPromises = new Map();

const lazyLoadMap = new Map(Object.entries({
  'actinomycosis-gu': () => import('./actinomycosisGUData.js'),
  'acute-bacterial-prostatitis': () => import('./acuteBacterialProstatitisData.js'),
  'acute-cystitis': () => import('./acuteCystitisData.js'),
  'acute-kidney-injury': () => import('./acuteKidneyInjuryData.js'),
  'adrenal-cancer': () => import('./adrenalCancerData.js'),
  'adrenal-incidentaloma': () => import('./adrenalIncidentalomaData.js'),
  'analgesic-nephropathy': () => import('./analgesicNephropathyData.js'),
  'androgen-resistance-syndrome': () => import('./androgenResistanceSyndromeData.js'),
  anejaculation: () => import('./anejaculationData.js'),
  'asymptomatic-bacteriuria': () => import('./asymptomaticBacteriuriaData.js'),
  aspermatism: () => import('./aspermatismData.js'),
  asthenozoospermia: () => import('./asthenozoospermiaData.js'),
  azoospermia: () => import('./azoospermiaData.js'),
  balanoposthitis: () => import('./balanoposthitisData.js'),
  'benign-bladder-neoplasm': () => import('./benignBladderNeoplasmData.js'),
  'bladder-cancer': () => import('./bladderCancerData.js'),
  'bladder-carcinoma-in-situ': () => import('./bladderCarcinomaInSituData.js'),
  'bladder-diverticulum': () => import('./bladderDiverticulumData.js'),
  'bladder-endometriosis': () => import('./bladderEndometriosisData.js'),
  'bladder-exstrophy': () => import('./bladderExstrophyData.js'),
  'bladder-neck-obstruction': () => import('./bladderNeckObstructionData.js'),
  'bladder-outlet-obstruction': () => import('./bladderOutletObstructionData.js'),
  'bladder-pain-syndrome': () => import('./bladderPainSyndromeData.js'),
  'bladder-rupture': () => import('./bladderRuptureData.js'),
  'catheter-complication': () => import('./catheterComplicationData.js'),
  'bladder-stones': () => import('./bladderStonesData.js'),
  bph: () => import('./bphData.js'),
  'candida-balanitis': () => import('./candidaBalanitisData.js'),
  'cavernous-fibrosis': () => import('./cavernousFibrosisData.js'),
  'chronic-bacterial-prostatitis': () => import('./chronicBacterialProstatitisData.js'),
  'chronic-cystitis': () => import('./chronicCystitisData.js'),
  'chronic-pyelonephritis': () => import('./chronicPyelonephritisData.js'),
  'chronic-prostatitis-cpps': () => import('./chronicProstatitisCPPSData.js'),
  chyluria: () => import('./chyluriaData.js'),
  ckd: () => import('./ckdData.js'),
  'condyloma-acuminata': () => import('./condylomaAcuminataData.js'),
  cowperitis: () => import('./cowperitisData.js'),
  cryptorchidism: () => import('./cryptorchidismData.js'),
  cystinuria: () => import('./cystinuriaData.js'),
  cystitis: () => import('./cystitisData.js'),
  'delayed-ejaculation': () => import('./delayedEjaculationData.js'),
  'device-associated-uti': () => import('./deviceAssociatedUtiData.js'),
  'diabetic-nephropathy': () => import('./diabeticNephropathyData.js'),
  'ejaculatory-duct-obstruction': () => import('./ejaculatoryDuctObstructionData.js'),
  'elevated-psa': () => import('./elevatedPsaData.js'),
  'emphysematous-pyelonephritis': () => import('./emphysematousPyelonephritisData.js'),
  'enterovesical-fistula': () => import('./enterovesicalFistulaData.js'),
  enuresis: () => import('./enuresisData.js'),
  epididymitis: () => import('./epididymitisData.js'),
  'epididymo-orchitis': () => import('./epididymoOrchitisData.js'),
  'erectile-dysfunction': () => import('./erectileDysfunctionData.js'),
  'fertility-preservation-male': () => import('./fertilityPreservationMaleData.js'),
  'fournier-gangrene': () => import('./fournierGangreneData.js'),
  funiculitis: () => import('./funiculitisData.js'),
  'genital-herpes': () => import('./genitalHerpesData.js'),
  'genital-mycoplasma': () => import('./genitalMycoplasmaData.js'),
  glomerulonephritis: () => import('./glomerulonephritisData.js'),
  hematospermia: () => import('./hematospermiaData.js'),
  hematuria: () => import('./hematuriaData.js'),
  hydrocele: () => import('./hydroceleData.js'),
  hydronephrosis: () => import('./hydronephrosisData.js'),
  hypercalciuria: () => import('./hypercalciuriaData.js'),
  hyperoxaluria: () => import('./hyperoxaluriaData.js'),
  'hyperprolactinemia-male': () => import('./hyperprolactinemiaMaleData.js'),
  'hyperthyroidism-ed': () => import('./hyperthyroidismEdData.js'),
  hyperuricosuria: () => import('./hyperuricosuriaData.js'),
  hypogonadism: () => import('./hypogonadismData.js'),
  hypospadias: () => import('./hypospadiasData.js'),
  'iga-nephropathy': () => import('./igaNephropathyData.js'),
  'interstitial-cystitis': () => import('./interstitialCystitisData.js'),
  'interstitial-nephritis': () => import('./interstitialNephritisData.js'),
  'kallmann-syndrome': () => import('./kallmannSyndromeData.js'),
  'kidney-cancer': () => import('./kidneyCancerData.js'),
  'kidney-stone': () => import('./kidneyStoneData.js'),
  'kidney-ureter-stones': () => import('./kidneyUreterStonesData.js'),
  'klein-felter': () => import('./kleinFelterData.js'),
  leukocytospermia: () => import('./leukocytospermiaData.js'),
  leukoplakia: () => import('./leukoplakiaData.js'),
  malakoplakia: () => import('./malakoplakiaData.js'),
  'male-climacterium': () => import('./maleClimacteriumData.js'),
  'male-contraception': () => import('./maleContraceptionData.js'),
  'male-genital-lichen-planus': () => import('./maleGenitalLichenPlanusData.js'),
  'male-infertility': () => import('./maleInfertilityData.js'),
  'male-osteoporosis-hypogonadism': () => import('./maleOsteoporosisHypogonadismData.js'),
  'male-pelvic-floor-dysfunction': () => import('./malePelvicFloorDysfunctionData.js'),
  'meatal-stenosis': () => import('./meatalStenosisData.js'),
  'membranous-nephropathy': () => import('./membranousNephropathyData.js'),
  'metabolic-syndrome-ed': () => import('./metabolicSyndromeEdData.js'),
  nephroptosis: () => import('./nephroptosisData.js'),
  'nephrotic-syndrome': () => import('./nephroticSyndromeData.js'),
  'neuroendocrine-bladder': () => import('./neuroendocrineBladderData.js'),
  'neurogenic-bladder-child': () => import('./neurogenicBladderChildData.js'),
  'neurogenic-bladder': () => import('./neurogenicBladderData.js'),
  nocturia: () => import('./nocturiaData.js'),
  oligospermia: () => import('./oligospermiaData.js'),
  orchialgia: () => import('./orchialgiaData.js'),
  orchitis: () => import('./orchitisData.js'),
  'overactive-bladder': () => import('./overactiveBladderData.js'),
  'papillary-necrosis': () => import('./papillaryNecrosisData.js'),
  'papillary-rcc': () => import('./papillaryRccData.js'),
  'paraganglioma-bladder': () => import('./paragangliomaBladderData.js'),
  paraphimosis: () => import('./paraphimosisData.js'),
  'pelvic-fracture-urethral-injury': () => import('./pelvicFractureUrethralInjuryData.js'),
  'penile-cancer': () => import('./penileCancerData.js'),
  'penile-fracture': () => import('./penileFractureData.js'),
  'penile-lichen-sclerosus': () => import('./penileLichenSclerosusData.js'),
  'penile-mondor-disease': () => import('./penileMondorDiseaseData.js'),
  'penile-trauma': () => import('./penileTraumaData.js'),
  peyronie: () => import('./peyronieData.js'),
  phimosis: () => import('./phimosisData.js'),
  pollakiuria: () => import('./pollakiuriaData.js'),
  'polycystic-kidney': () => import('./polycysticKidneyData.js'),
  'post-prostatectomy-incontinence': () => import('./postProstatectomyIncontinenceData.js'),
  'postprocedural-urethral-stricture': () => import('./postproceduralUrethralStrictureData.js'),
  'posterior-urethral-valves': () => import('./posteriorUrethralValvesData.js'),
  'post-vasectomy-pain': () => import('./postVasectomyPainData.js'),
  'premature-ejaculation': () => import('./prematureEjaculationData.js'),
  'psychogenic-ed': () => import('./psychogenicEdData.js'),
  'psychogenic-premature-ejaculation': () => import('./psychogenicPrematureEjaculationData.js'),
  priapism: () => import('./priapismData.js'),
  'prostatic-calculi': () => import('./prostaticCalculiData.js'),
  'prostate-abscess': () => import('./prostateAbscessData.js'),
  'prostate-cancer': () => import('./prostateCancerData.js'),
  'prostatic-cyst': () => import('./prostaticCystData.js'),
  'prostatic-intraepithelial-neoplasia': () => import('./prostaticIntraepithelialNeoplasiaData.js'),
  prostatitis: () => import('./prostatitisData.js'),
  prostatovesiculitis: () => import('./prostatovesiculitisData.js'),
  pyelonephritis: () => import('./pyelonephritisData.js'),
  'recurrent-uti': () => import('./recurrentUtiData.js'),
  'radiation-cystitis': () => import('./radiationCystitisData.js'),
  'renal-abscess': () => import('./renalAbscessData.js'),
  'renal-angiomyolipoma': () => import('./renalAngiomyolipomaData.js'),
  'renal-artery-stenosis': () => import('./renalArteryStenosisData.js'),
  'renal-colic': () => import('./renalColicData.js'),
  'renal-cysts': () => import('./renalCystsData.js'),
  'renal-infarction': () => import('./renalInfarctionData.js'),
  'renal-trauma': () => import('./renalTraumaData.js'),
  'renal-tuberculosis': () => import('./renalTuberculosisData.js'),
  'renal-vein-thrombosis': () => import('./renalVeinThrombosisData.js'),
  'retrograde-ejaculation': () => import('./retrogradeEjaculationData.js'),
  'retroperitoneal-fibrosis': () => import('./retroperitonealFibrosisData.js'),
  'sarcoma-prostate': () => import('./sarcomaProstateData.js'),
  'schistosomiasis-gu': () => import('./schistosomiasisGuData.js'),
  'scrotal-trauma': () => import('./scrotalTraumaData.js'),
  'seminal-vesicle-disease': () => import('./seminalVesicleData.js'),
  spermatocele: () => import('./spermatoceleData.js'),
  spermatorrhea: () => import('./spermatorrheaData.js'),
  'stent-symptoms': () => import('./stentSymptomsData.js'),
  'stress-incontinence': () => import('./stressIncontinenceData.js'),
  'stress-incontinence-male': () => import('./stressIncontinenceMaleData.js'),
  'subclinical-hypogonadism': () => import('./subclinicalHypogonadismData.js'),
  'testicular-atrophy': () => import('./testicularAtrophyData.js'),
  teratozoospermia: () => import('./teratozoospermiaData.js'),
  'testicular-cancer': () => import('./testicularCancerData.js'),
  'testicular-torsion': () => import('./testicularTorsionData.js'),
  'trichomoniasis-gu': () => import('./trichomoniasisGuData.js'),
  'upj-obstruction': () => import('./upjObstructionData.js'),
  'upper-tract-uc': () => import('./upperTractUCData.js'),
  'underactive-bladder': () => import('./underactiveBladderData.js'),
  'urethral-cancer': () => import('./urethralCancerData.js'),
  'ureteral-stricture-benign': () => import('./ureteralStrictureBenignData.js'),
  'ureteral-stone': () => import('./ureteralStoneData.js'),
  'ureteral-trauma': () => import('./ureteralTraumaData.js'),
  'urethral-caruncle': () => import('./urethralCaruncleData.js'),
  'urethral-diverticulum': () => import('./urethralDiverticulumData.js'),
  'urethral-hypersensitivity': () => import('./urethralHypersensitivityData.js'),
  'urethral-prolapse': () => import('./urethralProlapseData.js'),
  'urethral-stones': () => import('./urethralStonesData.js'),
  'urethral-stricture': () => import('./urethralStrictureData.js'),
  'urethral-trauma': () => import('./urethralTraumaData.js'),
  'urethral-syndrome': () => import('./urethralSyndromeData.js'),
  urethritis: () => import('./urethritisData.js'),
  'urinary-retention': () => import('./urinaryRetentionData.js'),
  'urogenital-fistula': () => import('./urogenitalFistulaData.js'),
  urolithiasis: () => import('./urolithiasisData.js'),
  'urge-incontinence': () => import('./urgeIncontinenceData.js'),
  'uti-unspecified': () => import('./utiUnspecifiedData.js'),
  urosepsis: () => import('./urosepsisData.js'),
  varicocele: () => import('./varicoceleData.js'),
  'varicocele-recurrence': () => import('./varicoceleRecurrenceData.js'),
  'vesicocutaneous-fistula': () => import('./vesicocutaneousFistulaData.js'),
  'vesicoureteral-reflux': () => import('./vesicoureteralRefluxData.js'),
  'vesicovaginal-fistula': () => import('./vesicovaginalFistulaData.js'),
  'wilms-tumor': () => import('./wilmsTumorData.js'),
  'xanthogranulomatous-pyelonephritis': () => import('./xanthogranulomatousPyelonephritisData.js'),
}));

export function preloadDiseaseData(diseaseId) {
  if (loadedModules.has(diseaseId)) {
    return Promise.resolve(loadedModules.get(diseaseId));
  }

  if (loadPromises.has(diseaseId)) {
    return loadPromises.get(diseaseId);
  }

  const loader = lazyLoadMap.get(diseaseId);
  if (!loader) {
    return Promise.resolve(null);
  }

  const promise = loader()
    .then((module) => {
      const diseaseMeta = allDiseases.find((item) => item.id === diseaseId) || {};
      const data = enrichDiseaseGuidelines(applyClinicalContentEnrichment({
        ...diseaseMeta,
        ...module.default,
        id: diseaseId,
      }));
      loadedModules.set(diseaseId, data);
      loadPromises.delete(diseaseId);
      return data;
    })
    .catch(() => {
      loadPromises.delete(diseaseId);
      return null;
    });

  loadPromises.set(diseaseId, promise);
  return promise;
}

export function preloadSectionDiseases(section, subsection) {
  const diseases = allDiseases.filter(
    (d) => d.section === section && (!subsection || d.subsection === subsection)
  );

  return Promise.all(diseases.map((d) => preloadDiseaseData(d.id)));
}

export function preloadDiseaseBatch(diseaseIds) {
  if (!Array.isArray(diseaseIds) || diseaseIds.length === 0) {
    return Promise.resolve([]);
  }

  const uniqueIds = [...new Set(diseaseIds.filter(Boolean))];
  return Promise.all(uniqueIds.map((diseaseId) => preloadDiseaseData(diseaseId)));
}

export function isDiseaseLoaded(diseaseId) {
  return loadedModules.has(diseaseId);
}

export function clearLoadedData() {
  loadedModules.clear();
  loadPromises.clear();
}

export function getLoadedCount() {
  return loadedModules.size;
}
