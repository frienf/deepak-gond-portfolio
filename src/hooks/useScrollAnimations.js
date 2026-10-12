import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/** Resolve all reveal elements to their final state with no animation. */
function showEverything(scope) {
  scope.querySelectorAll('.js-reveal').forEach((el) => el.classList.add('is-visible'));
}

/**
 * Anything already on screen is shown straight away. Without this, landing on
 * a deep link such as /#projects leaves that section's cards at opacity 0
 * until the reader happens to scroll.
 */
function revealWhatIsAlreadyVisible(scope) {
  const onScreen = gsap.utils.toArray(scope.querySelectorAll('.js-reveal:not(.skill-group)')).filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
  });
  if (onScreen.length) {
    gsap.to(onScreen, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, overwrite: true });
  }
}

/**
 * All scroll choreography for the page, set up once after mount.
 *
 * Rules: native scrolling is never replaced, nothing is pinned, and with
 * reduced motion requested every element is simply shown.
 *
 * @param {React.RefObject<HTMLElement>} scopeRef  element containing the page
 * @param {object|null} pipeline  3D scene handles, once WebGL has started
 */
export function useScrollAnimations(scopeRef, pipeline) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    if (reduced) {
      showEverything(scope);
      return undefined;
    }

    // gsap.context scopes every tween and trigger so one revert() cleans up
    // the whole set - including on StrictMode's double mount.
    const ctx = gsap.context(() => {
      // A page that loads in a background tab has no animation frames, which
      // would strand entrance tweens at opacity 0. Show it instead.
      if (document.hidden) showEverything(scope);
      else {
        const items = scope.querySelectorAll('[data-hero-el]');
        if (items.length) {
          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(items, { y: 22, opacity: 0, duration: 0.85, stagger: 0.085 }, 0.1)
            .from('.hero__canvas-wrap', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0);
        }
      }

      // Batched so a grid of cards shares one trigger and staggers together
      ScrollTrigger.batch('.js-reveal:not(.skill-group)', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => gsap.set(batch, { clearProps: 'willChange' }),
        }),
      });

      /* Skills cascade in one after another and settle like a spring - the
         one place a little bounce is right, because the section is a list of
         capabilities rather than a measurement. Over the 20px of travel it
         peaks ~4.1px past the target, settles back ~0.7px under, then rests
         - about two rebounds. back.out(1.4) only managed 1.4px and no
         rebound at all, which is why it read as stiff. Period is the taste
         knob: 0.35 peaks ~6.4px, 0.65 ~2.7px. Opacity rides the same ease
         and so dips ~3.6% below full on the rebound, not perceptible.
         Excluded from the generic batch above via :not(). */
      ScrollTrigger.batch('.skill-group', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: 'elastic.out(1, 0.5)',
          overwrite: true,
          onComplete: () => gsap.set(batch, { clearProps: 'willChange,scale' }),
        }),
      });

      const bar = scope.querySelector('[data-timeline-progress]');
      const timeline = scope.querySelector('[data-timeline]');
      if (bar && timeline) {
        gsap.to(bar, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 75%', scrub: 0.6 },
        });
      }

      revealWhatIsAlreadyVisible(scope);
    }, scope);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        if (!reduced) revealWhatIsAlreadyVisible(scope);
      });
    }

    return () => ctx.revert();
  }, [scopeRef, reduced]);

  /* The hero's exit is wired separately: it depends on the 3D scene, which
     arrives after its lazy import resolves. */
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || reduced || !pipeline) return undefined;

    const hero = scope.querySelector('.hero');
    if (!hero) return undefined;

    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true,
        },
      })
        .to(pipeline.camera.position, { z: () => pipeline.camera.position.z + 12, y: 4 }, 0)
        .to(pipeline.root.rotation, { y: -0.06 }, 0)
        .to('.hero__content', { y: -70, opacity: 0.1 }, 0)
        .to('.hero__legend', { opacity: 0 }, 0)
        .to('.scroll-cue', { opacity: 0, duration: 0.2 }, 0);
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, reduced, pipeline]);
}
