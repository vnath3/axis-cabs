import { describe, it, expect } from 'vitest';
import { render } from 'astro/test';
import StoryQuoteToggle from '../StoryQuoteToggle.astro';

describe('StoryQuoteToggle', () => {
  it('renders both story and quote views', async () => {
    const story = {
      type: 'editorial-split' as const,
      image: { src: '/img.jpg', alt: 'alt text' },
      blocks: [{ body: 'split body' }]
    };
    const quote = {
      image: { src: '/img2.jpg', alt: 'alt text' },
      quote: 'a quote',
      attribution: 'Someone'
    };
    const { getByText } = await render(StoryQuoteToggle, { props: { story, quote } });
    expect(getByText('split body')).toBeDefined();
    expect(getByText('a quote')).toBeDefined();
  });
});
