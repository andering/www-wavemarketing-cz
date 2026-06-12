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

  it('keeps omitted launch features disabled', () => {
    expect(siteContent.launchExclusions.references).toBe(true);
    expect(siteContent.launchExclusions.contactForm).toBe(true);
    expect(siteContent.launchExclusions.socialLinks).toBe(true);
  });
});
