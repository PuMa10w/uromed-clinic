/**
 * ЕДИНЫЙ ИСТОЧНИК ДАННЫХ — UroAndro
 * Все мета-данные болезней для навигации, поиска, избранного и истории.
 */

import { buildSearchVariants, normalizeSearchText, scoreSearchMatch } from '../utils/search';

// ===== СЕКЦИИ И ПОДРАЗДЕЛЫ =====
export const sections = [
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'urology', label: 'Урология', icon: '🔬' },
  { id: 'andrology', label: 'Андрология', icon: '⚡' },
  { id: 'pediatric', label: 'Детская', icon: '👶' },
  { id: 'emergency', label: 'Экстренные', icon: '🚨' },
  { id: 'surgery', label: 'Хирургия', icon: '🔪' },
  { id: 'metaphylaxis', label: 'Диеты', icon: '🥗' },
  { id: 'tools', label: 'Опросники', icon: '📊' },
  { id: 'games', label: 'Игры', icon: '🎮' },
  { id: 'drugs', label: 'Препараты', icon: '💊' },
  { id: 'glossary', label: 'Глоссарий', icon: '📖' },
  { id: 'calculators', label: 'Калькуляторы', icon: '🧮' },
  { id: 'sitemap', label: 'Карта', icon: '🗺️' },
];

export const subsectionLabels = {
  stones: 'Мочекаменная', infections: 'Инфекции', oncology: 'Онкология',
  functional: 'Функциональная', reconstructive: 'Реконструктивная',
  nephrology: 'Нефрология', pain: 'Болевой синдром',
  sexual: 'Сексуальная', fertility: 'Фертильность', endocrine: 'Эндокринология',
};

export const sectionNames = {
  urology: 'Урология', andrology: 'Андрология', pediatric: 'Детская',
  emergency: 'Экстренные', surgery: 'Хирургия', metaphylaxis: 'Диеты при МКБ',
  tools: 'Опросники', games: 'Игры', drugs: 'Препараты', glossary: 'Глоссарий',
  calculators: 'Калькуляторы', sitemap: 'Карта сайта', home: 'Главная',
};

export const sectionIcons = {
  urology: '🔬', andrology: '⚡', pediatric: '👶',
  emergency: '🚨', surgery: '🔪', metaphylaxis: '🥗',
  tools: '📊', games: '🎮', drugs: '💊', glossary: '📖', calculators: '🧮',
  sitemap: '🗺️', home: '🏠',
};

