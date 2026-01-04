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

    const root = document.getElementById("root");
    const html = document.documentElement;

    // Temporarily disable global smooth scrolling so scrollTo(0,0) is instant.
    const prevInlineScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const scrollToTop = (label: string) => {
      // Scroll the window and common containers (in case the app uses an overflow wrapper)
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      html.scrollTop = 0;
      document.body.scrollTop = 0;
      root?.scrollTo({ top: 0, left: 0, behavior: "auto" });

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("[ScrollToTop]", label, {
          pathname,
          windowY: window.scrollY,
          htmlY: html.scrollTop,
          bodyY: document.body.scrollTop,
          rootY: root?.scrollTop,
        });
      }
    };

    scrollToTop("immediate");
    Promise.resolve().then(() => scrollToTop("microtask"));

    const raf1 = requestAnimationFrame(() => scrollToTop("raf"));

    const timeout1 = setTimeout(() => scrollToTop("t0"), 0);
    const timeout2 = setTimeout(() => scrollToTop("t50"), 50);
    const timeout3 = setTimeout(() => scrollToTop("t150"), 150);
    const timeout4 = setTimeout(() => scrollToTop("t300"), 300);

    // Restore smooth scrolling after we're done forcing to top.
    const restore = setTimeout(() => {
      html.style.scrollBehavior = prevInlineScrollBehavior;
    }, 400);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(restore);
      html.style.scrollBehavior = prevInlineScrollBehavior;
    };
  }, [pathname, hash]);

  return null;
}
