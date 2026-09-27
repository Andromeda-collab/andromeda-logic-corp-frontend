import './About.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAboutContent } from '../../services/aboutService.js';
import useApiResource from '../../hooks/useApiResource.js';

const milestones = [
  { year: '2021', label: 'Founding', desc: 'Andromeda Logic Corp established with a singular mission: build autonomous intelligence for the deep-space era.' },
  { year: '2022', label: 'GNC Stack v1', desc: 'First autonomous Guidance, Navigation & Control stack validated in hardware-in-the-loop simulation environment.' },
  { year: '2023', label: 'Mission Prarambh', desc: 'EDGE Payload deployed in first orbital mission — real-time hazard avoidance and telemetry compression validated in-orbit.' },
  { year: '2024', label: 'HITL Suite Launch', desc: 'HITL Digital Twin Suite released as a standalone platform for aerospace research institutions and agency validation programs.' },
  { year: '2025', label: 'Swarm Orchestrator', desc: 'Multi-agent swarm architecture demonstrated across a 6-satellite constellation in LEO, managing autonomous station-keeping.' },
  { year: '2026', label: 'Deep Space Push', desc: 'Radiation-Tolerant Inference Engine enters flight qualification. Andromeda Logic Corp expands to lunar and interplanetary mission support.' },
];

const leadership = [
  { initials: 'AK', name: 'Arjun Kapoor', title: 'Founder & CEO', bio: 'Former aerospace AI researcher with 12 years in autonomous spacecraft systems. Led GNC development for lunar mission programs.' },
  { initials: 'PS', name: 'Priya Sharma', title: 'CTO & Co-Founder', bio: 'Deep expertise in radiation-hardened computing architectures and onboard ML inference systems for deep-space environments.' },
  { initials: 'RN', name: 'Rohan Nair', title: 'VP Engineering', bio: 'Systems architect specializing in fault-tolerant embedded software for mission-critical aerospace and defense applications.' },
  { initials: 'AM', name: 'Aisha Mehta', title: 'Head of Research', bio: 'Leads the HITL Simulation division and academic partnership programs, driving joint research with space agencies worldwide.' },
];

const values = [
  { icon: '⬡', title: 'Mission First', desc: 'Every line of code and every design decision is evaluated against one criterion: does it make the mission succeed?' },
  { icon: '◈', title: 'Radical Reliability', desc: 'Space systems fail in silence. We build for the most extreme environments humanity has ever reached.' },
  { icon: '⬟', title: 'Autonomous Intelligence', desc: 'We believe the future belongs to systems that can think, adapt, and decide — without waiting on Earth.' },
  { icon: '◇', title: 'Open Science', desc: 'Collaboration with research institutions and academia accelerates the entire field. We publish, share, and build together.' },
];

const stats = [
  { value: '5+', label: 'Orbital Missions Supported', sublabel: 'Flight-validated systems' },
  { value: '3', label: 'Named Flagship Platforms', sublabel: 'Flight-Proven status' },
  { value: '12+', label: 'Research Partnerships', sublabel: 'Agencies & Universities' },
  { value: '2026', label: 'Deep Space Milestone', sublabel: 'Lunar & interplanetary' },
];

