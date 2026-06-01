import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://uromed.app';

function buildCanonicalPath(activeSection, activeSubsection, selectedDisease) {
  if (selectedDisease?.id) {
    return `/${[selectedDisease.section, selectedDisease.subsection, selectedDisease.id].filter(Boolean).join('/')}`;
  }

  if (!activeSection || activeSection === 'home') {
    return '/';
  }

  return `/${[activeSection, activeSubsection].filter(Boolean).join('/')}`;
}

function getRobotsValue(activeSection) {
  return activeSection === 'favorites' ? 'noindex, nofollow' : 'index, follow';
}

export default function SeoHelmet({
  pageTitle,
  pageDescription,
  keywords,
  selectedDisease,
  activeSection,
  activeSubsection,
}) {
  const canonicalPath = buildCanonicalPath(activeSection, activeSubsection, selectedDisease);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const robots = getRobotsValue(activeSection);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="UroMed" />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="UroMed" />
      <meta property="og:locale" content="ru_RU" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />

      {selectedDisease ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: selectedDisease.name,
            description: pageDescription,
            url: canonicalUrl,
            medicalCondition: {
              '@type': 'MedicalCondition',
              name: selectedDisease.name,
              icd10Code: selectedDisease.icd,
            },
            about: {
              '@type': 'Thing',
              name: selectedDisease.name,
              description: `Medical condition: ${selectedDisease.name}, ICD-10: ${selectedDisease.icd}`,
            },
            genre: 'Medical reference',
            inLanguage: 'ru',
            dateCreated: '2024-01-01',
            dateModified: new Date().toISOString().split('T')[0],
          })}
        </script>
      ) : (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'UroMed',
            description: 'Medical reference for urology and andrology',
            url: SITE_URL,
            publisher: {
              '@type': 'Organization',
              name: 'UroMed',
              description: 'Evidence-based urology and andrology platform',
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
            inLanguage: 'ru',
          })}
        </script>
      )}
    </Helmet>
  );
}

SeoHelmet.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  pageDescription: PropTypes.string.isRequired,
  keywords: PropTypes.string.isRequired,
  selectedDisease: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    icd: PropTypes.string,
    section: PropTypes.string,
    subsection: PropTypes.string,
  }),
  activeSection: PropTypes.string,
  activeSubsection: PropTypes.string,
};

SeoHelmet.defaultProps = {
  selectedDisease: null,
  activeSection: 'home',
  activeSubsection: null,
};
