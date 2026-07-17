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
  playProgress() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {}
  },
  playSuccess() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.03, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc1.start();
      osc1.stop(now + 0.1);
      
      setTimeout(() => {
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
        gain2.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc2.start();
        osc2.stop(this.ctx.currentTime + 0.15);
      }, 80);

      setTimeout(() => {
        const osc3 = this.ctx.createOscillator();
        const gain3 = this.ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(this.ctx.destination);
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1174.66, this.ctx.currentTime); // D6
        gain3.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc3.start();
        osc3.stop(this.ctx.currentTime + 0.4);
      }, 160);
    } catch (e) {}
  },
  playError() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
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

// Cursor Ambient Glow Tracker
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
  
  const recoverForm = document.getElementById('recover-form');
  const ownerInput = document.getElementById('owner-input');
  const repoInput = document.getElementById('repo-input');
  const submitBtn = document.getElementById('submit-btn');
  const termBody = document.getElementById('recover-terminal-body');
  
  const alertDanger = document.getElementById('alert-danger');
  const alertSuccess = document.getElementById('alert-success');
  const reconstructionPanel = document.getElementById('reconstruction-panel');
  const syncProgressBar = document.getElementById('sync-progress-bar');
  const syncProgressPct = document.getElementById('sync-progress-pct');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  if (!recoverForm) return;
  
  function addTerminalLine(text, type = 'normal') {
    const p = document.createElement('p');
    p.className = `terminal-line ${type}`;
    p.innerText = `> ${text}`;
    termBody.appendChild(p);
    termBody.scrollTop = termBody.scrollHeight;
  }
  
  recoverForm.addEventListener('submit', (e) => {
    e.preventDefault();
    synth.init();
    synth.playClick();
    
    // Hide previous alerts
    alertDanger.style.display = 'none';
    alertSuccess.style.display = 'none';
    
    const owner = ownerInput.value;
    const repository = repoInput.value;
    
    // Disable inputs
    ownerInput.disabled = true;
    repoInput.disabled = true;
    submitBtn.disabled = true;
    
    addTerminalLine(`INITIATING BACKUP SEARCH: github.com/${owner}/${repository}...`, 'system');
    
    // Call Validation API
    fetch('/api/recover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ owner, repository })
    })
    .then(async (response) => {
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Repository Not Found');
      }
      
      // Success case
      addTerminalLine(`SUCCESS: MIRROR HOST IDENTIFIED. CONNECTING...`, 'success');
      alertSuccess.innerText = 'Repository Located. Connecting...';
      alertSuccess.style.display = 'block';
      
      // Update header status
      if (statusIndicator) {
        statusIndicator.className = 'status-indicator syncing';
        statusText.innerText = 'SYNCING';
      }
      
      // Reveal reconstruction panel
      reconstructionPanel.style.display = 'block';
      
      // Run reconstruction progress
      let pct = 0;
      const totalSyncTime = 4000; // 4 seconds
      const syncIntervalTime = 40; // update progress
      const steps = totalSyncTime / syncIntervalTime;
      const stepVal = 100 / steps;
      
      const logsToPrint = [
        { pct: 15, text: "Syncing Git object metadata... OK" },
        { pct: 30, text: "Retrieving tree objects: 142 objects" },
        { pct: 50, text: "Reconstructing commit history (318 commits)..." },
        { pct: 70, text: "Extracting active branches (5 active branches)..." },
        { pct: 85, text: "Pulling release package indexes (14 releases)..." },
        { pct: 95, text: "Repository integrity checked: OK" },
        { pct: 100, text: "SYNCHRONIZATION COMPLETED. EXPORTING ACCESS KEY..." }
      ];
      
      let nextLogIdx = 0;
      synth.playProgress();
      
      const syncInterval = setInterval(() => {
        pct += stepVal;
        if (pct >= 100) {
          pct = 100;
          clearInterval(syncInterval);
          syncProgressBar.style.width = '100%';
          syncProgressPct.innerText = '100%';
          
          addTerminalLine(logsToPrint[logsToPrint.length - 1].text, 'success');
          synth.playSuccess();
          
          // Redirect to success page
          setTimeout(() => {
            const container = document.querySelector('.os-container');
            container.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
              window.location.href = 'success.html';
            }, 500);
          }, 1000);
        } else {
          syncProgressBar.style.width = `${pct}%`;
          syncProgressPct.innerText = `${Math.floor(pct)}%`;
          
          if (Math.random() > 0.85) {
            synth.playClick();
          }
          
          // Print logs at appropriate milestones
          if (nextLogIdx < logsToPrint.length - 1 && pct >= logsToPrint[nextLogIdx].pct) {
            addTerminalLine(logsToPrint[nextLogIdx].text, 'system');
            nextLogIdx++;
          }
        }
      }, syncIntervalTime);
      
    })
    .catch((err) => {
      // Error case
      addTerminalLine(`ERROR: ${err.message}`, 'error');
      synth.playError();
      
      alertDanger.innerText = `${err.message}`;
      alertDanger.style.display = 'block';
      
      // Re-enable inputs
      ownerInput.disabled = false;
      repoInput.disabled = false;
      submitBtn.disabled = false;
    });
  });
});
