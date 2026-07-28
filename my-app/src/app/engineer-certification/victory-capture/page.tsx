"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { synth } from "@/utils/synthAudio";
import {
  Camera,
  CameraIcon,
  CheckCircle2,
  Sparkles,
  ScanLine,
  Trophy,
} from "lucide-react";

const CELEBRATION_PARTICLES = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 13) % 90)}%`,
  delay: ((index * 5) % 8) / 10,
  duration: 2 + ((index * 7) % 15) / 10,
  drift: -60 + ((index * 23) % 120),
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
      <div className="min-h-screen w-full overflow-hidden bg-[#030603] text-[#33ff66] font-mono relative">

        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(51,255,102,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,255,102,0.06)_1px,transparent_1px)] bg-[size:45px_45px]" />

        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,255,102,0.08),transparent_65%)]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.9)_100%)]" />

        <div className="relative z-10 flex min-h-screen flex-col px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

          {/* HEADER */}

          <header className="mb-5 sm:mb-8 rounded-2xl border border-[#33ff66]/30 bg-[#071007]/90 shadow-[0_0_35px_rgba(51,255,102,.12)] backdrop-blur-md">

            <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4">

              <div>

                <h2 className="text-[#33ff66] font-black tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[11px] sm:text-sm">
                  BLACKBOX ENGINEERING DIVISION
                </h2>

                <p className="text-[#4f8b5d] text-[10px] sm:text-xs mt-1 tracking-wider">
                  VICTORY_CAPTURE.exe
                </p>

              </div>

              <div className="rounded-lg border border-[#33ff66]/30 px-3 sm:px-4 py-2 bg-[#081108] text-[10px] sm:text-xs uppercase tracking-widest">

                SYSTEM ONLINE

              </div>

            </div>

          </header>

          <main className="flex-1">

            {/* TITLE */}

            <motion.div

              initial={{ opacity: 0, y: -20 }}

              animate={{ opacity: 1, y: 0 }}

              className="text-center mb-6 sm:mb-8 md:mb-10"

            >

              <motion.div

                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 3, -3, 0],
                }}

                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}

              >

                {capturedImage ? (

                  <Trophy

                    size={56}

                    className="mx-auto text-[#33ff66] drop-shadow-[0_0_20px_#33ff66]"

                  />

                ) : (

                  <Camera

                    size={56}

                    className="mx-auto text-[#33ff66] drop-shadow-[0_0_20px_#33ff66]"

                  />

                )}

              </motion.div>

              <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#33ff66]">

                {finalRevealed
                  ? "CONGRATULATIONS"
                  : "FINAL MISSION"}

              </h1>

              <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-bold uppercase text-white tracking-[0.25em] sm:tracking-[0.35em]">

                BLACKBOX ENGINEERS

              </h2>

              <p className="mt-4 sm:mt-5 text-[#4b7f55] max-w-3xl mx-auto text-xs sm:text-sm md:text-base">

                {finalRevealed
                  ? "Mission Complete • Official Engineer Certification Photo Archived Successfully"
                  : "Gather your entire engineering squad inside the frame and capture the final BLACKBOX memory."}

              </p>

            </motion.div>


            <div className="mx-auto w-full max-w-6xl flex flex-col items-center gap-5 sm:gap-6 md:gap-8">

              {/* Congratulations Banner */}

              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl rounded-2xl border-2 border-[#33ff66]
               bg-[#071007]
               px-4 sm:px-6 py-4 sm:py-5
               text-center
               shadow-[0_0_45px_rgba(51,255,102,.22)]"
              >

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-[.2em] sm:tracking-[.25em] text-[#33ff66]">
                  🎉 Congratulations BlackBox Engineers 🎉
                </h2>

                <p className="mt-2 sm:mt-3 text-[#65b374] tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[10px] sm:text-xs md:text-sm">
                  Official Team Certification Photograph
                </p>

              </motion.div>





              {/* CAMERA FRAME */}

              <div className="relative w-full max-w-[42rem] sm:max-w-5xl">

                {/* Outer Glow */}

                <div className="absolute -inset-3 rounded-[36px]
                      bg-[#33ff66]/10 blur-3xl"/>

                <div
                  className="relative
      rounded-[34px]
      border-2
      border-[#33ff66]
      bg-[#020402]
      p-3 sm:p-4 md:p-5
      shadow-[0_0_60px_rgba(51,255,102,.18)]">




                  {/* INNER BORDER */}

                  <div className="rounded-[28px]
                      border
                      border-[#33ff66]/30
                      p-2 sm:p-3">




                    {/* CAMERA */}

                    <div
                      className="relative
                 aspect-[5/4] sm:aspect-video
                 overflow-hidden
                 rounded-[16px] sm:rounded-[20px]
                 border
                 border-[#33ff66]/40
                 bg-black">





                      {/* Corner Brackets */}

                      <div className="absolute left-3 top-3 h-8 w-8 border-l-4 border-t-4 border-[#33ff66] z-40 sm:left-4 sm:top-4 sm:h-10 sm:w-10" />

                      <div className="absolute right-3 top-3 h-8 w-8 border-r-4 border-t-4 border-[#33ff66] z-40 sm:right-4 sm:top-4 sm:h-10 sm:w-10" />

                      <div className="absolute left-3 bottom-3 h-8 w-8 border-l-4 border-b-4 border-[#33ff66] z-40 sm:left-4 sm:bottom-4 sm:h-10 sm:w-10" />

                      <div className="absolute right-3 bottom-3 h-8 w-8 border-r-4 border-b-4 border-[#33ff66] z-40 sm:right-4 sm:bottom-4 sm:h-10 sm:w-10" />





                      {/* Scanner */}

                      {!capturedImage && (

                        <motion.div

                          className="absolute
                 left-0
                 right-0
                 h-1
                 bg-[#33ff66]
                 shadow-[0_0_18px_#33ff66]
                 z-30"

                          animate={{
                            y: ["0%", "100%", "0%"]
                          }}

                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "linear"
                          }}

                        />

                      )}





                      {/* Scan Glow */}

                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(51,255,102,.10),transparent_20%,transparent_80%,rgba(51,255,102,.10))] z-20 pointer-events-none" />





                      {/* LIVE VIDEO / PHOTO */}

                      <AnimatePresence mode="wait">

                        {capturedImage ? (

                          <motion.img

                            key="captured"

                            src={capturedImage}

                            alt="Captured Team"

                            className="absolute inset-0 h-full w-full object-cover"

                            initial={{ opacity: 0, scale: 1.08 }}

                            animate={{ opacity: 1, scale: 1 }}

                            transition={{ duration: .5 }}

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
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">

                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "linear",
                            }}
                          >
                            <CameraIcon
                              size={48}
                              className="text-[#33ff66] drop-shadow-[0_0_20px_#33ff66]"
                            />
                          </motion.div>

                          <h3 className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl font-black uppercase tracking-[.2em] sm:tracking-[.25em] text-[#33ff66]">
                            Camera Array
                          </h3>

                          <p className="mt-2 text-center text-[#70b97b] text-xs sm:text-sm max-w-md px-4 sm:px-6">
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

                          className="
          absolute
          left-6
          top-6
          z-50
          rounded-xl
          border
          border-[#33ff66]
          bg-[#041004]/90
          px-4 sm:px-5
          py-2 sm:py-3
          backdrop-blur-md
          shadow-[0_0_30px_rgba(51,255,102,.25)]
          "

                        >

                          <div className="flex items-center gap-3">

                            <Sparkles
                              size={18}
                              className="text-[#33ff66]"
                            />

                            <div>

                              <p className="text-[10px] sm:text-xs uppercase tracking-[.25em] sm:tracking-[.3em] text-[#33ff66] font-black">
                                Mission Complete
                              </p>

                              <p className="text-[9px] sm:text-[10px] uppercase tracking-[.18em] sm:tracking-[.2em] text-[#7ac686]">
                                Photo Successfully Captured
                              </p>

                            </div>

                          </div>

                        </motion.div>

                      )}






                      {/* Bottom Certification Strip */}

                      <div
                        className="
      absolute
      bottom-0
      left-0
      right-0
      z-40
      bg-gradient-to-r
      from-[#051005]
      via-[#0b1d0d]
      to-[#051005]
      border-t
      border-[#33ff66]/40
      px-3 sm:px-4 md:px-6
      py-2 sm:py-3
      ">

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <span className="text-[#33ff66] font-bold uppercase tracking-[.2em] sm:tracking-[.25em] text-[10px] sm:text-xs">
                            BLACKBOX ENGINEERS
                          </span>

                          <span className="text-[#79bb7b] uppercase tracking-[.3em] text-[10px]">
                            Official Certification Frame
                          </span>

                          <span className="text-[#79bb7b] uppercase tracking-[.3em] text-[10px]">
                            Secure Capture Protocol
                          </span>

                        </div>

                      </div>





                      {/* Camera Glow */}

                      <div
                        className="
      absolute
      inset-0
      pointer-events-none
      rounded-[24px]
      shadow-[inset_0_0_60px_rgba(51,255,102,.08)]
      "
                      />

                    </div>

                  </div>

                </div>

              </div>

              <canvas
                ref={canvasRef}
                className="hidden"
              />
              <AnimatePresence mode="wait">

                {finalRevealed ? (

                  <motion.div

                    key="success"

                    initial={{ opacity: 0, y: 30 }}

                    animate={{ opacity: 1, y: 0 }}

                    exit={{ opacity: 0 }}

                    transition={{ duration: .5 }}

                    className="w-full max-w-5xl"

                  >

                    <div
                      className="
      rounded-2xl
      border-2
      border-[#33ff66]
      bg-[#061106]
      p-5 sm:p-6 md:p-8
      shadow-[0_0_60px_rgba(51,255,102,.18)]
      ">

                      <motion.div

                        animate={{
                          scale: [1, 1.05, 1]
                        }}

                        transition={{
                          repeat: Infinity,
                          duration: 2
                        }}

                      >

                        <Trophy

                          size={72}

                          className="
          mx-auto
          text-[#33ff66]
          drop-shadow-[0_0_25px_#33ff66]
          "

                        />

                      </motion.div>

                      <h2
                        className="
        mt-6
        text-center
        text-2xl
        sm:text-3xl
        md:text-4xl
        lg:text-5xl
        font-black
        uppercase
        tracking-[.25em]
        text-[#33ff66]
        ">

                        Congratulations

                      </h2>

                      <h3
                        className="
        mt-4
        text-center
        text-lg
        sm:text-xl
        md:text-2xl
        lg:text-3xl
        uppercase
        tracking-[.3em]
        font-bold
        text-white
        ">

                        BLACKBOX ENGINEERS

                      </h3>

                      <p
                        className="
        mt-6
        text-center
        text-[#73bc7a]
        max-w-3xl
        mx-auto
        leading-8
        ">

                        Your final team photograph has been successfully archived into
                        the BLACKBOX Engineer Registry.

                        <br /><br />

                        You have completed every mission and officially joined the
                        BLACKBOX League of Engineers.

                      </p>

                      <div
                        className="
        mt-10
        grid
        gap-4
        md:grid-cols-3
        ">

                        <div className="rounded-xl border border-[#33ff66]/30 bg-[#071207] p-5">

                          <CheckCircle2 className="mb-3 text-[#33ff66]" />

                          <h4 className="font-bold uppercase tracking-[.2em]">
                            Team Photo
                          </h4>

                          <p className="mt-2 text-[#72b977] text-sm">
                            Successfully Captured
                          </p>

                        </div>

                        <div className="rounded-xl border border-[#33ff66]/30 bg-[#071207] p-5">

                          <CheckCircle2 className="mb-3 text-[#33ff66]" />

                          <h4 className="font-bold uppercase tracking-[.2em]">
                            Certification
                          </h4>

                          <p className="mt-2 text-[#72b977] text-sm">
                            Engineer Status Verified
                          </p>

                        </div>

                        <div className="rounded-xl border border-[#33ff66]/30 bg-[#071207] p-5">

                          <CheckCircle2 className="mb-3 text-[#33ff66]" />

                          <h4 className="font-bold uppercase tracking-[.2em]">
                            Mission
                          </h4>

                          <p className="mt-2 text-[#72b977] text-sm">
                            Successfully Completed
                          </p>

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

                    <div
                      className="
      rounded-2xl
      border
      border-[#33ff66]/30
      bg-[#071107]
      p-5 sm:p-6 md:p-8
      ">

                      <h3
                        className="
        text-[#33ff66]
        uppercase
        tracking-[.25em]
        font-black
        text-base
        sm:text-lg
        ">

                        Capture Your Victory

                      </h3>

                      <p
                        className="
        mt-5
        text-[#74b97d]
        leading-8
        ">

                        • Gather your complete engineering team inside the camera frame.

                        <br /><br />

                        • Stand together for your official BLACKBOX certification photo.

                        <br /><br />

                        • Once captured, this becomes your team's final achievement record.

                      </p>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>
              {/* Capture Button */}

              {!capturedImage && (

                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-5xl"
                >

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 45px rgba(51,255,102,.45)",
                    }}
                    whileTap={{
                      scale: 0.98,
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
      border-[#33ff66]
      bg-[#081208]
      py-4 sm:py-5
      text-base sm:text-lg md:text-xl
      font-black
      uppercase
      tracking-[.35em]
      text-[#33ff66]
      transition-all
      duration-300
      disabled:cursor-not-allowed
      disabled:opacity-40
      "

                  >

                    {/* Animated Background */}

                    <motion.div
                      className="absolute inset-0 bg-[#33ff66]"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: .35 }}
                    />

                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">

                      📸 CAPTURE TEAM PHOTO

                    </span>

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