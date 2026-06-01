// ===== ALL DISEASES (для поиска и избранного) =====
import cystitisData from './data/cystitisData';
import prostatitisData from './data/prostatitisData';
import epididymitisData from './data/epididymitisData';
import pyelonephritisData from './data/pyelonephritisData';
import urethritisData from './data/urethritisData';
import interstitialCystitisData from './data/interstitialCystitisData';
import urolithiasisData from './data/urolithiasisData';
import bphData from './data/bphData';
import prostateCancerData from './data/prostateCancerData';
import bladderCancerData from './data/bladderCancerData';
import kidneyCancerData from './data/kidneyCancerData';
import testicularCancerData from './data/testicularCancerData';
import penileCancerData from './data/penileCancerData';
import upperTractUCData from './data/upperTractUCData';
import overactiveBladderData from './data/overactiveBladderData';
import stressIncontinenceData from './data/stressIncontinenceData';
import neurogenicBladderData from './data/neurogenicBladderData';
import urethralStrictureData from './data/urethralStrictureData';
import leukoplakiaData from './data/leukoplakiaData';
import urinaryRetentionData from './data/urinaryRetentionData';
import hematuriaData from './data/hematuriaData';
import vesicoureteralRefluxData from './data/vesicoureteralRefluxData';
import hydronephrosisData from './data/hydronephrosisData';
import retroperitonealFibrosisData from './data/retroperitonealFibrosisData';
import glomerulonephritisData from './data/glomerulonephritisData';
import ckdData from './data/ckdData';
import nephroptosisData from './data/nephroptosisData';
import renalCystsData from './data/renalCystsData';
import renalAbscessData from './data/renalAbscessData';
import prostateAbscessData from './data/prostateAbscessData';
import xanthogranulomatousPyelonephritisData from './data/xanthogranulomatousPyelonephritisData';
import fournierGangreneData from './data/fournierGangreneData';
import urogenitalFistulaData from './data/urogenitalFistulaData';
import priapismData from './data/priapismData';
import cavernousFibrosisData from './data/cavernousFibrosisData';
import testicularTorsionData from './data/testicularTorsionData';
import acuteKidneyInjuryData from './data/acuteKidneyInjuryData';
import nephroticSyndromeData from './data/nephroticSyndromeData';
import polycysticKidneyData from './data/polycysticKidneyData';
import urethralDiverticulumData from './data/urethralDiverticulumData';
import paraphimosisData from './data/paraphimosisData';
import meatalStenosisData from './data/meatalStenosisData';
import seminalVesicleData from './data/seminalVesicleData';
import prostaticCystData from './data/prostaticCystData';
import postProstatectomyIncontinenceData from './data/postProstatectomyIncontinenceData';
import renalArteryStenosisData from './data/renalArteryStenosisData';
import renalInfarctionData from './data/renalInfarctionData';
import papillaryNecrosisData from './data/papillaryNecrosisData';
import renalVeinThrombosisData from './data/renalVeinThrombosisData';
import emphysematousPyelonephritisData from './data/emphysematousPyelonephritisData';
import malakoplakiaData from './data/malakoplakiaData';
import bladderPainSyndromeData from './data/bladderPainSyndromeData';
import renalTuberculosisData from './data/renalTuberculosisData';
import actinomycosisGUData from './data/actinomycosisGUData';
import ureteralStrictureBenignData from './data/ureteralStrictureBenignData';
import bladderNeckObstructionData from './data/bladderNeckObstructionData';
import vesicovaginalFistulaData from './data/vesicovaginalFistulaData';
import urethralCaruncleData from './data/urethralCaruncleData';
import stressIncontinenceMaleData from './data/stressIncontinenceMaleData';
import interstitialNephritisData from './data/interstitialNephritisData';
import membranousNephropathyData from './data/membranousNephropathyData';
import igaNephropathyData from './data/igaNephropathyData';
import diabeticNephropathyData from './data/diabeticNephropathyData';
import analgesicNephropathyData from './data/analgesicNephropathyData';
import renalColicData from './data/renalColicData';
import bladderOutletObstructionData from './data/bladderOutletObstructionData';
import neurogenicBladderChildData from './data/neurogenicBladderChildData';
import renalTraumaData from './data/renalTraumaData';
import ureteralTraumaData from './data/ureteralTraumaData';
import erectileDysfunctionData from './data/erectileDysfunctionData';
import prematureEjaculationData from './data/prematureEjaculationData';
import peyronieData from './data/peyronieData';
import maleInfertilityData from './data/maleInfertilityData';
import varicoceleData from './data/varicoceleData';
import cryptorchidismData from './data/cryptorchidismData';
import hypogonadismData from './data/hypogonadismData';
import orchitisData from './data/orchitisData';
import chronicProstatitisCPPSData from './data/chronicProstatitisCPPSData';
import prostaticIntraepithelialNeoplasiaData from './data/prostaticIntraepithelialNeoplasiaData';
import orchialgiaData from './data/orchialgiaData';
import funiculitisData from './data/funiculitisData';
import spermatorrheaData from './data/spermatorrheaData';
import aspermatismData from './data/aspermatismData';
import penileTraumaData from './data/penileTraumaData';
import penileLichenSclerosusData from './data/penileLichenSclerosusData';
import maleClimacteriumData from './data/maleClimacteriumData';
import oligospermiaData from './data/oligospermiaData';
import enuresisData from './data/enuresisData';
import phimosisData from './data/phimosisData';
import hydroceleData from './data/hydroceleData';
import hypospadiasData from './data/hypospadiasData';
import spermatoceleData from './data/spermatoceleData';
import balanoposthitisData from './data/balanoposthitisData';

