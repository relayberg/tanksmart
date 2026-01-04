import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures the window starts at the top after route changes.
 * Uses multiple strategies to ensure scroll position is reset.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Disable browser scroll restoration
  useLayoutEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      // ignore
    }
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    // Respect anchor navigation if a hash is present.
    if (hash) return;

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll
    scrollToTop();

    // After microtask
    Promise.resolve().then(scrollToTop);

    // After next frame
    const raf1 = requestAnimationFrame(scrollToTop);

    // After a short delay (for content that loads async)
    const timeout1 = setTimeout(scrollToTop, 0);
    const timeout2 = setTimeout(scrollToTop, 50);
    const timeout3 = setTimeout(scrollToTop, 100);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [pathname, hash]);

  return null;
}
