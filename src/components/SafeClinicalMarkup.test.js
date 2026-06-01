import { sanitizeClinicalHtml } from './SafeClinicalMarkup';

describe('SafeClinicalMarkup', () => {
  it('keeps safe clinical inline tags', () => {
    expect(sanitizeClinicalHtml('A <strong>red flag</strong><br><em>urgent</em>')).toBe(
      'A <strong>red flag</strong><br><em>urgent</em>',
    );
  });

  it('removes scripts, handlers and unsafe links', () => {
    const html = '<img src=x onerror=alert(1)>Safe <script>alert(1)</script><a href="javascript:alert(1)">bad</a><strong onclick="alert(1)">ok</strong>';
    const sanitized = sanitizeClinicalHtml(html);

    expect(sanitized).toContain('Safe');
    expect(sanitized).toContain('<strong>ok</strong>');
    expect(sanitized).not.toContain('script');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('<a');
    expect(sanitized).not.toContain('<img');
  });
});
