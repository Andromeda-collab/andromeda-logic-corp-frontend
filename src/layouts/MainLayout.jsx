import './MainLayout.css';

import React, { useEffect, useRef, useState } from "react";

import { Outlet, Link, useLocation } from "react-router-dom";

import PageTransition from "../components/motion/PageTransition.jsx";

import logoIcon from "../assets/logo.png";

import { sendNovaMessage } from "../services/novaService.js";



// Stable per-visit session id for NOVA conversation logging (Section 10.6).

function getNovaSessionId() {

  try {

    const KEY = "alc_nova_session_id";

    let id = sessionStorage.getItem(KEY);

    if (!id) {

      id =

        (crypto && typeof crypto.randomUUID === "function"

          ? crypto.randomUUID()

          : `nova-${Date.now()}-${Math.random().toString(16).slice(2)}`);

      sessionStorage.setItem(KEY, id);

    }

    return id;

  } catch {

    return `nova-${Date.now()}`;

  }

}



const NOVA_ENABLED = import.meta.env.VITE_NOVA_ENABLED !== "false";



// ─── Mega-menu data ────────────────────────────────────────────────────────────

const MEGA_MENU = [

  {

    id: "technology",

    label: "Technology",

    path: "/technology",

    featured: {

      icon: "⬡",

      eyebrow: "Core Platform",

      title: "Autonomous GNC",

      desc: "Real-time hazard detection, autonomous landing & trajectory adjustment — no ground telemetry required.",

      cta: "Explore Technology",

      href: "/technology",

      stat: { value: "0.3 ms", label: "Reaction latency" },

    },

    columns: [

      {

        heading: "AI & Computing",

        links: [

          { label: "Autonomous Spacecraft Guidance", href: "/technology/autonomous-gnc", desc: "Guidance, navigation & control stack" },

          { label: "Radiation-Tolerant AI", href: "/technology/radiation-tolerant-ai", desc: "Neural nets for hardened hardware" },

          { label: "In-Orbit Edge Computing", href: "/technology/edge-computing", desc: "In-orbit data reduction & processing" },

        ],

      },

      {

        heading: "Autonomy & Validation",

        links: [

          { label: "Autonomous Outpost", href: "/technology/swarm-infrastructure", desc: "Multi-agent satellite orchestration" },

          { label: "Hardware-in-the-Loop", href: "/technology/hitl-simulation", desc: "High-fidelity digital twin validation" },

        ],

      },

    ],

  },

  {

    id: "products",

    label: "Products",

    path: "/products",

    featured: {

      icon: "◈",

      eyebrow: "Platform Catalog",

      title: "Full-Stack Autonomy",

      desc: "Five named platforms — flight-proven and in-development — covering the full autonomy stack.",

      cta: "View All Platforms",

      href: "/products",

      stat: { value: "5", label: "Named platforms" },

    },

    columns: [

      {

        heading: "Hardware & Compute",

        links: [

          { label: "EDGE Payload",             href: "/products/edge-payload",           desc: "In-orbit edge compute module" },

          { label: "Rad-Hard AI Core",         href: "/products/edge-payload",           desc: "Radiation-hardened inference chip" },

          { label: "Thermal Control Unit",     href: "/products/edge-payload",           desc: "Active thermal management" },

        ],

      },

      {

        heading: "Software & Simulation",

        links: [

          { label: "GNC Autonomy Stack",       href: "/products/gnc-autonomy-stack",     desc: "Full guidance & navigation system" },

          { label: "Swarm Orchestrator",       href: "/products/swarm-orchestrator",     desc: "Constellation coordination engine" },

          { label: "HITL Digital Twin Suite",  href: "/products/hitl-digital-twin-suite",desc: "Pre-deployment mission simulator" },

        ],

      },

    ],

  },

  {

    id: "solutions",

    label: "Solutions",

    path: "/solutions",

    featured: {

      icon: "◎",

      eyebrow: "Audience-First",

      title: "Tailored Mission Paths",

      desc: "Tailored value propositions and engagement models for every mission persona.",

      cta: "Find Your Solution",

      href: "/solutions",

      stat: { value: "4", label: "Mission verticals" },

    },

    columns: [

      {

        heading: "Mission Audiences",

        links: [

          { label: "Space Agencies", href: "/solutions/space-agencies", desc: "NASA · ESA · ISRO · National Programs" },

          { label: "Commercial Space Operators", href: "/solutions/commercial", desc: "Satellite Constellations · Launch Providers · In-Orbit Services" },

          { label: "Defense & National Security", href: "/solutions/defense", desc: "Defense Programs · Contested Environments · Secure Operations" },

          { label: "Research Institutions & Academia", href: "/solutions/research", desc: "Universities · National Labs · Independent Research" },

        ],

      },

    ],

  },

  {

    id: "research",

    label: "Research",

    path: "/research",

    featured: {

      icon: "⬟",

      eyebrow: "Deep Research",

      title: "HITL & Digital Twins",

      desc: "High-fidelity orbital simulation environments for aerospace engineers, academia & defense research.",

      cta: "Explore Research",

      href: "/research",

      stat: { value: "12+", label: "Published papers" },

    },

    columns: [

      {

        heading: "Publications",

        links: [

          { label: "Whitepapers & Briefs",     href: "/library",   desc: "Peer-reviewed technical publications" },

          { label: "Technical Library",        href: "/library",   desc: "Gated spec sheets & briefings" },

          { label: "Preprint Archive",         href: "/library",   desc: "Early-stage research previews" },

        ],

      },

      {

        heading: "Programs",

        links: [

          { label: "Academic Access",          href: "/research",  desc: "Joint research & simulation access" },

          { label: "Innovation Lab",           href: "/research",  desc: "Early-stage R&D programs" },

          { label: "Resident Engineering",     href: "/research",  desc: "Embedded teams for mission partners" },

        ],

      },

      {

        heading: "Mission Stories",

        links: [

          { label: "Case Studies",             href: "/missions",  desc: "Mission narratives & flight heritage" },

          { label: "Mission Prarambh",         href: "/missions",  desc: "First orbital autonomy demonstration" },

          { label: "Newsroom",                 href: "/newsroom",  desc: "Press releases & media coverage" },

        ],

      },

    ],

  },

  {

    id: "company",

    label: "Company",

    path: "/about",

    featured: {

      icon: "✦",

      eyebrow: "About Us",

      title: "Andromeda Logic Corp",

      desc: "Building the intelligent infrastructure for deep-space missions — autonomous, resilient, precise.",

      cta: "Our Story",

      href: "/about",

      stat: { value: "2025", label: "Founded" },

    },

    columns: [

      {

        heading: "Organisation",

        links: [

          { label: "About Us",                 href: "/about",     desc: "Mission, vision & leadership" },

          { label: "Our Team",                 href: "/about",     desc: "The engineering minds behind the platform" },

          { label: "Investors & Partners",     href: "/investors", desc: "Partnership & investor relations" },

        ],

      },

      {

        heading: "Work With Us",

        links: [

          { label: "Careers",                  href: "/careers",   desc: "Join the deep-space engineering team" },

          { label: "Open Roles",               href: "/careers",   desc: "Browse current positions" },

          { label: "Internship Program",       href: "/careers",   desc: "University & graduate opportunities" },

        ],

      },

      {

        heading: "Press & Compliance",

        links: [

          { label: "Newsroom",                 href: "/newsroom",  desc: "Press releases & media coverage" },

          { label: "Trust & Compliance",       href: "/trust",     desc: "Export control & certifications" },

          { label: "Contact Us",               href: "/contact",   desc: "Get in touch with our team" },

        ],

      },

    ],

  },

  {

    id: "resources",

    label: "Resources",

    path: "/library",

    featured: {

      icon: "⬡",

      eyebrow: "Resource Hub",

      title: "Technical Library",

      desc: "Filterable whitepapers, spec sheets, briefings — the primary technical-authority resource hub.",

      cta: "Browse Library",

      href: "/library",

      stat: { value: "40+", label: "Resources" },

    },

    columns: [

      {

        heading: "Documents",

        links: [

          { label: "Whitepapers & Specs",      href: "/library",   desc: "Gated technical publications" },

          { label: "Technical Briefings",      href: "/library",   desc: "Deep-dive engineering documents" },

          { label: "Product Datasheets",       href: "/library",   desc: "Platform specifications at a glance" },

        ],

      },

      {

        heading: "Mission Content",

        links: [

          { label: "Case Studies",             href: "/missions",  desc: "Named mission narratives" },

          { label: "Flight Heritage",          href: "/missions",  desc: "In-orbit demonstration record" },

          { label: "Simulation Reports",       href: "/library",   desc: "HITL validation summaries" },

        ],

      },

      {

        heading: "Get Started",

        links: [

          { label: "Trust & Compliance",       href: "/trust",     desc: "Export control & certifications" },

          { label: "Mission Consultation",     href: "/contact",   desc: "Start the conversation" },

          { label: "Investor Relations",       href: "/investors", desc: "Partnership & funding information" },

        ],

      },

    ],

  },

];





