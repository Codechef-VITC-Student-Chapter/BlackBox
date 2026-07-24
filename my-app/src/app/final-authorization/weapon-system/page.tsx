"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const modes = ["SAFE", "SEMI", "AUTO"];

export default function WeaponSystemPage() {
    const router = useRouter();

    const [modeIndex, setModeIndex] = useState(0);
    const [activated, setActivated] = useState(false);

    function handleModeChange() {
        if (activated) return;

        if (modeIndex < modes.length - 1) {
            setModeIndex(modeIndex + 1);
        } else {
            setActivated(true);
        }
    }

    return (
        <PageTransition>
            <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

                {/* LEFT */}

                <div className="flex-1 glass-panel flex flex-col overflow-hidden">

                    <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
                        <Terminal size={18} className="text-secondary-text" />

                        <span className="font-mono text-sm tracking-widest text-secondary-text">
                            WEAPON_SYSTEM.EXE
                        </span>
                    </div>

                    <div className="flex-1 p-8 font-mono">

                        <h1 className="text-3xl text-primary font-bold tracking-widest mb-8">
                            WEAPON STATUS
                        </h1>

                        <div className="space-y-3 text-sm">

                            <p>
                                MODEL :
                                <span className="text-primary ml-2">
                                    AK47
                                </span>
                            </p>

                            <p>
                                STATE :
                                <span
                                    className={`ml-2 ${activated
                                            ? "text-primary"
                                            : "text-danger"
                                        }`}
                                >
                                    {activated ? "ONLINE" : "DISABLED"}
                                </span>
                            </p>

                            <p>
                                RECOVERY MODE :
                                <span className="text-primary ml-2">
                                    ACTIVE
                                </span>
                            </p>

                        </div>

                        {/* Gun */}

                        <div className="flex justify-center my-14">

                            <motion.img
                                src="/images/ak47.png"
                                alt="AK47"
                                className={`w-[430px] transition-all duration-500 ${activated
                                        ? ""
                                        : "opacity-40 grayscale"
                                    }`}
                                animate={{
                                    scale: activated ? 1.03 : 1,
                                }}
                            />

                        </div>

                        {/* Safety */}

                        <div className="flex flex-col items-center gap-6">

                            <p className="text-secondary-text tracking-widest">
                                SAFETY SELECTOR
                            </p>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleModeChange}
                                className={`border px-10 py-3 font-bold tracking-widest transition-all ${activated
                                        ? "border-primary text-primary"
                                        : "border-border text-white hover:border-primary"
                                    }`}
                            >
                                {activated
                                    ? "WEAPON ONLINE"
                                    : `MODE : ${modes[modeIndex]}`}
                            </motion.button>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="lg:w-80 flex flex-col gap-4">

                    <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">
                        Weapon Diagnostics
                    </h2>

                    <StatusCard
                        title="Recovery Mode"
                        status="ACTIVE"
                        success
                    />

                    <StatusCard
                        title="Power"
                        status="ONLINE"
                        success
                    />

                    <StatusCard
                        title="Safety"
                        status={activated ? "OFF" : modes[modeIndex]}
                    />

                    <StatusCard
                        title="Authorization"
                        status={activated ? "FAILED" : "WAITING"}
                    />

                </div>

            </div>

            {/* Bottom Terminal */}

            {activated && (

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-panel mt-8 p-6 font-mono space-y-3"
                >

                    <p className="text-primary">
                        WEAPON ONLINE
                    </p>

                    <p className="text-danger">
                        AUTHENTICATION FAILED
                    </p>

                    <p className="text-secondary-text">
                        RECOVERY KEY REQUIRED
                    </p>

                    <button
                        onClick={() =>
                            router.push(
                                "/final-authorization/authorization"
                            )
                        }
                        className="mt-4 border border-primary text-primary px-8 py-3 hover:bg-primary hover:text-black transition"
                    >
                        Enter Recovery Key
                    </button>

                </motion.div>

            )}

        </PageTransition>
    );
}

function StatusCard({
    title,
    status,
    success = false,
}: {
    title: string;
    status: string;
    success?: boolean;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`glass-panel p-4 flex justify-between items-center border ${success
                    ? "border-primary/30 bg-primary/5"
                    : "border-border"
                }`}
        >
            <div className="flex items-center gap-3">

                {success ? (
                    <ShieldCheck
                        size={18}
                        className="text-primary"
                    />
                ) : (
                    <Lock
                        size={18}
                        className="text-secondary-text"
                    />
                )}

                <span className="font-mono text-sm">
                    {title}
                </span>

            </div>

            <span
                className={`font-mono text-xs px-2 py-1 rounded ${success
                        ? "bg-primary/20 text-primary"
                        : "bg-surface text-secondary-text"
                    }`}
            >
                {status}
            </span>
        </motion.div>
    );
}