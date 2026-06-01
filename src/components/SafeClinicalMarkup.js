import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_ALLOWED_TAGS = [
  'b',
  'br',
  'code',
  'em',
  'i',
  'mark',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
];

const stripMarkup = (value) => String(value || '').replace(/<[^>]*>/g, '');

export function sanitizeClinicalHtml(html, allowedTags = DEFAULT_ALLOWED_TAGS) {
  const source = String(html || '');
  if (!source) return '';

  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return stripMarkup(source);
  }

  const allowed = new Set(allowedTags.map((tag) => tag.toLowerCase()));
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(`<body>${source}</body>`, 'text/html');

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return doc.createTextNode(node.textContent || '');
    if (node.nodeType !== Node.ELEMENT_NODE) return doc.createTextNode('');

    const tagName = node.tagName.toLowerCase();
    if (!allowed.has(tagName)) {
      const fragment = doc.createDocumentFragment();
      node.childNodes.forEach((child) => fragment.appendChild(sanitizeNode(child)));
      return fragment;
    }

    const element = doc.createElement(tagName);
    if (tagName === 'span' && node.classList.contains('clinical-muted')) {
      element.className = 'clinical-muted';
    }

    node.childNodes.forEach((child) => element.appendChild(sanitizeNode(child)));
    return element;
  };

  const output = doc.createElement('div');
  doc.body.childNodes.forEach((node) => output.appendChild(sanitizeNode(node)));
  return output.innerHTML;
}

export default function SafeClinicalMarkup({
  html,
  allowedTags = DEFAULT_ALLOWED_TAGS,
  fallbackText = '',
  as: Component = 'span',
  className = '',
  sourceId = '',
}) {
  const sanitized = useMemo(
    () => sanitizeClinicalHtml(html, allowedTags),
    [html, allowedTags],
  );
  const safeHtml = sanitized || fallbackText || '';

  return (
    <Component
      className={className || undefined}
      data-safe-clinical-markup="true"
      data-source-id={sourceId || undefined}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

SafeClinicalMarkup.propTypes = {
  html: PropTypes.string,
  allowedTags: PropTypes.arrayOf(PropTypes.string),
  fallbackText: PropTypes.string,
  as: PropTypes.elementType,
  className: PropTypes.string,
  sourceId: PropTypes.string,
};
