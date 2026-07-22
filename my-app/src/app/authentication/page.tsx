"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, Lock, Key, Shield, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

export default function AuthenticationModule() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { playSound } = useAudio();

  const handleAuthenticate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: 'BLACKBOX2026', pin: '483921' }),
        credentials: 'include'
      });

      if (response.ok) {
        setAuthStatus("Authentication successful! Check DevTools → Storage → Cookies for JWT.");
        playSound("success");
      } else {
        const data = await response.json();
        setError(data.error || "Authentication failed");
        playSound("error");
      }
    } catch (err) {
      setError("Network error. Make sure server is running.");
      playSound("error");
    }
  };

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
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Terminal */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />
            <span className="font-mono text-sm text-secondary-text tracking-wider">MODULE_1_AUTH.EXE</span>
          </div>
          
          <div className="p-6 font-mono text-sm space-y-2 flex-1 overflow-auto">
            {terminalLines.map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${line.includes('INSTRUCTIONS') || line.includes('Example') ? 'text-primary font-bold' : line.includes('curl') ? 'text-accent' : 'text-text'}`}
              >
                {line}
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
              <span className="text-primary">STATUS:</span> Awaiting authentication<br/>
              <span className="text-text mt-2 block">Decode the JWT to proceed.</span>
            </p>
          </div>
        </div>

        {/* Right Side: Challenge Steps */}
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
          
          <div className="glass-panel p-4 border border-border mt-4">
            <h3 className="font-mono text-xs text-secondary-text uppercase tracking-widest mb-2">Test Authentication</h3>
            <button
              onClick={handleAuthenticate}
              className="w-full bg-primary/20 border border-primary text-primary font-mono text-sm uppercase tracking-widest py-2 rounded hover:bg-primary/30 transition-colors mb-3"
            >
              Authenticate
            </button>
            
            {error && (
              <div className="p-3 bg-danger/20 border border-danger rounded mb-3">
                <p className="font-mono text-xs text-danger">{error}</p>
              </div>
            )}
            
            {authStatus && (
              <div className="p-3 bg-primary/20 border border-primary rounded">
                <p className="font-mono text-xs text-primary">{authStatus}</p>
              </div>
            )}
          </div>
          
          <div className="glass-panel p-4 border border-border mt-4">
            <h3 className="font-mono text-xs text-secondary-text uppercase tracking-widest mb-2">Test Credentials</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-text">Event ID:</span>
                <span className="text-primary">BLACKBOX2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Team PIN:</span>
                <span className="text-primary">483921</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </PageTransition>
  );
}

function StepCard({ step, title, description, icon }: { step: number, title: string, description: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-4 border border-border"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="font-mono text-xs text-primary font-bold">{step}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-primary text-sm">{icon}</div>
            <span className="font-mono text-sm text-text font-semibold">{title}</span>
          </div>
          <p className="font-mono text-xs text-secondary-text">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
