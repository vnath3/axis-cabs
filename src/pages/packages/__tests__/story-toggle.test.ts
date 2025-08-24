import { describe, it, expect } from 'vitest';
import { render } from 'astro/test';
import Page from '../[slug].astro';
import { packages } from '@/data/packages';

describe('package story toggle', () => {
  it('wraps story section in a details element', async () => {
    const slug = packages.find(p => p.story)?.slug as string;
    const { getByText } = await render(Page, { params: { slug } });
    const summary = getByText('Story');
    expect(summary.parentElement?.tagName).toBe('DETAILS');
  });
});

