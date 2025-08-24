import { gaEvent } from './ga';

export function packagesQuoteOpen(props: Record<string, any>) {
  gaEvent('packages_quote_open', props);
}

export function packagesStoryToggle(props: Record<string, any>) {
  gaEvent('packages_story_toggle', props);
}

export function packagesReviewsScroll(props: Record<string, any>) {
  gaEvent('packages_reviews_scroll', props);
}

export function packagesStickyCtaClick(props: Record<string, any>) {
  gaEvent('packages_sticky_cta_click', props);
}

export function packagesWhatsappClick(props: Record<string, any>) {
  gaEvent('packages_whatsapp_click', props);
}
