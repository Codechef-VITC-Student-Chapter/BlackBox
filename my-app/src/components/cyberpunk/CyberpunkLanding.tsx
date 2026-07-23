"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { synth } from "@/utils/synthAudio";
import { BootSequence } from "@/components/ui/BootSequence";

interface Subsystem {
  id: string;
  name: string;
  command: string;
  top: string;
  left: string;
  width: string;
  rot: number;
  depth: number;
  opacity: number;
  normalLogs: string[];
  failureLogs: string[];
}

const SUBSYSTEMS: Subsystem[] = [
  {
    id: "auth",
    name: "auth_daemon_v2.sh",
    command: "root@blackbox-node01:~# systemctl status auth.service",
    top: "5%",
    left: "3%",
    width: "290px",
    rot: -3,
    depth: 1.2,
    opacity: 0.95,
    normalLogs: [
      "● auth.service - BLACKBOX Authentication Daemon",
      "   Loaded: loaded (/lib/systemd/system/auth.service; enabled)",
      "   Active: active (running) since Wed 16:43:01 UTC",
      "   Tasks: 4 (limit: 4915) | Memory: 14.2M"
    ],
    failureLogs: [
      "[CRITICAL] Authentication failed (HTTP 401)",
      "Segmentation fault (core dumped)",
      "Process terminated with code 139",
      "Fatal exception: Access token revoked"
    ]
  },
  {
    id: "memory",
    name: "sys_memory_heap.c",
    command: "root@blackbox-node02:~# free -m -h",
    top: "10%",
    left: "28%",
    width: "300px",
    rot: 2,
    depth: 0.8,
    opacity: 0.9,
    normalLogs: [
      "               total        used        free      shared",
      "Mem:           31Gi       8.2Gi        18Gi       120Mi",
      "Swap:          2.0Gi          0B       2.0Gi",
      "[RAM] [██████████░░] 82.4% Heap allocated"
    ],
    failureLogs: [
      "free: Out of memory (OOM)",
      "Kernel panic - not syncing: Out of memory kill",
      "Memory corruption detected at 0x7FFF0042",
      "Process terminated"
    ]
  },
  {
    id: "network",
    name: "net_gateway_kmod.ko",
    command: "root@blackbox-gw:~# ping gateway.local",
    top: "4%",
    left: "64%",
    width: "280px",
    rot: 4,
    depth: 1.5,
    opacity: 0.95,
    normalLogs: [
      "PING gateway.local (10.244.0.1) 56(84) bytes of data.",
      "64 bytes from 10.244.0.1: icmp_seq=1 ttl=64 time=1.12 ms",
      "64 bytes from 10.244.0.1: icmp_seq=2 ttl=64 time=1.05 ms",
      "64 bytes from 10.244.0.1: icmp_seq=3 ttl=64 time=1.18 ms"
    ],
    failureLogs: [
      "From 10.244.0.1 icmp_seq=4 Destination Unreachable",
      "ping: sendmsg: Network is unreachable",
      "Connection refused",
      "Interface eth0 dropped"
    ]
  },
  {
    id: "gpu",
    name: "vulkan_gpu_pipeline.so",
    command: "root@blackbox-gpu:~# nvidia-smi",
    top: "22%",
    left: "80%",
    width: "270px",
    rot: -4,
    depth: 0.9,
    opacity: 0.85,
    normalLogs: [
      "| NVIDIA-SMI 535.104.05   Driver Version: 535.104 |",
      "| GPU  Name        Persistence-M | Bus-Id Disp.A |",
      "| 0  NVIDIA RTX 4090    On     | 0000:01:00.0   |",
      "| 64%   62C    P2    180W / 450W | 8192MiB/24576MiB |"
    ],
    failureLogs: [
      "NVIDIA-SMI failed: Driver communication lost",
      "GPU timeout detected on PCI bus 0000:01:00.0",
      "Bus error (core dumped)",
      "Display matrix crashed"
    ]
  },
  {
    id: "db",
    name: "mongodb_shard_01.d",
    command: "root@blackbox-db:~# mongosh --eval 'db.status()'",
    top: "32%",
    left: "2%",
    width: "300px",
    rot: 5,
    depth: 1.1,
    opacity: 0.92,
    normalLogs: [
      "Connecting to: mongodb://127.0.0.1:27017/blackbox",
      "{ ok: 1, members: 3, state: 'PRIMARY' }",
      "[DB] Connection pool ready (100 sockets)",
      "[QUERY] Cache hit rate: 99.4%"
    ],
    failureLogs: [
      "MongoNetworkError: connect ECONNREFUSED 127.0.0.1",
      "FATAL: Database exclusive lock",
      "SQL STATE [42000] Access Denied",
      "Repository unreachable"
    ]
  },
  {
    id: "repo",
    name: "git_mirror_sync.py",
    command: "root@blackbox-repo:~# git fetch origin main",
    top: "40%",
    left: "22%",
    width: "310px",
    rot: -2,
    depth: 1.6,
    opacity: 0.95,
    normalLogs: [
      "remote: Enumerating objects: 42, done.",
      "remote: Counting objects: 100% (42/42), done.",
      "remote: Compressing objects: 100% (18/18), done.",
      "Receiving objects: 100% (42/42), 1.20 MiB ok"
    ],
    failureLogs: [
      "fatal: read error: Connection reset by peer",
      "fatal: early EOF",
      "fatal: index-pack failed",
      "Repository unreachable"
    ]
  },
  {
    id: "ai_core",
    name: "ai_neural_inference.py",
    command: "root@blackbox-ai:~# torchrun --nproc=8 train.py",
    top: "26%",
    left: "48%",
    width: "320px",
    rot: 2,
    depth: 1.8,
    opacity: 0.95,
    normalLogs: [
      "[AI] PyTorch CUDA pipeline active",
      "[MODEL] 175B Weights verified in VRAM",
      "[TENSOR] [██████████░░] 88% PASS",
      "[OK] Realtime inference loop 120Hz"
    ],
    failureLogs: [
      "RuntimeError: CUDA error: device-side assert triggered",
      "AI Neural Core Unresponsive",
      "Tensor parity fail: NAN overflow",
      "Process terminated"
    ]
  },
  {
    id: "security",
    name: "security_sentinel_iptables.c",
    command: "root@blackbox-sec:~# iptables -L -n -v",
    top: "50%",
    left: "72%",
    width: "280px",
    rot: -4,
    depth: 0.7,
    opacity: 0.9,
    normalLogs: [
      "Chain INPUT (policy ACCEPT 12K packets, 4.2M bytes)",
      " pkts bytes target     prot opt in     out     source",
      "12400 4200K ACCEPT     all  --  eth0   *       0.0.0.0/0",
      "[OK] Zero vulnerability flags"
    ],
    failureLogs: [
      "[FATAL] INTRUSION DETECTED (SEV 1)",
      "Firewall breached: Rule bypass on port 443",
      "Security Sentinel crashed",
      "Fatal exception: Cryptographic key leak"
    ]
  },
  {
    id: "filesystem",
    name: "vfs_mount_sys.c",
    command: "root@blackbox-vfs:~# df -h /sys",
    top: "62%",
    left: "6%",
    width: "280px",
    rot: 4,
    depth: 1.0,
    opacity: 0.9,
    normalLogs: [
      "Filesystem      Size  Used Avail Use% Mounted on",
      "/dev/sda1       100G   24G   72G  25% /sys",
      "[SPEED] Read rate: 520 MB/s",
      "[OK] File descriptor limit 1024 ok"
    ],
    failureLogs: [
      "Filesystem read error on /dev/sda1",
      "EXT4-fs error: i/o error reading inode",
      "Bus error (core dumped)",
      "Filesystem read error"
    ]
  },
  {
    id: "process_mgr",
    name: "process_scheduler_rt.h",
    command: "root@blackbox-proc:~# ps aux | grep blackbox",
    top: "68%",
    left: "38%",
    width: "300px",
    rot: -3,
    depth: 1.3,
    opacity: 0.95,
    normalLogs: [
      "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
      "root      1294  0.2  1.4 1420900 410200 ?        Ssl  16:00   0:42 ./blackbox-core",
      "root      1412  0.0  0.2  412000  64000 ?        Sl   16:01   0:05 ./auth-service",
      "[OK] Thread pool 64 active"
    ],
    failureLogs: [
      "[1294] KILLED ./blackbox-core",
      "[1412] KILLED ./auth-service",
      "Kernel panic - not syncing: Fatal exception",
      "Process terminated"
    ]
  },
  {
    id: "telemetry",
    name: "telemetry_stream.go",
    command: "root@blackbox-log:~# journalctl -f -u telemetry",
    top: "14%",
    left: "16%",
    width: "270px",
    rot: -5,
    depth: 0.6,
    opacity: 0.8,
    normalLogs: [
      "-- Logs begin at Wed 2026-07-22 16:00:00 UTC. --",
      "Jul 22 16:43:01 telemetry[892]: Metrics feed 60Hz",
      "Jul 22 16:43:02 telemetry[892]: Heartbeat tick ok",
      "[OK] Sensor metrics streaming live"
    ],
    failureLogs: [
      "Jul 22 16:43:03 telemetry[892]: [EMERG] Feed terminated",
      "Jul 22 16:43:03 telemetry[892]: Heartbeat lost",
      "Service crashed",
      "Unexpected EOF"
    ]
  },
  {
    id: "kernel",
    name: "kernel_ring0_core.c",
    command: "root@blackbox-kernel:~# dmesg -w --level=err",
    top: "54%",
    left: "30%",
    width: "290px",
    rot: 5,
    depth: 1.2,
    opacity: 0.9,
    normalLogs: [
      "[KERN] Ring 0 privilege level verified",
      "[SYSCALL] Table mapped 0x80 active",
      "[INT] Interrupt vector 0x20 set",
      "[OK] Kernel space isolation stable"
    ],
    failureLogs: [
      "[ 412.89] Kernel panic - not syncing: Fatal exception in interrupt",
      "[ 412.90] CPU 0: Segmentation fault",
      "[ 412.91] System halted. Core dumped.",
      "Kernel panic"
    ]
  },
  {
    id: "clock",
    name: "sys_clock_chrony.c",
    command: "root@blackbox-clk:~# uptime",
    top: "72%",
    left: "66%",
    width: "260px",
    rot: 2,
    depth: 0.8,
    opacity: 0.85,
    normalLogs: [
      " 16:43:02 up 14 days,  3:42,  1 user,  load average: 0.12, 0.08, 0.05",
      "NTP Stratum 1 hardware clock sync accurate",
      "Clock drift: +0.000001s",
      "[OK] System epoch timestamp valid"
    ],
    failureLogs: [
      "Clock hardware desync detected",
      "Drift overflow: +9999.00s",
      "Kernel panic - time jump overflow",
      "Process terminated"
    ]
  },
  {
    id: "cache",
    name: "redis_l2_cache.conf",
    command: "root@blackbox-cache:~# netstat -tulpn | grep 6379",
    top: "42%",
    left: "76%",
    width: "270px",
    rot: -6,
    depth: 1.1,
    opacity: 0.9,
    normalLogs: [
      "tcp        0      0 0.0.0.0:6379            0.0.0.0:*               LISTEN      1120/redis-server",
      "Cache hit rate: 99.4% (Keyspace 1.4M)",
      "[RAM] [████████░░░░] 68% L2 Cache",
      "[OK] Memory purge cycle ready"
    ],
    failureLogs: [
      "netstat: netlink socket failed: Connection refused",
      "Memory corruption detected at 0x637900",
      "Service crashed",
      "Bus error"
    ]
  },
  {
    id: "crypto_engine",
    name: "crypto_aes256_hsm.c",
    command: "root@blackbox-hsm:~# openssl speed -evp aes-256-gcm",
    top: "58%",
    left: "54%",
    width: "300px",
    rot: -3,
    depth: 1.4,
    opacity: 0.92,
    normalLogs: [
      "Doing aes-256-gcm for 3s on 16 size blocks: 41290810 ops",
      "Doing aes-256-gcm for 3s on 64 size blocks: 29810420 ops",
      "type             16 bytes     64 bytes    256 bytes   1024 bytes",
      "aes-256-gcm     220810.1k    635955.6k   1420911.2k   2104922.8k"
    ],
    failureLogs: [
      "OpenSSL: EVP_DecryptFinal_ex: bad decrypt",
      "Fatal exception: HSM hardware failure",
      "Memory corruption detected",
      "Process terminated"
    ]
  },
  {
    id: "docker_pod",
    name: "k8s_container_pod.go",
    command: "root@blackbox-k8s:~# docker ps --format 'table {{.Names}}\\t{{.Status}}'",
    top: "36%",
    left: "70%",
    width: "270px",
    rot: 3,
    depth: 1.0,
    opacity: 0.85,
    normalLogs: [
      "NAMES               STATUS",
      "blackbox-api        Up 14 days (healthy)",
      "blackbox-vault      Up 14 days (healthy)",
      "[OK] All container pods running"
    ],
    failureLogs: [
      "NAMES               STATUS",
      "blackbox-api        Exited (137) 1 second ago",
      "blackbox-vault      Exited (1) 1 second ago",
      "Error response from daemon: Service crashed"
    ]
  },
  {
    id: "zfs_storage",
    name: "zfs_pool_storage.sh",
    command: "root@blackbox-zfs:~# iostat -xz 1 2",
    top: "80%",
    left: "14%",
    width: "280px",
    rot: -2,
    depth: 0.9,
    opacity: 0.85,
    normalLogs: [
      "avg-cpu:  %user   %nice %system %iowait  %steal   %idle",
      "           12.40    0.00    2.10    0.15    0.00   85.35",
      "Device r/s     w/s     rMB/s   wMB/s   await  %util",
      "sda    124.0   45.2    12.4    8.1     0.8    14.2"
    ],
    failureLogs: [
      "iostat: device /dev/sda failed: Bus error",
      "iostat: device I/O error on controller 0",
      "Filesystem read error",
      "Bus error (core dumped)"
    ]
  },
  {
    id: "dns_resolver",
    name: "dns_unbound_daemon.c",
    command: "root@blackbox-dns:~# dig +short blackbox.internal",
    top: "82%",
    left: "44%",
    width: "270px",
    rot: 2,
    depth: 1.1,
    opacity: 0.85,
    normalLogs: [
      "10.244.11.89",
      "10.244.11.90",
      ";; Query time: 1 msec",
      ";; SERVER: 127.0.0.53#53(127.0.0.53)"
    ],
    failureLogs: [
      ";; connection timed out; no servers could be reached",
      "dig: SERVFAIL resolving 'blackbox.internal'",
      "Connection refused",
      "Service crashed"
    ]
  }
];

