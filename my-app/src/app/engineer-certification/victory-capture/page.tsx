"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import {
    Camera,
    Terminal,
    CameraIcon,
    ArrowRight,
} from "lucide-react";

export default function VictoryCapturePage() {
    const router = useRouter();

    return (
        <PageTransition>
            <div className="flex justify-center items-center min-h-[80vh]">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel w-full max-w-5xl overflow-hidden"
                >

                    {/* Header */}

                    <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
                        <Terminal size={18} className="text-secondary-text" />
                        <span className="font-mono text-sm tracking-widest uppercase text-secondary-text">
                            Victory Capture
                        </span>
                    </div>

                    {/* Body */}

                    <div className="p-10 space-y-8">

                        <div className="text-center">

                            <Camera
                                size={60}
                                className="mx-auto text-primary mb-5"
                            />

                            <h1 className="font-heading text-4xl uppercase tracking-widest text-primary">
                                Engineer Certified
                            </h1>

                            <p className="font-mono text-secondary-text mt-4">
                                One final step before BLACKBOX closes.
                            </p>

                        </div>

                        {/* Camera */}

                        <div className="glass-panel p-8">

                            <div className="border-2 border-dashed border-border rounded-xl h-[420px] flex flex-col items-center justify-center">

                                <CameraIcon
                                    size={70}
                                    className="text-secondary-text mb-6"
                                />

                                <p className="font-mono text-secondary-text">
                                    Camera Preview
                                </p>

                                <p className="font-mono text-xs text-secondary-text mt-2">
                                    Webcam will appear here.
                                </p>

                            </div>
                            {/* <Webcam
                                    audio={false}
                                    screenshotFormat="image/png"
                                    className="rounded-xl w-full h-full object-cover"
                                /> */}
                        </div>

                        {/* Instructions */}

                        <div className="glass-panel p-6 font-mono text-sm space-y-3">

                            <p className="text-primary">
                                &gt; Capture Your Victory
                            </p>

                            <p>
                                Gather your entire team inside the frame.
                            </p>

                            <p>
                                Your final achievement frame will be generated
                                automatically based on your leaderboard rank.
                            </p>

                            <p>
                                Smile... this moment is permanent.
                            </p>

                        </div>

                        {/* Buttons */}

                        <div className="flex justify-end gap-4">

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary text-black px-6 py-3 rounded-lg font-bold"
                            >
                                Capture Photo
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    router.push("/engineer-certification/leaderboard")
                                }
                                className="glass-panel px-6 py-3 flex items-center gap-2"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </motion.button>

                        </div>

                    </div>

                </motion.div>

            </div>
        </PageTransition>
    );
}