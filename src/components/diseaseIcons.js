import React from 'react';

const tokens = {
  bgOuter: '#08121f',
  bgInner: '#102033',
  line: '#9bb6d4',
  soft: '#5f7594',
  gold: '#e7c06b',
  teal: '#65d7bf',
  blue: '#7baef2',
  danger: '#ff6a6a',
  dangerSoft: '#ff9e9e',
  organ: '#d8a28d',
  organDark: '#9c6b59',
  kidney: '#cb6c70',
  bladder: '#c98294',
  fluid: '#7ec7ef',
  stone: '#e2c170',
  white: '#f5f9ff',
};

const Frame = ({ children }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="um-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={tokens.bgInner} />
        <stop offset="100%" stopColor={tokens.bgOuter} />
      </linearGradient>
      <radialGradient id="um-glow" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#1a3250" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#08121f" stopOpacity="1" />
      </radialGradient>
      <linearGradient id="um-organ" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#efc1ab" />
        <stop offset="100%" stopColor={tokens.organDark} />
      </linearGradient>
      <linearGradient id="um-kidney" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ea8e91" />
        <stop offset="100%" stopColor="#9e4348" />
      </linearGradient>
      <linearGradient id="um-bladder" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#dfb0bd" />
        <stop offset="100%" stopColor="#93576a" />
      </linearGradient>
      <linearGradient id="um-fluid" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b8ebff" />
        <stop offset="100%" stopColor="#57aad9" />
      </linearGradient>
      <linearGradient id="um-stone" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f7e3aa" />
        <stop offset="100%" stopColor="#b78d39" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#um-glow)" />
    <circle cx="50" cy="50" r="46.5" fill="url(#um-bg)" stroke="rgba(155,182,212,0.32)" strokeWidth="1.25" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(231,192,107,0.14)" strokeWidth="0.8" />
    <circle cx="18" cy="24" r="1" fill="rgba(123,174,242,0.45)" />
    <circle cx="80" cy="18" r="1.1" fill="rgba(231,192,107,0.3)" />
    <circle cx="77" cy="77" r="0.9" fill="rgba(101,215,191,0.35)" />
    {children}
  </svg>
);

const organStroke = { fill: 'url(#um-organ)', stroke: 'rgba(245,249,255,0.18)', strokeWidth: 1 };
const kidneyStroke = { fill: 'url(#um-kidney)', stroke: 'rgba(245,249,255,0.15)', strokeWidth: 1 };
const bladderStroke = { fill: 'url(#um-bladder)', stroke: 'rgba(245,249,255,0.15)', strokeWidth: 1 };

const addDanger = (x, y, r = 5) => <circle cx={x} cy={y} r={r} fill={tokens.danger} opacity="0.86" />;
const addSoftGlow = (x, y, r = 8, color = 'rgba(231,192,107,0.14)') => <circle cx={x} cy={y} r={r} fill={color} />;

const kidneysBase = () => (
  <>
    <path d="M31 28c-7 2-12 9-12 18s5 16 12 18c8-2 13-9 13-18s-5-16-13-18Z" {...kidneyStroke} />
    <path d="M69 28c7 2 12 9 12 18s-5 16-12 18c-8-2-13-9-13-18s5-16 13-18Z" {...kidneyStroke} />
    <path d="M44 44h12" stroke={tokens.soft} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M34 61c-2 6-4 11-5 17" stroke={tokens.organ} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <path d="M66 61c2 6 4 11 5 17" stroke={tokens.organ} strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </>
);

const bladderBase = () => (
  <>
    <path d="M31 31c0 13 8 24 19 24s19-11 19-24c0-2-1-4-2-6H33c-1 2-2 4-2 6Z" {...bladderStroke} />
    <path d="M43 55v17" stroke={tokens.organ} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M57 55v17" stroke={tokens.organ} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M50 55v22" stroke={tokens.fluid} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
  </>
);

const prostateBase = () => (
  <>
    <ellipse cx="50" cy="49" rx="17" ry="12" {...organStroke} />
    <path d="M50 23v13" stroke={tokens.fluid} strokeWidth="2.1" strokeLinecap="round" />
    <ellipse cx="50" cy="25" rx="13" ry="9" {...bladderStroke} opacity="0.7" />
    <path d="M50 37v22" stroke={tokens.fluid} strokeWidth="2" strokeLinecap="round" />
  </>
);

const testicleBase = () => (
  <>
    <ellipse cx="42" cy="60" rx="11" ry="15" {...organStroke} />
    <ellipse cx="58" cy="60" rx="11" ry="15" {...organStroke} />
    <path d="M50 28c-2 6-2 10-1 16" stroke={tokens.organ} strokeWidth="2.1" strokeLinecap="round" fill="none" />
  </>
);

const penisBase = () => (
  <>
    <path d="M50 18c0 10 1 18 1 27 0 8-1 15-1 23" stroke="url(#um-organ)" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M50 68c-2 4-6 8-10 10" stroke={tokens.organ} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
  </>
);

const urethraBase = () => (
  <>
    <path d="M50 18v62" stroke={tokens.fluid} strokeWidth="3" strokeLinecap="round" />
    <path d="M42 18h16" stroke={tokens.soft} strokeWidth="1.6" strokeLinecap="round" />
  </>
);

