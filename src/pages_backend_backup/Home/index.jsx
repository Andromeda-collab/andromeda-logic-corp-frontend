import './Home.css';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

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
  },
];

/* =========================================================
   UTILS
========================================================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

function easeInOutCubic(t) {
  t = clamp(t, 0, 1);

  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* =========================================================
   STYLE BLOCK
========================================================= */

function HomeStyles() {
  return (
    null
  );
}

/* =========================================================
   INTERACTIVE A CANVAS
========================================================= */

function InteractiveA() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    active: false,
  });

  const particlesRef = useRef([]);
  const dimensionsRef = useRef({
    width: 0,
    height: 0,
    dpr: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isMobile = window.innerWidth <= 700;

    const createParticles = (width, height) => {
      const count = reducedMotion
        ? 450
        : isMobile
          ? 750
          : Math.min(
            2400,
            Math.floor((width * height) / 550)
          );

      const points = [];

      /*
       * Construct the A from three large geometric regions:
       *
       * left diagonal
       * right diagonal
       * crossbar
       *
       * We create lots of particles along the geometry with
       * slight 3D depth.
       */

      const cx = width * 0.64;
      const top = height * 0.03;
      const bottom = height * 0.78;

      const aWidth = Math.min(width * 0.56, 780);
      const leftX = cx - aWidth / 2;
      const rightX = cx + aWidth / 2;
      const crossY = lerp(top, bottom, 0.49);

      const segments = [
        {
          x1: cx,
          y1: top,
          x2: leftX,
          y2: bottom,
          weight: 0.39,
        },
        {
          x1: cx,
          y1: top,
          x2: rightX,
          y2: bottom,
          weight: 0.39,
        },
        {
          x1: leftX + aWidth * 0.15,
          y1: crossY,
          x2: rightX - aWidth * 0.15,
          y2: crossY,
          weight: 0.22,
        },
      ];

      segments.forEach((segment) => {
        const segmentCount = Math.max(
          1,
          Math.floor(count * segment.weight)
        );

        for (let i = 0; i < segmentCount; i++) {
          const t = Math.random();

          const x = lerp(segment.x1, segment.x2, t);
          const y = lerp(segment.y1, segment.y2, t);

          const spread = 250 + Math.random() * 28;

          points.push({
            x: x + (Math.random() - 0.5) * spread,
            y: y + (Math.random() - 0.5) * spread,
            baseX: x,
            baseY: y,
            z: Math.random(),
            size:
              Math.random() < 0.05
                ? 1.6 + Math.random() * 1.2
                : 0.45 + Math.random() * 0.8,
            alpha:
              0.25 + Math.random() * 0.55,
            phase: Math.random() * Math.PI * 2,
            speed:
              0.0004 + Math.random() * 0.001,
          });
        }
      });

      /*
       * Ambient telemetry points surrounding A.
       */

      const ambientCount = Math.floor(
        reducedMotion ? 90 : isMobile ? 130 : 250
      );

      for (let i = 0; i < ambientCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius =
          Math.min(width, height) *
          (0.30 + Math.random() * 0.42);

        const x = cx + Math.cos(angle) * radius;
        const y =
          height * 0.42 +
          Math.sin(angle) * radius * 0.34;

        points.push({
          x,
          y,
          baseX: x,
          baseY: y,
          z: Math.random(),
          size: 0.4 + Math.random() * 0.8,
          alpha: 0.12 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0002 + Math.random() * 0.001,
        });
      }

      particlesRef.current = points;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        isMobile ? 1.5 : 2
      );

      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
        dpr,
      };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createParticles(rect.width, rect.height);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();

      mouseRef.current.tx =
        event.clientX - rect.left;

      mouseRef.current.ty =
        event.clientY - rect.top;

      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener(
      "mousemove",
      onMouseMove,
      { passive: true }
    );

    container.addEventListener(
      "mouseleave",
      onMouseLeave
    );

    const render = (time) => {
      const {
        width,
        height,
      } = dimensionsRef.current;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      const mouse = mouseRef.current;

      if (mouse.active) {
        mouse.x = lerp(
          mouse.x,
          mouse.tx,
          0.07
        );

        mouse.y = lerp(
          mouse.y,
          mouse.ty,
          0.07
        );
      } else {
        mouse.x = lerp(
          mouse.x,
          width * 0.64,
          0.025
        );

        mouse.y = lerp(
          mouse.y,
          height * 0.4,
          0.025
        );
      }

      const particles = particlesRef.current;

      /*
       * Draw connections first.
       * Keep connections sparse so the A looks engineered,
       * not like a giant mesh.
       */

      if (!reducedMotion) {
        for (
          let i = 0;
          i < particles.length;
          i += 1
        ) {
          const p = particles[i];

          if (p.z < 0.35) continue;

          const influence =
            Math.max(
              0,
              1 -
              Math.hypot(
                p.x - mouse.x,
                p.y - mouse.y
              ) /
              180
            );

          if (influence < 0.03) continue;

          ctx.beginPath();

          ctx.moveTo(
            p.x,
            p.y
          );

          ctx.lineTo(
            lerp(
              p.baseX,
              mouse.x,
              influence * 0.04
            ),
            lerp(
              p.baseY,
              mouse.y,
              influence * 0.04
            )
          );

          ctx.strokeStyle =
            `rgba(41,227,217,${0.025 * influence})`;

          ctx.lineWidth = 0.5;

          ctx.stroke();
        }
      }

      /*
       * Particles.
       */

      particles.forEach((p) => {
        const wave =
          reducedMotion
            ? 0
            : Math.sin(
              time * p.speed +
              p.phase
            ) * 1.4;

        const dx =
          p.baseX -
          mouse.x;

        const dy =
          p.baseY -
          mouse.y;

        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        const interactionRadius =
          isMobile ? 130 : 220;

        let interaction =
          Math.max(
            0,
            1 -
            distance /
            interactionRadius
          );

        interaction =
          interaction *
          interaction;

        /*
         * Cursor creates a very subtle
         * attraction / repulsion field.
         */

        let targetX = p.baseX;
        let targetY = p.baseY;

        if (interaction > 0) {
          targetX +=
            (dx /
              Math.max(distance, 1)) *
            interaction *
            12;

          targetY +=
            (dy /
              Math.max(distance, 1)) *
            interaction *
            12;
        }

        p.x = lerp(
          p.x,
          targetX +
          wave * (0.2 + p.z),
          0.045
        );

        p.y = lerp(
          p.y,
          targetY +
          wave * (0.12 + p.z),
          0.045
        );

        const depthScale =
          0.6 + p.z * 0.9;

        const size =
          p.size *
          depthScale *
          (1 + interaction * 0.7);

        let color;

        if (p.z > 0.84) {
          color =
            COLORS.cyan;
        } else if (p.z > 0.62) {
          color =
            COLORS.white;
        } else if (p.z > 0.35) {
          color =
            COLORS.violet;
        } else {
          color =
            COLORS.white;
        }

        const alpha =
          p.alpha *
          (0.5 + p.z * 0.5) *
          (1 + interaction * 0.7);

        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          color === COLORS.cyan
            ? `rgba(41,227,217,${alpha})`
            : color === COLORS.violet
              ? `rgba(108,76,227,${alpha * 0.8})`
              : `rgba(245,247,255,${alpha})`;

        ctx.fill();
      });

      /*
       * Draw several "signal" nodes.
       */

      if (!reducedMotion) {
        const nodeSeed = Math.floor(
          time / 800
        ) % 8;

        for (
          let i = 0;
          i < 8;
          i += 1
        ) {
          const p =
            particles[
            (nodeSeed * 93 + i * 137) %
            particles.length
            ];

          if (!p) continue;

          const pulse =
            1 +
            Math.sin(
              time * 0.002 +
              i
            ) *
            0.25;

          ctx.beginPath();

          ctx.arc(
            p.x,
            p.y,
            2.4 * pulse,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            `rgba(41,227,217,0.85)`;

          ctx.shadowColor =
            COLORS.cyan;

          ctx.shadowBlur = 12;

          ctx.fill();

          ctx.shadowBlur = 0;
        }
      }

      animationRef.current =
        requestAnimationFrame(render);
    };

    animationRef.current =
      requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();

      container.removeEventListener(
        "mousemove",
        onMouseMove
      );

      container.removeEventListener(
        "mouseleave",
        onMouseLeave
      );

      cancelAnimationFrame(
        animationRef.current
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        className="alc-hero__canvas"
        aria-hidden="true"
      />
    </div>
  );
}

/* =========================================================
   SATELLITE CANVAS
========================================================= */

function SatelliteCanvas() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const startTime = performance.now();

    /* ---- geometry helpers ---- */
    function setLineStyle(color, width, blur = 0) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
    }

    function drawSatellite(cx, cy, scale) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      /* --- Main body --- */
      const bw = 38, bh = 22;
      setLineStyle("rgba(41,227,217,0.9)", 1.5, 14);
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3);
      ctx.stroke();

      /* --- Cross-hatching on body --- */
      setLineStyle("rgba(41,227,217,0.22)", 0.7, 0);
      for (let x = -bw / 2 + 8; x < bw / 2; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, -bh / 2);
        ctx.lineTo(x, bh / 2);
        ctx.stroke();
      }

      /* --- Solar panels left --- */
      const pw = 44, ph = 14, gap = 6;
      setLineStyle("rgba(108,76,227,0.85)", 1.2, 10);
      ctx.beginPath();
      ctx.rect(-bw / 2 - gap - pw, -ph / 2, pw, ph);
      ctx.stroke();
      /* panel cells */
      setLineStyle("rgba(108,76,227,0.3)", 0.6, 0);
      for (let x = -bw / 2 - gap - pw + 11; x < -bw / 2 - gap; x += 11) {
        ctx.beginPath();
        ctx.moveTo(x, -ph / 2);
        ctx.lineTo(x, ph / 2);
        ctx.stroke();
      }
      /* connector arm */
      setLineStyle("rgba(41,227,217,0.55)", 1, 6);
      ctx.beginPath();
      ctx.moveTo(-bw / 2, 0);
      ctx.lineTo(-bw / 2 - gap, 0);
      ctx.stroke();

      /* --- Solar panels right (mirror) --- */
      setLineStyle("rgba(108,76,227,0.85)", 1.2, 10);
      ctx.beginPath();
      ctx.rect(bw / 2 + gap, -ph / 2, pw, ph);
      ctx.stroke();
      setLineStyle("rgba(108,76,227,0.3)", 0.6, 0);
      for (let x = bw / 2 + gap + 11; x < bw / 2 + gap + pw; x += 11) {
        ctx.beginPath();
        ctx.moveTo(x, -ph / 2);
        ctx.lineTo(x, ph / 2);
        ctx.stroke();
      }
      setLineStyle("rgba(41,227,217,0.55)", 1, 6);
      ctx.beginPath();
      ctx.moveTo(bw / 2, 0);
      ctx.lineTo(bw / 2 + gap, 0);
      ctx.stroke();

      /* --- Antenna --- */
      setLineStyle("rgba(41,227,217,0.7)", 1, 8);
      ctx.beginPath();
      ctx.moveTo(0, -bh / 2);
      ctx.lineTo(0, -bh / 2 - 18);
      ctx.stroke();
      /* Dish arc */
      ctx.beginPath();
      ctx.arc(0, -bh / 2 - 18, 8, Math.PI, 0);
      ctx.stroke();
      /* Dish center dot */
      ctx.beginPath();
      ctx.arc(0, -bh / 2 - 18, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(41,227,217,0.9)";
      ctx.shadowColor = "#29E3D9";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      /* --- Engine nozzles --- */
      setLineStyle("rgba(230,60,140,0.8)", 1.2, 8);
      ctx.beginPath();
      ctx.moveTo(-8, bh / 2);
      ctx.lineTo(-12, bh / 2 + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, bh / 2);
      ctx.lineTo(12, bh / 2 + 10);
      ctx.stroke();

      /* --- Engine glow --- */
      const grad = ctx.createRadialGradient(0, bh / 2 + 12, 0, 0, bh / 2 + 12, 14);
      grad.addColorStop(0, "rgba(230,60,140,0.5)");
      grad.addColorStop(1, "rgba(230,60,140,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, bh / 2 + 12, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const render = (now) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      const elapsed = (now - startTime) / 1000; // seconds

      /* ---- Phase 1: enter large, blurred, bottom-left → center orbit ---- */
      /* ---- Phase 2: settle on orbital ring                           ---- */
      /* ---- Phase 3: orbit drift                                      ---- */

      const PHASE1_END = 4.5;
      const PHASE2_END = 7.5;

      // Target position: the orbital ring center is approx 64% across, 38% down
      const orbitCX = W * 0.64;
      const orbitRX = W * 0.26;   // ring semi-major axis
      const orbitRY = H * 0.10;   // ring semi-minor axis

      let satX, satY, satScale, blur;

      if (reducedMotion) {
        // Just show it statically on the ring
        const angle = -0.4;
        satX = orbitCX + Math.cos(angle) * orbitRX;
        satY = H * 0.38 + Math.sin(angle) * orbitRY;
        satScale = 0.6;
        blur = 0;
      } else if (elapsed < PHASE1_END) {
        const t = Math.min(elapsed / PHASE1_END, 1);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

        const startX = W * 0.08;
        const startY = H * 0.88;

        const angle = lerp(-Math.PI * 0.6, -0.4, ease);
        const endX = orbitCX + Math.cos(-0.4) * orbitRX;
        const endY = H * 0.38 + Math.sin(-0.4) * orbitRY;

        satX = lerp(startX, endX, ease);
        satY = lerp(startY, endY, ease);
        satScale = lerp(3.2, 0.6, ease);
        blur = lerp(10, 0, ease);
      } else if (elapsed < PHASE2_END) {
        const t = (elapsed - PHASE1_END) / (PHASE2_END - PHASE1_END);
        const ease = 1 - Math.pow(1 - t, 2);
        const angle = lerp(-0.4, -0.4 - Math.PI * 0.12, ease);
        satX = orbitCX + Math.cos(angle) * orbitRX;
        satY = H * 0.38 + Math.sin(angle) * orbitRY;
        satScale = lerp(0.6, 0.55, ease);
        blur = 0;
      } else {
        // Drift along orbital ring
        const angle = -0.4 - Math.PI * 0.12 - (elapsed - PHASE2_END) * 0.075;
        satX = orbitCX + Math.cos(angle) * orbitRX;
        satY = H * 0.38 + Math.sin(angle) * orbitRY;
        satScale = 0.55 + Math.sin((elapsed - PHASE2_END) * 0.4) * 0.02;
        blur = 0;
      }

      /* apply blur via filter */
      if (blur > 0.1) {
        ctx.filter = `blur(${blur.toFixed(1)}px)`;
      } else {
        ctx.filter = "none";
      }

      drawSatellite(satX, satY, satScale);
      ctx.filter = "none";

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 3,
      }}
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
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const parent =
      canvas.parentElement;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let frame;

    const draw = (time) => {
      const width =
        parent.clientWidth;

      const height =
        parent.clientHeight;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.75
      );

      if (
        canvas.width !==
        width * dpr
      ) {
        canvas.width =
          width * dpr;

        canvas.height =
          height * dpr;

        canvas.style.width =
          `${width}px`;

        canvas.style.height =
          `${height}px`;
      }

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      const cx =
        width * 0.5;

      const cy =
        height * 0.52;

      /*
       * Background crosshair.
       */

      ctx.strokeStyle =
        "rgba(245,247,255,0.055)";

      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(cx, 60);
      ctx.lineTo(cx, height - 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(70, cy);
      ctx.lineTo(width - 70, cy);
      ctx.stroke();

      /*
       * Shared orbital structure.
       */

      ctx.save();

      ctx.translate(
        cx,
        cy
      );

      ctx.rotate(
        -0.14 + progress * 0.08
      );

      ctx.scale(
        1,
        0.36
      );

      [0.88, 0.65, 0.42].forEach(
        (scale, index) => {
          ctx.beginPath();

          ctx.arc(
            0,
            0,
            Math.min(width, height) *
            0.28 *
            scale,
            0,
            Math.PI * 2
          );

          ctx.strokeStyle =
            index === 0
              ? "rgba(41,227,217,0.17)"
              : "rgba(138,147,184,0.11)";

          ctx.setLineDash(
            index === 1
              ? [4, 7]
              : []
          );

          ctx.stroke();
        }
      );

      ctx.restore();

      /*
       * Principle-specific visualization.
       */

      if (type === "navigation") {
        drawNavigation(
          ctx,
          cx,
          cy,
          width,
          height,
          time,
          progress,
          accent
        );
      }

      if (type === "compute") {
        drawCompute(
          ctx,
          cx,
          cy,
          width,
          height,
          time,
          progress,
          accent
        );
      }

      if (type === "signal") {
        drawSignal(
          ctx,
          cx,
          cy,
          width,
          height,
          time,
          progress,
          accent
        );
      }

      if (type === "simulation") {
        drawSimulation(
          ctx,
          cx,
          cy,
          width,
          height,
          time,
          progress,
          accent
        );
      }

      frame =
        requestAnimationFrame(
          draw
        );
    };

    frame =
      requestAnimationFrame(draw);

    return () =>
      cancelAnimationFrame(frame);
  }, [type, accent, progress]);

  return (
    <canvas
      ref={canvasRef}
      className="alc-principles__visual-canvas"
      aria-hidden="true"
    />
  );
}

