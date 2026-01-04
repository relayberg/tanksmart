import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures the window starts at the top after route changes.
 * (React Router does not handle scroll restoration by default.)
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Respect anchor navigation if a hash is present.
    if (hash) return;

    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      // ignore
    }

    // Set immediately and once again after paint to avoid late layout shifts.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