export default function MainLayout() {

  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileExpanded, setMobileExpanded] = useState(null);

  const [activeMenu, setActiveMenu] = useState(null);

  const hoverTimeout = useRef(null);



  // NOVA

  const [novaOpen, setNovaOpen] = useState(false);

  const [novaInput, setNovaInput] = useState("");

  const [novaMessages, setNovaMessages] = useState([]);

  const [novaLoading, setNovaLoading] = useState(false);

  const [novaError, setNovaError] = useState(null);

  const novaSessionId = useRef(getNovaSessionId());

  const novaBodyRef = useRef(null);



  const askNova = (text) => {

    const message = (text ?? novaInput).trim();

    if (!message || novaLoading) return;

    setNovaError(null);

    setNovaInput("");

    setNovaMessages((m) => [...m, { role: "user", text: message }]);

    setNovaLoading(true);

    sendNovaMessage(message, novaSessionId.current)

      .then((res) => {

        const { reply, citations } = res.data || {};

        setNovaMessages((m) => [

          ...m,

          {

            role: "assistant",

            text: reply || "NOVA didn't return a response.",

            citations: Array.isArray(citations) ? citations : [],

          },

        ]);

      })

      .catch((err) => {

        setNovaError(

          err?.uiMessage || "NOVA is unavailable right now. Please try again."

        );

      })

      .finally(() => setNovaLoading(false));

  };



  // Scroll NOVA body

  useEffect(() => {

    if (novaBodyRef.current) {

      novaBodyRef.current.scrollTop = novaBodyRef.current.scrollHeight;

    }

  }, [novaMessages, novaLoading]);



  // Scroll listener — hide desktop navbar/logo after the page moves away from top.
  // Capture-phase document scrolling is included so this also works if a page
  // section/layout becomes the active scroll container.
  useEffect(() => {
    let scrollTimeout;

    const getScrollTop = (event) => {
      const windowTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const target = event?.target;
      const targetTop =
        target &&
        target !== document &&
        target !== window &&
        typeof target.scrollTop === "number"
          ? target.scrollTop
          : 0;

      return Math.max(windowTop, targetTop);
    };

    const handleScroll = (event) => {
      const hasScrolled = getScrollTop(event) > 20;

      setScrolled(hasScrolled);
      document.body.classList.toggle("alc-page-scrolled", hasScrolled);

      document.body.classList.add("is-scrolling");
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);

      clearTimeout(scrollTimeout);

      document.body.classList.remove("alc-page-scrolled");
      document.body.classList.remove("is-scrolling");
    };
  }, []);

  // Close mobile + menu on route change

  useEffect(() => {

    setMobileOpen(false);

    setMobileExpanded(null);

    setActiveMenu(null);

  }, [location.pathname]);



  // Lock body scroll when mobile open

  useEffect(() => {

    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => { document.body.style.overflow = ""; };

  }, [mobileOpen]);



  // Scroll to top on route change

  useEffect(() => {

    window.scrollTo(0, 0);

  }, [location.pathname]);



  // Escape key closes menus

  useEffect(() => {

    const handleKey = (e) => {

      if (e.key === "Escape") {

        setMobileOpen(false);

        setActiveMenu(null);

      }

    };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);

  }, []);



  // ── Logo click handler ─────────────────────────────────────────────────────

  const handleLogoClick = (e) => {

    if (location.pathname === "/") {

      e.preventDefault();

      window.location.reload();

    }

  };



  const handleNavEnter = (id) => {

    clearTimeout(hoverTimeout.current);

    setActiveMenu(id);

  };



  const handleNavLeave = () => {

    hoverTimeout.current = setTimeout(() => {

      setActiveMenu(null);

    }, 120);

  };



  const handlePanelEnter = () => {

    clearTimeout(hoverTimeout.current);

  };



  const currentMenu = MEGA_MENU.find((m) => m.id === activeMenu);



  return (

    <>

      {/* Film grain noise overlay */}

      <div className="alc-noise" aria-hidden="true" />



      {/* ── Fixed Big Logo ────────────────────────────────────────────────── */}

      <Link

        to="/"

        className={`alc-fixed-logo ${scrolled ? "is-scrolled" : ""}`}

        onClick={handleLogoClick}

        aria-label="Andromeda Logic Corp — Home"

      >

        <img src={logoIcon} alt="Andromeda Logic Corp" className="alc-fixed-logo-icon" />

      </Link>



      {/* ── Header ──────────────────────────────────────────────────────────── */}

      <header className={`alc-header ${scrolled ? "is-scrolled" : ""}`}>

        <div className="alc-header__inner">



          {/* Desktop nav — JS hover state for smooth cross-item transitions */}

          <nav className="alc-header__nav" aria-label="Primary navigation">

            {MEGA_MENU.map((item) => (

              <div

                key={item.id}

                className={`alc-nav-item ${activeMenu === item.id ? "is-active" : ""}`}

                onMouseEnter={() => handleNavEnter(item.id)}

                onMouseLeave={handleNavLeave}

              >

                <Link to={item.path} className="alc-nav-item__btn">

                  <span>{item.label}</span>

                  <svg className="alc-nav-item__chevron" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">

                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

                  </svg>

                </Link>

              </div>

            ))}

          </nav>



          {/* CTA */}

          <Link to="/contact" className="alc-button alc-button--primary alc-header__cta">

            Mission Consultation

          </Link>



          {/* Mobile hamburger */}

          <button

            className={`alc-header__mobile-toggle ${mobileOpen ? "is-open" : ""}`}

            onClick={() => setMobileOpen((prev) => !prev)}

            aria-label={mobileOpen ? "Close menu" : "Open menu"}

            aria-expanded={mobileOpen}

          >

            <span className="alc-hamburger-line" />

            <span className="alc-hamburger-line" />

            <span className="alc-hamburger-line" />

          </button>

        </div>

      </header>



      {/* ── Full-width Mega Panel ─────────────────────────────────────────── */}

      <div

        className={`alc-mega-fullpanel ${activeMenu ? "is-visible" : ""}`}

        onMouseEnter={handlePanelEnter}

        onMouseLeave={handleNavLeave}

        aria-hidden={!activeMenu}

      >

        {/* Top accent bar */}

        <div className="alc-mega-fullpanel__bar" aria-hidden="true" />



        <div className="alc-mega-fullpanel__inner">

          {MEGA_MENU.map((item) => (

            <div

              key={item.id}

              className={`alc-mega-fullpanel__slide ${activeMenu === item.id ? "is-active" : ""}`}

            >

              {/* Featured card */}

              <div className="alc-mega-full-featured">

                <Link to={item.featured.href} className="alc-mega-full-card">

                  <div className="alc-mega-full-card__icon" aria-hidden="true">{item.featured.icon}</div>

                  <p className="alc-mega-full-card__eyebrow">{item.featured.eyebrow}</p>

                  <h3 className="alc-mega-full-card__title">{item.featured.title}</h3>

                  <p className="alc-mega-full-card__desc">{item.featured.desc}</p>

                  {item.featured.stat && (

                    <div className="alc-mega-full-card__stat">

                      <span className="alc-mega-full-card__stat-value">{item.featured.stat.value}</span>

                      <span className="alc-mega-full-card__stat-label">{item.featured.stat.label}</span>

                    </div>

                  )}

                  <span className="alc-mega-full-card__cta">

                    {item.featured.cta}

                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">

                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

                    </svg>

                  </span>

                </Link>

              </div>



              {/* Divider */}

              <div className="alc-mega-full-divider" aria-hidden="true" />



              {/* Columns */}

              <div className="alc-mega-full-columns">

                {item.columns.map((col, ci) => (

                  <div key={ci} className="alc-mega-full-col">

                    <p className="alc-mega-full-col__heading">{col.heading}</p>

                    <div className="alc-mega-full-col__links">

                      {col.links.map((link, li) => (

                        <Link

                          key={li}

                          to={link.href}

                          className="alc-mega-full-link"

                          style={{ "--i": li }}

                        >

                          <div className="alc-mega-full-link__body">

                            <span className="alc-mega-full-link__label">{link.label}</span>

                            <span className="alc-mega-full-link__desc">{link.desc}</span>

                          </div>

                          <svg className="alc-mega-full-link__arrow" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">

                            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

                          </svg>

                        </Link>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>



      {/* Backdrop dimmer */}

      <div

        className={`alc-mega-backdrop ${activeMenu ? "is-visible" : ""}`}

        onMouseEnter={handleNavLeave}

        aria-hidden="true"

      />





      {/* ── Mobile panel ──────────────────────────────────────────────────── */}

      <div

        className={`alc-mobile-panel ${mobileOpen ? "is-open" : ""}`}

        aria-hidden={!mobileOpen}

        role="dialog"

        aria-label="Mobile navigation"

      >

        <div className="alc-mobile-panel__inner">

          {MEGA_MENU.map((item, index) => (

            <div key={item.id} className="alc-mobile-nav-item">

              <button

                className="alc-mobile-nav-item__btn"

                onClick={() =>

                  setMobileExpanded((prev) =>

                    prev === item.id ? null : item.id

                  )

                }

                aria-expanded={mobileExpanded === item.id}

              >

                <span>

                  <span className="alc-mobile-nav-item__num">

                    {String(index + 1).padStart(2, "0")}

                  </span>

                  {item.label}

                </span>

                <svg

                  className={`alc-mobile-chevron ${mobileExpanded === item.id ? "is-open" : ""}`}

                  width="16"

                  height="16"

                  viewBox="0 0 12 12"

                  fill="none"

                  aria-hidden="true"

                >

                  <path

                    d="M2 4L6 8L10 4"

                    stroke="currentColor"

                    strokeWidth="1.5"

                    strokeLinecap="round"

                    strokeLinejoin="round"

                  />

                </svg>

              </button>



              {/* Mobile sub-links accordion */}

              <div

                className={`alc-mobile-subnav ${mobileExpanded === item.id ? "is-open" : ""}`}

              >

                <Link

                  to={item.path}

                  className="alc-mobile-sublink alc-mobile-sublink--all"

                  onClick={() => setMobileOpen(false)}

                >

                  View All {item.label} →

                </Link>

                {item.columns.flatMap((col) => col.links).slice(0, 6).map((link) => (

                  <Link

                    key={link.href + link.label}

                    to={link.href}

                    className="alc-mobile-sublink"

                    onClick={() => setMobileOpen(false)}

                  >

                    {link.label}

                  </Link>

                ))}

              </div>

            </div>

          ))}



          <Link

            to="/contact"

            className="alc-button alc-button--primary alc-mobile-cta"

            onClick={() => setMobileOpen(false)}

          >

            Request Mission Consultation

          </Link>

        </div>

      </div>



      <main>

        <Outlet />

      </main>



      <footer className="alc-footer">

        <div className="alc-container alc-footer__grid">

          <div className="alc-footer__brand">

            <Link to="/" className="alc-footer__logo-link">

              <img src={logoIcon} alt="Andromeda Logic Corp" className="alc-footer__logo-icon" />

              <span className="alc-footer__logo-text">Andromeda</span>

            </Link>

            <a 

              href="https://www.linkedin.com/company/andromeda-logic-corp-private-limited/" 

              target="_blank" 

              rel="noopener noreferrer" 

              className="alc-footer__social-link"

            >

              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">

                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>

              </svg>

              Follow us on LinkedIn

            </a>

          </div>



          <div>

            <h3>Explore</h3>

            <div className="alc-footer__links">

              <Link to="/">Home</Link>

              <Link to="/technology">Technology</Link>

              <Link to="/products">Products</Link>

              <Link to="/solutions">Solutions</Link>

            </div>

          </div>



          <div>

            <h3>Company</h3>

            <div className="alc-footer__links">

              <Link to="/about">About Us</Link>

              <Link to="/careers">Careers</Link>

              <Link to="/newsroom">Newsroom</Link>

              <Link to="/investors">Investors & Partners</Link>

            </div>

          </div>



          <div>

            <h3>Resources</h3>

            <div className="alc-footer__links">

              <Link to="/library">Technical Library</Link>

              <Link to="/missions">Case Studies</Link>

              <Link to="/trust">Trust & Compliance</Link>

              <Link to="/contact">Contact</Link>

            </div>

          </div>

        </div>



        <div className="alc-footer__bottom">

          &copy; {new Date().getFullYear()} Andromeda Logic Corp Private Limited. All rights reserved.

        </div>

      </footer>



      {NOVA_ENABLED && (

        <div className="alc-nova">

          {novaOpen && (

            <div className="alc-nova__panel" role="dialog" aria-label="NOVA AI Mission Assistant">

              <div className="alc-nova__top">

                <div className="alc-nova__title">

                  <strong>NOVA</strong>

                  <span>Mission Intelligence Interface</span>

                </div>



                <button

                  className="alc-nova__close"

                  onClick={() => setNovaOpen(false)}

                  aria-label="Close NOVA"

                >

                  ×

                </button>

              </div>



              <div className="alc-nova__body" ref={novaBodyRef}>

                {novaMessages.length === 0 && (

                  <>

                    <p>

                      Explore Andromeda Logic technologies, platforms, research,

                      mission stories, and engagement paths through the NOVA

                      interface.

                    </p>



                    <div className="alc-nova__quick">

                      <button type="button" onClick={() => askNova("Explore autonomous navigation")}>

                        Explore autonomous navigation

                      </button>

                      <button type="button" onClick={() => askNova("Tell me about your products and platforms")}>

                        Explore Products &amp; Platforms

                      </button>

                      <button type="button" onClick={() => askNova("Help me find the right solution for my mission")}>

                        Find the right solution for my mission

                      </button>

                      <button type="button" onClick={() => askNova("What is in your technical library?")}>

                        Search the Technical Library

                      </button>

                    </div>

                  </>

                )}



                {novaMessages.map((msg, i) => (

                  <div

                    key={i}

                    className={`alc-nova__msg alc-nova__msg--${msg.role}`}

                    style={{

                      margin: "10px 0",

                      padding: "10px 12px",

                      borderRadius: 10,

                      fontSize: 13,

                      lineHeight: 1.55,

                      background:

                        msg.role === "user"

                          ? "rgba(41,227,217,0.10)"

                          : "rgba(245,247,255,0.06)",

                      border: "1px solid rgba(138,147,184,0.18)",

                    }}

                  >

                    <span

                      style={{

                        display: "block",

                        fontFamily: "JetBrains Mono, monospace",

                        fontSize: 10,

                        letterSpacing: "0.12em",

                        textTransform: "uppercase",

                        color: msg.role === "user" ? "#29e3d9" : "#8a93b8",

                        marginBottom: 4,

                      }}

                    >

                      {msg.role === "user" ? "You" : "NOVA"}

                    </span>

                    {msg.text}

                    {msg.citations && msg.citations.length > 0 && (

                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>

                        {msg.citations.map((c, ci) => (

                          <Link

                            key={ci}

                            to={c.source || "#"}

                            onClick={() => setNovaOpen(false)}

                            style={{

                              fontSize: 11,

                              padding: "2px 8px",

                              borderRadius: 999,

                              border: "1px solid rgba(41,227,217,0.4)",

                              color: "#29e3d9",

                              textDecoration: "none",

                            }}

                          >

                            {c.title || c.source}

                          </Link>

                        ))}

                      </div>

                    )}

                  </div>

                ))}



                {novaLoading && (

                  <div

                    className="alc-nova__msg alc-nova__msg--assistant"

                    style={{ margin: "10px 0", fontSize: 13, color: "#8a93b8" }}

                  >

                    NOVA is thinking…

                  </div>

                )}



                {novaError && (

                  <div role="alert" style={{ margin: "10px 0", fontSize: 12, color: "#e63c8c" }}>

                    {novaError}

                  </div>

                )}

              </div>



              <form

                className="alc-nova__input"

                onSubmit={(e) => {

                  e.preventDefault();

                  askNova();

                }}

                style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid rgba(138,147,184,0.18)" }}

              >

                <input

                  type="text"

                  value={novaInput}

                  onChange={(e) => setNovaInput(e.target.value)}

                  placeholder="Ask NOVA…"

                  aria-label="Ask NOVA"

                  style={{

                    flex: 1,

                    padding: "9px 12px",

                    borderRadius: 8,

                    border: "1px solid rgba(138,147,184,0.3)",

                    background: "#05070d",

                    color: "#f5f7ff",

                    fontSize: 13,

                  }}

                />

                <button

                  type="submit"

                  disabled={novaLoading || !novaInput.trim()}

                  style={{

                    padding: "9px 14px",

                    borderRadius: 8,

                    border: "1px solid #29e3d9",

                    background: "transparent",

                    color: "#f5f7ff",

                    fontSize: 12,

                    cursor: "pointer",

                  }}

                >

                  Send

                </button>

              </form>

            </div>

          )}



          <button

            className="alc-nova__launcher"

            onClick={() => setNovaOpen((prev) => !prev)}

            aria-label="Open NOVA mission assistant"

            aria-expanded={novaOpen}

          >

            <span

              style={{

                fontFamily: "JetBrains Mono, monospace",

                fontSize: 11,

                letterSpacing: "0.1em",

                color: "#29e3d9",

              }}

            >

              ALC

            </span>

          </button>

        </div>

      )}

    </>

  );

}
