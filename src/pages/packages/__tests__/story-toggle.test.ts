import { describe, it } from 'vitest';
import { render } from 'astro/test';
import Page from '../[slug].astro';
import { packages } from '@/data/packages';
import { expect } from 'vitest';

describe('package story toggle', () => {
  it('renders story toggle buttons', async () => {
    const slug = packages[0].slug;
    const { getByText } = await render(Page, { params: { slug } });
    expect(getByText('Visual highlights')).toBeTruthy();
    expect(getByText('Detailed narrative')).toBeTruthy();
  });
});