// ===== ВСЕ БОЛЕЗНИ — единый массив =====
export const allDiseases = [
  // УРОЛОГИЯ — мочекаменная
  { id: 'urolithiasis', name: 'Мочекаменная болезнь', icd: 'N20-N23', section: 'urology', subsection: 'stones', icon: '💎' },
  { id: 'kidney-stone', name: 'Камень почки', icd: 'N20.0', section: 'urology', subsection: 'stones', icon: '💎' },
  { id: 'renal-colic', name: 'Почечная колика', icd: 'N23', section: 'urology', subsection: 'stones', icon: '💎' },
  { id: 'kidney-ureter-stones', name: 'Камни почки с камнями мочеточника', icd: 'N20.2', section: 'urology', subsection: 'stones', icon: '💎' },
  { id: 'ureteral-stone', name: 'Камень мочеточника', icd: 'N20.1', section: 'urology', subsection: 'stones', icon: '💎' },

  // УРОЛОГИЯ — инфекции
  { id: 'cystitis', name: 'Цистит', icd: 'N30', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'acute-cystitis', name: 'Острый цистит', icd: 'N30.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'chronic-cystitis', name: 'Хронический цистит', icd: 'N30.2', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'prostatitis', name: 'Простатит / ХТБС', icd: 'N41', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'pyelonephritis', name: 'Пиелонефрит', icd: 'N10', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'chronic-pyelonephritis', name: 'Хронический пиелонефрит', icd: 'N11', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'epididymitis', name: 'Эпидидимит', icd: 'N45', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'urethritis', name: 'Уретрит', icd: 'N34', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'orchitis', name: 'Орхит', icd: 'N45', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'prostate-abscess', name: 'Абсцесс простаты', icd: 'N41.2', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'fournier-gangrene', name: 'Гангрена Фурнье', icd: 'N49.2', section: 'urology', subsection: 'infections', icon: '⚠️' },
  { id: 'xanthogranulomatous-pyelonephritis', name: 'Ксантогранулематозный пиелонефрит', icd: 'N12', section: 'urology', subsection: 'infections', icon: '🫘' },
  { id: 'emphysematous-pyelonephritis', name: 'Эмфизематозный пиелонефрит', icd: 'N13.6', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'renal-tuberculosis', name: 'Туберкулёз почки', icd: 'A18.1', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'actinomycosis-gu', name: 'Актиномикоз мочеполовой', icd: 'A42.8', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'balanoposthitis', name: 'Баланопостит', icd: 'N48.1', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'recurrent-uti', name: 'Рецидивирующая ИМП', icd: 'N39.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'asymptomatic-bacteriuria', name: 'Бессимптомная бактериурия', icd: 'R82.7', section: 'urology', subsection: 'infections', icon: '🧪' },
  { id: 'uti-unspecified', name: 'ИМП без уточнения', icd: 'N39.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'device-associated-uti', name: 'ИМП, связанная с катетером/устройством', icd: 'T83.5', section: 'urology', subsection: 'infections', icon: '⚠️' },
  { id: 'acute-bacterial-prostatitis', name: 'Острый бактериальный простатит', icd: 'N41.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'epididymo-orchitis', name: 'Эпидидимоорхит', icd: 'N45.9', section: 'urology', subsection: 'infections', icon: '🔥' },

  // УРОЛОГИЯ — онкология
  { id: 'prostate-cancer', name: 'Рак предстательной железы', icd: 'C61', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'elevated-psa', name: 'Повышенный ПСА', icd: 'R97', section: 'urology', subsection: 'oncology', icon: '🧪' },
  { id: 'bladder-cancer', name: 'Рак мочевого пузыря', icd: 'C67', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'benign-bladder-neoplasm', name: 'Доброкачественное новообразование мочевого пузыря', icd: 'D30.3', section: 'urology', subsection: 'oncology', icon: '🛡️' },
  { id: 'kidney-cancer', name: 'Рак почки', icd: 'C64', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'testicular-cancer', name: 'Рак яичка', icd: 'C62', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'penile-cancer', name: 'Рак полового члена', icd: 'C60', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'upper-tract-uc', name: 'Уротелиальный рак верхних мочевых путей', icd: 'C65-C66', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'bladder-carcinoma-in-situ', name: 'Карцинома in situ мочевого пузыря', icd: 'D09.0', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'urethral-cancer', name: 'Рак уретры', icd: 'C68.0', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'prostatic-intraepithelial-neoplasia', name: 'Простатическая интраэпителиальная неоплазия (PIN)', icd: 'D40.0', section: 'urology', subsection: 'oncology', icon: '🎗️' },

  // УРОЛОГИЯ — функциональная
  { id: 'bph', name: 'ДГПЖ / Аденома простаты', icd: 'N40', section: 'urology', subsection: 'functional', icon: '🔬' },
  { id: 'overactive-bladder', name: 'Гиперактивный мочевой пузырь', icd: 'N32.8', section: 'urology', subsection: 'functional', icon: '⚡' },
  { id: 'stress-incontinence', name: 'Стрессовое недержание мочи', icd: 'N39.3', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'neurogenic-bladder', name: 'Нейрогенный мочевой пузырь', icd: 'N31', section: 'urology', subsection: 'functional', icon: '⚡' },
  { id: 'urinary-retention', name: 'Острая задержка мочи', icd: 'R33', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'interstitial-cystitis', name: 'Интерстициальный цистит / СБМП', icd: 'N30.1', section: 'urology', subsection: 'functional', icon: '🔥' },
  { id: 'seminal-vesicle-disease', name: 'Заболевания семенных пузырьков', icd: 'N50.0', section: 'urology', subsection: 'functional', icon: '🔬' },
  { id: 'prostatic-cyst', name: 'Кисты простаты', icd: 'N42.0', section: 'urology', subsection: 'functional', icon: '🔬' },
  { id: 'prostatic-calculi', name: 'Камни простаты', icd: 'N42.0', section: 'urology', subsection: 'functional', icon: '🔬' },
  { id: 'post-prostatectomy-incontinence', name: 'Послеоперационное недержание', icd: 'N39.4', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'bladder-neck-obstruction', name: 'Обструкция шейки мочевого пузыря', icd: 'N32.0', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'bladder-outlet-obstruction', name: 'Обструкция выхода мочевого пузыря', icd: 'N32.0', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'urge-incontinence', name: 'Ургентное недержание мочи', icd: 'N39.4', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'neurogenic-bladder-child', name: 'Нейрогенный мочевой пузырь у детей', icd: 'N31.2', section: 'urology', subsection: 'functional', icon: '⚡' },
  { id: 'underactive-bladder', name: 'Гипоактивный мочевой пузырь', icd: 'N31.2', section: 'urology', subsection: 'functional', icon: '💧' },

  // УРОЛОГИЯ — реконструктивная
  { id: 'urethral-stricture', name: 'Стриктура уретры', icd: 'N35', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'postprocedural-urethral-stricture', name: 'Постпроцедурная стриктура уретры', icd: 'N99.1', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'vesicoureteral-reflux', name: 'Пузырно-мочеточниковый рефлюкс', icd: 'N13.7', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'hydronephrosis', name: 'Гидронефроз', icd: 'N13', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'leukoplakia', name: 'Лейкоплакия мочевого пузыря', icd: 'N32.8', section: 'urology', subsection: 'reconstructive', icon: '🔬' },
  { id: 'retroperitoneal-fibrosis', name: 'Ретроперитонеальный фиброз', icd: 'N13.5', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'hematuria', name: 'Гематурия', icd: 'R31', section: 'urology', subsection: 'reconstructive', icon: '🩸' },
  { id: 'urogenital-fistula', name: 'Урогенитальные свищи', icd: 'N82', section: 'urology', subsection: 'reconstructive', icon: '🔗' },
  { id: 'urethral-diverticulum', name: 'Дивертикул уретры', icd: 'N36.2', section: 'urology', subsection: 'reconstructive', icon: '🔬' },
  { id: 'paraphimosis', name: 'Парафимоз', icd: 'N47.1', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'meatal-stenosis', name: 'Стеноз наружного меатуса', icd: 'N36.0', section: 'urology', subsection: 'reconstructive', icon: '🔬' },
  { id: 'testicular-torsion', name: 'Перекрут яичка', icd: 'N44', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'ureteral-stricture-benign', name: 'Доброкачественная стриктура мочеточника', icd: 'N13.5', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'vesicovaginal-fistula', name: 'Пузырно-влагалищный свищ', icd: 'N82.0', section: 'urology', subsection: 'reconstructive', icon: '🔗' },
  { id: 'urethral-caruncle', name: 'Уретральный карункул', icd: 'N36.8', section: 'urology', subsection: 'reconstructive', icon: '🔬' },
  { id: 'bladder-diverticulum', name: 'Дивертикул мочевого пузыря', icd: 'N32.3', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'enterovesical-fistula', name: 'Кишечно-пузырный свищ', icd: 'N32.1', section: 'urology', subsection: 'reconstructive', icon: '🔗' },
  { id: 'bladder-rupture', name: 'Разрыв мочевого пузыря', icd: 'S37.2', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'urethral-trauma', name: 'Травма уретры', icd: 'S37.3', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'catheter-complication', name: 'Механическое осложнение мочевого катетера', icd: 'T83.0', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },

  // УРОЛОГИЯ — нефрология
  { id: 'glomerulonephritis', name: 'Гломерулонефрит', icd: 'N00-N08', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'ckd', name: 'Хроническая болезнь почек', icd: 'N18', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'nephroptosis', name: 'Нефроптоз', icd: 'N28.8', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'renal-cysts', name: 'Кисты почек', icd: 'N28.1', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'renal-abscess', name: 'Абсцесс почки', icd: 'N15.1', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'acute-kidney-injury', name: 'Острое повреждение почек (ОПП)', icd: 'N17', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'nephrotic-syndrome', name: 'Нефротический синдром', icd: 'N04', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'polycystic-kidney', name: 'Поликистозная болезнь почек', icd: 'Q61.2', section: 'urology', subsection: 'nephrology', icon: '🧬' },
  { id: 'renal-artery-stenosis', name: 'Стеноз почечной артерии', icd: 'I70.1', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'renal-infarction', name: 'Инфаркт почки', icd: 'N28.0', section: 'urology', subsection: 'nephrology', icon: '⚠️' },
  { id: 'papillary-necrosis', name: 'Папиллярный некроз', icd: 'N17.0', section: 'urology', subsection: 'nephrology', icon: '⚠️' },
  { id: 'renal-vein-thrombosis', name: 'Тромбоз почечной вены', icd: 'I82.3', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'interstitial-nephritis', name: 'Интерстициальный нефрит', icd: 'N10', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'membranous-nephropathy', name: 'Мембранозная нефропатия', icd: 'N05', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'iga-nephropathy', name: 'IgA-нефропатия (Берже)', icd: 'N02', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'diabetic-nephropathy', name: 'Диабетическая нефропатия', icd: 'E11.2', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'analgesic-nephropathy', name: 'Анальгетическая нефропатия', icd: 'N14.0', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'renal-trauma', name: 'Травма почки', icd: 'S37.0', section: 'urology', subsection: 'nephrology', icon: '⚠️' },
  { id: 'ureteral-trauma', name: 'Травма мочеточника', icd: 'S37.1', section: 'urology', subsection: 'nephrology', icon: '⚠️' },

  // УРОЛОГИЯ — болевой синдром
  { id: 'bladder-pain-syndrome', name: 'Болевой синдром мочевого пузыря', icd: 'N30.1', section: 'urology', subsection: 'pain', icon: '💢' },
  { id: 'malakoplakia', name: 'Малакоплакия мочевого пузыря', icd: 'N32.8', section: 'urology', subsection: 'pain', icon: '🔬' },

  // АНДРОЛОГИЯ — сексуальная
  { id: 'erectile-dysfunction', name: 'Эректильная дисфункция', icd: 'N52', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'premature-ejaculation', name: 'Преждевременная эякуляция', icd: 'N53', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'psychogenic-premature-ejaculation', name: 'Психогенная преждевременная эякуляция', icd: 'F52.4', section: 'andrology', subsection: 'sexual', icon: '🧠' },
  { id: 'peyronie', name: 'Болезнь Пейрони', icd: 'N48.6', section: 'andrology', subsection: 'sexual', icon: '🔬' },
  { id: 'psychogenic-ed', name: 'Психогенная эректильная дисфункция', icd: 'F52.2', section: 'andrology', subsection: 'sexual', icon: '🧠' },
  { id: 'priapism', name: 'Приапизм', icd: 'N48.3', section: 'andrology', subsection: 'sexual', icon: '⚠️' },
  { id: 'cavernous-fibrosis', name: 'Фиброз кавернозных тел', icd: 'N48.6', section: 'andrology', subsection: 'sexual', icon: '🔬' },
  { id: 'chronic-prostatitis-cpps', name: 'Хронический простатит / СХТБ', icd: 'N41.1', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'orchialgia', name: 'Орхиалгия (хроническая боль в яичке)', icd: 'N50.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'funiculitis', name: 'Фуникулит', icd: 'N49.2', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'spermatorrhea', name: 'Сперматорея', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'aspermatism', name: 'Асперматизм', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'penile-trauma', name: 'Травма полового члена', icd: 'S39.8', section: 'andrology', subsection: 'sexual', icon: '⚠️' },
  { id: 'penile-lichen-sclerosus', name: 'Склероатрофический лихен полового члена', icd: 'L90.0', section: 'andrology', subsection: 'sexual', icon: '🔬' },

  // АНДРОЛОГИЯ — фертильность
  { id: 'male-infertility', name: 'Мужское бесплодие', icd: 'N46', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'varicocele', name: 'Варикоцеле', icd: 'I86.1', section: 'andrology', subsection: 'fertility', icon: '🔬' },
  { id: 'cryptorchidism', name: 'Крипторхизм', icd: 'Q53', section: 'andrology', subsection: 'fertility', icon: '🔬' },
  { id: 'oligospermia', name: 'Олигозооспермия', icd: 'N46', section: 'andrology', subsection: 'fertility', icon: '🧬' },

  // АНДРОЛОГИЯ — эндокринология
  { id: 'hypogonadism', name: 'Мужской гипогонадизм', icd: 'E29.1', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'male-climacterium', name: 'Мужской климакс (LOH)', icd: 'E29.1', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },

  // ДЕТСКАЯ УРОЛОГИЯ
  { id: 'enuresis', name: 'Энурез (ночное недержание)', icd: 'F98.0', section: 'pediatric', subsection: null, icon: '👶' },
  { id: 'phimosis', name: 'Фимоз', icd: 'N47', section: 'pediatric', subsection: null, icon: '🔬' },
  { id: 'hydrocele', name: 'Гидроцеле', icd: 'N43', section: 'pediatric', subsection: null, icon: '💧' },
  { id: 'hypospadias', name: 'Гипоспадия', icd: 'Q54', section: 'pediatric', subsection: null, icon: '🔧' },
  { id: 'spermatocele', name: 'Сперматоцеле', icd: 'N50.3', section: 'pediatric', subsection: null, icon: '🔬' },
  { id: 'posterior-urethral-valves', name: 'Клапаны задней уретры', icd: 'Q64.2', section: 'pediatric', subsection: null, icon: '👶' },

  // НОВЫЕ НОЗОЛОГИИ
  { id: 'urosepsis', name: 'Уросепсис', icd: 'N13.6 + A41.9', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'radiation-cystitis', name: 'Лучевой цистит', icd: 'N30.4', section: 'urology', subsection: 'pain', icon: '☢️' },
  { id: 'stent-symptoms', name: 'Стент-симптомы', icd: 'T83.1', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'post-vasectomy-pain', name: 'Поствазэктомический болевой синдром', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'klein-felter', name: 'Синдром Клайнфельтера', icd: 'Q97.0', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'urethral-syndrome', name: 'Уретральный синдром', icd: 'N30.9', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'male-contraception', name: 'Мужская контрацепция', icd: 'Z30.0', section: 'andrology', subsection: 'fertility', icon: '🧬' },

  // ===== НОВЫЕ 40 НОЗОЛОГИЙ =====
  // УРОЛОГИЯ — ИНФЕКЦИИ
  { id: 'prostatovesiculitis', name: 'Простатовезикулит', icd: 'N50.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'cowperitis', name: 'Куперит (бульбоуретрит)', icd: 'N34.2', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'trichomoniasis-gu', name: 'Трихомониаз мочеполовой', icd: 'A59.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'genital-mycoplasma', name: 'Микоплазменная инфекция мочеполовая', icd: 'A49.3', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'genital-herpes', name: 'Герпес генитальный', icd: 'A60.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'condyloma-acuminata', name: 'Остроконечные кондиломы (ВПЧ)', icd: 'A63.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'schistosomiasis-gu', name: 'Шистосомоз мочеполовой', icd: 'B65.0', section: 'urology', subsection: 'infections', icon: '🔥' },
  { id: 'candida-balanitis', name: 'Кандидозный баланопостит', icd: 'B37.4', section: 'urology', subsection: 'infections', icon: '🔥' },

  // УРОЛОГИЯ — КАМНИ
  { id: 'bladder-stones', name: 'Камни мочевого пузыря', icd: 'N21.0', section: 'urology', subsection: 'stones', icon: '💎' },
  { id: 'urethral-stones', name: 'Камни уретры', icd: 'N21.1', section: 'urology', subsection: 'stones', icon: '💎' },

  // УРОЛОГИЯ — ОНКОЛОГИЯ
  { id: 'sarcoma-prostate', name: 'Саркома предстательной железы', icd: 'C61', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'neuroendocrine-bladder', name: 'Нейроэндокринная опухоль мочевого пузыря', icd: 'C67.9', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'wilms-tumor', name: 'Опухоль Вильмса (нефробластома)', icd: 'C64', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'adrenal-cancer', name: 'Рак надпочечника', icd: 'C74.0', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'paraganglioma-bladder', name: 'Параганглиома мочевого пузыря', icd: 'D35.4', section: 'urology', subsection: 'oncology', icon: '🎗️' },

  // УРОЛОГИЯ — ФУНКЦИОНАЛЬНАЯ
  { id: 'nocturia', name: 'Ноктурия', icd: 'R35.1', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'pollakiuria', name: 'Поллакиурия', icd: 'R35.0', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'vesicocutaneous-fistula', name: 'Пузырно-кожный свищ', icd: 'N82.8', section: 'urology', subsection: 'functional', icon: '💧' },
  { id: 'urethral-hypersensitivity', name: 'Гиперчувствительность уретры', icd: 'N36.8', section: 'urology', subsection: 'functional', icon: '💧' },

  // УРОЛОГИЯ — РЕКОНСТРУКТИВНАЯ/ТРАВМА
  { id: 'pelvic-fracture-urethral-injury', name: 'Травма уретры при переломе таза', icd: 'S37.2', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'penile-fracture', name: 'Перелом полового члена', icd: 'S39.8', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'scrotal-trauma', name: 'Травма мошонки', icd: 'S30.2', section: 'urology', subsection: 'reconstructive', icon: '⚠️' },
  { id: 'urethral-prolapse', name: 'Выпадение уретры', icd: 'N36.1', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'bladder-exstrophy', name: 'Экстрофия мочевого пузыря', icd: 'Q64.1', section: 'urology', subsection: 'reconstructive', icon: '🔧' },

  // УРОЛОГИЯ — НЕФРОЛОГИЯ
  { id: 'hypercalciuria', name: 'Гиперкальциурия', icd: 'E83.5', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'hyperoxaluria', name: 'Гипероксалурия', icd: 'E72.5', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'cystinuria', name: 'Цистинурия', icd: 'E72.0', section: 'urology', subsection: 'nephrology', icon: '🧬' },
  { id: 'hyperuricosuria', name: 'Гиперурикозурия', icd: 'E79.0', section: 'urology', subsection: 'nephrology', icon: '🫘' },

  // АНДРОЛОГИЯ — СЕКСУАЛЬНАЯ
  { id: 'delayed-ejaculation', name: 'Замедленная эякуляция', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'anejaculation', name: 'Анэякуляция', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'retrograde-ejaculation', name: 'Ретроградная эякуляция', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'hematospermia', name: 'Гематоспермия', icd: 'N53.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },

  // АНДРОЛОГИЯ — ФЕРТИЛЬНОСТЬ
  { id: 'azoospermia', name: 'Азооспермия', icd: 'N46', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'teratozoospermia', name: 'Тератозооспермия', icd: 'N46', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'asthenozoospermia', name: 'Астенозооспермия', icd: 'N46', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'leukocytospermia', name: 'Лейкоцитоспермия', icd: 'N46', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'varicocele-recurrence', name: 'Рецидив варикоцеле', icd: 'I86.1', section: 'andrology', subsection: 'fertility', icon: '🔬' },

  // АНДРОЛОГИЯ — ЭНДОКРИНОЛОГИЯ
  { id: 'hyperprolactinemia-male', name: 'Гиперпролактинемия у мужчин', icd: 'E22.1', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'hyperthyroidism-ed', name: 'ЭД на фоне гипертиреоза', icd: 'E05.9', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'metabolic-syndrome-ed', name: 'ЭД на фоне метаболического синдрома', icd: 'E88.8', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'kallmann-syndrome', name: 'Синдром Каллмана', icd: 'E23.0', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'upj-obstruction', name: 'Обструкция ЛМС', icd: 'N13.5', section: 'urology', subsection: 'reconstructive', icon: '🔧' },
  { id: 'bladder-endometriosis', name: 'Эндометриоз мочевого пузыря', icd: 'N80.1', section: 'urology', subsection: 'reconstructive', icon: '🔬' },
  { id: 'chyluria', name: 'Хилурия', icd: 'R82.0', section: 'urology', subsection: 'reconstructive', icon: '🧪' },
  { id: 'renal-angiomyolipoma', name: 'Ангиомиолипома почки', icd: 'D30.0', section: 'urology', subsection: 'nephrology', icon: '🫘' },
  { id: 'papillary-rcc', name: 'Папиллярный рак почки', icd: 'C64', section: 'urology', subsection: 'oncology', icon: '🎗️' },
  { id: 'adrenal-incidentaloma', name: 'Инциденталома надпочечника', icd: 'E27.8', section: 'urology', subsection: 'oncology', icon: '🧭' },
  { id: 'ejaculatory-duct-obstruction', name: 'Обструкция семявыбрасывающих протоков', icd: 'N53.8', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'fertility-preservation-male', name: 'Сохранение фертильности у мужчин', icd: 'Z31.6', section: 'andrology', subsection: 'fertility', icon: '🧬' },
  { id: 'subclinical-hypogonadism', name: 'Субклинический гипогонадизм', icd: 'E29.1', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'androgen-resistance-syndrome', name: 'Синдром андрогенной резистентности', icd: 'E34.5', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'male-osteoporosis-hypogonadism', name: 'Остеопороз при гипогонадизме', icd: 'M81.8', section: 'andrology', subsection: 'endocrine', icon: '⚗️' },
  { id: 'male-pelvic-floor-dysfunction', name: 'Дисфункция тазового дна у мужчин', icd: 'M62.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'penile-mondor-disease', name: 'Болезнь Мондора полового члена', icd: 'I80.8', section: 'andrology', subsection: 'sexual', icon: '⚡' },
  { id: 'male-genital-lichen-planus', name: 'Генитальный красный плоский лишай', icd: 'L43.9', section: 'andrology', subsection: 'sexual', icon: '🔬' },
  { id: 'chronic-bacterial-prostatitis', name: 'Хронический бактериальный простатит', icd: 'N41.1', section: 'andrology', subsection: 'sexual', icon: '🔥' },
  { id: 'testicular-atrophy', name: 'Атрофия яичка', icd: 'N50.0', section: 'andrology', subsection: 'sexual', icon: '⚡' },
];

// ===== MAP для быстрого поиска по ID =====
export const diseaseById = {};
allDiseases.forEach(d => { diseaseById[d.id] = d; });

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
  return diseaseById[id] || null;
}

export function getDiseasesBySection(section) {
  return allDiseases.filter(d => d.section === section);
}

export function getDiseasesBySubsection(section, subsection) {
  return allDiseases.filter(d => d.section === section && d.subsection === subsection);
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