const ALL_DISEASES = [
  { ...urolithiasisData, section: 'urology', subsection: 'stones' },
  { ...cystitisData, section: 'urology', subsection: 'infections' },
  { ...prostatitisData, section: 'urology', subsection: 'infections' },
  { ...pyelonephritisData, section: 'urology', subsection: 'infections' },
  { ...epididymitisData, section: 'urology', subsection: 'infections' },
  { ...urethritisData, section: 'urology', subsection: 'infections' },
  { ...orchitisData, section: 'urology', subsection: 'infections' },
  { ...prostateAbscessData, section: 'urology', subsection: 'infections' },
  { ...fournierGangreneData, section: 'urology', subsection: 'infections' },
  { ...xanthogranulomatousPyelonephritisData, section: 'urology', subsection: 'infections' },
  { ...prostateCancerData, section: 'urology', subsection: 'oncology' },
  { ...bladderCancerData, section: 'urology', subsection: 'oncology' },
  { ...kidneyCancerData, section: 'urology', subsection: 'oncology' },
  { ...testicularCancerData, section: 'urology', subsection: 'oncology' },
  { ...penileCancerData, section: 'urology', subsection: 'oncology' },
  { ...upperTractUCData, section: 'urology', subsection: 'oncology' },
  { ...bphData, section: 'urology', subsection: 'functional' },
  { ...overactiveBladderData, section: 'urology', subsection: 'functional' },
  { ...stressIncontinenceData, section: 'urology', subsection: 'functional' },
  { ...neurogenicBladderData, section: 'urology', subsection: 'functional' },
  { ...urinaryRetentionData, section: 'urology', subsection: 'functional' },
  { ...interstitialCystitisData, section: 'urology', subsection: 'functional' },
  { ...seminalVesicleData, section: 'urology', subsection: 'functional' },
  { ...prostaticCystData, section: 'urology', subsection: 'functional' },
  { ...postProstatectomyIncontinenceData, section: 'urology', subsection: 'functional' },
  { ...urethralStrictureData, section: 'urology', subsection: 'reconstructive' },
  { ...vesicoureteralRefluxData, section: 'urology', subsection: 'reconstructive' },
  { ...hydronephrosisData, section: 'urology', subsection: 'reconstructive' },
  { ...leukoplakiaData, section: 'urology', subsection: 'reconstructive' },
  { ...retroperitonealFibrosisData, section: 'urology', subsection: 'reconstructive' },
  { ...hematuriaData, section: 'urology', subsection: 'reconstructive' },
  { ...urogenitalFistulaData, section: 'urology', subsection: 'reconstructive' },
  { ...urethralDiverticulumData, section: 'urology', subsection: 'reconstructive' },
  { ...paraphimosisData, section: 'urology', subsection: 'reconstructive' },
  { ...meatalStenosisData, section: 'urology', subsection: 'reconstructive' },
  { ...testicularTorsionData, section: 'urology', subsection: 'reconstructive' },
  { ...glomerulonephritisData, section: 'urology', subsection: 'nephrology' },
  { ...ckdData, section: 'urology', subsection: 'nephrology' },
  { ...nephroptosisData, section: 'urology', subsection: 'nephrology' },
  { ...renalCystsData, section: 'urology', subsection: 'nephrology' },
  { ...renalAbscessData, section: 'urology', subsection: 'nephrology' },
  { ...acuteKidneyInjuryData, section: 'urology', subsection: 'nephrology' },
  { ...nephroticSyndromeData, section: 'urology', subsection: 'nephrology' },
  { ...polycysticKidneyData, section: 'urology', subsection: 'nephrology' },
  { ...renalArteryStenosisData, section: 'urology', subsection: 'nephrology' },
  { ...renalInfarctionData, section: 'urology', subsection: 'nephrology' },
  { ...papillaryNecrosisData, section: 'urology', subsection: 'nephrology' },
  { ...renalVeinThrombosisData, section: 'urology', subsection: 'nephrology' },
  { ...emphysematousPyelonephritisData, section: 'urology', subsection: 'infections' },
  { ...renalTuberculosisData, section: 'urology', subsection: 'infections' },
  { ...actinomycosisGUData, section: 'urology', subsection: 'infections' },
  { ...prostaticIntraepithelialNeoplasiaData, section: 'urology', subsection: 'oncology' },
  { ...bladderNeckObstructionData, section: 'urology', subsection: 'functional' },
  { ...bladderOutletObstructionData, section: 'urology', subsection: 'functional' },
  { ...stressIncontinenceMaleData, section: 'urology', subsection: 'functional' },
  { ...neurogenicBladderChildData, section: 'urology', subsection: 'functional' },
  { ...ureteralStrictureBenignData, section: 'urology', subsection: 'reconstructive' },
  { ...vesicovaginalFistulaData, section: 'urology', subsection: 'reconstructive' },
  { ...urethralCaruncleData, section: 'urology', subsection: 'reconstructive' },
  { ...interstitialNephritisData, section: 'urology', subsection: 'nephrology' },
  { ...membranousNephropathyData, section: 'urology', subsection: 'nephrology' },
  { ...igaNephropathyData, section: 'urology', subsection: 'nephrology' },
  { ...diabeticNephropathyData, section: 'urology', subsection: 'nephrology' },
  { ...analgesicNephropathyData, section: 'urology', subsection: 'nephrology' },
  { ...renalTraumaData, section: 'urology', subsection: 'nephrology' },
  { ...ureteralTraumaData, section: 'urology', subsection: 'nephrology' },
  { ...renalColicData, section: 'urology', subsection: 'stones' },
  { ...bladderPainSyndromeData, section: 'urology', subsection: 'pain' },
  { ...malakoplakiaData, section: 'urology', subsection: 'pain' },
  { ...erectileDysfunctionData, section: 'andrology', subsection: 'sexual' },
  { ...prematureEjaculationData, section: 'andrology', subsection: 'sexual' },
  { ...peyronieData, section: 'andrology', subsection: 'sexual' },
  { ...priapismData, section: 'andrology', subsection: 'sexual' },
  { ...cavernousFibrosisData, section: 'andrology', subsection: 'sexual' },
  { ...chronicProstatitisCPPSData, section: 'andrology', subsection: 'sexual' },
  { ...orchialgiaData, section: 'andrology', subsection: 'sexual' },
  { ...funiculitisData, section: 'andrology', subsection: 'sexual' },
  { ...spermatorrheaData, section: 'andrology', subsection: 'sexual' },
  { ...aspermatismData, section: 'andrology', subsection: 'sexual' },
  { ...penileTraumaData, section: 'andrology', subsection: 'sexual' },
  { ...penileLichenSclerosusData, section: 'andrology', subsection: 'sexual' },
  { ...maleInfertilityData, section: 'andrology', subsection: 'fertility' },
  { ...varicoceleData, section: 'andrology', subsection: 'fertility' },
  { ...cryptorchidismData, section: 'andrology', subsection: 'fertility' },
  { ...hypogonadismData, section: 'andrology', subsection: 'endocrine' },
  { ...oligospermiaData, section: 'andrology', subsection: 'fertility' },
  { ...maleClimacteriumData, section: 'andrology', subsection: 'endocrine' },
  { ...enuresisData, section: 'pediatric', subsection: null },
  { ...phimosisData, section: 'pediatric', subsection: null },
  { ...hydroceleData, section: 'pediatric', subsection: null },
  { ...hypospadiasData, section: 'pediatric', subsection: null },
  { ...spermatoceleData, section: 'pediatric', subsection: null },
  { ...balanoposthitisData, section: 'pediatric', subsection: null },
];

export default ALL_DISEASES;