export default function About() {
  const [activeYear, setActiveYear] = useState(null);
  const countersRef = useRef(null);
  const [counted, setCounted] = useState(false);

  // CMS-managed About content (GET /api/v1/about/). 404 until seeded — the
  // page then renders entirely from the static copy below.
  const { data: about } = useApiResource(() => getAboutContent(), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !counted) setCounted(true); },
      { threshold: 0.3 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => observer.disconnect();
  }, [counted]);

  return (
    <div className="alc-about">

      {/* Hero */}
      <section className="alc-about__hero">
        <div className="alc-about__hero-grid">
          <div className="alc-about__hero-label alc-eyebrow-reveal">COMPANY PROFILE</div>
          <h1 className="alc-about__hero-title split-text">
            <span className="split-text__line">
              <span className="split-text__inner">Building the Computational</span>
            </span>
            <span className="split-text__line">
              <span className="split-text__inner" style={{ transitionDelay: '0.12s' }}>
                <span className="alc-about__hero-accent">Backbone of Deep Space</span>
              </span>
            </span>
          </h1>
          <p className="alc-about__hero-desc reveal--up reveal-delay-3">
            Andromeda Logic Corp is a space and research technology company building autonomous, radiation-tolerant computing systems for deep-space missions. We design, build, and deploy high-reliability intelligent systems that empower autonomous exploration, accelerate scientific discovery, and expand human reach into the cosmos.
          </p>
          <div className="alc-about__hero-tags stagger-children">
            <span>Space Technology</span>
            <span>Aerospace AI/ML</span>
            <span>Research &amp; Development</span>
            <span>Deep Space Systems</span>
          </div>
        </div>
        <div className="alc-about__hero-visual reveal--scale">
          <div className="alc-about__orbit-ring alc-about__orbit-ring--1" />
          <div className="alc-about__orbit-ring alc-about__orbit-ring--2" />
          <div className="alc-about__orbit-ring alc-about__orbit-ring--3" />
          <div className="alc-about__orbit-center">
            <span>ALC</span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="alc-about__mv">
        <div className="alc-container">
          <div className="alc-about__mv-grid stagger-children">
            <div className="alc-about__mv-card">
              <div className="alc-about__mv-label">MISSION</div>
              <p className="alc-about__mv-text">
                {about?.mission_statement ||
                  'To design, build, and deploy high-reliability intelligent systems that empower autonomous exploration, accelerate scientific discovery, and expand human reach into deep space.'}
              </p>
            </div>
            <div className="alc-about__mv-divider" />
            <div className="alc-about__mv-card">
              <div className="alc-about__mv-label">VISION</div>
              <p className="alc-about__mv-text">
                {about?.vision_statement ||
                  "To become the fundamental computational backbone for humanity's multi-planetary future — enabling spacecraft, satellites, and research outposts to think, adapt, and make critical decisions across the cosmos."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="alc-about__stats" ref={countersRef}>
        <div className="alc-container">
          <div className="alc-about__stats-grid stagger-children">
            {stats.map((s, i) => (
              <div className="alc-about__stat-card" key={i}>
                <div className="alc-about__stat-value">{s.value}</div>
                <div className="alc-about__stat-label">{s.label}</div>
                <div className="alc-about__stat-sub">{s.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="alc-about__values">
        <div className="alc-container">
          <div className="alc-about__section-header">
            <span className="alc-about__section-tag alc-eyebrow-reveal">PRINCIPLES</span>
            <h2 className="split-text">
              <span className="split-text__line"><span className="split-text__inner">What We Stand For</span></span>
            </h2>
            <p className="reveal--up reveal-delay-2">Our engineering culture is defined by these four operating principles — every platform, algorithm, and research initiative reflects them.</p>
          </div>
          <div className="alc-about__values-grid stagger-children">
            {values.map((v, i) => (
              <div className="alc-about__value-card alc-card-shine" key={i}>
                <div className="alc-about__value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="alc-about__timeline">
        <div className="alc-container">
          <div className="alc-about__section-header">
            <span className="alc-about__section-tag alc-eyebrow-reveal">HERITAGE</span>
            <h2 className="split-text">
              <span className="split-text__line"><span className="split-text__inner">Company Milestones</span></span>
            </h2>
            <p className="reveal--up reveal-delay-2">From founding to orbital deployment — the milestones that define Andromeda Logic Corp's technical legacy.</p>
          </div>
          <div className="alc-about__timeline-track">
            {milestones.map((m, i) => (
              <div
                className={`alc-about__timeline-item reveal--left reveal-delay-${Math.min(i + 1, 8)} ${activeYear === i ? 'is-active' : ''}`}
                key={i}
                onClick={() => setActiveYear(activeYear === i ? null : i)}
              >
                <div className="alc-about__timeline-year">{m.year}</div>
                <div className="alc-about__timeline-dot" />
                <div className="alc-about__timeline-content">
                  <div className="alc-about__timeline-label">{m.label}</div>
                  <p className="alc-about__timeline-desc">{m.desc}</p>
                </div>
              </div>
            ))}
            <div className="alc-about__timeline-line" />
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="alc-about__leadership">
        <div className="alc-container">
          <div className="alc-about__section-header">
            <span className="alc-about__section-tag alc-eyebrow-reveal">LEADERSHIP</span>
            <h2 className="split-text">
              <span className="split-text__line"><span className="split-text__inner">The Team Behind the Mission</span></span>
            </h2>
            <p className="reveal--up reveal-delay-2">Our leadership brings together aerospace engineering, AI research, and systems architecture to build systems that work where nothing else can.</p>
          </div>
          <div className="alc-about__leadership-grid stagger-children">
            {leadership.map((l, i) => (
              <div className="alc-about__leader-card alc-card-shine" key={i}>
                <div className="alc-about__leader-avatar">
                  <span>{l.initials}</span>
                </div>
                <div className="alc-about__leader-info">
                  <h3>{l.name}</h3>
                  <div className="alc-about__leader-title">{l.title}</div>
                  <p>{l.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="alc-about__locations">
        <div className="alc-container">
          <div className="alc-about__section-header">
            <span className="alc-about__section-tag alc-eyebrow-reveal">PRESENCE</span>
            <h2 className="split-text">
              <span className="split-text__line"><span className="split-text__inner">Engineering &amp; Mission Operations</span></span>
            </h2>
          </div>
          <div className="alc-about__locations-grid stagger-children">
            <div className="alc-about__location-card alc-card-shine">
              <div className="alc-about__location-icon">◈</div>
              <h3>Bengaluru, India</h3>
              <div className="alc-about__location-role">Headquarters &amp; Core Engineering</div>
              <p>Primary research, GNC algorithm development, HITL simulation lab, and corporate operations.</p>
            </div>
            <div className="alc-about__location-card alc-card-shine">
              <div className="alc-about__location-icon">◈</div>
              <h3>Pune, India</h3>
              <div className="alc-about__location-role">Embedded Systems &amp; Hardware Lab</div>
              <p>Radiation-tolerant hardware validation, inference engine testing, and payload integration.</p>
            </div>
            <div className="alc-about__location-card alc-card-shine">
              <div className="alc-about__location-icon">◈</div>
              <h3>Remote / Distributed</h3>
              <div className="alc-about__location-role">Research &amp; Academic Partnerships</div>
              <p>Collaborative programs with global space agencies, universities, and national laboratories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="alc-about__cta">
        <div className="alc-container">
          <div className="alc-about__cta-inner reveal--scale">
            <h2 className="split-text">
              <span className="split-text__line"><span className="split-text__inner">Ready to Explore a Partnership?</span></span>
            </h2>
            <p className="reveal--fade reveal-delay-2">Whether you're an agency, commercial operator, defense program, or research institution — we have an engagement path built for your mission.</p>
            <div className="alc-about__cta-buttons reveal--up reveal-delay-3">
              <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>
              <Link to="/solutions" className="alc-btn-ghost">Explore Solutions by Audience</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
