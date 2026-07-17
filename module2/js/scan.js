// Audio Synth Helper
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
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  },
  playScanSweep() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  },
  playPopup() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {}
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
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorTrack();
  
  const scanBtn = document.getElementById('scan-btn');
  const continueBtn = document.getElementById('continue-btn');
  const qrScannerLine = document.querySelector('.qr-scanner-line');
  const qrImage = document.querySelector('.qr-image');
  const termBody = document.getElementById('scan-terminal-body');
  const modal = document.getElementById('info-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  if (!scanBtn) return;
  
  const scanLogs = [
    "INITIALIZING EMERGENCY BACKUP SCAN...",
    "CALIBRATING OPTICAL FORENSIC SENSORS... OK",
    "READING DATA CHUNKS (ECC LEVEL: H)...",
    "SECTOR 0x38F: [PARTIALLY CORRUPTED]",
    "REBUILDING DEGRADED QR SUB-SECTORS...",
    "EXTRACTING TARGET EMBEDDED METADATA...",
    "DECRYPTION COMPLETED SUCCESSFULLY."
  ];
  
  function addTerminalLine(text, isHeader = false) {
    const p = document.createElement('p');
    p.className = 'terminal-line';
    if (isHeader) {
      p.classList.add('system');
    }
    p.innerText = `> ${text}`;
    termBody.appendChild(p);
    termBody.scrollTop = termBody.scrollHeight;
  }
  
  scanBtn.addEventListener('click', () => {
    synth.init();
    scanBtn.disabled = true;
    
    // Animate scan line faster
    qrScannerLine.style.animation = 'scanSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite';
    qrImage.style.animation = 'qrFlicker 0.2s infinite';
    
    let logIdx = 0;
    
    function printScanLogs() {
      if (logIdx < scanLogs.length) {
        addTerminalLine(scanLogs[logIdx], logIdx === 0 || logIdx === scanLogs.length - 1);
        synth.playClick();
        
        // Scan sounds
        if (logIdx % 2 === 0) {
          synth.playScanSweep();
        }
        
        logIdx++;
        setTimeout(printScanLogs, 600);
      } else {
        // Scanning completed
        setTimeout(() => {
          synth.playPopup();
          modal.classList.add('active');
        }, 500);
      }
    }
    
    printScanLogs();
  });
  
  closeModalBtn.addEventListener('click', () => {
    synth.playClick();
    modal.classList.remove('active');
    
    // Stop QR flicker, slow down scan line
    qrScannerLine.style.animation = 'scanSweep 4s linear infinite';
    qrImage.style.animation = 'none';
    
    // Render the continue button
    continueBtn.style.display = 'inline-flex';
    setTimeout(() => {
      continueBtn.style.opacity = '1';
      continueBtn.style.animation = 'pulseGlow 2.5s infinite';
    }, 100);
  });
  
  continueBtn.addEventListener('click', () => {
    synth.playClick();
    const container = document.querySelector('.os-container');
    container.style.animation = 'fadeOut 0.5s ease forwards';
    setTimeout(() => {
      window.location.href = 'evidence.html';
    }, 500);
  });
});
