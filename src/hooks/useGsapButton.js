import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGsapButton() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { transformOrigin: 'center center' });

    const tl = gsap
      .timeline({ paused: true })
      .to(el, { scale: 1.04, duration: 0.18, ease: 'power2.out' });

    function onEnter() {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      tl.play();
    }

    function onLeave() {
      tl.reverse();
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      tl.kill();
      gsap.set(el, { clearProps: 'transform' });
    };
  }, []);

  return ref;
}
