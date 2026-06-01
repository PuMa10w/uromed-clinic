const fs = require('fs');
const path = require('path');

const mappings = {
  urolithiasisData: ['pyelonephritis', 'hydronephrosis', 'renal-colic', 'acute-kidney-injury'],
  cystitisData: ['pyelonephritis', 'urethritis', 'interstitial-cystitis', 'bladder-pain-syndrome'],
  prostatitisData: ['chronic-prostatitis-cpps', 'prostate-abscess', 'erectile-dysfunction'],
  pyelonephritisData: ['cystitis', 'xanthogranulomatous-pyelonephritis', 'emphysematous-pyelonephritis'],
  epididymitisData: ['orchitis', 'testicular-torsion', 'urethritis'],
  urethritisData: ['cystitis', 'epididymitis', 'prostatitis'],
  orchitisData: ['epididymitis', 'testicular-torsion', 'funiculitis'],
  prostateAbscessData: ['prostatitis', 'fournier-gangrene', 'acute-kidney-injury'],
  fournierGangreneData: ['prostate-abscess', 'emphysematous-pyelonephritis', 'diabetic-nephropathy'],
  xanthogranulomatousPyelonephritisData: ['pyelonephritis', 'renal-abscess', 'kidney-cancer'],
  prostateCancerData: ['bph', 'erectile-dysfunction', 'post-prostatectomy-incontinence'],
  bladderCancerData: ['hematuria', 'urogenital-fistula', 'bladder-pain-syndrome'],
  kidneyCancerData: ['renal-cysts', 'hydronephrosis', 'renal-infarction'],
  testicularCancerData: ['cryptorchidism', 'varicocele', 'testicular-torsion'],
  penileCancerData: ['phimosis', 'penile-lichen-sclerosus', 'penile-trauma'],
  upperTractUCData: ['bladder-cancer', 'kidney-cancer', 'urolithiasis'],
  bphData: ['urinary-retention', 'stress-incontinence', 'post-prostatectomy-incontinence'],
  overactiveBladderData: ['stress-incontinence', 'neurogenic-bladder', 'urinary-retention'],
  stressIncontinenceData: ['overactive-bladder', 'post-prostatectomy-incontinence', 'neurogenic-bladder'],
  neurogenicBladderData: ['overactive-bladder', 'urinary-retention', 'neurogenic-bladder-child'],
  urinaryRetentionData: ['bph', 'urethral-stricture', 'neurogenic-bladder'],
  interstitialCystitisData: ['bladder-pain-syndrome', 'cystitis', 'overactive-bladder'],
  balanoposthitisData: ['phimosis', 'paraphimosis', 'diabetic-nephropathy'],
  ckdData: ['glomerulonephritis', 'diabetic-nephropathy', 'polycystic-kidney'],
  nephroptosisData: ['renal-trauma', 'renal-artery-stenosis', 'renal-colic'],
  renalCystsData: ['polycystic-kidney', 'kidney-cancer', 'renal-abscess'],
  renalAbscessData: ['pyelonephritis', 'xanthogranulomatous-pyelonephritis', 'renal-infarction'],
  acuteKidneyInjuryData: ['urolithiasis', 'renal-infarction', 'diabetic-nephropathy'],
  nephroticSyndromeData: ['glomerulonephritis', 'membranous-nephropathy', 'diabetic-nephropathy'],
  polycysticKidneyData: ['renal-cysts', 'ckd', 'renal-artery-stenosis'],
  renalArteryStenosisData: ['ckd', 'renal-infarction', 'acute-kidney-injury'],
  renalInfarctionData: ['renal-artery-stenosis', 'renal-vein-thrombosis', 'renal-trauma'],
  papillaryNecrosisData: ['pyelonephritis', 'urolithiasis', 'diabetic-nephropathy'],
  renalVeinThrombosisData: ['nephrotic-syndrome', 'renal-infarction', 'kidney-cancer'],
  interstitialNephritisData: ['acute-kidney-injury', 'ckd', 'analgesic-nephropathy'],
  membranousNephropathyData: ['nephrotic-syndrome', 'glomerulonephritis', 'diabetic-nephropathy'],
  igaNephropathyData: ['glomerulonephritis', 'nephrotic-syndrome', 'ckd'],
  diabeticNephropathyData: ['ckd', 'nephrotic-syndrome', 'glomerulonephritis'],
  analgesicNephropathyData: ['ckd', 'interstitial-nephritis', 'papillary-necrosis'],
  renalTraumaData: ['kidney-cancer', 'renal-infarction', 'ureteral-trauma'],
  ureteralTraumaData: ['ureteral-stricture-benign', 'hydronephrosis', 'renal-trauma'],
  erectileDysfunctionData: ['premature-ejaculation', 'peyronie', 'hypogonadism'],
  prematureEjaculationData: ['erectile-dysfunction', 'chronic-prostatitis-cpps', 'spermatorrhea'],
  peyronieData: ['erectile-dysfunction', 'cavernous-fibrosis', 'penile-trauma'],
  priapismData: ['erectile-dysfunction', 'cavernous-fibrosis', 'penile-trauma'],
  cavernousFibrosisData: ['priapism', 'erectile-dysfunction', 'peyronie'],
  chronicProstatitisCPPSData: ['prostatitis', 'premature-ejaculation', 'erectile-dysfunction'],
  orchialgiaData: ['orchitis', 'epididymitis', 'testicular-torsion'],
  funiculitisData: ['epididymitis', 'orchitis', 'varicocele'],
  spermatorrheaData: ['premature-ejaculation', 'aspermatism', 'oligospermia'],
  aspermatismData: ['spermatorrhea', 'male-infertility', 'oligospermia'],
  penileTraumaData: ['priapism', 'penile-lichen-sclerosus', 'cavernous-fibrosis'],
  penileLichenSclerosusData: ['phimosis', 'paraphimosis', 'penile-cancer'],
  maleInfertilityData: ['varicocele', 'cryptorchidism', 'oligospermia'],
  varicoceleData: ['male-infertility', 'testicular-torsion', 'orchialgia'],
  cryptorchidismData: ['testicular-cancer', 'male-infertility', 'hypospadias'],
  hypogonadismData: ['erectile-dysfunction', 'male-infertility', 'male-climacterium'],
  oligospermiaData: ['male-infertility', 'varicocele', 'cryptorchidism'],
  maleClimacteriumData: ['hypogonadism', 'erectile-dysfunction', 'premature-ejaculation'],
  enuresisData: ['neurogenic-bladder-child', 'overactive-bladder'],
  phimosisData: ['paraphimosis', 'balanoposthitis', 'penile-lichen-sclerosus'],
  hydroceleData: ['spermatocele', 'testicular-torsion', 'epididymitis'],
  hypospadiasData: ['cryptorchidism', 'urethral-stricture', 'meatal-stenosis'],
  spermatoceleData: ['hydrocele', 'varicocele', 'epididymitis'],
  emphysematousPyelonephritisData: ['pyelonephritis', 'diabetic-nephropathy', 'fournier-gangrene'],
  renalTuberculosisData: ['pyelonephritis', 'renal-abscess'],
  actinomycosisGUData: ['pyelonephritis', 'prostatitis', 'fournier-gangrene'],
  prostaticIntraepithelialNeoplasiaData: ['prostate-cancer', 'bph', 'prostatitis'],
  bladderNeckObstructionData: ['bph', 'urinary-retention', 'urethral-stricture'],
  bladderOutletObstructionData: ['bph', 'urinary-retention', 'urethral-stricture'],
  stressIncontinenceMaleData: ['post-prostatectomy-incontinence', 'stress-incontinence', 'bph'],
  neurogenicBladderChildData: ['neurogenic-bladder', 'enuresis', 'vesicoureteral-reflux'],
  ureteralStrictureBenignData: ['urethral-stricture', 'hydronephrosis', 'ureteral-trauma'],
  vesicovaginalFistulaData: ['urogenital-fistula', 'post-prostatectomy-incontinence'],
  urethralCaruncleData: ['urethral-diverticulum', 'urethritis', 'meatal-stenosis'],
  renalColicData: ['urolithiasis', 'hydronephrosis', 'pyelonephritis'],
};

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('Data.js') && !f.includes('add'));

let updated = 0;
let skipped = 0;

files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  const baseName = file.replace('.js', '');
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('relatedIds:')) {
    skipped++;
    return;
  }

  const relatedIds = mappings[baseName] || [];
  if (relatedIds.length === 0) return;

  content = content.replace(
    'tags: ["EAU 2025", "AUA 2025", "РКР 2024", "UA 2025"],',
    `tags: ["EAU 2025", "AUA 2025", "РКР 2024", "UA 2025"],\n  relatedIds: ${JSON.stringify(relatedIds)},`
  );

  fs.writeFileSync(filePath, content);
  updated++;
});

console.log(`Done! Updated ${updated} files, skipped ${skipped} (already have relatedIds).`);
