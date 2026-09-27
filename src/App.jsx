import { Routes, Route } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Global scroll reveal observer — powers all .reveal--* and .stagger-children classes
function useGlobalReveal() {
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(
          ".reveal, .reveal--up, .reveal--fade, .reveal--left, .reveal--right, .reveal--scale, .reveal--clip, .stagger-children, .split-text, .alc-eyebrow-reveal, .alc-divider-animate"
        )
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const selectors = [
      ".reveal",
      ".reveal--up",
      ".reveal--fade",
      ".reveal--left",
      ".reveal--right",
      ".reveal--scale",
      ".reveal--clip",
      ".stagger-children",
      ".split-text",
      ".alc-eyebrow-reveal",
      ".alc-divider-animate",
    ].join(", ");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const observe = () => {
      // Small timeout to allow DOM to render new page content before observing
      setTimeout(() => {
        document.querySelectorAll(selectors).forEach((el) => {
          if (!el.classList.contains("is-visible")) observer.observe(el);
        });
      }, 100);
    };

    observe();

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run observe only when the route changes
}

export default function App() {
  useGlobalReveal();
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<AppRouter />} />
    </Routes>
  );
}