/* =========================================================
   VISUAL FUNCTIONS
========================================================= */

function drawNavigation(
  ctx,
  cx,
  cy,
  width,
  height,
  time,
  progress,
  accent
) {
  const scale =
    Math.min(width, height) /
    600;

  const shipY =
    cy -
    70 * scale;

  /*
   * Route path.
   */

  ctx.beginPath();

  ctx.moveTo(
    cx -
    170 * scale,
    cy +
    80 * scale
  );

  ctx.bezierCurveTo(
    cx -
    80 * scale,
    cy +
    20 * scale,
    cx +
    65 * scale,
    cy +
    35 * scale,
    cx +
    175 * scale,
    cy -
    100 * scale
  );

  ctx.strokeStyle =
    "rgba(41,227,217,0.42)";

  ctx.lineWidth = 1.5;

  ctx.stroke();

  /*
   * Waypoint nodes.
   */

  const nodes = [
    [-170, 80],
    [-35, 32],
    [85, 12],
    [175, -100],
  ];

  nodes.forEach(
    ([x, y], index) => {
      ctx.beginPath();

      ctx.arc(
        cx + x * scale,
        cy + y * scale,
        index === nodes.length - 1
          ? 5
          : 3.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        index ===
          nodes.length - 1
          ? accent
          : "rgba(245,247,255,0.5)";

      ctx.shadowColor =
        index ===
          nodes.length - 1
          ? accent
          : "transparent";

      ctx.shadowBlur =
        index ===
          nodes.length - 1
          ? 16
          : 0;

      ctx.fill();

      ctx.shadowBlur = 0;
    }
  );

  /*
   * Spacecraft.
   */

  ctx.save();

  ctx.translate(
    cx +
    55 * scale,
    shipY
  );

  ctx.rotate(
    -0.65 +
    progress * 0.12
  );

  ctx.fillStyle =
    "rgba(245,247,255,0.86)";

  ctx.beginPath();

  ctx.moveTo(0, -24 * scale);
  ctx.lineTo(
    8 * scale,
    12 * scale
  );
  ctx.lineTo(
    0,
    20 * scale
  );
  ctx.lineTo(
    -8 * scale,
    12 * scale
  );
  ctx.closePath();

  ctx.fill();

  ctx.strokeStyle =
    accent;

  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.moveTo(
    -25 * scale,
    8 * scale
  );

  ctx.lineTo(
    -6 * scale,
    8 * scale
  );

  ctx.moveTo(
    6 * scale,
    8 * scale
  );

  ctx.lineTo(
    25 * scale,
    8 * scale
  );

  ctx.stroke();

  ctx.restore();

  /*
   * Direction arrow.
   */

  const arrowX =
    cx +
    185 * scale;

  const arrowY =
    cy -
    115 * scale;

  ctx.strokeStyle =
    accent;

  ctx.lineWidth = 1.5;

  ctx.beginPath();

  ctx.moveTo(
    arrowX -
    18 * scale,
    arrowY +
    10 * scale
  );

  ctx.lineTo(
    arrowX,
    arrowY -
    10 * scale
  );

  ctx.lineTo(
    arrowX +
    18 * scale,
    arrowY +
    10 * scale
  );

  ctx.stroke();
}

function drawCompute(
  ctx,
  cx,
  cy,
  width,
  height,
  time,
  progress,
  accent
) {
  const size =
    Math.min(width, height) *
    0.17;

  /*
   * Central compute core.
   */

  ctx.save();

  ctx.translate(cx, cy);

  ctx.rotate(
    progress * 0.04
  );

  ctx.strokeStyle =
    accent;

  ctx.lineWidth = 2;

  ctx.strokeRect(
    -size,
    -size,
    size * 2,
    size * 2
  );

  ctx.lineWidth = 1;

  ctx.strokeStyle =
    "rgba(245,247,255,0.35)";

  ctx.strokeRect(
    -size * 0.7,
    -size * 0.7,
    size * 1.4,
    size * 1.4
  );

  /*
   * CPU-like nodes.
   */

  const rows = 5;
  const cols = 5;

  for (
    let r = 0;
    r < rows;
    r++
  ) {
    for (
      let c = 0;
      c < cols;
      c++
    ) {
      const x =
        lerp(
          -size * 0.62,
          size * 0.62,
          c / (cols - 1)
        );

      const y =
        lerp(
          -size * 0.62,
          size * 0.62,
          r / (rows - 1)
        );

      const pulse =
        0.55 +
        0.45 *
        Math.sin(
          time * 0.002 +
          r +
          c
        );

      ctx.fillStyle =
        `rgba(41,227,217,${0.08 + pulse * 0.35})`;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        2.1,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  ctx.restore();

  /*
   * Radiation rings.
   */

  for (
    let i = 0;
    i < 4;
    i++
  ) {
    const radius =
      size *
      (1.8 + i * 0.33);

    const pulse =
      Math.sin(
        time * 0.0017 +
        i
      );

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      radius +
      pulse * 5,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      `rgba(108,76,227,${0.08 - i * 0.012})`;

    ctx.setLineDash([
      2 + i * 2,
      7 + i * 2,
    ]);

    ctx.stroke();
  }

  /*
   * Side radiation indicators.
   */

  const positions = [
    [-190, -90],
    [190, -50],
    [-185, 105],
    [190, 95],
  ];

  positions.forEach(
    ([x, y], index) => {
      const px =
        cx +
        x *
        Math.min(
          width,
          height
        ) /
        600;

      const py =
        cy +
        y *
        Math.min(
          width,
          height
        ) /
        600;

      ctx.fillStyle =
        `rgba(255,182,72,${0.25 + 0.15 * Math.sin(time * 0.002 + index)})`;

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        4,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );
}

function drawSignal(
  ctx,
  cx,
  cy,
  width,
  height,
  time,
  progress,
  accent
) {
  const scale =
    Math.min(width, height) /
    600;

  /*
   * Large incoming signal field.
   */

  const total =
    75;

  for (
    let i = 0;
    i < total;
    i++
  ) {
    const seed =
      i * 37;

    const x =
      ((seed * 17) %
        420) -
      210;

    const y =
      ((seed * 29) %
        260) -
      130;

    const travel =
      ((time * 0.00008 +
        i * 0.037) %
        1);

    const px =
      cx +
      (x +
        travel * 110) *
      scale;

    const py =
      cy +
      y *
      scale;

    const alpha =
      0.12 +
      0.35 *
      Math.max(
        0,
        1 -
        Math.abs(
          px -
          cx
        ) /
        260
      );

    ctx.beginPath();

    ctx.arc(
      px,
      py,
      1 +
      Math.random() *
      0.8,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(245,247,255,${alpha})`;

    ctx.fill();
  }

  /*
   * Filtering gate.
   */

  const filterX =
    cx;

  ctx.strokeStyle =
    accent;

  ctx.lineWidth = 1.5;

  ctx.beginPath();

  ctx.moveTo(
    filterX -
    5 * scale,
    cy -
    170 * scale
  );

  ctx.lineTo(
    filterX +
    5 * scale,
    cy +
    170 * scale
  );

  ctx.stroke();

  /*
   * Selected output signals.
   */

  for (
    let i = 0;
    i < 14;
    i++
  ) {
    const t =
      ((time * 0.00018 +
        i * 0.12) %
        1);

    const x =
      filterX +
      t *
      200 *
      scale;

    const y =
      cy +
      Math.sin(
        i * 2.4
      ) *
      90 *
      scale;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      2.2,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(41,227,217,${0.35 + t * 0.5})`;

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
      x - 18,
      y
    );

    ctx.lineTo(
      x - 3,
      y
    );

    ctx.strokeStyle =
      `rgba(41,227,217,${0.25 + t * 0.3})`;

    ctx.stroke();
  }

  /*
   * Downlink vector.
   */

  ctx.strokeStyle =
    "rgba(245,247,255,0.3)";

  ctx.beginPath();

  ctx.arc(
    cx +
    205 *
    scale,
    cy,
    42 *
    scale,
    -0.8,
    0.8
  );

  ctx.stroke();
}

function drawSimulation(
  ctx,
  cx,
  cy,
  width,
  height,
  time,
  progress,
  accent
) {
  const scale =
    Math.min(width, height) /
    600;

  /*
   * Digital twin cube.
   */

  const s =
    105 * scale;

  const z =
    65 * scale;

  const corners = [
    [cx - s, cy - s],
    [cx + s, cy - s],
    [cx + s, cy + s],
    [cx - s, cy + s],

    [cx - s + z, cy - s - z],
    [cx + s + z, cy - s - z],
    [cx + s + z, cy + s - z],
    [cx - s + z, cy + s - z],
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  ctx.strokeStyle =
    `rgba(61,220,132,0.44)`;

  ctx.lineWidth = 1;

  edges.forEach(
    ([a, b]) => {
      ctx.beginPath();

      ctx.moveTo(
        corners[a][0],
        corners[a][1]
      );

      ctx.lineTo(
        corners[b][0],
        corners[b][1]
      );

      ctx.stroke();
    }
  );

  /*
   * Internal simulation grid.
   */

  ctx.strokeStyle =
    "rgba(245,247,255,0.09)";

  for (
    let i = 1;
    i < 6;
    i++
  ) {
    const t =
      i / 6;

    const x =
      lerp(
        cx - s,
        cx + s,
        t
      );

    ctx.beginPath();

    ctx.moveTo(
      x,
      cy - s
    );

    ctx.lineTo(
      x + z,
      cy - s - z
    );

    ctx.stroke();

    const y =
      lerp(
        cy - s,
        cy + s,
        t
      );

    ctx.beginPath();

    ctx.moveTo(
      cx - s,
      y
    );

    ctx.lineTo(
      cx + z - s,
      y - z
    );

    ctx.stroke();
  }

  /*
   * Simulated signal around the digital twin.
   */

  const pulse =
    (time * 0.0004) %
    1;

  ctx.beginPath();

  ctx.arc(
    cx +
    75 * scale,
    cy -
    75 * scale,
    6 +
    pulse * 10,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    `rgba(61,220,132,${1 - pulse})`;

  ctx.fill();

  /*
   * HITL connection to physical hardware.
   */

  ctx.beginPath();

  ctx.moveTo(
    cx -
    190 * scale,
    cy +
    155 * scale
  );

  ctx.lineTo(
    cx -
    40 * scale,
    cy +
    110 * scale
  );

  ctx.strokeStyle =
    accent;

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(
    cx -
    198 * scale,
    cy +
    158 * scale,
    4,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    accent;

  ctx.fill();
}

/* =========================================================
   PRINCIPLES SECTION
========================================================= */

function PrinciplesSection() {
  const sectionRef = useRef(null);
  const [progress, setProgress] =
    useState(0);

  const activeIndex =
    clamp(
      Math.floor(
        progress * pillars.length
      ),
      0,
      pillars.length - 1
    );

  const localProgress =
    clamp(
      progress * pillars.length -
      activeIndex,
      0,
      1
    );

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) return;

    let raf = 0;

    const update = () => {
      const rect =
        section.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const totalTravel =
        section.offsetHeight -
        viewportHeight;

      const raw =
        totalTravel <= 0
          ? 0
          : -rect.top /
          totalTravel;

      setProgress(
        clamp(raw, 0, 0.99999)
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);

      raf =
        requestAnimationFrame(
          update
        );
    };

    update();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      onScroll
    );

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        onScroll
      );
    };
  }, []);

  /*
   * Each card gets a continuous visual
   * position derived from scroll progress.
   */

  const cardStyles =
    useMemo(() => {
      return pillars.map(
        (_, index) => {
          const position =
            index -
            progress *
            pillars.length;

          const distance =
            Math.abs(position);

          const entering =
            clamp(
              1 -
              Math.abs(
                position -
                0.5
              ),
              0,
              1
            );

          const scale =
            index === activeIndex
              ? 1
              : clamp(
                0.96 -
                distance *
                0.015,
                0.91,
                0.96
              );

          const opacity =
            index === activeIndex
              ? 1
              : clamp(
                1 -
                distance *
                0.24,
                0.04,
                0.32
              );

          const y =
            index === activeIndex
              ? 0
              : position *
              90;

          const blur =
            index === activeIndex
              ? 0
              : clamp(
                distance *
                1.8,
                0,
                4
              );

          return {
            opacity,
            transform: `
              translate3d(
                0,
                ${y}px,
                0
              )
              scale(${scale})
            `,
            filter: `blur(${blur}px)`,
            zIndex:
              index === activeIndex
                ? 5
                : 4 - index,
            "--pillar-accent":
              pillars[index].accent,
          };
        }
      );
    }, [
      progress,
      activeIndex,
    ]);

  const currentPillar =
    pillars[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="alc-principles"
    >
      <div className="alc-principles__sticky">

        <div className="alc-principles__bg-grid" />

        <div
          className="alc-principles__orbit"
        />

        <div
          className="alc-principles__orbit alc-principles__orbit--two"
        />

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
                type={
                  currentPillar.visual
                }
                accent={
                  currentPillar.accent
                }
                progress={
                  localProgress
                }
              />

            </div>
          </div>

          <div className="alc-principles__copy-stage">

            <div className="alc-principles__counter">
              <strong>
                {currentPillar.id}
              </strong>

              <span className="alc-principles__line" />

              <span className="alc-principles__active-short">
                {currentPillar.short}
              </span>

              <span>
                / 04
              </span>
            </div>

            <div className="alc-principles__copy">

              {pillars.map(
                (
                  pillar,
                  index
                ) => {
                  const position =
                    index -
                    progress *
                    pillars.length;

                  const distance =
                    Math.abs(
                      position
                    );

                  const active =
                    index ===
                    activeIndex;

                  const opacity =
                    active
                      ? 1
                      : clamp(
                        1 -
                        distance *
                        2.5,
                        0,
                        0
                      );

                  const y =
                    active
                      ? 0
                      : position <
                        0
                        ? -30
                        : 30;

                  const scale =
                    active
                      ? 1
                      : 0.94;

                  return (
                    <div
                      key={
                        pillar.id
                      }
                      className="alc-principles__copy-item"
                      style={{
                        opacity,
                        transform: `
                          translate3d(
                            0,
                            ${y}px,
                            0
                          )
                          scale(${scale})
                        `,
                        "--pillar-accent":
                          pillar.accent,
                      }}
                    >
                      <div className="alc-principles__copy-number">
                        {pillar.id}
                        {"  //  "}
                        {pillar.system}
                      </div>

                      <h3 className="alc-principles__copy-title">
                        {pillar.title}
                      </h3>

                      <p className="alc-principles__copy-description">
                        {
                          pillar.description
                        }
                      </p>

                      <div className="alc-principles__keywords">
                        {pillar.keywords.map(
                          (
                            keyword
                          ) => (
                            <span
                              key={
                                keyword
                              }
                              className="alc-principles__keyword"
                            >
                              {
                                keyword
                              }
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                }
              )}

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
            {pillars.map(
              (pillar, index) => (
                <div
                  key={
                    pillar.id
                  }
                  className={`alc-principles__dot ${index ===
                    activeIndex
                    ? "active"
                    : ""
                    }`}
                />
              )
            )}
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
            ].map(([x,y], i) => (
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

          <div className="alc-hero__grid" />

          <div className="alc-hero__orb alc-hero__orb--one" />
          <div className="alc-hero__orb alc-hero__orb--two" />

          <InteractiveA />

          <SatelliteCanvas />

          {/* Telemetry data stream (far right) */}
          <div className="alc-hero__data-stream" aria-hidden="true">
            {['ALT // 408.2 km', 'VEL // 7.66 km/s', 'INC // 51.6°', 'TMP // -157°C', 'PWR // 84W', 'SIG // NOMINAL', 'GNC // ACTIVE', 'UPLINK // 2.4 GHz'].map((line, i) => (
              <div key={i} className="alc-hero__data-line" style={{ opacity: 0.35 + (i % 3) * 0.1, animationDelay: `${i * 0.15}s` }}>{line}</div>
            ))}
          </div>

          <div className="alc-hero__telemetry alc-hero__telemetry--one">
            ALC // A-001
          </div>

          <div className="alc-hero__telemetry alc-hero__telemetry--two">
            DEPTH VECTOR // 03.29
          </div>

          <div className="alc-hero__telemetry alc-hero__telemetry--three">
            TELEMETRY LINK // ACTIVE
          </div>

          <div className="alc-container alc-hero__content">
            <div className="alc-hero__content-inner">

              <div className="alc-hero__eyebrow alc-hero-enter alc-hero-enter--1">
                Andromeda Logic Corp
              </div>

              <h1 className="alc-hero__title alc-hero-enter alc-hero-enter--2">

                <span className="alc-hero__title-line">
                  Intelligent
                </span>

                <span className="alc-hero__title-line">
                  Systems for
                </span>

                <span className="alc-hero__title-line alc-hero__title-accent">
                  the Deep Space Era.
                </span>

              </h1>

              <p className="alc-hero__copy alc-hero-enter alc-hero-enter--3">
                Autonomous intelligence,
                radiation-resilient computing,
                and advanced simulation for
                systems that must think, adapt,
                and operate beyond Earth.
              </p>

              <div className="alc-hero__actions alc-hero-enter alc-hero-enter--4">

                <Link
                  to="/contact"
                  className="alc-button alc-button--primary alc-hero__button"
                >
                  Request Mission Consultation
                  <span>↗</span>
                </Link>

                <Link
                  to="/technology"
                  className="alc-button alc-button--secondary alc-hero__button"
                >
                  Explore Technology
                  <span>→</span>
                </Link>

              </div>

              <div className="alc-hero__meta alc-hero-enter alc-hero-enter--5">
                <span>
                  <i />
                  AUTONOMY
                </span>


                <span>
                  <i />
                  EDGE COMPUTING
                </span>

                <span>
                  <i />
                  COSMIC DATA
                </span>

                <span>
                  <i />
                  HITL SIMULATION
                </span>
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

        <section className="alc-section alc-section--void">

          <div className="alc-container">

            <div className="alc-section__eyebrow alc-eyebrow-reveal">
              Products & Platforms
            </div>

            <h2 className="alc-section__heading split-text">
              <span className="split-text__line"><span className="split-text__inner">Systems engineered</span></span>
              <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.08s'}}>for the conditions</span></span>
              <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.16s'}}>where conventional</span></span>
              <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.24s'}}>computing fails.</span></span>
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
              />

              <ProductCard
                status="In Development"
                statusClass="alc-status--amber"
                title="EDGE Payload"
                description="Onboard processing of camera, optical, scientific, and telemetry data."
              />

              <ProductCard
                status="Flight-Proven"
                statusClass="alc-status--green"
                title="HITL Digital Twin Suite"
                description="High-fidelity orbital and deep-space simulation for pre-deployment validation."
              />

              <ProductCard
                status="Roadmap"
                statusClass="alc-status--slate"
                title="Swarm Orchestrator"
                description="Multi-agent decision engines for constellations, habitats, and autonomous systems."
              />

              <ProductCard
                status="In Development"
                statusClass="alc-status--amber"
                title="Radiation-Tolerant Inference Engine"
                description="Intelligent inference optimized for radiation-hardened, low-power hardware."
              />

            </div>

          </div>
        </section>

        {/* =================================================
            MISSION
        ================================================= */}

        <section className="alc-section alc-section--indigo">

          <div className="alc-container">

            <div className="alc-mission reveal--scale">

              <div className="alc-mission__media reveal--left">

                <div className="alc-mission__fake-spacecraft">

                  <div className="alc-mission__nose" />

                  <div className="alc-mission__body" />

                  <div className="alc-mission__wing alc-mission__wing--left" />

                  <div className="alc-mission__wing alc-mission__wing--right" />

                </div>

                <div className="alc-mission__signal">
                  MISSION / PRARAMBH / TELEMETRY
                </div>

              </div>

              <div className="alc-mission__content">

                <span className="alc-telemetry">
                  Flagship Mission
                </span>

                <h2>
                  Mission
                  <br />
                  Prarambh
                </h2>

                <p>
                  As missions venture farther
                  into the solar system,
                  communication delays demand
                  unprecedented onboard autonomy.
                  Andromeda Logic builds
                  fault-tolerant computational
                  platforms and real-time data
                  processing tools designed to
                  operate seamlessly in
                  deep-space environments.
                </p>

                <Link
                  to="/missions"
                  className="alc-button alc-button--secondary"
                  style={{
                    marginTop: 26,
                    minHeight: 50,
                    padding:
                      "0 20px",
                    fontSize: 12,
                  }}
                >
                  Read the Full Story
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            AUDIENCE
        ================================================= */}

        <section className="alc-section alc-section--void">

          <div className="alc-container">

            <div className="alc-section__eyebrow alc-eyebrow-reveal">
              Solutions by Audience
            </div>

            <h2 className="alc-section__heading split-text">
              <span className="split-text__line"><span className="split-text__inner">Built for missions</span></span>
              <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.1s'}}>with no room for</span></span>
              <span className="split-text__line"><span className="split-text__inner" style={{transitionDelay:'0.2s'}}>uncertainty.</span></span>
            </h2>

            <div className="alc-audience stagger-children">

              <AudienceCard
                number="01"
                title="Space Agencies"
                icon="AG"
                to="/solutions/space-agencies"
              />

              <AudienceCard
                number="02"
                title="Commercial Space"
                icon="CS"
                to="/solutions/commercial"
              />

              <AudienceCard
                number="03"
                title="Defense & National Security"
                icon="DN"
                to="/solutions/defense"
              />

              <AudienceCard
                number="04"
                title="Research Institutions"
                icon="RI"
                to="/solutions/research"
              />

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
}) {
  return (
    <Link
      to="/products"
      className="alc-product"
    >
      <div className="alc-product__orb" />

      <span
        className={`alc-status ${statusClass}`}
      >
        {status}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>
    </Link>
  );
}

/* =========================================================
   AUDIENCE CARD
========================================================= */

function AudienceCard({
  number,
  title,
  icon,
  to,
}) {
  return (
    <Link
      to={to}
      className="alc-audience__card"
    >
      <span className="alc-audience__number">
        {number}
      </span>

      <div className="alc-audience__icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>
    </Link>
  );
}
