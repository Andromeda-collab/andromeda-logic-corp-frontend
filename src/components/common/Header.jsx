import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoIcon from "../../assets/logo.png";
import { getNavItems } from "../../services/navigationService.js";

export default function Header() {
  const [navItems, setNavItems] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    getNavItems()
      .then((res) => setNavItems(res.data || []))
      .catch(() => setNavItems([]));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = navItems.filter((item) => !item.is_cta);
  const cta = navItems.find((item) => item.is_cta);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="alc-header">
        <div className="alc-container alc-header__inner">
          <Link
            to="/"
            className="alc-header__logo"
            onClick={closeMobileMenu}
            aria-label="Andromeda Logic Corp Home"
          >
            <img
              src={logoIcon}
              alt="Andromeda Logic Corp"
              className="alc-header__logo-icon"
            />
          </Link>

          <nav className="alc-header__nav" aria-label="Primary navigation">
            {links.map((item) => (
              <Link
                to={item.url}
                key={item.id}
                className="alc-header__nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {cta && (
            <Link
              to={cta.url}
              className="alc-button alc-button--primary alc-header__cta"
            >
              {cta.label}
            </Link>
          )}

          <button
            type="button"
            className={`alc-header__mobile-toggle ${
              mobileOpen ? "is-open" : ""
            }`}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="alc-mobile-navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="alc-hamburger-line" />
            <span className="alc-hamburger-line" />
            <span className="alc-hamburger-line" />
          </button>
        </div>
      </header>

      <div
        id="alc-mobile-navigation"
        className={`alc-mobile-panel ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="alc-mobile-panel__inner">
          <nav className="alc-mobile-simple-nav" aria-label="Mobile navigation">
            {links.map((item, index) => (
              <Link
                key={item.id}
                to={item.url}
                className="alc-mobile-simple-link"
                onClick={closeMobileMenu}
              >
                <span className="alc-mobile-simple-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="alc-mobile-simple-label">
                  {item.label}
                </span>

                <span className="alc-mobile-simple-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>

          {cta && (
            <Link
              to={cta.url}
              className="alc-button alc-button--primary alc-mobile-cta"
              onClick={closeMobileMenu}
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
