import './About.css';

import React, { useState, useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';

import { getAboutContent } from '../../services/aboutService.js';

import useApiResource from '../../hooks/useApiResource.js';

import AbhishekImg from '../../assets/images/Founders/Abhishek.jpeg';

import AkshayImg from '../../assets/images/Founders/Akshay.jpeg';



import AboutBgVideo from '../../assets/videos/Aboutus_bg.mp4';



const milestones = [

  { year: '2025', label: 'Incorporation of Andromeda Logic Corp Private Limited', desc: 'Andromeda Logic Corp is incorporated in Bengaluru, India (CIN: U62011KA2025PTC211686). The company is founded on a dual-engine model: a space-tech core (Andromeda Logic) focused on autonomous systems, compute and research infrastructure, and a talent engine (Andromeda Ignite) delivering university training, Centres of Excellence and placement pathways.' },

  { year: '2025', label: 'Establishment of Bengaluru Headquarters', desc: 'Corporate headquarters and core engineering operations are established in Bengaluru. The site becomes the centre for GNC and autonomy research, hardware-in-the-loop simulation, research infrastructure development, and corporate leadership.' },

  { year: '2025', label: 'Definition of the Dual-Engine Operating Model', desc: 'Formal adoption of the dual-engine architecture. Andromeda Logic develops space-grade autonomy, edge compute, digital twins and mission systems. Andromeda Ignite builds campus talent pipelines, CoEs and industry immersion programs using the same technical standards.' },

  { year: '2025-2026', label: 'Adoption of the Trident Philosophy', desc: 'The company identity is codified around three principles  Creation (building systems that did not previously exist), Preservation (keeping missions, knowledge and careers reliable), and Dissolution (intentionally retiring, recycling and regenerating hardware, data and human capital).' },

  { year: '2025-2026', label: 'Articulation of Vision and Mission', desc: 'Vision is stated as Intelligence that can fly itself  from Earth orbit to deep space. Mission is defined as delivering research infrastructure and talent that India  and the world  can fly on.' },

  { year: '2025-2026', label: 'Core Technological Matrix Defined', desc: 'Three primary technology orbits are formalised: (1) Deep-Space Navigation & Neural Guidance, (2) Fault-Tolerant Edge & Quantum Computing, and (3) Extreme Environment Hardware & Adaptive Robotics. Supporting layers include digital twins, HPC simulation, secure collaboration and standards interfaces.' },

  { year: '2025-2026', label: 'Launch of Andromeda Ignite Platform', desc: 'Andromeda Ignite is established as the education and talent vertical, offering Foundation ? Specialisation ? Industry Immersion ? Placement pathways, university Centres of Excellence, adaptive AI assessment, and partnerships with global technology majors.' },

  { year: '2026', label: 'First Public Company Profile Release', desc: 'The confidential 2026 company profile is prepared, presenting the full technology lattice, industry presence across eight verticals, Ignite outcome metrics, engagement models, and leadership (Directors: Akshay Vijayendra Agasthya, Abhishek Tripathi, Salma Siddiqa).' },

];



const leadership = [

  { initials: 'AT', name: 'Abhishek Tripathi', title: 'Co Founder & Chief Executive Officer', image: AbhishekImg, linkedin: 'https://www.linkedin.com/in/abhishek-tripathi-030890103/' },

  { initials: 'VA', name: 'Akshay Vijayendra Agasthya', title: 'Co Founder & Chief Learning Officer', image: AkshayImg, linkedin: 'https://www.linkedin.com/in/akshay-v-agasthya?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
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

        <video 

          className="alc-about__hero-bg-video"

          src={AboutBgVideo} 

          autoPlay 

          loop 

          muted 

          playsInline

        />



        <div className="alc-about__hero-grid">

          <div className="alc-about__hero-label ">COMPANY PROFILE</div>

          <h1 className="alc-about__hero-title ">

            <span className="">

              <span className="">Building the Computational</span>

            </span>

            <span className="">

              <span className="" style={{ transitionDelay: '0.12s' }}>

                <span className="alc-about__hero-accent">Backbone of Deep Space</span>

              </span>

            </span>

          </h1>

          <p className="alc-about__hero-desc  ">

            Andromeda Logic Corp is a space and research technology company building autonomous, radiation-tolerant computing systems for deep-space missions. We design, build, and deploy high-reliability intelligent systems that empower autonomous exploration, accelerate scientific discovery, and expand human reach into the cosmos.

          </p>

          <div className="alc-about__hero-tags ">

            <span>Space Technology</span>

            <span>Aerospace AI/ML</span>

            <span>Research &amp; Development</span>

            <span>Deep Space Systems</span>

          </div>

        </div>

      </section>



      {/* Mission & Vision */}

      <section className="alc-about__mv">

        <div className="alc-container">

          <div className="alc-about__mv-grid ">

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

          <div className="alc-about__stats-grid ">

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

            <span className="alc-about__section-tag ">PRINCIPLES</span>

            <h2 className="">

              <span className=""><span className="">What We Stand For</span></span>

            </h2>

            <p className="">Our engineering culture is defined by these four operating principles — every platform, algorithm, and research initiative reflects them.</p>

          </div>

          <div className="alc-about__values-grid ">

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

            <span className="alc-about__section-tag ">HERITAGE</span>

            <h2 className=""><span className=""><span className="">Company Milestones</span></span></h2><p className="">Expanded public milestone list based strictly on the official company profile. Descriptions incorporate the dual-engine structure, Trident philosophy, technology matrix, and talent platform as presented in the 2026 profile.</p>

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

            <span className="alc-about__section-tag ">LEADERSHIP</span>

            <h2 className="">

              <span className=""><span className="">The Team Behind the Mission</span></span>

            </h2>

            <p className="">Our leadership brings together aerospace engineering, AI research, and systems architecture to build systems that work where nothing else can.</p>

          </div>

          <div className="alc-about__leadership-grid ">

                          {leadership.map((l, i) => (

                <div className="alc-about__leader-card" key={i}>

                  <div className="alc-about__leader-avatar">

                    {l.image ? <img src={l.image} alt={l.name} className="alc-about__leader-img" /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'rgba(255,255,255,0.2)'}}>{l.initials}</div>}

                  </div>

                  <div className="alc-about__leader-overlay"></div>

                  <div className="alc-about__leader-info">

                    <h3>{l.name}</h3>

                    <div className="alc-about__leader-title">{l.title}</div>

                    {l.linkedin && (

                      <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className="alc-about__linkedin" aria-label="LinkedIn Profile">

                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">

                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>

                        </svg>

                      </a>

                    )}

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

            <span className="alc-about__section-tag ">PRESENCE</span>

            <h2 className="">

              <span className=""><span className="">Engineering &amp; Mission Operations</span></span>

            </h2>

          </div>

          <div className="alc-about__locations-grid ">

            <div className="alc-about__location-card alc-card-shine">

              <div className="alc-about__location-icon">◈</div>

              <h3>Bengaluru, India</h3>

              <div className="alc-about__location-role">Headquarters &amp; Core Engineering</div>

              <p>Primary research, GNC algorithm development, HITL simulation lab, and corporate operations.</p>

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

          <div className="alc-about__cta-inner ">

            <h2 className="">

              <span className=""><span className="">Ready to Explore a Partnership?</span></span>

            </h2>

            <p className="reveal--fade ">Whether you're an agency, commercial operator, defense program, or research institution — we have an engagement path built for your mission.</p>

            <div className="alc-about__cta-buttons  ">

              <Link to="/contact" className="alc-btn-primary">Request Mission Consultation</Link>

              <Link to="/solutions" className="alc-btn-ghost">Explore Solutions by Audience</Link>

            </div>

          </div>

        </div>

      </section>



    </div>

  );

}
