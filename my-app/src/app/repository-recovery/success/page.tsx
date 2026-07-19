"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { synth } from "@/utils/synthAudio";

function CountUpNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span>{value}</span>;
}

export default function ReconstructSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Play Success Fanfare
    synth.playSuccessFanfare();

    // Trigger auto countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerRedirect = useCallback(() => {
    router.push("/repository-recovery/verify");
  }, [router]);

  // Monitor countdown to trigger redirect safely after render
  useEffect(() => {
    if (countdown === 0) {
      triggerRedirect();
    }
  }, [countdown, triggerRedirect]);

  const handleContinue = () => {
    synth.playClick();
    triggerRedirect();
  };

  return (
    <PageTransition>
      <div className="w-full max-w-[800px] glass-panel p-10 text-center border border-white/10 relative shadow-2xl select-none">
        
        {/* Style tag for logo breathing pulse */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes logoPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.1)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(0, 229, 255, 0.35)); }
          }
          .github-logo-animated {
            animation: logoPulse 2.5s ease-in-out infinite;
          }
        `}} />

        {/* Pulsing GitHub Logo SVG */}
        <div className="flex justify-center mb-8">
          <div className="github-logo-animated w-28 h-28 flex items-center justify-center p-2 rounded-full border border-white/10 bg-surface/50">
            <img 
              src="/images/github_logo.svg" 
              alt="GitHub Logo" 
              className="w-[85%] h-[85%] object-contain filter invert" 
              style={{ filter: "invert(88%) sepia(21%) saturate(2283%) hue-rotate(156deg) brightness(101%) contrast(101%)" }}
            />
          </div>
        </div>

        <h1 className="font-heading text-4xl font-black text-primary tracking-wide text-shadow-[0_0_12px_rgba(0,229,255,0.4)] uppercase mb-2">
          REPOSITORY RESTORED
        </h1>
        <p className="text-secondary-text text-sm max-w-lg mx-auto leading-relaxed mb-8">
          All system mirrors have successfully synchronized and the authentication path is secure. You have restored the source code repository.
        </p>

        {/* Stats Grid Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[600px] mx-auto mb-8 font-mono select-none">
          <div className="bg-primary/[0.02] border border-primary/10 hover:border-primary/25 rounded p-4 relative shadow-[inset_0_0_10px_rgba(0,229,255,0.02)] transition-all">
            <div className="text-2xl font-black text-primary text-shadow-[0_0_8px_rgba(0,229,255,0.4)] mb-1">
              <CountUpNumber target={142} />
            </div>
            <div className="text-[10px] text-secondary-text/80 uppercase tracking-widest">Objects</div>
          </div>
          
          <div className="bg-primary/[0.02] border border-primary/10 hover:border-primary/25 rounded p-4 relative shadow-[inset_0_0_10px_rgba(0,229,255,0.02)] transition-all">
            <div className="text-2xl font-black text-primary text-shadow-[0_0_8px_rgba(0,229,255,0.4)] mb-1">
              <CountUpNumber target={318} />
            </div>
            <div className="text-[10px] text-secondary-text/80 uppercase tracking-widest">Commits</div>
          </div>
          
          <div className="bg-primary/[0.02] border border-primary/10 hover:border-primary/25 rounded p-4 relative shadow-[inset_0_0_10px_rgba(0,229,255,0.02)] transition-all">
            <div className="text-2xl font-black text-primary text-shadow-[0_0_8px_rgba(0,229,255,0.4)] mb-1">
              <CountUpNumber target={5} />
            </div>
            <div className="text-[10px] text-secondary-text/80 uppercase tracking-widest">Branches</div>
          </div>
          
          <div className="bg-primary/[0.02] border border-primary/10 hover:border-primary/25 rounded p-4 relative shadow-[inset_0_0_10px_rgba(0,229,255,0.02)] transition-all">
            <div className="text-2xl font-black text-primary text-shadow-[0_0_8px_rgba(0,229,255,0.4)] mb-1">
              <CountUpNumber target={14} />
            </div>
            <div className="text-[10px] text-secondary-text/80 uppercase tracking-widest">Releases</div>
          </div>
        </div>

        {/* Redirect Action elements */}
        <div className="space-y-4 pt-4 border-t border-white/5 max-w-[600px] mx-auto">
          <p className="font-mono text-xs text-secondary-text/70">
            Redirecting to Verification Portal in <span className="text-primary font-bold text-shadow-[0_0_6px_rgba(0,229,255,0.4)]">{countdown}</span> seconds...
          </p>
          
          <button 
            onClick={handleContinue}
            className="font-mono font-bold tracking-widest border border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_15px_#00e5ff] py-3.5 px-12 rounded transition-all duration-300 uppercase cursor-pointer"
          >
            CONTINUE
          </button>
        </div>

      </div>
    </PageTransition>
  );
}
