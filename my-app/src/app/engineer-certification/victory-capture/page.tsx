"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { synth } from "@/utils/synthAudio";
import {
  Award,
  Camera,
  CameraIcon,
  CheckCircle2,
  FileCheck,
  Lock,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const CELEBRATION_PARTICLES = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 13) % 90)}%`,
  delay: ((index * 5) % 8) / 10,
  duration: 2 + ((index * 7) % 15) / 10,
  drift: -60 + ((index * 23) % 120),
}));

/* -------------------------------------------------------------------------- */
/* CONTINUOUS ILLUMINATED MARQUEE CERTIFICATION FRAME                        */
/* -------------------------------------------------------------------------- */

function ContinuousMarqueeFrame({
  children,
  isGlitched,
  glitchVariant,
}: {
  children: React.ReactNode;
  isGlitched: boolean;
  glitchVariant: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const offsetRef = useRef(0);
  const unitPercentRef = useRef(3.4375);

  // Measure exact length of 1 "BLACKBOX • " unit relative to total path length
  const measureUnit = () => {
    const path = pathRef.current;
    const text = textRef.current;
    if (!path || !text) return;

    try {
      const pathLength = path.getTotalLength();
      const totalTextLength = text.getComputedTextLength();
      if (pathLength > 0 && totalTextLength > 0) {
        const singleUnitPx = totalTextLength / 80;
        const calcPercent = (singleUnitPx / pathLength) * 100;
        if (calcPercent > 0) {
          unitPercentRef.current = calcPercent;
        }
      }
    } catch {
      // Use fallback if measurement fails momentarily
    }
  };

  useEffect(() => {
    measureUnit();
    window.addEventListener("resize", measureUnit);
    return () => window.removeEventListener("resize", measureUnit);
  }, []);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      // Smoothly advance offset downwards (pulling text backwards along path)
      offsetRef.current -= 0.018;

      // Wrap modulo 1 exact unit width for seamless 0-gap looping
      if (offsetRef.current <= -unitPercentRef.current) {
        offsetRef.current += unitPercentRef.current;
      }

      if (textPathRef.current) {
        textPathRef.current.setAttribute("startOffset", `${offsetRef.current}%`);
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const normalPattern = "BLACKBOX • ";
  const glitchPattern1 = "BL4CKB0X • ";
  const glitchPattern2 = "BLACКBOX • ";

  let baseUnit = normalPattern;
  if (isGlitched) {
    baseUnit = glitchVariant === 0 ? glitchPattern1 : glitchPattern2;
  }

  // 80 repeats of 11-char unit = 880 characters (~8800px).
  // Guarantees 100% path coverage for the entire perimeter at all times with 0 gaps!
  const fullMarqueeText = Array(80).fill(baseUnit).join("");

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Subtle Ambient Rear Glow */}
      <div className="absolute -inset-2 rounded-[36px] bg-[#00ff66]/10 blur-2xl pointer-events-none" />

      {/* Outer Matte-Black Industrial Frame Chassis */}
      <div
        className={`relative rounded-[24px] sm:rounded-[32px] bg-[#0a0d0b] p-4 sm:p-6 md:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-2px_6px_rgba(0,0,0,0.9)] border border-[#1b241e] transition-transform duration-100 ${
          isGlitched ? "translate-x-[1px] skew-x-[-0.2deg]" : ""
        }`}
      >
        {/* Subtle Metallic Highlight & Texture */}
        <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.04),transparent_65%)] pointer-events-none" />

        {/* Industrial Torx Screws / Fasteners */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-[#2a322c] to-[#0c100d] border border-[#3b463d] flex items-center justify-center shadow-inner z-20">
          <div className="w-2 h-0.5 bg-[#141a16] rotate-45" />
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-[#2a322c] to-[#0c100d] border border-[#3b463d] flex items-center justify-center shadow-inner z-20">
          <div className="w-2 h-0.5 bg-[#141a16] -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-[#2a322c] to-[#0c100d] border border-[#3b463d] flex items-center justify-center shadow-inner z-20">
          <div className="w-2 h-0.5 bg-[#141a16] -rotate-12" />
        </div>
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-[#2a322c] to-[#0c100d] border border-[#3b463d] flex items-center justify-center shadow-inner z-20">
          <div className="w-2 h-0.5 bg-[#141a16] rotate-60" />
        </div>

        {/* TOP ENGRAVINGS */}
        <div className="flex items-center justify-between px-2 sm:px-4 pb-2.5 text-[9px] sm:text-[11px] font-mono tracking-[0.2em] text-[#2c5636] uppercase select-none">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span className="font-bold text-[#3ea853]">BLACKBOX CERTIFIED</span>
            <span className="hidden sm:inline text-[#214227]">// VT-100</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[#214227]">MEMORY ARCHIVE</span>
            <span className="text-[#367845] font-semibold">SN: BB-2026-9904-X1</span>
          </div>
        </div>

        {/* RECESSED HOUSING FOR CAMERA & MARQUEE BORDER */}
        <div className="relative rounded-[16px] sm:rounded-[22px] bg-[#040604] p-2.5 sm:p-3.5 border border-[#152217] shadow-[inset_0_4px_24px_rgba(0,0,0,0.95)] overflow-hidden">
          
          {/* CONTINUOUS RECTANGULAR MARQUEE SVG PATH */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
            viewBox="0 0 1000 650"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                ref={pathRef}
                id="continuous-marquee-path"
                d="M 22,20 H 978 A 14,14 0 0 1 992,34 V 616 A 14,14 0 0 1 978,630 H 22 A 14,14 0 0 1 8,616 V 34 A 14,14 0 0 1 22,20 Z"
              />
              <filter id="marquee-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <text
              ref={textRef}
              fill="#00ff66"
              fontSize="12.5"
              fontWeight="900"
              fontFamily="monospace"
              letterSpacing="2.5px"
              filter="url(#marquee-glow)"
              className={`transition-all duration-75 ${
                isGlitched
                  ? "fill-[#22ff88] [text-shadow:-2px_0_#ff0055,2px_0_#00ffff]"
                  : ""
              }`}
            >
              <textPath
                ref={textPathRef}
                href="#continuous-marquee-path"
                startOffset="0%"
              >
                {fullMarqueeText}
              </textPath>
            </text>
          </svg>

          {/* INNER PREVIEW HOUSING (Camera stream or snapshot) */}
          <div className="relative z-10 rounded-[12px] sm:rounded-[16px] overflow-hidden bg-black border border-[#142618]">
            {children}
          </div>

        </div>

        {/* BOTTOM ENGRAVINGS */}
        <div className="flex items-center justify-between px-2 sm:px-4 pt-2.5 text-[9px] sm:text-[11px] font-mono tracking-[0.2em] text-[#2c5636] uppercase select-none">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#3a804a]">OFFICIAL CERTIFICATION FRAME</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[#214227]">QC: APPROVED // REV 4.2</span>
            <span className="text-[#00ff66]/70 font-semibold">SEC-CLR: LEVEL-5</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function VictoryCapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const celebrationTimeoutRef = useRef<number | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [finalRevealed, setFinalRevealed] = useState(false);

  const [isGlitched, setIsGlitched] = useState(false);
  const [glitchVariant, setGlitchVariant] = useState(0);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitched(true);
      setGlitchVariant(Math.floor(Math.random() * 2));
      setTimeout(() => {
        setIsGlitched(false);
      }, 150 + Math.random() * 100);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerGlitch();
      }
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }

        setCameraReady(true);
      } catch {
        if (!cancelled) setCameraError(true);
      }
    }

    startCamera();

    return () => {
      cancelled = true;

      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  const handleCapture = () => {
    synth.playClick();
    synth.playScanSweep();

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedImage(canvas.toDataURL("image/png"));

    setCelebrating(true);
    setFinalRevealed(false);

    synth.playSuccessFanfare();

    streamRef.current?.getTracks().forEach((track) => track.stop());

    celebrationTimeoutRef.current = window.setTimeout(() => {
      setCelebrating(false);
      setFinalRevealed(true);
    }, 3800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-hidden bg-[#040604] text-[#00ff66] font-mono relative">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,255,102,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,102,0.06)_1px,transparent_1px)] bg-[size:45px_45px]" />

        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.08),transparent_65%)]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.9)_100%)]" />

        <div className="relative z-10 flex min-h-screen flex-col px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          {/* TACTICAL COMMAND HEADER */}
          <header className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl border border-[#1b2b1f] bg-[#070b08]/90 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff66]/40 to-transparent" />
            
            <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 gap-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#00ff66] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[11px] sm:text-xs">
                      BLACKBOX // DEPT-07
                    </h2>
                    <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#102414] border border-[#00ff66]/20 text-[#67c476]">
                      CLASSIFIED
                    </span>
                  </div>
                  <p className="text-[#3b6b44] text-[9px] sm:text-[10px] tracking-wider mt-0.5 font-mono">
                    VICTORY_CAPTURE // ARCHIVE_PROTOCOL_V4
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-[#040805] border border-[#16291a] text-[10px] text-[#4b8a56]">
                  <span>ENCRYPTION:</span>
                  <span className="text-[#00ff66] font-bold">256-BIT SHA</span>
                </div>
                <div className="rounded-lg border border-[#00ff66]/30 px-3 py-1.5 bg-[#09140a] text-[10px] sm:text-xs font-bold text-[#00ff66] tracking-widest flex items-center gap-2 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                  SYSTEM ONLINE
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {/* HERO TITLE & TACTICAL EMBLEM */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 sm:mb-8 md:mb-10 relative"
            >
              {/* Precision SVG Optical Camera Sensor Insignia */}
              <div className="relative inline-flex items-center justify-center mb-5">
                {/* Outer Rotating Reticle */}
                <motion.svg
                  className="absolute w-32 h-32 text-[#00ff66]/30 pointer-events-none"
                  viewBox="0 0 100 100"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                >
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
                  <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="0" x2="50" y2="6" stroke="#00ff66" strokeWidth="2" />
                  <line x1="50" y1="94" x2="50" y2="100" stroke="#00ff66" strokeWidth="2" />
                  <line x1="0" y1="50" x2="6" y2="50" stroke="#00ff66" strokeWidth="2" />
                  <line x1="94" y1="50" x2="100" y2="50" stroke="#00ff66" strokeWidth="2" />
                </motion.svg>
                
                {/* Middle Radial Glow Ring */}
                <div className="absolute -inset-2 rounded-full border border-[#00ff66]/40 bg-[#00ff66]/5 blur-sm pointer-events-none" />

                {/* Center Metallic Lens Housing */}
                <motion.div
                  className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#122416] via-[#050c07] to-[#172f1d] border-2 border-[#00ff66]/80 p-3 flex items-center justify-center shadow-[0_0_35px_rgba(0,255,102,0.35),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.9)]"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                >
                  {/* Glass Reflection Highlight */}
                  <div className="absolute inset-1.5 rounded-full border border-[#00ff66]/30 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,102,0.25),transparent_60%)] pointer-events-none" />

                  {capturedImage ? (
                    <Trophy size={44} className="text-[#00ff66] drop-shadow-[0_0_18px_#00ff66] relative z-20" />
                  ) : (
                    /* Custom Optical Sensor Aperture (Not a generic icon!) */
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 48 48" className="w-12 h-12 text-[#00ff66] drop-shadow-[0_0_12px_#00ff66]">
                        {/* Outer lens ring */}
                        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                        {/* Aperture Blades */}
                        <path d="M 24 8 L 32 20 L 24 24 Z" fill="currentColor" opacity="0.35" />
                        <path d="M 40 24 L 28 32 L 24 24 Z" fill="currentColor" opacity="0.45" />
                        <path d="M 24 40 L 16 28 L 24 24 Z" fill="currentColor" opacity="0.35" />
                        <path d="M 8 24 L 20 16 L 24 24 Z" fill="currentColor" opacity="0.45" />
                        {/* Center Glowing Core */}
                        <circle cx="24" cy="24" r="7" fill="#00ff66" className="animate-pulse" />
                        <circle cx="24" cy="24" r="3" fill="#040604" />
                        {/* Laser Crosshairs */}
                        <line x1="24" y1="11" x2="24" y2="15" stroke="#00ff66" strokeWidth="1.5" />
                        <line x1="24" y1="33" x2="24" y2="37" stroke="#00ff66" strokeWidth="1.5" />
                        <line x1="11" y1="24" x2="15" y2="24" stroke="#00ff66" strokeWidth="1.5" />
                        <line x1="33" y1="24" x2="37" y2="24" stroke="#00ff66" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Main Mission Badge Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00ff66]/30 bg-[#081409] text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#00ff66] mb-3.5 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
                <ShieldCheck size={14} className="text-[#00ff66]" />
                <span>{finalRevealed ? "STAGE 07 // COMPLETE" : "FINAL STAGE // CAPTURE PROTOCOL"}</span>
              </div>

              {/* Primary Hero Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#00ff66] drop-shadow-[0_0_30px_rgba(0,255,102,0.35)]">
                {finalRevealed ? "CONGRATULATIONS" : "FINAL MISSION"}
              </h1>

              <h2 className="mt-2 text-base sm:text-lg md:text-xl font-bold uppercase text-white/90 tracking-[0.3em] sm:tracking-[0.4em]">
                BLACKBOX ENGINEERS
              </h2>

              <p className="mt-3 sm:mt-4 text-[#4e8b5d] max-w-2xl mx-auto text-xs sm:text-sm tracking-wide px-4">
                {finalRevealed
                  ? "Mission Complete • Official Engineer Certification Photo Archived Successfully"
                  : "Assemble your engineering squad inside the frame and record your permanent BLACKBOX legacy."}
              </p>
            </motion.div>

            <div className="mx-auto w-full max-w-6xl flex flex-col items-center gap-5 sm:gap-6 md:gap-8">
              {/* OFFICIAL CERTIFICATION SEAL BANNER */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl relative rounded-xl sm:rounded-2xl border border-[#00ff66]/40 bg-gradient-to-r from-[#071208] via-[#0d210e] to-[#071208] px-4 sm:px-8 py-4 sm:py-5 text-center shadow-[0_0_40px_rgba(0,255,102,.15),inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden"
              >
                {/* Corner Hardware Fasteners */}
                <div className="absolute top-2 left-2 text-[10px] text-[#00ff66]/40 font-mono">◤</div>
                <div className="absolute top-2 right-2 text-[10px] text-[#00ff66]/40 font-mono">◥</div>
                <div className="absolute bottom-2 left-2 text-[10px] text-[#00ff66]/40 font-mono">◣</div>
                <div className="absolute bottom-2 right-2 text-[10px] text-[#00ff66]/40 font-mono">◢</div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#00ff66]/70 font-mono tracking-wider">
                    <Award size={16} className="text-[#00ff66]" />
                    <span>CERTIFICATE ID: #BB-2026-FINAL</span>
                  </div>

                  <div className="text-center">
                    <h2 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-[.2em] sm:tracking-[.25em] text-[#00ff66] drop-shadow-[0_0_12px_#00ff66]">
                      OFFICIAL TEAM CERTIFICATION
                    </h2>
                    <p className="text-[#6bb57a] tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[9px] sm:text-xs mt-0.5">
                      BlackBox League of Engineers // Final Archive
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#00ff66]/70 font-mono tracking-wider">
                    <Lock size={14} className="text-[#00ff66]" />
                    <span>STATUS: VERIFIED</span>
                  </div>
                </div>
              </motion.div>

              {/* INDUSTRIAL CERTIFICATION CAMERA FRAME WITH CONTINUOUS ILLUMINATED MARQUEE */}
              <ContinuousMarqueeFrame isGlitched={isGlitched} glitchVariant={glitchVariant}>
                <div className="relative aspect-[5/4] sm:aspect-video overflow-hidden rounded-[12px] sm:rounded-[16px] bg-black">
                  {/* Scanner line */}
                  {!capturedImage && (
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-[#00ff66] shadow-[0_0_12px_#00ff66] z-30"
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                    />
                  )}

                  {/* Scan Glow */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,255,102,0.06),transparent_20%,transparent_80%,rgba(0,255,102,0.06))] z-20 pointer-events-none" />

                  {/* LIVE VIDEO / PHOTO SNAPSHOT */}
                  <AnimatePresence mode="wait">
                    {capturedImage ? (
                      <motion.img
                        key="captured"
                        src={capturedImage}
                        alt="Captured Team"
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <motion.div
                        key="live"
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Camera Loading Overlay */}
                  {!capturedImage && (!cameraReady || cameraError) && (
                    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      >
                        <CameraIcon size={48} className="text-[#00ff66] drop-shadow-[0_0_20px_#00ff66]" />
                      </motion.div>
                      <h3 className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl font-black uppercase tracking-[.25em] text-[#00ff66]">
                        Camera Array
                      </h3>
                      <p className="mt-2 text-center text-[#61b871] text-xs sm:text-sm max-w-md px-4 sm:px-6">
                        {cameraError
                          ? "Camera permission is required to generate your official engineer certification."
                          : "Initializing live capture system..."}
                      </p>
                    </div>
                  )}

                  {/* Mission Complete Badge */}
                  {capturedImage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-4 top-4 z-50 rounded-xl border border-[#00ff66]/60 bg-[#041004]/90 px-4 py-2 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,102,.25)]"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className="text-[#00ff66]" />
                        <div>
                          <p className="text-[10px] sm:text-xs uppercase tracking-[.25em] text-[#00ff66] font-black">
                            Mission Complete
                          </p>
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-[.18em] text-[#7ac686]">
                            Photo Successfully Archived
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Bottom Certification Strip Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#040c05] via-[#09180b] to-[#040c05] border-t border-[#00ff66]/30 px-3 sm:px-6 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#00ff66] font-bold uppercase tracking-[.25em] text-[10px] sm:text-xs">
                        BLACKBOX ENGINEERS
                      </span>
                      <span className="text-[#65b374] uppercase tracking-[.25em] text-[10px]">
                        Official Certification Frame
                      </span>
                      <span className="hidden sm:inline text-[#65b374] uppercase tracking-[.25em] text-[10px]">
                        Secure Capture Protocol
                      </span>
                    </div>
                  </div>

                  {/* Inset Shadow */}
                  <div className="absolute inset-0 pointer-events-none rounded-[12px] sm:rounded-[16px] shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]" />
                </div>
              </ContinuousMarqueeFrame>

              <canvas ref={canvasRef} className="hidden" />

              <AnimatePresence mode="wait">
                {finalRevealed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-5xl"
                  >
                    <div className="rounded-2xl border-2 border-[#00ff66] bg-[#061106] p-5 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(0,255,102,.18)]">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Trophy
                          size={72}
                          className="mx-auto text-[#00ff66] drop-shadow-[0_0_25px_#00ff66]"
                        />
                      </motion.div>

                      <h2 className="mt-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[.25em] text-[#00ff66]">
                        Congratulations
                      </h2>

                      <h3 className="mt-4 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-[.3em] font-bold text-white">
                        BLACKBOX ENGINEERS
                      </h3>

                      <p className="mt-6 text-center text-[#73bc7a] max-w-3xl mx-auto leading-8">
                        Your final team photograph has been successfully archived into the BLACKBOX Engineer Registry.
                        <br />
                        <br />
                        You have completed every mission and officially joined the BLACKBOX League of Engineers.
                      </p>

                      <div className="mt-10 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-[#00ff66]/30 bg-[#071207] p-5">
                          <CheckCircle2 className="mb-3 text-[#00ff66]" />
                          <h4 className="font-bold uppercase tracking-[.2em]">Team Photo</h4>
                          <p className="mt-2 text-[#72b977] text-sm">Successfully Captured</p>
                        </div>

                        <div className="rounded-xl border border-[#00ff66]/30 bg-[#071207] p-5">
                          <CheckCircle2 className="mb-3 text-[#00ff66]" />
                          <h4 className="font-bold uppercase tracking-[.2em]">Certification</h4>
                          <p className="mt-2 text-[#72b977] text-sm">Engineer Status Verified</p>
                        </div>

                        <div className="rounded-xl border border-[#00ff66]/30 bg-[#071207] p-5">
                          <CheckCircle2 className="mb-3 text-[#00ff66]" />
                          <h4 className="font-bold uppercase tracking-[.2em]">Mission</h4>
                          <p className="mt-2 text-[#72b977] text-sm">Successfully Completed</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="instructions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-5xl"
                  >
                    <div className="relative rounded-2xl border border-[#00ff66]/30 bg-gradient-to-b from-[#081209] to-[#040804] p-5 sm:p-6 md:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.06)] overflow-hidden">
                      {/* Top Header Strip */}
                      <div className="flex items-center justify-between border-b border-[#00ff66]/20 pb-3 mb-5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                          <h3 className="text-[#00ff66] uppercase tracking-[.25em] font-black text-xs sm:text-sm">
                            CAPTURE PROTOCOL DIRECTIVES
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#3e7d4c] uppercase tracking-widest hidden sm:inline">
                          REF: DIRECTIVE-07 // REV 4
                        </span>
                      </div>

                      {/* 3 Step Directive Cards */}
                      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                        {/* Step 1 */}
                        <div className="rounded-xl border border-[#142617] bg-[#050a06]/80 p-4 relative group hover:border-[#00ff66]/40 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-[#00ff66] px-2 py-0.5 rounded bg-[#091a0c] border border-[#00ff66]/30">
                              01 / FORMATION
                            </span>
                            <Users size={16} className="text-[#00ff66]/60 group-hover:text-[#00ff66] transition-colors" />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                            Squad Assembly
                          </h4>
                          <p className="text-[11px] text-[#5aa86b] leading-relaxed">
                            Gather your complete engineering squad inside the optical frame boundaries.
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-xl border border-[#142617] bg-[#050a06]/80 p-4 relative group hover:border-[#00ff66]/40 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-[#00ff66] px-2 py-0.5 rounded bg-[#091a0c] border border-[#00ff66]/30">
                              02 / VERIFICATION
                            </span>
                            <ShieldCheck size={16} className="text-[#00ff66]/60 group-hover:text-[#00ff66] transition-colors" />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                            Certification Scan
                          </h4>
                          <p className="text-[11px] text-[#5aa86b] leading-relaxed">
                            Stand together for official BLACKBOX League photo verification.
                          </p>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-xl border border-[#142617] bg-[#050a06]/80 p-4 relative group hover:border-[#00ff66]/40 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-[#00ff66] px-2 py-0.5 rounded bg-[#091a0c] border border-[#00ff66]/30">
                              03 / ARCHIVE
                            </span>
                            <FileCheck size={16} className="text-[#00ff66]/60 group-hover:text-[#00ff66] transition-colors" />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                            Permanent Record
                          </h4>
                          <p className="text-[11px] text-[#5aa86b] leading-relaxed">
                            Execute capture to seal your team's victory permanently into the registry.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Heavy Industrial Tactical Trigger Button */}
              {!capturedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-5xl"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.015,
                      boxShadow: "0 0 50px rgba(0,255,102,0.45)",
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    onClick={handleCapture}
                    disabled={!cameraReady || cameraError}
                    className="
                      group
                      relative
                      w-full
                      overflow-hidden
                      rounded-2xl
                      border-2
                      border-[#00ff66]
                      bg-[#09150a]
                      py-4 sm:py-5
                      text-base sm:text-lg md:text-xl
                      font-black
                      uppercase
                      tracking-[.35em]
                      text-[#00ff66]
                      transition-all
                      duration-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      shadow-[0_15px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)]
                    "
                  >
                    {/* Side Tactical Notch Stripes */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#00ff66]/20 border-r border-[#00ff66]/40 flex flex-col justify-between py-1 px-0.5">
                      <span className="w-full h-1 bg-[#00ff66]" />
                      <span className="w-full h-1 bg-[#00ff66]" />
                      <span className="w-full h-1 bg-[#00ff66]" />
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#00ff66]/20 border-l border-[#00ff66]/40 flex flex-col justify-between py-1 px-0.5">
                      <span className="w-full h-1 bg-[#00ff66]" />
                      <span className="w-full h-1 bg-[#00ff66]" />
                      <span className="w-full h-1 bg-[#00ff66]" />
                    </div>

                    {/* Hover Fill Effect */}
                    <motion.div
                      className="absolute inset-0 bg-[#00ff66]"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    />

                    {/* Button Content */}
                    <div className="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-black">
                      <Camera size={22} className="text-[#00ff66] group-hover:text-black transition-colors" />
                      <span>EXECUTE TEAM VICTORY CAPTURE</span>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}