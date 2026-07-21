"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, CheckCircle2, ArrowRight } from "lucide-react";

export default function VerdictPage() {
  const router = useRouter();

  // Temporary data (replace with backend later)
  const verdict = "Accepted";
  const language = "C++";
  const passed = 15;
  const total = 15;
  const executionTime = "124 ms";
  const memory = "38 MB";
  const penalty = "+0 min";

  const accepted = verdict === "Accepted";

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-[80vh]">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel w-full max-w-4xl overflow-hidden"
        >

          {/* Header */}

          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />
            <span className="font-mono text-sm tracking-widest text-secondary-text uppercase">
              Submission Verdict
            </span>
          </div>

          {/* Body */}

          <div className="p-8 space-y-8">

            {/* Verdict */}

            <div className="text-center">

              <CheckCircle2
                size={70}
                className="mx-auto text-primary mb-4"
              />

              <h1 className="font-heading text-3xl tracking-widest text-primary uppercase">
                {verdict}
              </h1>

              <p className="font-mono text-secondary-text mt-2">
                Solution successfully verified.
              </p>

            </div>

            {/* Result Grid */}

            <div className="grid grid-cols-2 gap-6 font-mono text-sm">

              <Info title="Language" value={language} />
              <Info title="Submission ID" value="#18" />
              <Info title="Passed Testcases" value={`${passed}/${total}`} />
              <Info title="Execution Time" value={executionTime} />
              <Info title="Memory Used" value={memory} />
              <Info title="Penalty" value={penalty} />

            </div>

            {/* Terminal Output */}

            <div className="glass-panel p-5 font-mono text-sm space-y-2">

              <p>{"> Running hidden test cases..."}</p>
              <p>{"> Checking constraints..."}</p>
              <p>{"> Validating output..."}</p>
              <p className="text-primary">
                {"> All test cases passed."}
              </p>

            </div>

            {/* Button */}

            <div className="flex justify-end">

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  router.push("/engineer-certification/recovery-complete")
                }
                className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-lg"
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

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="glass-panel p-4">
      <p className="text-secondary-text text-xs uppercase tracking-widest">
        {title}
      </p>

      <p className="text-text mt-2 text-lg">{value}</p>
    </div>
  );
}