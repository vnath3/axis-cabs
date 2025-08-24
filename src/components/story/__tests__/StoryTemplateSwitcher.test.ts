import { describe, it, expect } from 'vitest';
import { render } from 'astro/test';
import StoryTemplateSwitcher from '../StoryTemplateSwitcher.astro';

describe('StoryTemplateSwitcher', () => {
  it('renders EditorialSplit layout', async () => {
    const data = {
      type: 'editorial-split' as const,
      image: { src: '/img.jpg', alt: 'alt text' },
      blocks: [{ body: 'split body' }]
    };
    const { getByText } = await render(StoryTemplateSwitcher, { props: { data } });
    expect(getByText('split body')).toBeDefined();
  });

  it('renders QuoteOverlay layout', async () => {
    const data = {
      type: 'quote-overlay' as const,
      image: { src: '/img.jpg', alt: 'alt text' },
      quote: 'a quote',
      attribution: 'Someone'
    };
    const { getByText } = await render(StoryTemplateSwitcher, { props: { data } });
    expect(getByText('a quote')).toBeDefined();
    expect(getByText('Someone')).toBeDefined();
  });
});
