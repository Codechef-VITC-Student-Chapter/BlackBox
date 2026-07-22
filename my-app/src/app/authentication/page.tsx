"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, Lock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

export default function AuthenticationModule() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const { playSound } = useAudio();

  useEffect(() => {
    const sequence = [
      "BLACKBOX EVENT AUTHENTICATION",
      "Module 1: Access Control",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "INSTRUCTIONS:",
      "1. Use your Event ID and Team PIN",
      "2. Authenticate via POST /api/auth/login",
      "3. JWT token stored in browser cookie",
      "4. Inspect DevTools → Storage → Cookies",
      "5. Decode JWT to extract hidden route",
      "6. Change URL from /authentication to /access/[hiddenRoute]",
      "",
      "Example curl command:",
      'curl -X POST http://localhost:3000/api/auth/login \\',
      '  -H "Content-Type: application/json" \\',
      '  -d \'{"eventId": "BLACKBOX2026", "pin": "483921"}\' \\',
      '  -c cookies.txt',
      "",
      "Note: JWT is stored in browser cookie",
      "Waiting for authentication..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const line = sequence[i];
        setTerminalLines(prev => [...prev, line]);
        playSound("typing");
        if (line.includes("FAILED") || line.includes("ERROR")) {
          playSound("error");
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Terminal */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />
            <span className="font-mono text-sm text-secondary-text tracking-wider">AUTH_RECOVERY.EXE</span>
          </div>
          
          <div className="p-6 font-mono text-sm space-y-3 flex-1">
            {terminalLines.map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${line.includes('FAILED') || line.includes('ERROR') ? 'text-danger' : 'text-primary'}`}
              >
                {`> ${line}`}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2.5 h-4 bg-primary inline-block ml-2 align-middle"
            />
          </div>

          <div className="p-6 border-t border-border bg-surface/30">
            <p className="font-mono text-secondary-text text-sm">
              
              The machine remembers every visitor. Those who know where memories are kept will find a signed trace. Most will read it. The Engineer expected you to do something else<br/>
              
            </p>
            <p className="font-mono text-secondary-text text-sm">
              <br/>Everything you need <br/>
              is already here. <br/>
              <span className="text-text mt-2 block">Look closer.</span>
            </p>            
          </div>
        </div>

        {/* Right Side: System Status */}
        <div className="lg:w-80 flex flex-col gap-4">
          <h2 className="font-heading text-lg text-secondary-text uppercase tracking-widest mb-2">Challenge Steps</h2>
          
          <StepCard 
            step={1} 
            title="Authenticate" 
            description="POST /api/auth/login with Event ID and PIN"
            icon={<Key size={18} />}
          />
          <StepCard 
            step={2} 
            title="Inspect Cookie" 
            description="Find JWT in browser DevTools"
            icon={<Shield size={18} />}
          />
          <StepCard 
            step={3} 
            title="Decode JWT" 
            description="Extract hidden route from payload"
            icon={<Terminal size={18} />}
          />
          <StepCard 
            step={4} 
            title="Access Route" 
            description="Change URL from /authentication to /access/[hiddenRoute]"
            icon={<ArrowRight size={18} />}
          />
          
          <StatusCard title="Authentication" status="FAILED" icon={<XCircle size={18} />} />
          <StatusCard title="Repository" status="LOCKED" icon={<Lock size={18} />} />
          <StatusCard title="Network" status="LOCKED" icon={<Lock size={18} />} />
          <StatusCard title="Memory" status="LOCKED" icon={<Lock size={18} />} />
          <StatusCard title="Core" status="LOCKED" icon={<Lock size={18} />} />
        </div>
        
      </div>
    </PageTransition>
  );
}

function StatusCard({ title, status, icon }: { title: string, status: string, icon: React.ReactNode }) {
  const isFailed = status === "FAILED";
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 flex items-center justify-between border ${isFailed ? 'border-danger/30 bg-danger/5' : 'border-border'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`${isFailed ? 'text-danger' : 'text-secondary-text'}`}>
          {icon}
        </div>
        <span className="font-mono text-sm text-text">{title}</span>
      </div>
      <span className={`font-mono text-xs px-2 py-1 rounded ${isFailed ? 'bg-danger/20 text-danger' : 'bg-surface text-secondary-text'}`}>
        {status}
      </span>
    </motion.div>
  );
}
