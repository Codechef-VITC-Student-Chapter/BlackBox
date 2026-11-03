"use client";

import { motion } from "framer-motion";
import { FileCode2 } from "lucide-react";

export default function ProblemSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel flex flex-col overflow-hidden h-full"
    >
      {/* Header */}
      <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
        <FileCode2 size={18} className="text-secondary-text" />
        <span className="font-mono text-sm tracking-widest text-secondary-text">
          PROBLEM_STATEMENT.TXT
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-8">

        {/* Title */}
        <section>
          <h2 className="font-heading text-xl text-primary uppercase tracking-wider mb-2">
            Corrupted Network Nodes
          </h2>

          <p className="text-secondary-text leading-7">
            During the recovery of the BLACKBOX infrastructure,
            several communication nodes became corrupted.
            Your task is to determine the minimum recovery operations
            required to reconnect the system.
          </p>
        </section>

        {/* Statement */}

        <section>
          <h3 className="text-primary mb-3 uppercase tracking-wide">
            Problem Statement
          </h3>

          <p className="text-secondary-text leading-7">
            You are given a graph consisting of <span className="text-primary">N</span> nodes
            and <span className="text-primary">M</span> edges.
            Every edge connects two different nodes.

            Find the minimum number of operations required to
            reconnect every node so that the entire network
            becomes connected.
          </p>
        </section>

        {/* Input */}

        <section>
          <h3 className="text-primary mb-3 uppercase">
            Input Format
          </h3>

          <ul className="space-y-2 text-secondary-text list-disc ml-6">
            <li>First line contains N and M.</li>
            <li>Next M lines contain two integers U and V.</li>
          </ul>
        </section>

        {/* Output */}

        <section>
          <h3 className="text-primary mb-3 uppercase">
            Output Format
          </h3>

          <p className="text-secondary-text">
            Print one integer —
            the minimum operations required.
          </p>
        </section>

        {/* Constraints */}

        <section>
          <h3 className="text-primary mb-3 uppercase">
            Constraints
          </h3>

          <div className="glass-panel p-4 text-secondary-text space-y-2">
            <p>1 ≤ N ≤ 2 × 10⁵</p>
            <p>0 ≤ M ≤ 2 × 10⁵</p>
          </div>
        </section>

        {/* Example */}

        <section>
          <h3 className="text-primary mb-3 uppercase">
            Sample Input
          </h3>

          <div className="glass-panel p-4 whitespace-pre font-mono">
{`4 2
1 2
3 4`}
          </div>
        </section>

        <section>
          <h3 className="text-primary mb-3 uppercase">
            Sample Output
          </h3>

          <div className="glass-panel p-4 font-mono">
            1
          </div>
        </section>

        {/* Explanation */}

        <section>
          <h3 className="text-primary mb-3 uppercase">
            Explanation
          </h3>

          <p className="text-secondary-text leading-7">
            The graph consists of two disconnected components.
            Connecting one node from each component is sufficient
            to recover the BLACKBOX network.
          </p>
        </section>

      </div>
    </motion.div>
  );
}