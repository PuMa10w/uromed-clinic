const fs = require('fs');
const path = require('path');

const mappings = {
  urolithiasisData: ['pyelonephritis', 'hydronephrosis', 'renal-colic', 'acute-kidney-injury'],
  cystitisData: ['pyelonephritis', 'urethritis', 'interstitial-cystitis', 'bladder-pain-syndrome'],
  prostatitisData: ['chronic-prostatitis-cpps', 'prostate-abscess', 'erectile-dysfunction', 'orchitis'],
  pyelonephritisData: ['cystitis', 'xanthogranulomatous-pyelonephritis', 'emphysematous-pyelonephritis', 'renal-abscess'],
  epididymitisData: ['orchitis', 'testicular-torsion', 'urethritis', 'funiculitis'],
  urethritisData: ['cystitis', 'epididymitis', 'prostatitis', 'orchitis'],
  orchitisData: ['epididymitis', 'testicular-torsion', 'funiculitis', 'mumps'],
  prostateAbscessData: ['prostatitis', 'fournier-gangrene', 'acute-kidney-injury', 'urosepsis'],
  fournierGangreneData: ['prostate-abscess', 'emphysematous-pyelonephritis', 'diabetic-nephropathy', 'testicular-torsion'],
  xanthogranulomatousPyelonephritisData: ['pyelonephritis', 'renal-abscess', 'kidney-cancer', 'papillary-necrosis'],
  prostateCancerData: ['bph', 'erectile-dysfunction', 'post-prostatectomy-incontinence', 'prostatic-intraepithelial-neoplasia'],
  bladderCancerData: ['hematuria', 'urogenital-fistula', 'bladder-pain-syndrome', 'upper-tract-uc'],
  kidneyCancerData: ['renal-cysts', 'hydronephrosis', 'renal-infarction', 'renal-trauma'],
  testicularCancerData: ['cryptorchidism', 'varicocele', 'testicular-torsion', 'orchitis'],
  penileCancerData: ['phimosis', 'penile-lichen-sclerosus', 'penile-trauma', 'balanoposthitis'],
  upperTractUCData: ['bladder-cancer', 'kidney-cancer', 'urolithiasis', 'ureteral-trauma'],
  bphData: ['urinary-retention', 'stress-incontinence', 'post-prostatectomy-incontinence', 'bladder-neck-obstruction'],
  overactiveBladderData: ['stress-incontinence', 'neurogenic-bladder', 'urinary-retention', 'interstitial-cystitis'],
  stressIncontinenceData: ['overactive-bladder', 'post-prostatectomy-incontinence', 'stress-incontinence-male', 'neurogenic-bladder'],
  neurogenicBladderData: ['overactive-bladder', 'urinary-retention', 'neurogenic-bladder-child', 'spinal-cord-injury'],
  urinaryRetentionData: ['bph', 'urethral-stricture', 'neurogenic-bladder', 'bladder-outlet-obstruction'],
  interstitialCystitisData: ['bladder-pain-syndrome', 'cystitis', 'overactive-bladder', 'malakoplakia'],
  seminalVesicleData: ['prostatitis', 'erectile-dysfunction', 'male-infertility', 'hematospermia'],
  prostaticCystData: ['bph', 'prostatitis', 'seminal-vesicle-disease', 'mullerian-duct-cyst'],
  postProstatectomyIncontinenceData: ['bph', 'prostate-cancer', 'stress-incontinence', 'stress-incontinence-male'],
  urethralStrictureData: ['urinary-retention', 'urethral-diverticulum', 'urethral-caruncle', 'urethral-trauma'],
  vesicoureteralRefluxData: ['pyelonephritis', 'hydronephrosis', 'neurogenic-bladder-child', 'renal-cysts'],
  hydronephrosisData: ['urolithiasis', 'vesicoureteral-reflux', 'ureteral-stricture-benign', 'bladder-outlet-obstruction'],
  leukoplakiaData: ['bladder-cancer', 'interstitial-cystitis', 'urethritis', 'bladder-pain-syndrome'],
  retroperitonealFibrosisData: ['hydronephrosis', 'acute-kidney-injury', 'ureteral-stricture-benign', 'renal-infarction'],
  hematuriaData: ['bladder-cancer', 'kidney-cancer', 'urolithiasis', 'glomerulonephritis'],
  urogenitalFistulaData: ['bladder-cancer', 'vesicovaginal-fistula', 'retroperitoneal-fibrosis', 'post-prostatectomy-incontinence'],
  urethralDiverticulumData: ['urethral-stricture', 'urethritis', 'cystitis', 'urethral-caruncle'],
  paraphimosisData: ['phimosis', 'balanoposthitis', 'penile-lichen-sclerosus', 'penile-trauma'],
  meatalStenosisData: ['urethral-stricture', 'hypospadias', 'urinary-retention', 'urethral-caruncle'],
  testicularTorsionData: ['orchitis', 'epididymitis', 'varicocele', 'testicular-cancer'],
  glomerulonephritisData: ['ckd', 'nephrotic-syndrome', 'iga-nephropathy', 'diabetic-nephropathy'],
  ckdData: ['glomerulonephritis', 'diabetic-nephropathy', 'hypertensive-nephropathy', 'polycystic-kidney'],
  nephroptosisData: ['renal-trauma', 'renal-artery-stenosis', 'renal-colic', 'renal-cysts'],
  renalCystsData: ['polycystic-kidney', 'kidney-cancer', 'renal-abscess', 'hydronephrosis'],
  renalAbscessData: ['pyelonephritis', 'xanthogranulomatous-pyelonephritis', 'renal-infarction', 'acute-kidney-injury'],
  acuteKidneyInjuryData: ['urolithiasis', 'renal-infarction', 'diabetic-nephropathy', 'renal-trauma'],
  nephroticSyndromeData: ['glomerulonephritis', 'membranous-nephropathy', 'diabetic-nephropathy', 'iga-nephropathy'],
  polycysticKidneyData: ['renal-cysts', 'ckd', 'renal-artery-stenosis', 'glomerulonephritis'],
  renalArteryStenosisData: ['ckd', 'renal-infarction', 'hypertensive-nephropathy', 'acute-kidney-injury'],
  renalInfarctionData: ['renal-artery-stenosis', 'renal-vein-thrombosis', 'renal-trauma', 'acute-kidney-injury'],
  papillaryNecrosisData: ['pyelonephritis', 'urolithiasis', 'diabetic-nephropathy', 'analgesic-nephropathy'],
  renalVeinThrombosisData: ['nephrotic-syndrome', 'renal-infarction', 'kidney-cancer', 'renal-trauma'],
  interstitialNephritisData: ['acute-kidney-injury', 'ckd', 'analgesic-nephropathy', 'pyelonephritis'],
  membranousNephropathyData: ['nephrotic-syndrome', 'glomerulonephritis', 'diabetic-nephropathy', 'iga-nephropathy'],
  igaNephropathyData: ['glomerulonephritis', 'nephrotic-syndrome', 'ckd', 'hematuria'],
  diabeticNephropathyData: ['ckd', 'nephrotic-syndrome', 'glomerulonephritis', 'polycystic-kidney'],
  analgesicNephropathyData: ['ckd', 'interstitial-nephritis', 'papillary-necrosis', 'acute-kidney-injury'],
  renalTraumaData: ['kidney-cancer', 'renal-infarction', 'ureteral-trauma', 'renal-colic'],
  ureteralTraumaData: ['ureteral-stricture-benign', 'hydronephrosis', 'renal-trauma', 'renal-colic'],
  erectileDysfunctionData: ['premature-ejaculation', 'peyronie', 'hypogonadism', 'cavernous-fibrosis'],
  prematureEjaculationData: ['erectile-dysfunction', 'chronic-prostatitis-cpps', 'spermatorrhea', 'aspermatism'],
  peyronieData: ['erectile-dysfunction', 'cavernous-fibrosis', 'penile-trauma', 'diabetic-nephropathy'],
  priapismData: ['erectile-dysfunction', 'cavernous-fibrosis', 'penile-trauma', 'leukemia'],
  cavernousFibrosisData: ['priapism', 'erectile-dysfunction', 'peyronie', 'post-prostatectomy-incontinence'],
  chronicProstatitisCPPSData: ['prostatitis', 'premature-ejaculation', 'erectile-dysfunction', 'orchialgia'],
  orchialgiaData: ['orchitis', 'epididymitis', 'testicular-torsion', 'varicocele'],
  funiculitisData: ['epididymitis', 'orchitis', 'varicocele', 'spermatocele'],
  spermatorrheaData: ['premature-ejaculation', 'aspermatism', 'oligospermia', 'prostatitis'],
  aspermatismData: ['spermatorrhea', 'male-infertility', 'oligospermia', 'retrograde-ejaculation'],
  penileTraumaData: ['priapism', 'penile-lichen-sclerosus', 'cavernous-fibrosis', 'erectile-dysfunction'],
  penileLichenSclerosusData: ['phimosis', 'paraphimosis', 'penile-cancer', 'urethral-stricture'],
  maleInfertilityData: ['varicocele', 'cryptorchidism', 'oligospermia', 'hypogonadism'],
  varicoceleData: ['male-infertility', 'testicular-torsion', 'orchialgia', 'oligospermia'],
  cryptorchidismData: ['testicular-cancer', 'male-infertility', 'orchialgia', 'hypospadias'],
  hypogonadismData: ['erectile-dysfunction', 'male-infertility', 'male-climacterium', 'osteoporosis'],
  oligospermiaData: ['male-infertility', 'varicocele', 'cryptorchidism', 'hypogonadism'],
  maleClimacteriumData: ['hypogonadism', 'erectile-dysfunction', 'premature-ejaculation', 'depression'],
  enuresisData: ['neurogenic-bladder-child', 'overactive-bladder', 'diabetes-insipidus', 'adhd'],
  phimosisData: ['paraphimosis', 'balanoposthitis', 'penile-lichen-sclerosus', 'penile-cancer'],
  hydroceleData: ['spermatocele', 'testicular-torsion', 'epididymitis', 'hernia'],
  hypospadiasData: ['cryptorchidism', 'urethral-stricture', 'meatal-stenosis', 'phimosis'],
  spermatoceleData: ['hydrocele', 'varicocele', 'epididymitis', 'funiculitis'],
  balanoposthitisData: ['phimosis', 'paraphimosis', 'diabetic-nephropathy', 'penile-lichen-sclerosus'],
  emphysematousPyelonephritisData: ['pyelonephritis', 'diabetic-nephropathy', 'fournier-gangrene', 'acute-kidney-injury'],
  renalTuberculosisData: ['pyelonephritis', 'tuberculosis', 'renal-abscess', 'chronic-kidney-disease'],
  actinomycosisGUData: ['pyelonephritis', 'prostatitis', 'epididymitis', 'fournier-gangrene'],
  prostaticIntraepithelialNeoplasiaData: ['prostate-cancer', 'bph', 'prostatitis', 'psa-elevation'],
  bladderNeckObstructionData: ['bph', 'urinary-retention', 'urethral-stricture', 'neurogenic-bladder'],
  bladderOutletObstructionData: ['bph', 'urinary-retention', 'urethral-stricture', 'bladder-neck-obstruction'],
  stressIncontinenceMaleData: ['post-prostatectomy-incontinence', 'stress-incontinence', 'bph', 'urethral-stricture'],
  neurogenicBladderChildData: ['neurogenic-bladder', 'enuresis', 'vesicoureteral-reflux', 'spinal-dysraphism'],
  ureteralStrictureBenignData: ['urethral-stricture', 'hydronephrosis', 'ureteral-trauma', 'urolithiasis'],
  vesicovaginalFistulaData: ['urogenital-fistula', 'post-prostatectomy-incontinence', 'cervical-cancer', 'obstetric-trauma'],
  urethralCaruncleData: ['urethral-diverticulum', 'urethritis', 'meatal-stenosis', 'hematuria'],
  renalColicData: ['urolithiasis', 'hydronephrosis', 'pyelonephritis', 'acute-kidney-injury'],
  bladderPainSyndromeData: ['interstitial-cystitis', 'cystitis', 'overactive-bladder', 'malakoplakia'],
  malakoplakiaData: ['cystitis', 'pyelonephritis', 'bladder-pain-syndrome', 'immunodeficiency'],
};

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('Data.js'));

let updated = 0;
files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('relatedIds:')) return;

  const relatedIds = mappings[file] || [];
  if (relatedIds.length === 0) return;

  content = content.replace(
    /(tags:\s*\[[\s\S]*?\],)/,
    `$1\n  relatedIds: ${JSON.stringify(relatedIds)},`
  );

  fs.writeFileSync(filePath, content);
  updated++;
  console.log(`Updated: ${file} -> relatedIds: ${relatedIds.length} items`);
});

console.log(`\nDone! Updated ${updated} files.`);
