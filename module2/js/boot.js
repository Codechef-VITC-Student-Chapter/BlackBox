// Audio Synthesizer for Retro-SciFi sound effects
const synth = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playClick() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.log('Audio error:', e);
    }
  },
  playSuccess() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      // Tone 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.start();
      osc1.stop(now + 0.15);
      
      // Tone 2
      setTimeout(() => {
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, this.ctx.currentTime); // E6
        gain2.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc2.start();
        osc2.stop(this.ctx.currentTime + 0.3);
      }, 100);
    } catch (e) {
      console.log('Audio error:', e);
    }
  },
  playError() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }
};

// Particles Background Setup
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const particleCount = 45;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist/110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// Cursor and Parallax Trackers
function initCursorTrack() {
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.ambient-glow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
    
    // Parallax logic
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width/2);
      const y = e.clientY - rect.top - (rect.height/2);
      
      // Calculate rotation based on cursor distance
      const xRot = (y / rect.height) * 3; // Max 3deg
      const yRot = -(x / rect.width) * 3; 
      
      card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
  });
  
  document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// Boot diagnostics printout logic
const BOOT_LOGS = [
  { text: "BLACKBOX OS [BOOT VER. 1.0.4]", type: "system" },
  { text: "SECURE ENCLAVE LOADED SUCCESSFULLY.", type: "normal" },
  { text: "INITIALIZING AUTHENTICATION MEMORY SYSTEM... OK", type: "normal" },
  { text: "CONNECTING TO PRIMARY REPOSITORY STORAGE...", type: "normal" },
  { text: "ERROR: SQL STATE [42000] - FILE ACCESS DENIED", type: "error" },
  { text: "CRITICAL SYSTEM FAILURE DETECTED.", type: "error" },
  { text: "INTEGRITY STATUS: [DEGRADED]", type: "error" },
  { text: "SCANNING EMERGENCY RECOVERY MIRRORS...", type: "system" },
  { text: "BACKUP SERVER 1 (HONG KONG) ..... [OFFLINE]", type: "error" },
  { text: "BACKUP SERVER 2 (FRANKFURT) ..... [OFFLINE]", type: "error" },
  { text: "BACKUP SERVER 3 (AMSTERDAM) ..... [ONLINE - COMPROMISED]", type: "system" },
  { text: "EMERGENCY BACKUP FOUND: Sector 7 Fragment Survives.", type: "success" },
  { text: "DIAGNOSTIC ADVISORY: Begin recovery investigation.", type: "system" }
];

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorTrack();
  
  const termBody = document.getElementById('terminal-body');
  const progBar = document.getElementById('progress-bar');
  const progPct = document.getElementById('progress-percent');
  const beginBtn = document.getElementById('begin-btn');
  const integrityStatus = document.getElementById('integrity-status');
  
  if (!termBody) return;
  
  let currentLogIdx = 0;
  
  // Progress Bar filler
  let progress = 0;
  const totalDuration = 6500; // ms
  const progressInterval = 50; // update every 50ms
  const stepIncrement = (progressInterval / totalDuration) * 100;
  
  const progTimer = setInterval(() => {
    progress += stepIncrement;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progTimer);
    }
    progBar.style.width = `${progress}%`;
    progPct.innerText = `${Math.floor(progress)}%`;
  }, progressInterval);
  
  // Line by line printing
  function printNextLine() {
    if (currentLogIdx >= BOOT_LOGS.length) {
      // Completed boot printing
      setTimeout(() => {
        synth.playError();
        integrityStatus.innerText = "OFFLINE";
        integrityStatus.classList.remove('glow-cyan');
        integrityStatus.classList.add('glow-danger');
        
        // Show begin investigation button
        beginBtn.disabled = false;
        beginBtn.style.opacity = '1';
        beginBtn.style.animation = 'pulseGlow 2.5s infinite';
      }, 500);
      return;
    }
    
    const log = BOOT_LOGS[currentLogIdx];
    const lineDiv = document.createElement('p');
    lineDiv.className = `terminal-line ${log.type}`;
    
    // Create cursor inside
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    
    lineDiv.appendChild(document.createTextNode("> "));
    const textNode = document.createTextNode("");
    lineDiv.appendChild(textNode);
    lineDiv.appendChild(cursor);
    termBody.appendChild(lineDiv);
    
    // Scroll terminal
    termBody.scrollTop = termBody.scrollHeight;
    
    let charIdx = 0;
    const typingInterval = setInterval(() => {
      if (charIdx < log.text.length) {
        textNode.appendData(log.text[charIdx]);
        charIdx++;
        if (Math.random() > 0.4) {
          synth.playClick();
        }
      } else {
        clearInterval(typingInterval);
        cursor.remove();
        currentLogIdx++;
        
        // Delay before printing next line
        const delay = log.type === 'error' ? 800 : 300;
        setTimeout(printNextLine, delay);
      }
    }, 15);
  }
  
  // Click listener for body to start audio if blocked
  document.body.addEventListener('click', () => {
    synth.init();
  }, { once: true });
  
  // Start printing after a short delay
  setTimeout(printNextLine, 800);
  
  // Begin button trigger
  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      synth.playSuccess();
      const container = document.querySelector('.os-container');
      container.style.animation = 'fadeOut 0.5s ease forwards';
      setTimeout(() => {
        window.location.href = 'scan.html';
      }, 500);
    });
  }
});
