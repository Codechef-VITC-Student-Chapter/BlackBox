"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BootSequence } from "@/components/ui/BootSequence";
import { PageTransition } from "@/components/ui/PageTransition";

export default function LandingPage() {
  const [isBooting, setIsBooting] = useState(false);

  return (
    <>
      <BootSequence isActive={isBooting} />
      <PageTransition>
        <div className="flex flex-col items-center text-center space-y-24 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="space-y-6"
          >
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white">
              BLACK<span className="text-secondary-text">BOX</span>
            </h1>
            <p className="font-mono text-secondary-text text-lg md:text-xl max-w-md mx-auto">
              &quot;The application works.<br />The truth is hidden inside.&quot;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-mono text-secondary-text text-sm md:text-base space-y-4 text-left max-w-sm mx-auto p-8 glass-panel"
          >
            <p className="text-text">Three months ago,</p>
            <p>BLACKBOX was deployed.</p>
            <p className="pt-4 text-text">Today,</p>
            <p>every subsystem has failed.</p>
            <div className="py-4 space-y-1 text-danger/80">
              <p>{`> Authentication. [OFFLINE]`}</p>
              <p>{`> Repository.     [OFFLINE]`}</p>
              <p>{`> Network.        [OFFLINE]`}</p>
              <p>{`> Memory.         [OFFLINE]`}</p>
            </div>
            <p className="text-primary pt-4">Only one question remains.</p>
            <p className="text-text">Can you recover it?</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <MagneticButton onClick={() => setIsBooting(true)}>
              START RECOVERY
            </MagneticButton>
          </motion.div>
        </div>
      </PageTransition>
    </>
  );
}