type AnimationPhase = 
  | "operational" 
  | "cascade" 
  | "glitch_burst" 
  | "silence" 
  | "title_reveal" 
  | "cta_ready"
  | "executing";

interface LiveTerminalProps {
  sub: Subsystem;
  sIdx: number;
  isFailed: boolean;
  transX: number;
  transY: number;
  jitterX: number;
  jitterY: number;
}

// Subcomponent: Handles live character-by-character Linux typing and real-time failure interruptions
function LiveTerminalSession({ sub, sIdx, isFailed, transX, transY, jitterX, jitterY }: LiveTerminalProps) {
  const [typedCmd, setTypedCmd] = useState("");
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  // Live Typing & Streaming Loop
  useEffect(() => {
    let cmdIdx = 0;
    let logIdx = 0;
    let typingTimer: NodeJS.Timeout;
    let logTimer: NodeJS.Timeout;

    // Independent typing speed per terminal (22ms - 45ms)
    const charDelay = 22 + (sIdx % 5) * 6;

    function typeChar() {
      if (cmdIdx < sub.command.length) {
        setTypedCmd(sub.command.slice(0, cmdIdx + 1));
        cmdIdx++;
        typingTimer = setTimeout(typeChar, charDelay);
      } else {
        // Finished typing command -> stream normal logs line-by-line
        streamLogs();
      }
    }

    function streamLogs() {
      if (logIdx < sub.normalLogs.length) {
        setVisibleLogs((prev) => [...prev, sub.normalLogs[logIdx]]);
        logIdx++;
        logTimer = setTimeout(streamLogs, 320 + (sIdx % 3) * 140);
      }
    }

    // Staggered start delay per terminal window
    const startDelay = (sIdx % 6) * 110;
    const startTimer = setTimeout(typeChar, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(typingTimer);
      clearTimeout(logTimer);
    };
  }, [sub, sIdx]);

  // Real-Time Interruption on Cascade Failure
  useEffect(() => {
    if (!isFailed) return;

    // Interrupt typing immediately, freeze cursor, and stream error dumps
    const cursorTimer = setTimeout(() => {
      setShowCursor(true);
    }, 0);

    let failIdx = 0;
    const failInterval = setInterval(() => {
      if (failIdx < sub.failureLogs.length) {
        setVisibleLogs((prev) => [...prev, sub.failureLogs[failIdx]]);
        failIdx++;
      } else {
        clearInterval(failInterval);
      }
    }, 70);

    return () => {
      clearTimeout(cursorTimer);
      clearInterval(failInterval);
    };
  }, [isFailed, sub.failureLogs]);

  return (
    <motion.div
      key={sub.id}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: sub.opacity,
        scale: isFailed ? [1, 1.04, 0.96, 1] : 1,
        x: transX + jitterX,
        y: transY + jitterY,
      }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        top: sub.top,
        left: sub.left,
        width: sub.width,
        transform: `rotate(${sub.rot}deg)`,
      }}
      className={`rounded-lg border shadow-2xl overflow-hidden backdrop-blur-md transition-colors duration-300 ${
        isFailed
          ? "bg-[#070D19]/95 border-[#FF3B5C]/80 shadow-[0_0_35px_rgba(255,59,92,0.45)]"
          : "bg-[#070D19]/90 border-[#00FF88]/40 shadow-[0_0_22px_rgba(0,255,136,0.18)]"
      }`}
    >
      {/* OS Terminal Window Header Bar */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 border-b text-[10.5px] font-mono tracking-wider ${
          isFailed
            ? "bg-[#1A0A10] border-[#FF3B5C]/40 text-[#FF3B5C]"
            : "bg-[#0B1526] border-[#00FF88]/25 text-[#00FF88]/90"
        }`}
      >
        {/* Window Control Buttons */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isFailed ? "bg-[#FF3B5C] animate-ping" : "bg-[#FF5F56]"}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${isFailed ? "bg-[#FF3B5C]/60" : "bg-[#FFBD2E]"}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${isFailed ? "bg-[#FF3B5C]/60" : "bg-[#27C93F]"}`} />
        </div>

        {/* Window Title */}
        <div className="truncate font-semibold px-2 text-[10px] text-white/90">
          {sub.name}
        </div>

        {/* Subsystem Status Badge */}
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
            isFailed
              ? "bg-[#FF3B5C]/20 text-[#FF3B5C] border border-[#FF3B5C]/50"
              : "bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/40"
          }`}
        >
          {isFailed ? "CRITICAL" : "ONLINE"}
        </span>
      </div>

      {/* Terminal CLI Shell Body */}
      <div className="p-3 font-mono text-[10px] leading-relaxed space-y-1.5 min-h-[95px]">
        {/* Live Command Prompt */}
        <div className={`font-bold truncate text-[10px] pb-1 border-b flex items-center gap-1 ${
          isFailed ? "text-[#FF3B5C] border-[#FF3B5C]/30" : "text-[#00E5FF] border-[#00FF88]/15"
        }`}>
          <span className="truncate">{typedCmd}</span>
          {showCursor && (
            <span className={`w-1.5 h-3 inline-block shrink-0 ${isFailed ? "bg-[#FF3B5C]" : "bg-[#00FF88] animate-pulse"}`} />
          )}
        </div>

        {/* Live Output Log Stream */}
        <div className="space-y-1 pt-0.5">
          {visibleLogs.map((line, idx) => (
            <p key={idx} className={`truncate ${isFailed || line.includes("FATAL") || line.includes("CRITICAL") || line.includes("Segmentation") || line.includes("panic") || line.includes("failed") || line.includes("error") ? "text-[#FF3B5C] font-semibold" : "text-[#00FF88]"}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function CyberpunkLanding() {
  const [phase, setPhase] = useState<AnimationPhase>("operational");
  const [failedTerminals, setFailedTerminals] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [isBooting, setIsBooting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (typeof window === "undefined") return;
    const x = (e.clientX / window.innerWidth - 0.5) * 60;
    const y = (e.clientY / window.innerHeight - 0.5) * 60;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Particle background loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{ x: number; y: number; size: number; speedY: number; opacity: number }> = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.0 + 0.5,
        speedY: -(Math.random() * 0.5 + 0.1),
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = phase === "cascade" || phase === "glitch_burst" ? "#FF3B5C" : "#00FF88";

      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [phase]);

  // Intro Animation Timeline: Operational typing (~3.0s) -> Cascade Failure (~2.0s) -> Glitch Burst -> Silence -> Reveal
  useEffect(() => {
    // Phase 1: Operational Typing (~3.0s)
    const cascadeTimer = setTimeout(() => {
      setPhase("cascade");
      synth.playGlitch();

      // Rapidly trigger real-time failure across terminal sessions over 2.0s
      const ids = SUBSYSTEMS.map((s) => s.id);
      let idx = 0;
      const failInterval = setInterval(() => {
        if (idx < ids.length) {
          setFailedTerminals((prev) => new Set(prev).add(ids[idx]));
          if (Math.random() > 0.35) synth.playGlitch();
          idx++;
        } else {
          clearInterval(failInterval);
        }
      }, 90);
    }, 3000);

    // Phase 2: Glitch Burst at 5.2s
    const burstTimer = setTimeout(() => {
      setPhase("glitch_burst");
      synth.playGlitchBurst();
    }, 5200);

    // Phase 3: Instant Silence & Dark Screen at 5.6s
    const silenceTimer = setTimeout(() => {
      setPhase("silence");
    }, 5600);

    // Phase 4: Title reveal at 6.1s
    const titleTimer = setTimeout(() => {
      setPhase("title_reveal");
      synth.playClick();
    }, 6100);

    // Phase 5: Typing subtitle at 6.6s
    const targetSubtitle = "Initializing Recovery Protocol...";
    let subIdx = 0;
    const typeTimer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (subIdx < targetSubtitle.length) {
          setTypedText(targetSubtitle.slice(0, subIdx + 1));
          subIdx++;
          if (Math.random() > 0.5) synth.playClick();
        } else {
          clearInterval(typeInterval);
          // Reveal CTA
          setTimeout(() => {
            setPhase("cta_ready");
            synth.playClick();
          }, 300);
        }
      }, 35);
    }, 6600);

    return () => {
      clearTimeout(cascadeTimer);
      clearTimeout(burstTimer);
      clearTimeout(silenceTimer);
      clearTimeout(titleTimer);
      clearTimeout(typeTimer);
    };
  }, []);

  // Handler when user clicks CTA command button
  const handleStartRecovery = () => {
    synth.playScanSweep();
    setPhase("executing");
    setTimeout(() => {
      setIsBooting(true);
    }, 600);
  };

  return (
    <>
      <BootSequence isActive={isBooting} />

      <div
        ref={containerRef}
        className={`relative w-full min-h-screen overflow-hidden bg-[#05070B] text-white font-mono select-none ${
          phase === "glitch_burst" ? "animate-intense-shake" : ""
        }`}
      >
        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />

        {/* Drifting Cyber Grid Background */}
        <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20 z-0" />

        {/* CRT Scanline & Vignette Overlay */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none z-50 opacity-45" />
        <div className="absolute inset-0 crt-vignette pointer-events-none z-50 opacity-75" />

        {/* Chromatic Flash Overlay on Glitch Burst */}
        <AnimatePresence>
          {phase === "glitch_burst" && (
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: [0.9, 0.2, 0.8, 0] }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-40 bg-[#FF3B5C]/25 backdrop-invert"
            />
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* PHASE 1 & 2: LIVE TYPING LINUX TERMINALS & CASCADE FAILURE   */}
        {/* ============================================================ */}
        {(phase === "operational" || phase === "cascade" || phase === "glitch_burst") && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {SUBSYSTEMS.map((sub, sIdx) => {
              const isFailed = failedTerminals.has(sub.id);
              const transX = (mousePos.x * sub.depth) / 2;
              const transY = (mousePos.y * sub.depth) / 2;
              const jitterX = isFailed ? (sIdx % 2 === 0 ? 5 : -5) : 0;
              const jitterY = isFailed ? (sIdx % 3 === 0 ? 4 : -4) : 0;

              return (
                <LiveTerminalSession
                  key={sub.id}
                  sub={sub}
                  sIdx={sIdx}
                  isFailed={isFailed}
                  transX={transX}
                  transY={transY}
                  jitterX={jitterX}
                  jitterY={jitterY}
                />
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* PHASE 3 & 4: SILENCE, TITLE REVEAL & CTA STATE               */}
        {/* ============================================================ */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Centered Blinking Cursor in Silence Phase */}
          {phase === "silence" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl text-[#00FF88] font-bold animate-pulse"
            >
              &gt; _
            </motion.div>
          )}

          {/* Title Reveal & CTA Section */}
          {(phase === "title_reveal" || phase === "cta_ready" || phase === "executing") && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center max-w-3xl mx-auto space-y-8"
            >
              {/* Massive Geometric BLACKBOX Title */}
              <div className="relative group">
                <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-white animate-glitch-title">
                  BLACK<span className="text-[#00FF88]">BOX</span>
                </h1>
                <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-60" />
              </div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-3 font-mono text-secondary-text text-base sm:text-lg md:text-xl max-w-lg leading-relaxed"
              >
                <p className="text-white font-medium">&quot;The application worked.</p>
                <p className="text-secondary-text">The truth was hidden inside.&quot;</p>
              </motion.div>

              {/* Typed Terminal Protocol Status */}
              <div className="font-mono text-sm sm:text-base text-[#00FF88] h-6 flex items-center gap-1">
                <span>&gt; {typedText}</span>
                <span className="w-2 h-4 bg-[#00FF88] inline-block animate-pulse" />
              </div>

              {/* Terminal Command Button (CTA) */}
              {(phase === "cta_ready" || phase === "executing") && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="pt-6"
                >
                  <button
                    onClick={handleStartRecovery}
                    disabled={phase === "executing"}
                    className={`relative group font-mono text-sm sm:text-base md:text-lg font-bold tracking-widest px-10 py-5 rounded border transition-all duration-300 uppercase cursor-pointer backdrop-blur-lg ${
                      phase === "executing"
                        ? "bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88] shadow-[0_0_35px_rgba(0,255,136,0.6)]"
                        : "bg-[#0A1020]/90 border-[#00FF88]/50 text-[#00FF88] hover:border-[#00FF88] hover:bg-[#00FF88]/10 hover:text-white hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span>&gt;</span>
                      <span>
                        {phase === "executing" ? "EXECUTING RECOVERY PROTOCOL..." : "START RECOVERY"}
                      </span>
                      <span className="w-2.5 h-5 bg-[#00FF88] inline-block animate-pulse group-hover:bg-white" />
                    </span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
