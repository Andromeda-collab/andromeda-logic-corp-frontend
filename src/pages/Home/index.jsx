import './Home.css';

import React, {

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";

import { Link } from "react-router-dom";



import video1 from '../../assets/videos/1. Autonomous Navigation & Deep-Space AI.mp4';

import video2 from '../../assets/videos/2.Extreme_environment.mp4';

import video3 from '../../assets/videos/3. High_volume cosmic data.mp4';

import video4 from '../../assets/videos/4.Simulation_frameworks.mp4';

import heroVideo from '../../assets/HomeSlide/Home_ScreenBackground.mp4';

import lastPhoto from '../../assets/HomeSlide/Last_photo.jpg';

import audSpace from '../../assets/images/Applications/Space_agency.png';

import audComm from '../../assets/images/Applications/Commercial.png';

import audDef from '../../assets/images/Applications/Defence&National.png';

import audRes from '../../assets/images/Applications/ResearchInstitute.png';

import prodGnc from '../../assets/images/product_photos/GNC.png';

import prodEdge from '../../assets/images/product_photos/edge_payload.png';

import prodHitl from '../../assets/images/product_photos/HITL.png';

import prodSwarm from '../../assets/images/product_photos/Swarm.png';

import prodRad from '../../assets/images/product_photos/Radiation.png';

import bgImage from '../../assets/images/black_substitute.jpg';



/* =========================================================

   CONSTANTS

========================================================= */



const COLORS = {

  void: "#05070D",

  indigo: "#0B1026",

  violet: "#6C4CE3",

  magenta: "#E63C8C",

  cyan: "#29E3D9",

  amber: "#FFB648",

  white: "#F5F7FF",

  slate: "#8A93B8",

  green: "#3DDC84",

};



const pillars = [

  {

    id: "01",

    short: "AUTONOMY",

    title: "Autonomous Navigation & Deep-Space AI",

    description:

      "Decision-making intelligence that enables spacecraft and autonomous systems to detect hazards, correct trajectories, maintain orbital position, and adapt missions without continuously waiting for instructions from Earth.",

    keywords: [

      "Hazard avoidance",

      "Trajectory correction",

      "Autonomous landing",

      "Station keeping",

      "Mission adaptation",

    ],

    visual: "navigation",

    accent: COLORS.cyan,

    system: "NAV // AUTONOMOUS",

    videoSrc: video1,

  },

  {

    id: "02",

    short: "RESILIENCE",

    title: "Extreme-Environment Edge Computing",

    description:

      "Computational systems engineered for radiation, thermal extremes, limited power budgets, and demanding onboard environments — enabling intelligent processing where conventional systems cannot.",

    keywords: [

      "Radiation resilience",

      "Low-power inference",

      "Onboard computing",

      "Thermal tolerance",

      "Fault tolerance",

    ],

    visual: "compute",

    accent: COLORS.violet,

    system: "EDGE // RESILIENT",

    videoSrc: video2,

  },

  {

    id: "03",

    short: "SIGNAL",

    title: "High-Volume Cosmic Data & Signal Processing",

    description:

      "Intelligent pipelines that compress, filter, prioritize, and analyze scientific and telemetry data in orbit — transmitting high-value insight instead of overwhelming raw data.",

    keywords: [

      "Telemetry",

      "Signal filtering",

      "Compression",

      "Data prioritization",

      "Downlink optimization",

    ],

    visual: "signal",

    accent: COLORS.magenta,

    system: "DATA // SIGNAL",

    videoSrc: video3,

  },

  {

    id: "04",

    short: "VALIDATION",

    title: "Research Technology & Simulation Frameworks",

    description:

      "High-fidelity hardware-in-the-loop environments and digital twins that validate autonomous systems before deployment and enable deeper collaboration with aerospace and research teams.",

    keywords: [

      "HITL",

      "Digital twins",

      "Mission simulation",

      "System validation",

      "Research collaboration",

    ],

    visual: "simulation",

    accent: COLORS.green,

    system: "SIM // VALIDATION",

    videoSrc: video4,

  },

];



/* =========================================================

   UTILS

========================================================= */



function clamp(value, min, max) {

  return Math.min(Math.max(value, min), max);

}



/* =========================================================

   STYLE BLOCK

========================================================= */



function HomeStyles() {

  return null;

}



/* =========================================================

   HERO BACKGROUND (video with safe fallback to image)

========================================================= */



function HeroBackground() {

  const videoRef = useRef(null);

  const [showImage, setShowImage] = useState(false);



  useEffect(() => {

    const v = videoRef.current;

    if (!v) return;



    // React does not always write the muted attribute to the DOM,

    // and phones refuse to autoplay a video that is not muted.

    v.muted = true;



    const playPromise = v.play();

    if (playPromise && typeof playPromise.catch === "function") {

      // Autoplay blocked (e.g. Low Power Mode): fall back to the still image.

      playPromise.catch(() => setShowImage(true));

    }

  }, []);



  const fill = {

    position: "absolute",

    inset: 0,

    width: "100%",

    height: "100%",

    objectFit: "cover",

    zIndex: 0,

  };



  if (showImage) {

    return (

      <img

        src={lastPhoto}

        alt="Hero Background"

        className="alc-hero__bg-image"

        style={fill}

      />

    );

  }



  return (

    <video

      ref={videoRef}

      src={heroVideo}

      poster={lastPhoto}

      autoPlay

      muted

      loop

      playsInline
      preload="auto"
      onError={() => setShowImage(true)}

      className="alc-hero__bg-video"

      style={fill}

    />

  );

}



/* =========================================================

   PRINCIPLE VISUAL

========================================================= */



function PrincipleVisual({

  type,

  accent,

  progress,

  videoSrc,

  isMuted,

  onToggleMute,

}) {

  const videoRef = useRef(null);



  useEffect(() => {

    if (videoRef.current) {

      videoRef.current.muted = isMuted;

    }

  }, [isMuted, videoSrc]);



  const toggleMute = (e) => {

    e.stopPropagation();

    if (onToggleMute) onToggleMute();

  };



  if (videoSrc) {

    return (

      <div style={{ position: "relative", width: "100%", height: "100%" }}>

        <video

          ref={videoRef}

          key={videoSrc}

          src={videoSrc}

          autoPlay

          loop

          muted={isMuted}

          playsInline

          className="alc-principles__visual-video"

          style={{

            width: "100%",

            height: "100%",

            objectFit: "cover",

            borderRadius: "8px",

          }}

        />

        <button

          onClick={toggleMute}

          style={{

            position: "absolute",

            bottom: "16px",

            right: "16px",

            background: "rgba(5, 7, 13, 0.6)",

            border: `1px solid ${accent}`,

            color: "#fff",

            padding: "8px",

            borderRadius: "50%",

            cursor: "pointer",

            width: "36px",

            height: "36px",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            fontSize: "16px",

            backdropFilter: "blur(4px)",

            zIndex: 10,

            transition: "background 0.2s, transform 0.2s",

          }}

          onMouseEnter={(e) => {

            e.currentTarget.style.background = "rgba(5, 7, 13, 0.9)";

            e.currentTarget.style.transform = "scale(1.05)";

          }}

          onMouseLeave={(e) => {

            e.currentTarget.style.background = "rgba(5, 7, 13, 0.6)";

            e.currentTarget.style.transform = "scale(1)";

          }}

          aria-label={isMuted ? "Unmute video" : "Mute video"}

        >

          {isMuted ? "🔇" : "🔊"}

        </button>

      </div>

    );

  }



  // Fallback if no video

  return <div style={{ width: "100%", height: "100%", background: accent }} />;

}



/* =========================================================

   PRINCIPLES SECTION

========================================================= */



function PrinciplesSection() {

  const sectionRef = useRef(null);

  const [progress, setProgress] = useState(0);

  const [globalMuted, setGlobalMuted] = useState(true);



  const activeIndex = clamp(

    Math.floor(progress * pillars.length),

    0,

    pillars.length - 1

  );



  const localProgress = clamp(

    progress * pillars.length - activeIndex,

    0,

    1

  );



  useEffect(() => {

    const section = sectionRef.current;

    if (!section) return;



    let raf = 0;



    const update = () => {

      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      const totalTravel = section.offsetHeight - viewportHeight;

      const raw = totalTravel <= 0 ? 0 : -rect.top / totalTravel;



      setProgress(clamp(raw, 0, 0.99999));

    };



    const onScroll = () => {

      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(update);

    };



    update();



    window.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", onScroll);



    return () => {

      cancelAnimationFrame(raf);

      window.removeEventListener("scroll", onScroll);

      window.removeEventListener("resize", onScroll);

    };

  }, []);



  /*

   * Each card gets a continuous visual

   * position derived from scroll progress.

   */



  const cardStyles = useMemo(() => {

    return pillars.map((_, index) => {

      const position = index - progress * pillars.length;

      const distance = Math.abs(position);



      const scale =

        index === activeIndex

          ? 1

          : clamp(0.96 - distance * 0.015, 0.91, 0.96);



      const opacity =

        index === activeIndex

          ? 1

          : clamp(1 - distance * 0.24, 0.04, 0.32);



      const y = index === activeIndex ? 0 : position * 90;



      const blur =

        index === activeIndex ? 0 : clamp(distance * 1.8, 0, 4);



      return {

        opacity,

        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,

        filter: `blur(${blur}px)`,

        zIndex: index === activeIndex ? 5 : 4 - index,

        "--pillar-accent": pillars[index].accent,

      };

    });

  }, [progress, activeIndex]);



  const currentPillar = pillars[activeIndex];



  return (

    <section ref={sectionRef} className="alc-principles">

      <div className="alc-principles__sticky">



        <div className="alc-principles__bg-grid" />



        <div className="alc-principles__orbit" />



        <div className="alc-principles__orbit alc-principles__orbit--two" />



        <div className="alc-principles__header">

          <span className="alc-principles__eyebrow">

            Core Principles

          </span>



          <h2 className="alc-principles__heading">

            Engineering intelligence

            for environments that

            don't forgive error.

          </h2>



          <p className="alc-principles__intro">

            Four principles shape every

            system Andromeda Logic builds:

            autonomy, resilience, signal

            intelligence, and verifiable

            simulation.

          </p>

        </div>



        <div className="alc-principles__stage">



          <div className="alc-principles__visual">



            <div className="alc-principles__visual-frame">



              <div className="alc-principles__system">

                SYSTEM STATUS

                {"  "}

                <span>

                  {currentPillar.system}

                </span>

              </div>



              <div className="alc-principles__scanline" />



              <PrincipleVisual

                type={currentPillar.visual}

                accent={currentPillar.accent}

                videoSrc={currentPillar.videoSrc}

                progress={localProgress}

                isMuted={globalMuted}

                onToggleMute={() => setGlobalMuted(!globalMuted)}

              />



            </div>

          </div>



          <div className="alc-principles__copy-stage">



            <div className="alc-principles__copy">



              {pillars.map((pillar, index) => {

                const position = index - progress * pillars.length;

                const active = index === activeIndex;



                const opacity = active ? 1 : 0;

                const y = active ? 0 : position < 0 ? -30 : 30;

                const scale = active ? 1 : 0.94;



                return (

                  <div

                    key={pillar.id}

                    className="alc-principles__copy-item"

                    style={{

                      opacity,

                      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,

                      "--pillar-accent": pillar.accent,

                    }}

                  >

                    <h3 className="alc-principles__copy-title">

                      {pillar.title}

                    </h3>



                    <p className="alc-principles__copy-description">

                      {pillar.description}

                    </p>



                    <div className="alc-principles__keywords">

                      {pillar.keywords.map((keyword) => (

                        <span

                          key={keyword}

                          className="alc-principles__keyword"

                        >

                          {keyword}

                        </span>

                      ))}

                    </div>

                  </div>

                );

              })}



            </div>

          </div>

        </div>



        <div className="alc-principles__progress">

          <div className="alc-principles__progress-track">

            <div

              className="alc-principles__progress-fill"

              style={{

                height: `${progress * 100}%`,

              }}

            />

          </div>



          <div className="alc-principles__dots">

            {pillars.map((pillar, index) => (

              <div

                key={pillar.id}

                className={`alc-principles__dot ${index === activeIndex ? "active" : ""}`}

              />

            ))}

          </div>

        </div>



        <div className="alc-principles__scroll-hint">

          ↓ SCROLL TO NAVIGATE SYSTEM

        </div>

      </div>

    </section>

  );

}



/* =========================================================

   HOME

========================================================= */



export default function Home() {

  return (

    <>

      <HomeStyles />



      <div className="alc-home">



        {/* =================================================

            HERO

        ================================================= */}



        <section className="alc-hero">



          {/* Scanning horizon line */}

          <div className="alc-hero__scan" aria-hidden="true" />



          {/* Twinkling star constellation */}

          <div className="alc-hero__constellation" aria-hidden="true">

            {[

              [12,18],[22,72],[8,44],[35,8],[18,88],[45,32],[55,65],[30,50],

              [65,12],[72,78],[80,35],[88,55],[92,22],[6,62],[40,95],[58,42],

              [75,90],[84,8],[48,70],[16,35],[95,48],[62,18],[28,80],[50,5]

            ].map(([x, y], i) => (

              <span key={i} className="alc-hero__star" aria-hidden="true" style={{

                left: `${x}%`, top: `${y}%`,

                '--dur': `${2.5 + (i % 5) * 0.7}s`,

                '--delay': `${(i % 8) * 0.4}s`,

                width: i % 5 === 0 ? '3px' : '2px',

                height: i % 5 === 0 ? '3px' : '2px',

                background: i % 3 === 0 ? 'rgba(41,227,217,0.7)' : i % 7 === 0 ? 'rgba(108,76,227,0.8)' : 'rgba(245,247,255,0.6)',

                boxShadow: i % 5 === 0 ? '0 0 6px rgba(41,227,217,0.6)' : 'none',

              }} />

            ))}

          </div>



          {/* Spinning signal orbit rings (right side) */}

          <div className="alc-hero__signal-ring" aria-hidden="true" />



          {/* Hero background: video, with image fallback */}

          <HeroBackground />



          <div className="alc-container alc-hero__content">

            <div className="alc-hero__content-inner">

              <div className="alc-hero__eyebrow alc-hero-enter alc-hero-enter--1">

                Andromeda Logic Corp

              </div>

              <h1 className="alc-hero__title alc-hero-enter alc-hero-enter--2">

                <span className="alc-hero__title-line">Intelligent</span>

                <span className="alc-hero__title-line">Systems for</span>

                <span className="alc-hero__title-line alc-hero__title-accent">the Deep Space Era.</span>

              </h1>

              <p className="alc-hero__copy alc-hero-enter alc-hero-enter--3">

                Autonomous intelligence, radiation-resilient computing, and advanced simulation for systems that must think, adapt, and operate beyond Earth.

              </p>

              <div className="alc-hero__actions alc-hero-enter alc-hero-enter--4" style={{ marginTop: '54px' }}>

                <Link to="/contact" className="alc-button alc-button--primary alc-hero__button">

                  Request Mission Consultation

                  <span>↗</span>

                </Link>

                <Link to="/technology" className="alc-button alc-button--secondary alc-hero__button">

                  Explore Technology

                  <span>→</span>

                </Link>

              </div>

            </div>

          </div>

          <div className="alc-scroll-indicator">

            Scroll

            <span className="alc-scroll-indicator__line" />

          </div>



        </section>



        {/* =================================================

            PROOF

        ================================================= */}



        <section className="alc-proof">



          <div className="alc-container">



            <div className="alc-proof__grid">



              <div className="alc-proof__item">

                <span className="alc-proof__num">

                  10+

                </span>



                <span className="alc-proof__label">

                  Mission Heritage

                </span>



                <span className="alc-proof__scan" />

              </div>



              <div className="alc-proof__item">

                <span className="alc-proof__num">

                  100%

                </span>



                <span className="alc-proof__label">

                  Radiation-Tolerant IP

                </span>

              </div>



              <div className="alc-proof__item">

                <span className="alc-proof__num">

                  HITL

                </span>



                <span className="alc-proof__label">

                  Validation Rigor

                </span>

              </div>



              <div className="alc-proof__item">

                <span className="alc-proof__num">

                  5

                </span>



                <span className="alc-proof__label">

                  Core Platforms

                </span>

              </div>



            </div>



          </div>

        </section>



        {/* =================================================

            PINNED FOUR PILLARS

        ================================================= */}



        <PrinciplesSection />



        {/* =================================================

            PRODUCTS

        ================================================= */}



        <section className="alc-section alc-section--void" style={{ background: `linear-gradient(rgba(5, 7, 13, 0.75), rgba(5, 7, 13, 0.75)), url(${bgImage}) no-repeat center center fixed`, backgroundSize: 'cover' }}>



          <div className="alc-container">



            <div className="alc-section__eyebrow alc-eyebrow-reveal">

              Products & Platforms

            </div>



            <h2 className="alc-section__heading split-text">

              <span className="split-text__line"><span className="split-text__inner">Systems engineered</span></span>

              <span className="split-text__line"><span className="split-text__inner" style={{ transitionDelay: '0.08s' }}>for the conditions</span></span>

              <span className="split-text__line"><span className="split-text__inner" style={{ transitionDelay: '0.16s' }}>where conventional</span></span>

              <span className="split-text__line"><span className="split-text__inner" style={{ transitionDelay: '0.24s' }}>computing fails.</span></span>

            </h2>



            <p className="alc-section__description reveal--fade reveal-delay-4">

              Named platforms spanning

              autonomous navigation,

              radiation-tolerant inference,

              onboard edge processing,

              swarm intelligence, and

              simulation.

            </p>



            <div className="alc-products-grid stagger-children">



              <ProductCard

                status="Flight-Proven"

                statusClass="alc-status--green"

                title="GNC Autonomy Stack"

                description="Real-time hazard detection, trajectory correction, and orbital station-keeping."

                image={prodGnc}

                to="/products/gnc-autonomy-stack"

              />



              <ProductCard

                status="In Development"

                statusClass="alc-status--amber"

                title="EDGE Payload"

                description="Onboard processing of camera, optical, scientific, and telemetry data."

                image={prodEdge}

                to="/products/edge-payload"

              />



              <ProductCard

                status="Flight-Proven"

                statusClass="alc-status--green"

                title="HITL Digital Twin Suite"

                description="High-fidelity orbital and deep-space simulation for pre-deployment validation."

                image={prodHitl}

                to="/products/hitl-digital-twin-suite"

              />



              <ProductCard

                status="Roadmap"

                statusClass="alc-status--slate"

                title="Swarm Orchestrator"

                description="Multi-agent decision engines for constellations, habitats, and autonomous systems."

                image={prodSwarm}

                to="/products/swarm-orchestrator"

              />



              <ProductCard

                status="In Development"

                statusClass="alc-status--amber"

                title="Radiation-Tolerant Inference Engine"

                description="Intelligent inference optimized for radiation-hardened, low-power hardware."

                image={prodRad}

                to="/products/radiation-tolerant-inference-engine"

              />



            </div>



          </div>

        </section>



        
        {/* =================================================
            ALC CORE TECHNOLOGY MATRIX
        ================================================= */}

        <section className="alc-section alc-section--indigo alc-tech-matrix">
          <div className="alc-container">

            <div className="alc-tech-matrix__header">
              <span className="alc-telemetry">ALC TECHNOLOGY</span>

              <h2 className="alc-tech-matrix__heading">
                Our Core
                <br />
                <span>Technological Matrix.</span>
              </h2>

              <p className="alc-tech-matrix__intro">
                Advanced autonomous intelligence, resilient computing,
                and adaptive hardware engineered for orbital, lunar,
                and deep-space environments.
              </p>
            </div>

            <div className="alc-tech-matrix__grid">

              <article className="alc-tech-matrix__card">
                <div className="alc-tech-matrix__number">01</div>
                <div className="alc-tech-matrix__icon">◎</div>

                <h3>
                  Deep-Space Navigation
                  <br />
                  &amp; Neural Guidance
                </h3>

                <p>
                  Self-correcting trajectory AI, multi-body dynamics
                  solvers, and real-time hazard avoidance for lunar
                  and interplanetary missions.
                </p>

                <div className="alc-tech-matrix__tags">
                  <span>Navigation AI</span>
                  <span>Orbital Mechanics</span>
                  <span>Hazard Avoidance</span>
                </div>
              </article>

              <article className="alc-tech-matrix__card">
                <div className="alc-tech-matrix__number">02</div>
                <div className="alc-tech-matrix__icon">◈</div>

                <h3>
                  Fault-Tolerant Edge
                  <br />
                  &amp; Quantum Computing
                </h3>

                <p>
                  Radiation-hardened processing, redundant neural
                  compute clusters, and quantum-inspired optimization
                  for resilient mission operations.
                </p>

                <div className="alc-tech-matrix__tags">
                  <span>Rad-Hard Compute</span>
                  <span>Edge AI</span>
                  <span>Fault Tolerance</span>
                </div>
              </article>

              <article className="alc-tech-matrix__card">
                <div className="alc-tech-matrix__number">03</div>
                <div className="alc-tech-matrix__icon">⬡</div>

                <h3>
                  Extreme Environment
                  <br />
                  Hardware &amp; Robotics
                </h3>

                <p>
                  Thermal-vacuum qualified systems, adaptive mobility
                  technologies, and AI-driven anomaly response
                  designed for harsh orbital environments.
                </p>

                <div className="alc-tech-matrix__tags">
                  <span>Robotics</span>
                  <span>Thermal Vacuum</span>
                  <span>Adaptive Systems</span>
                </div>
              </article>

            </div>

            <div className="alc-tech-matrix__autonomy">

              <div className="alc-tech-matrix__autonomy-copy">
                <span className="alc-telemetry">AUTONOMOUS EXPLORATION</span>

                <h3>
                  Autonomy that does not
                  <br />
                  wait for Earth.
                </h3>
              </div>

              <div className="alc-tech-matrix__steps">
                <div>
                  <span>01</span>
                  <strong>Sense</strong>
                </div>

                <span className="alc-tech-matrix__arrow">→</span>

                <div>
                  <span>02</span>
                  <strong>Decide</strong>
                </div>

                <span className="alc-tech-matrix__arrow">→</span>

                <div>
                  <span>03</span>
                  <strong>Act</strong>
                </div>

                <span className="alc-tech-matrix__arrow">→</span>

                <div>
                  <span>04</span>
                  <strong>Learn</strong>
                </div>
              </div>

            </div>

            <div className="alc-tech-matrix__stack">
              <span>Autonomy</span>
              <span>Mission ML</span>
              <span>Orbital Mechanics</span>
              <span>HPC</span>
              <span>Quantum-Ready</span>
              <span>Cyber</span>
              <span>Digital Twin</span>
              <span>Satcom</span>
              <span>Edge</span>
              <span>Simulation</span>
            </div>

            <div className="alc-tech-matrix__cta">
              <Link to="/technology" className="alc-button alc-button--primary">
                Explore ALC Technology
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>


        {/* =================================================
            DEEP-SPACE COMPUTATIONAL SYSTEMS
        ================================================= */}

        <section className="alc-section alc-section--void alc-compute-stack">
          <div className="alc-container">

            <div className="alc-compute-stack__header">
              <span className="alc-telemetry">
                COMPUTATION
              </span>

              <h2 className="alc-compute-stack__heading">
                Deep-space
                <br />
                <span>computational systems.</span>
              </h2>

              <p className="alc-compute-stack__intro">
                A technology stack that starts at the payload and
                extends to secure mission intelligence on the ground.
              </p>
            </div>

            <div className="alc-compute-stack__grid">

              <article className="alc-compute-stack__card">
                <span className="alc-compute-stack__number">01</span>
                <div className="alc-compute-stack__icon">EDGE</div>

                <h3>Payload Edge</h3>

                <p>
                  On-sensor inference with bandwidth treated as a
                  scarce mission resource.
                </p>
              </article>

              <article className="alc-compute-stack__card">
                <span className="alc-compute-stack__number">02</span>
                <div className="alc-compute-stack__icon">CORE</div>

                <h3>Rad-Hard Cores</h3>

                <p>
                  Compute designed for radiation, thermal-vacuum
                  conditions, and fault-tolerant operation.
                </p>
              </article>

              <article className="alc-compute-stack__card">
                <span className="alc-compute-stack__number">03</span>
                <div className="alc-compute-stack__icon">AI</div>

                <h3>Mission AI</h3>

                <p>
                  Planning, anomaly detection, and autonomy models
                  that live with the spacecraft.
                </p>
              </article>

              <article className="alc-compute-stack__card">
                <span className="alc-compute-stack__number">04</span>
                <div className="alc-compute-stack__icon">MESH</div>

                <h3>Ground Mesh</h3>

                <p>
                  Secure downlink, digital twins, and
                  human-on-the-loop mission operations.
                </p>
              </article>

            </div>

            <div className="alc-compute-stack__flow">
              <span>PAYLOAD EDGE</span>
              <i>→</i>
              <span>RAD-HARD CORE</span>
              <i>→</i>
              <span>MISSION AI</span>
              <i>→</i>
              <span>GROUND MESH</span>
            </div>

          </div>
        </section>

{/* =================================================

            AUDIENCE

        ================================================= */}



        <section className="alc-section alc-section--void" style={{ background: `linear-gradient(rgba(5, 7, 13, 0.75), rgba(5, 7, 13, 0.75)), url(${bgImage}) no-repeat center center fixed`, backgroundSize: 'cover' }}>



          <div className="alc-container">



            <div className="alc-section__eyebrow alc-eyebrow-reveal">

              Solutions by Audience

            </div>



            <h2 className="alc-section__heading split-text">

              <span className="split-text__line"><span className="split-text__inner">Built for missions</span></span>

              <span className="split-text__line"><span className="split-text__inner" style={{ transitionDelay: '0.1s' }}>with no room for</span></span>

              <span className="split-text__line"><span className="split-text__inner" style={{ transitionDelay: '0.2s' }}>uncertainty.</span></span>

            </h2>



            <div className="alc-audience stagger-children">



              <AudienceCard

                number="01"

                title="Space Agencies"

                image={audSpace}

                icon="AG"

                description="Mission-critical GNC algorithms and hardware for orbital and deep-space missions."

                to="/solutions/space-agencies"

              />



              <AudienceCard

                number="02"

                title="Commercial Space"

                image={audComm}

                icon="CS"

                description="Scalable autonomous systems for constellations, logistics, and infrastructure."

                to="/solutions/commercial"

              />



              <AudienceCard

                number="03"

                title="Defense & National Security"

                image={audDef}

                icon="DN"

                description="Resilient edge compute and swarm orchestration for tactical superiority."

                to="/solutions/defense"

              />



              <AudienceCard

                number="04"

                title="Research Institutions"

                image={audRes}

                icon="RI"

                description="High-fidelity HITL simulation and digital twins for advanced aerospace research."

                to="/solutions/research"

              />



            </div>



          </div>

        </section>



        {/* =================================================
            FINAL TECHNOLOGY CTA
        ================================================= */}

        <section className="alc-orbits-cta">
          <div className="alc-container alc-orbits-cta__inner">

            <span className="alc-telemetry">
              ANDROMEDA LOGIC CORP
            </span>

            <h2>
              Let&apos;s build
              <br />
              <span>what orbits next.</span>
            </h2>

            <p>
              Build with ALC across autonomous systems, mission AI,
              resilient edge computing, digital twins, simulation,
              and research infrastructure.
            </p>

            <div className="alc-orbits-cta__actions">
              <Link
                to="/contact"
                className="alc-button alc-button--primary"
              >
                Start a Mission Conversation
                <span>↗</span>
              </Link>

              <Link
                to="/technology"
                className="alc-button alc-button--secondary"
              >
                Explore Technology
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>



      </div>

    </>

  );

}



/* =========================================================

   PRODUCT CARD

========================================================= */



function ProductCard({

  status,

  statusClass,

  title,

  description,

  image,

  to = "/products"

}) {

  return (

    <Link

      to={to}

      className="alc-product"

      style={{ overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'flex-start' }}

    >

      <div className="alc-product__orb" style={{ top: '24px', right: '24px', zIndex: 3 }} />



      {image && (

        <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.5)', zIndex: 2 }}>

          <img

            src={image}

            alt={title}

            className="alc-product__bg-img"

            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }}

          />

        </div>

      )}



      <div style={{ position: 'relative', zIndex: 2, padding: '0 8px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        <span

          className={`alc-status ${statusClass}`}

          style={{ marginBottom: '16px', alignSelf: 'flex-start' }}

        >

          {status}

        </span>



        <h3 style={{ margin: '0 0 8px', fontSize: '22px' }}>

          {title}

        </h3>



        <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', lineHeight: '1.5' }}>

          {description}

        </p>

      </div>

    </Link>

  );

}



/* =========================================================

   AUDIENCE CARD

========================================================= */



function AudienceCard({ number, title, description, icon, to, image }) {

  return (

    <Link to={to} className="alc-audience__card" style={{ display: 'flex', flexDirection: 'column', padding: '16px', minHeight: 'auto', gap: '16px' }}>

      {image && (

        <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.5)' }}>

          <img

            src={image}

            alt={title}

            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }}

            className="alc-audience__bg-img"

          />

        </div>

      )}

      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px 8px', flex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>

          <div className="alc-audience__icon" style={{ borderColor: 'rgba(41,227,217,0.2)', color: '#fff', fontSize: '14px', fontWeight: 'bold', width: '40px', height: '40px' }}>{icon}</div>

          <span className="alc-audience__number" style={{ position: 'static', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{number}</span>

        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', lineHeight: '1.2', transition: 'color 0.4s ease' }} className="alc-audience__title">{title}</h3>

        {description && (

          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>

            {description}

          </p>

        )}

      </div>

    </Link>

  );

}