// Site-wide behaviour: entrance reveals and the pointer-following light on buttons.
import { gsap } from 'gsap';

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const root = document.documentElement;

// Buttons: the highlight follows the pointer (lighting only, the button never moves).
document.addEventListener(
  'pointermove',
  (event) => {
    const target = event.target as Element | null;
    const btn = target?.closest?.<HTMLElement>('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    btn.style.setProperty('--my', `${event.clientY - rect.top}px`);
  },
  { passive: true },
);

// Entrances: elements marked data-reveal rise into place the first time they enter the viewport.
// Elements entering together are staggered in document order (heading, then text, then picture).
if (root.classList.contains('motion')) {
  window.__motionReady = true;
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const order = new Map(items.map((el, i) => [el, i]));

  const reveal = (els: HTMLElement[]) => {
    els.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.075,
      onComplete: () => {
        for (const el of els) {
          el.classList.add('is-in');
          gsap.set(el, { clearProps: 'opacity,transform' });
        }
      },
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (!entering.length) return;
      entering.forEach((el) => io.unobserve(el));
      reveal(entering);
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  );

  items.forEach((el) => io.observe(el));
}
