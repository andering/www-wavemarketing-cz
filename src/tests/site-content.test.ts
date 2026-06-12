import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteContent } from '../data/site';

describe('siteContent', () => {
  it('contains approved launch navigation only', () => {
    expect(siteContent.navigation.map((item) => item.label)).toEqual([
      'Úvod',
      'Naše služby',
      'Kontakt'
    ]);
    expect(siteContent.navigation.some((item) => item.label === 'Reference')).toBe(false);
  });

  it('contains key contact facts', () => {
    expect(siteContent.contact.person.name).toBe('Jana Skalníková');
    expect(siteContent.contact.person.phoneDisplay).toBe('605 461 440');
    expect(siteContent.contact.person.phoneHref).toBe('tel:+420605461440');
    expect(siteContent.contact.email.href).toBe('mailto:jana.skalnikova@wavemarketing.cz');
  });

  it('records resolved production asset paths', () => {
    expect(siteContent.assets.logo).toBe('/assets/wave-marketing-logo.png');
    expect(siteContent.assets.janaPhoto).toBe('/assets/jana-skalnikova-photo.png');
  });

  it('points to existing public assets', () => {
    for (const assetPath of [siteContent.assets.logo, siteContent.assets.janaPhoto]) {
      const publicPath = assetPath.replace(/^\//, '');
      expect(existsSync(join(process.cwd(), 'public', publicPath))).toBe(true);
    }
  });

  it('keeps omitted launch features disabled', () => {
    expect(siteContent.launchExclusions.references).toBe(true);
    expect(siteContent.launchExclusions.contactForm).toBe(true);
    expect(siteContent.launchExclusions.socialLinks).toBe(true);
    expect(siteContent.launchExclusions.legalPlaceholderLinks).toBe(true);
  });

  it('does not contain forbidden launch content', () => {
    const serialized = JSON.stringify(siteContent);

    expect(serialized).not.toContain('Reference');
    expect(serialized).not.toContain('Acme Corp');
    expect(serialized).not.toContain('Globex');
    expect(serialized).not.toContain('+150%');
    expect(serialized).not.toContain('GDPR');
    expect(serialized).not.toContain('Obchodní podmínky');
    expect(serialized).not.toContain('instagram.com');
    expect(serialized).not.toContain('facebook.com');
    expect(serialized).not.toContain('linkedin.com');
  });
});
