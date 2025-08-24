import { describe, it, expect } from 'vitest';

class ClassList {
  private set = new Set<string>();
  add(...cls: string[]) {
    cls.forEach(c => this.set.add(c));
  }
  remove(...cls: string[]) {
    cls.forEach(c => this.set.delete(c));
  }
  contains(cls: string) {
    return this.set.has(cls);
  }
  toggle(cls: string, force?: boolean) {
    if (force === undefined) {
      if (this.set.has(cls)) {
        this.set.delete(cls);
        return false;
      }
      this.set.add(cls);
      return true;
    }
    if (force) {
      this.set.add(cls);
      return true;
    }
    this.set.delete(cls);
    return false;
  }
}

interface Card {
  dataset: { title: string; tags: string };
  classList: ClassList;
}

interface Button {
  dataset: { filterTag: string };
  classList: ClassList;
}

function setup() {
  const search = { value: '' };
  const cards: Card[] = [
    { dataset: { title: 'Beach Paradise', tags: 'beach' }, classList: new ClassList() },
    { dataset: { title: 'Mountain Adventure', tags: 'mountain' }, classList: new ClassList() }
  ];
  const buttons: Button[] = [
    { dataset: { filterTag: 'beach' }, classList: new ClassList() },
    { dataset: { filterTag: 'mountain' }, classList: new ClassList() }
  ];

  const getActive = () => buttons.find(b => b.classList.contains('active')) ?? null;

  const applyFilters = () => {
    const q = search.value.toLowerCase();
    const active = getActive()?.dataset.filterTag;
    cards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const tags = card.dataset.tags.split(',');
      const matchesQ = title.includes(q);
      const matchesTag = !active || tags.includes(active);
      card.classList.toggle('hidden', !(matchesQ && matchesTag));
    });
  };

  const click = (btn: Button) => {
    if (btn.classList.contains('active')) {
      btn.classList.remove('active', 'bg-orange-600', 'text-white');
    } else {
      buttons.forEach(b => b.classList.remove('active', 'bg-orange-600', 'text-white'));
      btn.classList.add('active', 'bg-orange-600', 'text-white');
    }
    applyFilters();
  };

  return { search, cards, buttons, applyFilters, click };
}

describe('packages page filters', () => {
  it('filters cards based on search input', () => {
    const { search, cards, applyFilters } = setup();
    search.value = 'beach';
    applyFilters();
    expect(cards[0].classList.contains('hidden')).toBe(false);
    expect(cards[1].classList.contains('hidden')).toBe(true);
  });

  it('filters cards based on tag button', () => {
    const { cards, buttons, click } = setup();
    const [beachBtn] = buttons;
    click(beachBtn);
    expect(cards[0].classList.contains('hidden')).toBe(false);
    expect(cards[1].classList.contains('hidden')).toBe(true);
    click(beachBtn);
    expect(cards[0].classList.contains('hidden')).toBe(false);
    expect(cards[1].classList.contains('hidden')).toBe(false);
  });
});