const icons = {
  'urolithiasis': <Frame>{addSoftGlow(32, 42)}{addSoftGlow(68, 42)}{kidneysBase()}<path d="M30 42l4-4 5 3-2 6-6 1-4-3z" fill="url(#um-stone)" /><path d="M67 40l4-3 4 4-2 5-5 1-4-4z" fill="url(#um-stone)" /></Frame>,
  'renal-colic': <Frame>{kidneysBase()}<path d="M50 33c7 5 8 12 2 18" stroke={tokens.gold} strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M52 51c-5 2-8 6-9 12" stroke={tokens.dangerSoft} strokeWidth="2" strokeLinecap="round" fill="none" /></Frame>,
  'bladder-stones': <Frame>{bladderBase()}<path d="M43 42l5-4 5 3-1 6-6 1-4-3z" fill="url(#um-stone)" /><path d="M56 45l4-3 4 3-1 5-5 1-3-3z" fill="url(#um-stone)" opacity="0.9" /></Frame>,
  'urethral-stones': <Frame>{urethraBase()}<path d="M50 53l4-4 5 4-2 5-5 1-4-3z" fill="url(#um-stone)" /></Frame>,

  'cystitis': <Frame>{bladderBase()}{addDanger(42, 40, 4)}{addDanger(56, 46, 3.5)}<path d="M33 30c8-6 26-6 34 0" stroke={tokens.dangerSoft} strokeWidth="2.2" fill="none" /></Frame>,
  'prostatitis': <Frame>{prostateBase()}{addDanger(43, 47, 4)}{addDanger(56, 49, 3.5)}<circle cx="50" cy="50" r="4.5" fill={tokens.gold} opacity="0.55" /></Frame>,
  'pyelonephritis': <Frame>{kidneysBase()}{addDanger(30, 39, 4)}{addDanger(35, 48, 3)}<path d="M28 34c-4 2-6 5-7 9" stroke={tokens.dangerSoft} strokeWidth="1.8" fill="none" /></Frame>,
  'epididymitis': <Frame>{testicleBase()}<ellipse cx="66" cy="56" rx="6" ry="11" fill={tokens.danger} opacity="0.8" />{addDanger(66, 46, 3)}</Frame>,
  'urethritis': <Frame>{urethraBase()}<path d="M50 24v40" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" opacity="0.95" /><circle cx="50" cy="58" r="3" fill={tokens.gold} opacity="0.7" /></Frame>,
  'orchitis': <Frame>{testicleBase()}{addDanger(42, 60, 5)}<ellipse cx="42" cy="60" rx="13" ry="17" fill={tokens.danger} opacity="0.18" /></Frame>,
  'prostate-abscess': <Frame>{prostateBase()}<circle cx="50" cy="49" r="6.5" fill={tokens.gold} opacity="0.8" /><circle cx="50" cy="49" r="3.6" fill={tokens.dangerSoft} opacity="0.7" /></Frame>,
  'fournier-gangrene': <Frame>{testicleBase()}<path d="M35 48l8 9M43 48l-8 9" stroke={tokens.danger} strokeWidth="2.3" strokeLinecap="round" /><path d="M57 48l8 9M65 48l-8 9" stroke={tokens.danger} strokeWidth="2.3" strokeLinecap="round" /></Frame>,
  'urosepsis': <Frame>{kidneysBase()}<path d="M50 20v18" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /><path d="M50 22l4 5-8 0z" fill={tokens.danger} /><path d="M24 26c8-4 44-4 52 0" stroke={tokens.dangerSoft} strokeWidth="1.4" strokeDasharray="2 2" fill="none" /></Frame>,
  'radiation-cystitis': <Frame>{bladderBase()}<path d="M66 24l-6 12h5l-7 14" stroke={tokens.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Frame>,
  'stent-symptoms': <Frame>{kidneysBase()}<path d="M67 60c3 5 3 11 0 17" stroke={tokens.fluid} strokeWidth="2.2" fill="none" /><path d="M33 60c-3 5-3 11 0 17" stroke={tokens.fluid} strokeWidth="2.2" fill="none" /><path d="M69 58c5 0 6 4 6 7s-2 6-5 6" stroke={tokens.gold} strokeWidth="1.5" fill="none" /></Frame>,
  'urethral-syndrome': <Frame>{urethraBase()}<circle cx="50" cy="50" r="14" fill="none" stroke={tokens.gold} strokeWidth="1.6" strokeDasharray="3 2" /><path d="M43 50h14" stroke={tokens.dangerSoft} strokeWidth="1.6" strokeLinecap="round" /></Frame>,
  'prostatovesiculitis': <Frame>{prostateBase()}<ellipse cx="39" cy="34" rx="5" ry="8" fill={tokens.dangerSoft} opacity="0.6" /><ellipse cx="61" cy="34" rx="5" ry="8" fill={tokens.dangerSoft} opacity="0.6" />{addDanger(50, 49, 3.5)}</Frame>,
  'cowperitis': <Frame>{urethraBase()}<circle cx="45" cy="64" r="4" fill={tokens.dangerSoft} opacity="0.85" /><circle cx="55" cy="64" r="4" fill={tokens.dangerSoft} opacity="0.85" /></Frame>,
  'trichomoniasis-gu': <Frame>{urethraBase()}<path d="M45 39l5 8 5-8" stroke={tokens.gold} strokeWidth="1.8" fill="none" /><circle cx="50" cy="53" r="3" fill={tokens.dangerSoft} /></Frame>,
  'genital-mycoplasma': <Frame>{urethraBase()}<circle cx="44" cy="42" r="2.5" fill={tokens.gold} /><circle cx="55" cy="47" r="2.5" fill={tokens.gold} opacity="0.8" /><circle cx="50" cy="55" r="2.5" fill={tokens.gold} opacity="0.6" /></Frame>,
  'genital-herpes': <Frame>{penisBase()}<circle cx="44" cy="28" r="2.4" fill={tokens.danger} /><circle cx="49" cy="24" r="2.2" fill={tokens.dangerSoft} /><circle cx="55" cy="29" r="2.4" fill={tokens.danger} /></Frame>,
  'condyloma-acuminata': <Frame>{penisBase()}<path d="M45 24l3 4 3-4 3 4 3-4" stroke={tokens.gold} strokeWidth="1.6" fill="none" strokeLinecap="round" /></Frame>,
  'schistosomiasis-gu': <Frame>{bladderBase()}<path d="M39 37c3-4 6-5 11-5s8 1 11 5" stroke={tokens.gold} strokeWidth="1.6" fill="none" /><path d="M41 46c2-2 4-3 9-3s7 1 9 3" stroke={tokens.gold} strokeWidth="1.4" fill="none" opacity="0.8" /></Frame>,
  'candida-balanitis': <Frame>{penisBase()}<circle cx="45" cy="27" r="2.8" fill={tokens.white} /><circle cx="50" cy="31" r="2.4" fill={tokens.white} /><circle cx="55" cy="26" r="2.7" fill={tokens.white} /></Frame>,

  'prostate-cancer': <Frame>{prostateBase()}{addDanger(40, 46, 5)}{addDanger(60, 50, 4)}</Frame>,
  'bladder-cancer': <Frame>{bladderBase()}{addDanger(40, 34, 5)}<path d="M38 30c0-4 2-7 5-10" stroke={tokens.dangerSoft} strokeWidth="1.4" fill="none" strokeDasharray="2 2" /></Frame>,
  'kidney-cancer': <Frame>{kidneysBase()}{addDanger(35, 38, 6)}<path d="M54 20c2-3 4-5 7-7" stroke={tokens.dangerSoft} strokeWidth="1.4" fill="none" strokeDasharray="2 2" /></Frame>,
  'testicular-cancer': <Frame>{testicleBase()}{addDanger(58, 60, 5)}<circle cx="58" cy="60" r="9" fill="rgba(255,106,106,0.15)" /></Frame>,
  'penile-cancer': <Frame>{penisBase()}{addDanger(50, 28, 5)}<path d="M57 21c4 1 7 4 9 7" stroke={tokens.dangerSoft} strokeWidth="1.4" fill="none" strokeDasharray="2 2" /></Frame>,
  'upper-tract-uc': <Frame>{kidneysBase()}<path d="M67 61c6-2 10-6 12-12" stroke={tokens.danger} strokeWidth="2.4" fill="none" /><circle cx="73" cy="49" r="3.5" fill={tokens.danger} /></Frame>,
  'prostatic-intraepithelial-neoplasia': <Frame>{prostateBase()}<circle cx="44" cy="49" r="3" fill={tokens.gold} opacity="0.9" /><circle cx="54" cy="46" r="2.8" fill={tokens.gold} opacity="0.8" /></Frame>,
  'sarcoma-prostate': <Frame>{prostateBase()}<path d="M40 40c8-4 18-4 24 4" stroke={tokens.danger} strokeWidth="2.4" fill="none" /><path d="M40 56c10 2 18 0 24-7" stroke={tokens.dangerSoft} strokeWidth="1.8" fill="none" /></Frame>,
  'neuroendocrine-bladder': <Frame>{bladderBase()}<circle cx="40" cy="38" r="3" fill={tokens.gold} /><circle cx="57" cy="39" r="3" fill={tokens.blue} /><circle cx="49" cy="48" r="3" fill={tokens.danger} /></Frame>,
  'wilms-tumor': <Frame>{kidneysBase()}<circle cx="34" cy="40" r="7" fill={tokens.blue} opacity="0.75" /><circle cx="34" cy="40" r="3.5" fill={tokens.gold} opacity="0.8" /></Frame>,
  'adrenal-cancer': <Frame>{kidneysBase()}<circle cx="28" cy="24" r="4.5" fill={tokens.danger} /><circle cx="72" cy="24" r="4.5" fill={tokens.danger} opacity="0.65" /></Frame>,
  'paraganglioma-bladder': <Frame>{bladderBase()}<circle cx="50" cy="35" r="5" fill={tokens.blue} /><path d="M50 27v-7" stroke={tokens.gold} strokeWidth="1.6" /></Frame>,
  'papillary-rcc': <Frame>{kidneysBase()}<circle cx="66" cy="38" r="5" fill={tokens.danger} /><path d="M66 31c0-4 2-7 5-9" stroke={tokens.gold} strokeWidth="1.3" fill="none" strokeDasharray="2 2" /></Frame>,
  'adrenal-incidentaloma': <Frame>{kidneysBase()}<circle cx="28" cy="24" r="4" fill={tokens.gold} /><circle cx="72" cy="24" r="4" fill={tokens.blue} opacity="0.7" /></Frame>,

  'bph': <Frame>{prostateBase()}<ellipse cx="50" cy="49" rx="12" ry="9" fill={tokens.organ} opacity="0.75" /></Frame>,
  'overactive-bladder': <Frame>{bladderBase()}<path d="M27 32c6-8 14-12 23-12" stroke={tokens.teal} strokeWidth="1.8" fill="none" /><path d="M51 20c10 0 18 4 24 12" stroke={tokens.teal} strokeWidth="1.8" fill="none" /></Frame>,
  'stress-incontinence': <Frame>{bladderBase()}<path d="M50 64c0 7 0 11 0 14" stroke={tokens.fluid} strokeWidth="2.2" strokeLinecap="round" /><circle cx="50" cy="82" r="3.3" fill={tokens.fluid} /></Frame>,
  'neurogenic-bladder': <Frame>{bladderBase()}<path d="M50 10v11" stroke={tokens.gold} strokeWidth="1.8" strokeLinecap="round" /><path d="M50 21l-4 5h8z" fill={tokens.gold} /><path d="M34 18c4 5 8 8 16 8" stroke={tokens.blue} strokeWidth="1.4" fill="none" /></Frame>,
  'urinary-retention': <Frame>{bladderBase()}<path d="M50 55v18" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /><path d="M42 67h16" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /></Frame>,
  'interstitial-cystitis': <Frame>{bladderBase()}<circle cx="40" cy="43" r="4" fill={tokens.dangerSoft} /><circle cx="58" cy="48" r="3" fill={tokens.gold} opacity="0.75" /></Frame>,
  'seminal-vesicle-disease': <Frame>{prostateBase()}<ellipse cx="39" cy="34" rx="5" ry="8" fill={tokens.organ} opacity="0.7" /><ellipse cx="61" cy="34" rx="5" ry="8" fill={tokens.organ} opacity="0.7" /></Frame>,
  'prostatic-cyst': <Frame>{prostateBase()}<circle cx="56" cy="50" r="5.5" fill="url(#um-fluid)" opacity="0.8" /><circle cx="56" cy="50" r="3" fill={tokens.white} opacity="0.2" /></Frame>,
  'post-prostatectomy-incontinence': <Frame>{bladderBase()}<path d="M50 60v15" stroke={tokens.fluid} strokeWidth="2.4" strokeLinecap="round" /><circle cx="50" cy="79" r="4" fill={tokens.fluid} /><path d="M42 28l16 0" stroke={tokens.gold} strokeWidth="1.2" opacity="0.7" /></Frame>,
  'bladder-neck-obstruction': <Frame>{bladderBase()}<path d="M44 54h12" stroke={tokens.danger} strokeWidth="2.3" strokeLinecap="round" /><path d="M50 54v16" stroke={tokens.fluid} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" /></Frame>,
  'bladder-outlet-obstruction': <Frame>{bladderBase()}<path d="M40 58h20" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /><path d="M50 58v14" stroke={tokens.fluid} strokeWidth="1.7" strokeLinecap="round" opacity="0.5" /></Frame>,
  'stress-incontinence-male': <Frame>{prostateBase()}<path d="M50 60v12" stroke={tokens.fluid} strokeWidth="2.2" strokeLinecap="round" /><circle cx="50" cy="78" r="3.5" fill={tokens.fluid} /></Frame>,
  'neurogenic-bladder-child': <Frame>{bladderBase()}<circle cx="50" cy="18" r="5" fill={tokens.blue} opacity="0.75" /><path d="M50 23v7" stroke={tokens.gold} strokeWidth="1.6" /></Frame>,
  'nocturia': <Frame>{bladderBase()}<path d="M68 20a8 8 0 1 1-9 11a7 7 0 1 0 9-11Z" fill={tokens.gold} opacity="0.9" /></Frame>,
  'pollakiuria': <Frame>{bladderBase()}<path d="M73 23v9M69 27h8" stroke={tokens.gold} strokeWidth="1.5" strokeLinecap="round" /><path d="M77 42v9M73 46h8" stroke={tokens.gold} strokeWidth="1.5" strokeLinecap="round" /></Frame>,
  'vesicocutaneous-fistula': <Frame>{bladderBase()}<path d="M67 45c10 2 15 8 17 15" stroke={tokens.teal} strokeWidth="2.1" fill="none" /><circle cx="84" cy="63" r="3" fill={tokens.fluid} /></Frame>,
  'urethral-hypersensitivity': <Frame>{urethraBase()}<circle cx="50" cy="52" r="12" fill="none" stroke={tokens.gold} strokeWidth="1.5" strokeDasharray="2 2" /><circle cx="50" cy="52" r="3" fill={tokens.dangerSoft} /></Frame>,
  'bladder-endometriosis': <Frame>{bladderBase()}<circle cx="40" cy="42" r="4" fill={tokens.danger} opacity="0.82" /><circle cx="57" cy="46" r="3" fill={tokens.dangerSoft} opacity="0.8" /></Frame>,
  'chyluria': <Frame>{kidneysBase()}<path d="M50 58v12" stroke={tokens.white} strokeWidth="2.2" strokeLinecap="round" /><circle cx="50" cy="78" r="3.5" fill={tokens.white} opacity="0.9" /></Frame>,
  'upj-obstruction': <Frame>{kidneysBase()}<ellipse cx="31" cy="46" rx="7" ry="9" fill="url(#um-fluid)" opacity="0.5" /><path d="M34 60h7" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /></Frame>,

  'urethral-stricture': <Frame>{urethraBase()}<path d="M44 48h12" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /><path d="M50 38v20" stroke={tokens.fluid} strokeWidth="1.6" opacity="0.45" /></Frame>,
  'vesicoureteral-reflux': <Frame>{bladderBase()}<path d="M39 31c0-5-2-10-7-14" stroke={tokens.teal} strokeWidth="2" fill="none" /><path d="M61 31c0-5 2-10 7-14" stroke={tokens.teal} strokeWidth="2" fill="none" /><path d="M32 17l-4 2 2 4" stroke={tokens.teal} strokeWidth="1.5" fill="none" /><path d="M68 17l4 2-2 4" stroke={tokens.teal} strokeWidth="1.5" fill="none" /></Frame>,
  'hydronephrosis': <Frame>{kidneysBase()}<ellipse cx="31" cy="46" rx="7" ry="9" fill="url(#um-fluid)" opacity="0.55" /><ellipse cx="69" cy="46" rx="7" ry="9" fill="url(#um-fluid)" opacity="0.35" /></Frame>,
  'leukoplakia': <Frame>{bladderBase()}<path d="M39 38h22" stroke={tokens.white} strokeWidth="2" strokeLinecap="round" /><path d="M41 45h18" stroke={tokens.white} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" /></Frame>,
  'retroperitoneal-fibrosis': <Frame>{kidneysBase()}<path d="M38 43h24" stroke={tokens.gold} strokeWidth="2" strokeDasharray="3 2" /><path d="M45 36c3 7 3 14 0 22" stroke={tokens.gold} strokeWidth="1.4" fill="none" /></Frame>,
  'hematuria': <Frame>{bladderBase()}<path d="M50 58v12" stroke={tokens.danger} strokeWidth="2.1" strokeLinecap="round" /><path d="M50 80c3-6 6-8 0-14c-6 6-3 8 0 14Z" fill={tokens.danger} /></Frame>,
  'urogenital-fistula': <Frame>{bladderBase()}<path d="M64 45c7 1 12 5 15 11" stroke={tokens.teal} strokeWidth="2.1" fill="none" /><path d="M67 43c0 5 3 8 8 9" stroke={tokens.gold} strokeWidth="1.2" fill="none" /></Frame>,
  'urethral-diverticulum': <Frame>{urethraBase()}<circle cx="60" cy="50" r="7" fill="url(#um-fluid)" opacity="0.7" /><path d="M50 50h6" stroke={tokens.fluid} strokeWidth="1.6" /></Frame>,
  'paraphimosis': <Frame>{penisBase()}<path d="M50 28c7 0 10 4 10 8" stroke={tokens.danger} strokeWidth="2.4" fill="none" /><circle cx="50" cy="30" r="6.5" fill={tokens.dangerSoft} opacity="0.35" /></Frame>,
  'meatal-stenosis': <Frame>{urethraBase()}<circle cx="50" cy="22" r="3" fill={tokens.dangerSoft} /><circle cx="50" cy="22" r="1.2" fill={tokens.bgOuter} /></Frame>,
  'testicular-torsion': <Frame>{testicleBase()}<path d="M50 34c7 2 10 6 12 12" stroke={tokens.danger} strokeWidth="2.4" fill="none" /><path d="M57 39l2-7 5 4" fill="none" stroke={tokens.danger} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></Frame>,
  'ureteral-stricture-benign': <Frame>{kidneysBase()}<path d="M70 58c-2 6-3 10-4 16" stroke={tokens.organ} strokeWidth="2.4" strokeLinecap="round" /><path d="M67 66h7" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /></Frame>,
  'vesicovaginal-fistula': <Frame>{bladderBase()}<path d="M63 49c7 2 12 7 15 13" stroke={tokens.teal} strokeWidth="2.1" fill="none" /><circle cx="82" cy="66" r="2.8" fill={tokens.fluid} /></Frame>,
  'urethral-caruncle': <Frame>{urethraBase()}<circle cx="50" cy="74" r="5" fill={tokens.dangerSoft} opacity="0.85" /></Frame>,
  'pelvic-fracture-urethral-injury': <Frame>{urethraBase()}<path d="M32 62l10-8M42 62l-10-8" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /><path d="M58 62l10-8M68 62l-10-8" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /></Frame>,
  'penile-fracture': <Frame>{penisBase()}<path d="M43 39l14 14M57 39L43 53" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /></Frame>,
  'scrotal-trauma': <Frame>{testicleBase()}<path d="M32 49l36 18" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /><path d="M37 39l26 25" stroke={tokens.dangerSoft} strokeWidth="1.6" strokeLinecap="round" /></Frame>,
  'urethral-prolapse': <Frame>{urethraBase()}<circle cx="50" cy="75" r="7" fill="none" stroke={tokens.dangerSoft} strokeWidth="2.1" /><circle cx="50" cy="75" r="3" fill={tokens.fluid} /></Frame>,
  'bladder-exstrophy': <Frame>{bladderBase()}<path d="M31 35c4 10 12 16 19 16s15-6 19-16" stroke={tokens.danger} strokeWidth="2.2" fill="none" /><circle cx="50" cy="45" r="8" fill={tokens.dangerSoft} opacity="0.4" /></Frame>,

  'glomerulonephritis': <Frame>{kidneysBase()}<circle cx="31" cy="42" r="4" fill={tokens.gold} opacity="0.8" /><circle cx="69" cy="44" r="4" fill={tokens.gold} opacity="0.6" /></Frame>,
  'ckd': <Frame>{kidneysBase()}<path d="M24 45c6 14 14 20 26 20" stroke={tokens.gold} strokeWidth="1.7" fill="none" strokeDasharray="2 2" /><path d="M76 45c-6 14-14 20-26 20" stroke={tokens.gold} strokeWidth="1.7" fill="none" strokeDasharray="2 2" /></Frame>,
  'nephroptosis': <Frame>{kidneysBase()}<path d="M31 62v8" stroke={tokens.gold} strokeWidth="2.1" strokeLinecap="round" /><path d="M31 75l-4-6h8z" fill={tokens.gold} /></Frame>,
  'renal-cysts': <Frame>{kidneysBase()}<circle cx="31" cy="43" r="6" fill="url(#um-fluid)" opacity="0.7" /><circle cx="69" cy="48" r="5" fill="url(#um-fluid)" opacity="0.55" /></Frame>,
  'renal-abscess': <Frame>{kidneysBase()}<circle cx="31" cy="43" r="7" fill={tokens.gold} opacity="0.8" /><circle cx="31" cy="43" r="3.5" fill={tokens.dangerSoft} /></Frame>,
  'acute-kidney-injury': <Frame>{kidneysBase()}<path d="M50 16l-4 9h5l-3 8 9-11h-5l4-6z" fill={tokens.gold} opacity="0.9" /></Frame>,
  'nephrotic-syndrome': <Frame>{kidneysBase()}<path d="M50 72c4-6 7-8 0-14c-7 6-4 8 0 14Z" fill={tokens.fluid} /><path d="M61 74c3-5 5-7 0-11c-5 4-3 6 0 11Z" fill={tokens.fluid} opacity="0.7" /></Frame>,
  'polycystic-kidney': <Frame>{kidneysBase()}<circle cx="28" cy="39" r="4" fill="url(#um-fluid)" opacity="0.6" /><circle cx="35" cy="49" r="3.5" fill="url(#um-fluid)" opacity="0.55" /><circle cx="66" cy="40" r="4" fill="url(#um-fluid)" opacity="0.6" /><circle cx="72" cy="50" r="3.5" fill="url(#um-fluid)" opacity="0.55" /></Frame>,
  'renal-artery-stenosis': <Frame>{kidneysBase()}<path d="M50 20c-6 5-10 11-12 17" stroke={tokens.danger} strokeWidth="2" fill="none" /><path d="M50 20c6 5 10 11 12 17" stroke={tokens.danger} strokeWidth="2" fill="none" /><path d="M36 33h6" stroke={tokens.gold} strokeWidth="1.5" /><path d="M58 33h6" stroke={tokens.gold} strokeWidth="1.5" /></Frame>,
  'renal-infarction': <Frame>{kidneysBase()}<path d="M28 36l9 16 7-10z" fill={tokens.danger} opacity="0.75" /></Frame>,
  'papillary-necrosis': <Frame>{kidneysBase()}<circle cx="31" cy="49" r="4.5" fill={tokens.gold} opacity="0.85" /><path d="M31 45v8" stroke={tokens.danger} strokeWidth="1.4" /></Frame>,
  'renal-vein-thrombosis': <Frame>{kidneysBase()}<path d="M50 20c4 6 8 12 11 18" stroke={tokens.blue} strokeWidth="2.2" fill="none" /><circle cx="59" cy="33" r="3.5" fill={tokens.dangerSoft} /></Frame>,
  'interstitial-nephritis': <Frame>{kidneysBase()}<circle cx="31" cy="41" r="3" fill={tokens.gold} /><circle cx="36" cy="47" r="2.5" fill={tokens.teal} /><circle cx="66" cy="42" r="3" fill={tokens.gold} /></Frame>,
  'membranous-nephropathy': <Frame>{kidneysBase()}<path d="M24 42c4-4 10-6 14-6" stroke={tokens.gold} strokeWidth="1.6" fill="none" /><path d="M62 42c4-4 10-6 14-6" stroke={tokens.gold} strokeWidth="1.6" fill="none" /></Frame>,
  'iga-nephropathy': <Frame>{kidneysBase()}<circle cx="28" cy="39" r="5" fill={tokens.blue} opacity="0.75" /><text x="28" y="41.8" fontSize="5.8" fill={tokens.white} textAnchor="middle">IgA</text></Frame>,
  'diabetic-nephropathy': <Frame>{kidneysBase()}<path d="M50 17c3-6 8-6 11 0c-3 6-8 6-11 0Z" fill={tokens.dangerSoft} /><path d="M50 14v6M47 17h6" stroke={tokens.white} strokeWidth="1.1" strokeLinecap="round" /></Frame>,
  'analgesic-nephropathy': <Frame>{kidneysBase()}<rect x="44" y="12" width="12" height="6" rx="3" fill={tokens.gold} /><path d="M44 15h12" stroke={tokens.white} strokeWidth="1" /></Frame>,
  'renal-trauma': <Frame>{kidneysBase()}<path d="M22 35l18 18" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /><path d="M27 28l12 13" stroke={tokens.dangerSoft} strokeWidth="1.6" strokeLinecap="round" /></Frame>,
  'ureteral-trauma': <Frame>{kidneysBase()}<path d="M66 60c3 5 4 11 4 17" stroke={tokens.organ} strokeWidth="2.3" /><path d="M68 66l8 8" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /></Frame>,
  'hypercalciuria': <Frame>{kidneysBase()}<circle cx="50" cy="16" r="5" fill={tokens.gold} /><text x="50" y="18.6" fontSize="6" fill={tokens.bgOuter} textAnchor="middle">Ca</text></Frame>,
  'hyperoxaluria': <Frame>{kidneysBase()}<circle cx="50" cy="16" r="5" fill={tokens.gold} /><text x="50" y="18.6" fontSize="5.4" fill={tokens.bgOuter} textAnchor="middle">Ox</text></Frame>,
  'cystinuria': <Frame>{kidneysBase()}<polygon points="50,16 54,20 50,24 46,20" fill={tokens.gold} /><polygon points="50,28 54,32 50,36 46,32" fill={tokens.gold} opacity="0.75" /></Frame>,
  'hyperuricosuria': <Frame>{kidneysBase()}<circle cx="50" cy="16" r="5" fill={tokens.gold} /><text x="50" y="18.4" fontSize="4.8" fill={tokens.bgOuter} textAnchor="middle">UA</text></Frame>,
  'renal-angiomyolipoma': <Frame>{kidneysBase()}<circle cx="31" cy="43" r="6" fill={tokens.gold} opacity="0.85" /><circle cx="31" cy="43" r="3" fill={tokens.organ} opacity="0.65" /></Frame>,

  'bladder-pain-syndrome': <Frame>{bladderBase()}<path d="M32 48c6-10 30-10 36 0" stroke={tokens.danger} strokeWidth="2.2" fill="none" /><path d="M40 56c4-4 16-4 20 0" stroke={tokens.gold} strokeWidth="1.4" fill="none" /></Frame>,
  'malakoplakia': <Frame>{bladderBase()}<circle cx="40" cy="40" r="3.8" fill={tokens.gold} /><circle cx="50" cy="45" r="3.8" fill={tokens.gold} opacity="0.75" /><circle cx="60" cy="40" r="3.8" fill={tokens.gold} opacity="0.55" /></Frame>,

  'erectile-dysfunction': <Frame>{penisBase()}<path d="M67 25v25" stroke={tokens.danger} strokeWidth="2.3" strokeLinecap="round" /><path d="M63 46l4 6 4-6" fill={tokens.danger} /></Frame>,
  'premature-ejaculation': <Frame><circle cx="50" cy="46" r="24" fill="none" stroke={tokens.gold} strokeWidth="2" /><path d="M50 46l0-14" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /><path d="M50 46l10 0" stroke={tokens.gold} strokeWidth="1.6" strokeLinecap="round" /><text x="50" y="54" textAnchor="middle" fontSize="12" fill={tokens.dangerSoft}>1m</text></Frame>,
  'peyronie': <Frame>{penisBase()}<path d="M50 18c1 7 3 14 5 20 2 8 1 15-5 24" stroke={tokens.organ} strokeWidth="9" strokeLinecap="round" fill="none" /><ellipse cx="55" cy="38" rx="5" ry="7" fill={tokens.gold} opacity="0.7" /></Frame>,
  'priapism': <Frame>{penisBase()}<path d="M50 18c0 12 0 24 0 36" stroke={tokens.danger} strokeWidth="3.2" strokeLinecap="round" fill="none" /><circle cx="50" cy="18" r="5" fill={tokens.dangerSoft} opacity="0.8" /></Frame>,
  'cavernous-fibrosis': <Frame>{penisBase()}<path d="M47 26c4 10 4 20 0 31" stroke={tokens.gold} strokeWidth="1.8" fill="none" strokeDasharray="2 2" /><path d="M53 24c4 11 4 21 0 34" stroke={tokens.gold} strokeWidth="1.8" fill="none" strokeDasharray="2 2" /></Frame>,
  'chronic-prostatitis-cpps': <Frame>{prostateBase()}<path d="M38 54c7-7 17-7 24 0" stroke={tokens.dangerSoft} strokeWidth="2.2" fill="none" /><path d="M43 59c4-3 10-3 14 0" stroke={tokens.gold} strokeWidth="1.3" fill="none" /></Frame>,
  'orchialgia': <Frame>{testicleBase()}<path d="M36 61c3-6 9-9 14-9" stroke={tokens.danger} strokeWidth="2" fill="none" /><path d="M31 67c6-3 12-3 18 0" stroke={tokens.dangerSoft} strokeWidth="1.4" fill="none" /></Frame>,
  'funiculitis': <Frame>{testicleBase()}<path d="M50 26c0 9-1 15-2 22" stroke={tokens.danger} strokeWidth="2.4" fill="none" /><path d="M46 28h8" stroke={tokens.gold} strokeWidth="1.4" /></Frame>,
  'spermatorrhea': <Frame>{testicleBase()}<path d="M50 56v15" stroke={tokens.fluid} strokeWidth="2.2" strokeLinecap="round" /><circle cx="50" cy="76" r="3.2" fill={tokens.fluid} /></Frame>,
  'aspermatism': <Frame>{testicleBase()}<path d="M44 72h12" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /><path d="M50 56v15" stroke={tokens.fluid} strokeWidth="1.6" opacity="0.4" /></Frame>,
  'penile-trauma': <Frame>{penisBase()}<path d="M42 40l16 16" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /><path d="M58 40L42 56" stroke={tokens.danger} strokeWidth="2.4" strokeLinecap="round" /></Frame>,
  'penile-lichen-sclerosus': <Frame>{penisBase()}<path d="M44 28c3-2 9-2 12 0" stroke={tokens.white} strokeWidth="2.2" strokeLinecap="round" /><path d="M45 36c3-1 7-1 10 0" stroke={tokens.white} strokeWidth="1.6" strokeLinecap="round" opacity="0.85" /></Frame>,
  'delayed-ejaculation': <Frame><circle cx="50" cy="46" r="24" fill="none" stroke={tokens.gold} strokeWidth="2" /><path d="M50 46l0-8" stroke={tokens.gold} strokeWidth="2" strokeLinecap="round" /><path d="M50 46l13 7" stroke={tokens.blue} strokeWidth="1.6" strokeLinecap="round" /><text x="50" y="54" textAnchor="middle" fontSize="10" fill={tokens.blue}>slow</text></Frame>,
  'anejaculation': <Frame>{testicleBase()}<path d="M50 56v14" stroke={tokens.fluid} strokeWidth="1.8" opacity="0.5" /><path d="M43 74h14" stroke={tokens.danger} strokeWidth="2.2" strokeLinecap="round" /></Frame>,
  'retrograde-ejaculation': <Frame>{testicleBase()}<path d="M50 54v-18" stroke={tokens.fluid} strokeWidth="2.2" strokeLinecap="round" /><path d="M46 40l4-6 4 6" fill={tokens.fluid} /></Frame>,
  'hematospermia': <Frame>{testicleBase()}<path d="M50 56v14" stroke={tokens.fluid} strokeWidth="2" strokeLinecap="round" /><circle cx="50" cy="75" r="3.6" fill={tokens.danger} /></Frame>,
  'post-vasectomy-pain': <Frame>{testicleBase()}<path d="M35 40l7 8" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /><path d="M65 40l-7 8" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /></Frame>,
  'male-pelvic-floor-dysfunction': <Frame>{prostateBase()}<path d="M38 63c6-4 18-4 24 0" stroke={tokens.gold} strokeWidth="2" fill="none" /><path d="M42 68c4-2 12-2 16 0" stroke={tokens.teal} strokeWidth="1.4" fill="none" /></Frame>,
  'penile-mondor-disease': <Frame>{penisBase()}<path d="M55 24c4 8 4 17 1 28" stroke={tokens.blue} strokeWidth="2.3" fill="none" /><circle cx="56" cy="38" r="3" fill={tokens.dangerSoft} /></Frame>,
  'male-genital-lichen-planus': <Frame>{penisBase()}<circle cx="48" cy="31" r="3.2" fill={tokens.white} /><circle cx="54" cy="38" r="2.8" fill={tokens.white} opacity="0.85" /></Frame>,
  'chronic-bacterial-prostatitis': <Frame>{prostateBase()}{addDanger(44, 47, 3.8)}<circle cx="57" cy="50" r="2.4" fill={tokens.gold} opacity="0.7" /></Frame>,

  'male-infertility': <Frame>{testicleBase()}<circle cx="40" cy="59" r="1.4" fill={tokens.fluid} opacity="0.45" /><circle cx="48" cy="63" r="1.2" fill={tokens.fluid} opacity="0.35" /><text x="50" y="28" textAnchor="middle" fontSize="14" fill={tokens.gold}>?</text></Frame>,
  'varicocele': <Frame>{testicleBase()}<path d="M40 26c-3 8-4 17-1 26" stroke={tokens.danger} strokeWidth="3" fill="none" opacity="0.8" /><path d="M46 24c-2 8-2 16 0 24" stroke={tokens.danger} strokeWidth="2.2" fill="none" opacity="0.55" /><path d="M52 24c1 7 1 15-1 23" stroke={tokens.danger} strokeWidth="1.8" fill="none" opacity="0.45" /></Frame>,
  'cryptorchidism': <Frame>{testicleBase()}<ellipse cx="62" cy="34" rx="8" ry="10" {...organStroke} opacity="0.78" /><path d="M58 20c0 6 2 10 4 14" stroke={tokens.gold} strokeWidth="1.6" fill="none" strokeDasharray="2 2" /></Frame>,
  'oligospermia': <Frame>{testicleBase()}<circle cx="40" cy="60" r="1.4" fill={tokens.fluid} opacity="0.45" /><circle cx="60" cy="61" r="1.3" fill={tokens.fluid} opacity="0.4" /></Frame>,
  'azoospermia': <Frame>{testicleBase()}<path d="M40 60c7-4 13-4 20 0" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /><path d="M42 66h16" stroke={tokens.dangerSoft} strokeWidth="1.5" strokeLinecap="round" /></Frame>,
  'teratozoospermia': <Frame>{testicleBase()}<path d="M40 58c2-4 6-5 10-3" stroke={tokens.fluid} strokeWidth="1.6" fill="none" /><circle cx="52" cy="57" r="2.2" fill={tokens.dangerSoft} /></Frame>,
  'asthenozoospermia': <Frame>{testicleBase()}<path d="M40 58c2 0 4 2 5 5" stroke={tokens.fluid} strokeWidth="1.6" fill="none" /><path d="M55 58c1 0 2 1 3 2" stroke={tokens.fluid} strokeWidth="1.4" fill="none" opacity="0.55" /></Frame>,
  'leukocytospermia': <Frame>{testicleBase()}<circle cx="43" cy="56" r="3" fill={tokens.gold} /><circle cx="58" cy="59" r="3" fill={tokens.gold} opacity="0.75" /></Frame>,
  'varicocele-recurrence': <Frame>{testicleBase()}<path d="M40 26c-3 8-4 17-1 26" stroke={tokens.danger} strokeWidth="3" fill="none" opacity="0.8" /><path d="M58 28c4 2 7 6 8 11" stroke={tokens.gold} strokeWidth="1.6" fill="none" strokeDasharray="2 2" /></Frame>,
  'male-contraception': <Frame>{testicleBase()}<path d="M45 38l10 10" stroke={tokens.gold} strokeWidth="2" strokeLinecap="round" /><path d="M55 38L45 48" stroke={tokens.gold} strokeWidth="2" strokeLinecap="round" /></Frame>,
  'ejaculatory-duct-obstruction': <Frame>{prostateBase()}<path d="M42 34l8 8" stroke={tokens.danger} strokeWidth="1.8" /><path d="M58 34l-8 8" stroke={tokens.danger} strokeWidth="1.8" /></Frame>,
  'fertility-preservation-male': <Frame>{testicleBase()}<path d="M72 20v16h-10" stroke={tokens.gold} strokeWidth="1.8" fill="none" /><path d="M62 20h10v10" stroke={tokens.gold} strokeWidth="1.8" fill="none" /></Frame>,

  'hypogonadism': <Frame>{testicleBase()}<path d="M38 40v-10" stroke={tokens.danger} strokeWidth="2" /><path d="M62 40v-10" stroke={tokens.danger} strokeWidth="2" /><text x="38" y="26" fontSize="7" fill={tokens.gold} textAnchor="middle">T</text><text x="62" y="26" fontSize="7" fill={tokens.gold} textAnchor="middle">T</text></Frame>,
  'male-climacterium': <Frame>{testicleBase()}<path d="M34 24c10-6 22-6 32 0" stroke={tokens.gold} strokeWidth="1.6" fill="none" /><path d="M66 24l-4 4" stroke={tokens.gold} strokeWidth="1.4" /><path d="M66 24l-1 5" stroke={tokens.gold} strokeWidth="1.4" /></Frame>,
  'hyperprolactinemia-male': <Frame>{prostateBase()}<circle cx="50" cy="18" r="5" fill={tokens.blue} /><text x="50" y="20.2" fontSize="4.8" fill={tokens.white} textAnchor="middle">PRL</text></Frame>,
  'hyperthyroidism-ed': <Frame>{penisBase()}<path d="M68 22l4 8-8 0z" fill={tokens.gold} /><path d="M64 30h8" stroke={tokens.gold} strokeWidth="1.6" /></Frame>,
  'metabolic-syndrome-ed': <Frame>{penisBase()}<circle cx="68" cy="24" r="6" fill={tokens.gold} opacity="0.8" /><path d="M64 24h8" stroke={tokens.bgOuter} strokeWidth="1.2" /><path d="M68 20v8" stroke={tokens.bgOuter} strokeWidth="1.2" /></Frame>,
  'kallmann-syndrome': <Frame>{testicleBase()}<circle cx="50" cy="18" r="5" fill={tokens.blue} opacity="0.8" /><path d="M50 23v6" stroke={tokens.gold} strokeWidth="1.5" /></Frame>,
  'klein-felter': <Frame>{testicleBase()}<text x="50" y="22" fontSize="9" fill={tokens.gold} textAnchor="middle">XXY</text></Frame>,
  'subclinical-hypogonadism': <Frame>{testicleBase()}<path d="M50 18h10" stroke={tokens.gold} strokeWidth="1.5" strokeDasharray="2 2" /><text x="40" y="20" fontSize="6" fill={tokens.gold} textAnchor="middle">T?</text></Frame>,
  'androgen-resistance-syndrome': <Frame>{testicleBase()}<circle cx="50" cy="18" r="5" fill={tokens.gold} opacity="0.8" /><path d="M57 18h8" stroke={tokens.danger} strokeWidth="2" strokeLinecap="round" /></Frame>,
  'male-osteoporosis-hypogonadism': <Frame>{testicleBase()}<path d="M72 54l6 6M78 54l-6 6" stroke={tokens.white} strokeWidth="1.8" strokeLinecap="round" /><path d="M75 46v22" stroke={tokens.white} strokeWidth="1.2" opacity="0.7" /></Frame>,
  'enuresis': <Frame>{bladderBase()}<path d="M50 58v12" stroke={tokens.fluid} strokeWidth="2.2" /><circle cx="46" cy="76" r="3" fill={tokens.fluid} /><circle cx="54" cy="81" r="2.5" fill={tokens.fluid} opacity="0.7" /></Frame>,
  'phimosis': <Frame>{penisBase()}<circle cx="50" cy="28" r="7" fill="none" stroke={tokens.organDark} strokeWidth="3" /><circle cx="50" cy="28" r="2" fill={tokens.dangerSoft} /></Frame>,
  'hydrocele': <Frame>{testicleBase()}<ellipse cx="50" cy="60" rx="22" ry="24" fill="url(#um-fluid)" opacity="0.16" /><ellipse cx="50" cy="60" rx="19" ry="21" fill="none" stroke={tokens.fluid} strokeWidth="2" /></Frame>,
  'hypospadias': <Frame>{penisBase()}<circle cx="46" cy="52" r="3" fill={tokens.dangerSoft} /><path d="M46 55l-5 8" stroke={tokens.fluid} strokeWidth="1.6" fill="none" /></Frame>,
  'spermatocele': <Frame>{testicleBase()}<circle cx="50" cy="33" r="8" fill="url(#um-fluid)" opacity="0.72" /><circle cx="50" cy="33" r="5" fill={tokens.white} opacity="0.12" /></Frame>,
  'balanoposthitis': <Frame>{penisBase()}{addDanger(50, 28, 5)}<path d="M44 21c3-2 9-2 12 0" stroke={tokens.dangerSoft} strokeWidth="1.7" fill="none" /></Frame>,
};

const aliases = {
  'xanthogranulomatous-pyelonephritis': 'pyelonephritis',
  'emphysematous-pyelonephritis': 'pyelonephritis',
  'renal-tuberculosis': 'pyelonephritis',
  'actinomycosis-gu': 'urethritis',
  'urethral-syndrome': 'urethritis',
  'overactive-bladder': 'bladder-pain-syndrome',
  'stress-incontinence': 'stress-incontinence-male',
  'stress-incontinence-male': 'stress-incontinence',
  'seminal-vesicle-disease': 'prostatovesiculitis',
  'prostatic-cyst': 'prostatic-intraepithelial-neoplasia',
  'vesicovaginal-fistula': 'urogenital-fistula',
  'urethral-diverticulum': 'urethral-caruncle',
  'leukoplakia': 'bladder-pain-syndrome',
  'retroperitoneal-fibrosis': 'ureteral-stricture-benign',
  'nephroptosis': 'ckd',
  'renal-cysts': 'renal-angiomyolipoma',
  'acute-kidney-injury': 'renal-infarction',
  'polycystic-kidney': 'renal-cysts',
  'membranous-nephropathy': 'glomerulonephritis',
  'iga-nephropathy': 'glomerulonephritis',
  'interstitial-nephritis': 'glomerulonephritis',
  'hypercalciuria': 'hyperoxaluria',
  'cystinuria': 'hyperoxaluria',
  'analgesic-nephropathy': 'diabetic-nephropathy',
  'orchitis': 'epididymitis',
  'funiculitis': 'orchialgia',
  'aspermatism': 'anejaculation',
  'oligospermia': 'male-infertility',
  'azoospermia': 'male-infertility',
  'teratozoospermia': 'male-infertility',
  'asthenozoospermia': 'male-infertility',
  'leukocytospermia': 'male-infertility',
  'male-contraception': 'fertility-preservation-male',
  'male-climacterium': 'subclinical-hypogonadism',
  'hyperprolactinemia-male': 'subclinical-hypogonadism',
  'hyperthyroidism-ed': 'metabolic-syndrome-ed',
  'kallmann-syndrome': 'hypogonadism',
  'klein-felter': 'androgen-resistance-syndrome',
  'enuresis': 'stress-incontinence',
  'hydrocele': 'spermatocele',
  'hypospadias': 'phimosis',
};

Object.entries(aliases).forEach(([id, sourceId]) => {
  if (!icons[id] && icons[sourceId]) {
    icons[id] = icons[sourceId];
  }
});

export const diseaseIcons = icons;

export default diseaseIcons;
