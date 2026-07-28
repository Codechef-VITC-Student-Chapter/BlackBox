"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { Camera, CameraIcon, CheckCircle2, Sparkles } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "ACTIVE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
];

const CELEBRATION_PARTICLES = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  delay: ((index * 7) % 8) / 10,
  duration: 2.4 + ((index * 5) % 14) / 10,
  drift: -38 + ((index * 19) % 76),
}));

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

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
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
          await videoRef.current.play();
        }

        setCameraReady(true);
      } catch {
        if (!cancelled) {
          setCameraError(true);
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (celebrationTimeoutRef.current !== null) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  const handleCapture = () => {
    synth.playClick();
    synth.playScanSweep();

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL("image/png"));
    setCelebrating(true);
    setFinalRevealed(false);
    synth.playSuccessFanfare();

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (celebrationTimeoutRef.current !== null) {
      window.clearTimeout(celebrationTimeoutRef.current);
    }

    celebrationTimeoutRef.current = window.setTimeout(() => {
      setCelebrating(false);
      setFinalRevealed(true);
      celebrationTimeoutRef.current = null;
    }, 3600);
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-06"
        exeName="VICTORY_CAPTURE.EXE"
        terminalLabel="PHOTO CAPTURE TERMINAL"
        maintenanceSeal="#4096"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="victory_capture.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-06"
        directiveTitle="CLASSIFIED DIRECTIVE // VICTORY CAPTURE"
        directiveText={
          <>
            Align camera sensors before triggering the victory capture snapshot.
            <br />
            Gather your team inside the vector bounds of the frame.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURED"
        radarSublabel="GRADER SECURE"
        bottomBarText="VICTORY FRAME ACQUIRED"
        bottomBarSerial="#8409-VICTORY"
        wallStencil="CONTROL ROOM 04 // ENG SECTOR"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between gap-4 relative">
          <AnimatePresence>
            {celebrating && (
              <motion.div
                className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,255,102,0.24),transparent_52%)]"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {CELEBRATION_PARTICLES.map((particle) => (
                  <motion.span
                    key={particle.id}
                    className="absolute top-4 h-1.5 w-1.5 rounded-full bg-[#33ff66] shadow-[0_0_10px_rgba(51,255,102,0.9)]"
                    style={{ left: particle.left }}
                    initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
                    animate={{
                      y: [0, 120, 260],
                      x: [0, particle.drift, particle.drift * 0.45],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.2],
                    }}
                    transition={{
                      delay: particle.delay,
                      duration: particle.duration,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center py-2 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              {capturedImage ? (
                <CheckCircle2
                  size={52}
                  className="mx-auto text-[#33ff66] mb-2 drop-shadow-[0_0_10px_#33ff66]"
                />
              ) : (
                <Camera
                  size={52}
                  className="mx-auto text-[#33ff66] mb-2 drop-shadow-[0_0_8px_#33ff66]"
                />
              )}
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={finalRevealed ? "decoded" : "mission"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="font-mono text-xl md:text-2xl font-bold tracking-widest text-[#33ff66] uppercase">
                  {finalRevealed ? "BLACKBOX Decoded" : "Final Mission"}
                </h1>
                <p className="font-mono text-[10px] md:text-xs text-[#3c663a] mt-1 max-w-xl mx-auto">
                  {finalRevealed
                    ? "You didn't just solve puzzles. You decoded BLACKBOX. Welcome to the league of BLACKBOX Masters."
                    : "You've come this far. Capture one final memory with your entire team."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative border-2 border-dashed border-[#33ff66]/30 bg-[#030703] rounded-md min-h-[240px] sm:min-h-[300px] lg:min-h-[340px] overflow-hidden flex items-center justify-center select-none shadow-[0_0_22px_rgba(51,255,102,0.08)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(51,255,102,0.08),transparent_24%,transparent_76%,rgba(51,255,102,0.06))] pointer-events-none z-10" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#33ff66]/30 shadow-[0_0_12px_rgba(51,255,102,0.8)] pointer-events-none z-10" />

            <AnimatePresence mode="wait">
              {capturedImage ? (
                <motion.img
                  key="captured-photo"
                  src={capturedImage}
                  alt="Captured team finale"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              ) : (
                <motion.div
                  key="live-preview"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                >
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    className={`h-full w-full object-cover transition-opacity duration-500 ${
                      cameraReady ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!capturedImage && (!cameraReady || cameraError) && (
              <div className="relative z-20 flex flex-col items-center justify-center text-center p-6">
                <CameraIcon
                  size={48}
                  className="text-[#3c663a] mb-2 animate-pulse"
                />
                <p className="font-mono text-xs text-[#3c663a] font-bold">
                  CAMERA PREVIEW ARRAY
                </p>
                <p className="font-mono text-[10px] text-[#3c663a]/65 mt-1">
                  {cameraError ? "Camera permission required for final capture." : "Initializing webcam feed..."}
                </p>
              </div>
            )}

            {capturedImage && (
              <motion.div
                className="absolute left-3 top-3 z-20 flex items-center gap-1.5 border border-[#33ff66]/50 bg-[#030703]/80 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#33ff66] backdrop-blur-sm"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Sparkles size={12} />
                Mission Complete
              </motion.div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <AnimatePresence mode="wait">
            {finalRevealed ? (
              <motion.div
                key="final-message"
                className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 font-mono text-[10px] text-[#3c663a] leading-relaxed space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35 }}
              >
                <p className="text-[#33ff66] font-bold uppercase tracking-wider mb-1">{"// BLACKBOX MASTER RECORD"}</p>
                <p>Your final frame has been sealed into the recovery archive.</p>
                <p>The system recognizes your team as BLACKBOX Masters.</p>
                <p className="text-white font-bold pt-1">Mission complete. Stand tall.</p>
              </motion.div>
            ) : (
              <motion.div
                key="instructions"
                className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 font-mono text-[10px] text-[#3c663a] leading-relaxed space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
            <p className="text-[#33ff66] font-bold uppercase tracking-wider mb-1">{"// CAPTURE YOUR VICTORY"}</p>
            <p>Gather your entire team inside the frame.</p>
            <p>Your victory capture snapshot will be saved to your engineer certification credentials.</p>
            <p className="text-white font-bold pt-1">Smile... this moment is permanent.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!capturedImage && (
          <div className="flex gap-3 select-none">
            <button
              onClick={handleCapture}
              disabled={!cameraReady || cameraError}
              className="flex-1 border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black transition-all duration-250 py-2.5 font-mono text-xs font-bold uppercase cursor-pointer"
            >
              Capture Team Photo
            </button>
          </div>
          )}
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
