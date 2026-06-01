# V7 Guideline Source Matrix

Дата фиксации: 2026-05-08

Цель: закрепить проверяемые первичные источники для дальнейшего наполнения карточек МКБ-10. Перед добавлением дозировок, интервалов наблюдения и порогов вмешательства каждая карточка должна пройти ручную сверку с профильным гайдом.

## Wave A: источники первой очереди

| Клинический блок | Карточки | Основной источник | Что обновлять в карточках |
|---|---|---|---|
| Инфекции нижних и верхних мочевых путей | `acute-cystitis`, `recurrent-uti`, `pyelonephritis`, `urosepsis`, `device-associated-uti` | EAU Urological Infections 2026; AUA/CUA/SUFU rUTI 2025 | диагностика, посевы, антибиотикостюардшип, критерии осложненного течения, follow-up |
| Камни и почечная колика | `kidney-stone`, `ureteral-stone`, `kidney-ureter-stones`, `renal-colic` | EAU Urolithiasis 2026 | renal colic pathway, MET, декомпрессия, антибиотикопрофилактика, метафилактика |
| Сексуальная медицина | `erectile-dysfunction`, `psychogenic-ed`, `premature-ejaculation`, `psychogenic-premature-ejaculation`, `priapism` | EAU Sexual and Reproductive Health 2026; AUA/SMSNA Disorders of Ejaculation 2020; AUA ED guideline 2018 | диагностика, опросники, психосексуальный маршрут, ED treatment flow, PE treatment flow, priapism urgent route |
| LUTS/BPH и функциональная урология | `bph`, `overactive-bladder`, `urinary-retention`, `urge-incontinence`, `underactive-bladder` | EAU Non-neurogenic Male LUTS 2026 + профильные EAU/AUA блоки | диагностика, conservative treatment, медикаменты, хирургические развилки, наблюдение |

## Проверенные ссылки

- EAU Urological Infections: https://uroweb.org/guidelines/urological-infections
- EAU Urological Infections summary of changes 2026: https://uroweb.org/guidelines/urological-infections/summary-of-changes
- AUA/CUA/SUFU Recurrent Uncomplicated UTI 2025: https://www.auanet.org/guidelines-and-quality/guidelines/recurrent-uti
- EAU Urolithiasis summary of changes 2026: https://uroweb.org/guidelines/urolithiasis/summary-of-changes
- EAU Sexual and Reproductive Health summary of changes 2026: https://uroweb.org/guidelines/sexual-and-reproductive-health/summary-of-changes
- AUA/SMSNA Disorders of Ejaculation: https://www.auanet.org/guidelines-and-quality/guidelines/disorders-of-ejaculation
- AUA Erectile Dysfunction guideline publication: https://pubmed.ncbi.nlm.nih.gov/29746858/
- EAU Non-neurogenic Male LUTS summary of changes 2026: https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts/summary-of-changes

## Правило обновления карточки

1. Сначала закрыть структурные блоки из `content/icd10-gap-register-v7.csv`.
2. Затем добавить `lastReviewed`, `evidenceVersion`, `reviewStatus`.
3. После медицинского обновления запускать `npm run content:quality`.
4. Если карточка меняет визуальную нагрузку (много таблиц/алгоритмов), дополнительно проверить iPhone viewport.

## Приоритет ручной сверки

1. `acute-bacterial-prostatitis`, `ureteral-stone`, `psychogenic-ed`, `psychogenic-premature-ejaculation`.
2. `acute-cystitis`, `recurrent-uti`, `device-associated-uti`, `kidney-stone`, `kidney-ureter-stones`.
3. `urge-incontinence`, `hydronephrosis`, `renal-colic`.

## Ограничение безопасности

Этот файл фиксирует источники и порядок работы. Он не заменяет медицинскую редактуру: точные дозировки, длительность терапии, противопоказания и пороги вмешательства добавляются только после сверки с актуальной версией первичного гайда.
