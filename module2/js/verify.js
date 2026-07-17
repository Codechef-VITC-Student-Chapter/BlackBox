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
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1100, this.ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {}
  },
  playSuccess() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 E5 G5 C6 E6
      
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
          
          osc.start();
          osc.stop(this.ctx.currentTime + 0.4);
        }, idx * 80);
      });
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
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
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
  
  const termBody = document.getElementById('verify-terminal-body');
  const verifyBar = document.getElementById('verify-progress-bar');
  const verifyPct = document.getElementById('verify-progress-pct');
  const verifyStatus = document.getElementById('verify-progress-status');
  
  const verifyForm = document.getElementById('verify-form');
  const keyInput = document.getElementById('key-input');
  const verifyBtn = document.getElementById('verify-btn');
  const repoBtn = document.getElementById('repo-btn');
  
  const mainPanel = document.getElementById('main-panel');
  const alertDanger = document.getElementById('alert-danger');
  const checkmarkWrapper = document.getElementById('checkmark-wrapper');
  const module3Panel = document.getElementById('module3-panel');
  
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  if (!termBody) return;
  
  function addTerminalLine(text, type = 'normal') {
    const p = document.createElement('p');
    p.className = `terminal-line ${type}`;
    p.innerText = `> ${text}`;
    termBody.appendChild(p);
    termBody.scrollTop = termBody.scrollHeight;
  }

  // 1. Run Initial Malfunctioning Boot logs
  const initLogs = [
    { text: "Repository Connection Established.", type: "normal" },
    { text: "Verifying Repository Integrity...", type: "system" },
    { text: "WARNING: Integrity Verification Failed", type: "error" },
    { text: "STATUS: Recovery Key Signature Missing", type: "error" },
    { text: "DIAGNOSTIC: Manual verification required.", type: "system" }
  ];

  let logIdx = 0;
  
  // Fill progress bar from 0% to 25% on load
  let barPct = 0;
  const initBarInterval = setInterval(() => {
    barPct += 1;
    if (barPct >= 25) {
      barPct = 25;
      clearInterval(initBarInterval);
    }
    verifyBar.style.width = `${barPct}%`;
    verifyPct.innerText = `${barPct}%`;
  }, 30);

  function printInitLogs() {
    if (logIdx < initLogs.length) {
      addTerminalLine(initLogs[logIdx].text, initLogs[logIdx].type);
      synth.playClick();
      
      if (initLogs[logIdx].type === 'error') {
        synth.playError();
      }
      
      logIdx++;
      setTimeout(printInitLogs, 600);
    } else {
      verifyStatus.innerText = "Signature missing. Awaiting key...";
    }
  }

  setTimeout(printInitLogs, 500);

  // 2. Open Repo in new Tab
  repoBtn.addEventListener('click', () => {
    synth.playClick();
    window.open('https://github.com/codechefvit/blackbox', '_blank');
  });

  // 3. Form Submission
  verifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    synth.init();
    synth.playClick();
    
    // Reset alert
    alertDanger.style.display = 'none';
    alertDanger.classList.remove('red-glitch');
    mainPanel.classList.remove('shake-error');
    
    const recoveryKey = keyInput.value;
    
    // Disable inputs
    keyInput.disabled = true;
    verifyBtn.disabled = true;
    repoBtn.disabled = true;
    
    addTerminalLine("AUDITING KEY CODE: " + recoveryKey + "...", "system");
    addTerminalLine("Contacting repository authorization server...", "normal");
    
    fetch('/api/verifyRecoveryKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recoveryKey })
    })
    .then(async (response) => {
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid Recovery Key');
      }
      
      // Success Case!
      addTerminalLine("SIGNATURE ACCEPTED: Integrity Authorized.", "success");
      addTerminalLine("Decrypting remaining files structure...", "normal");
      
      // Sync progress bar 25% -> 100%
      let currentPct = 25;
      verifyStatus.innerText = "Synchronizing files...";
      synth.playProgress();
      
      const successInterval = setInterval(() => {
        currentPct += 3;
        if (currentPct >= 100) {
          currentPct = 100;
          clearInterval(successInterval);
          
          verifyBar.style.width = '100%';
          verifyPct.innerText = '100%';
          verifyStatus.innerText = "Synchronization Complete.";
          
          addTerminalLine("REPOSITORY INTEGRITY: 100% SECURE.", "success");
          addTerminalLine("ACCESS LEVEL: LEVEL 3 AUTHORIZED.", "success");
          addTerminalLine("MODULE 2 STATUS: COMPLETED.", "system");
          
          synth.playSuccess();
          
          // Update Header status
          if (statusIndicator) {
            statusIndicator.className = 'status-indicator';
            statusText.innerText = 'RESTORED 100%';
            statusText.style.color = '#27c93f';
            statusText.style.textShadow = '0 0 6px rgba(39,201,63,0.4)';
          }

          // Hide form
          verifyForm.style.display = 'none';
          
          // Show checkmark and proceed button
          checkmarkWrapper.style.display = 'flex';
          module3Panel.style.display = 'block';
        } else {
          verifyBar.style.width = `${currentPct}%`;
          verifyPct.innerText = `${currentPct}%`;
          
          if (currentPct % 4 === 0) {
            synth.playClick();
          }
        }
      }, 60);

    })
    .catch((err) => {
      // Failure Case
      setTimeout(() => {
        addTerminalLine("VERIFICATION FAILURE: " + err.message.toUpperCase(), "error");
        synth.playError();
        
        // Render shake
        mainPanel.classList.add('shake-error');
        
        // Show red alert
        alertDanger.innerHTML = `Verification Failed.<br><span class="red-glitch">Recovery Key Invalid.</span> Search the repository again.`;
        alertDanger.style.display = 'block';
        
        // Re-enable inputs
        keyInput.disabled = false;
        verifyBtn.disabled = false;
        repoBtn.disabled = false;
        
        // Focus back
        keyInput.focus();
      }, 800);
    });
  });

  // Proceed to Module 3 redirection
  document.getElementById('proceed-btn').addEventListener('click', () => {
    synth.playClick();
    const container = document.querySelector('.os-container');
    container.style.animation = 'fadeOut 0.5s ease forwards';
    setTimeout(() => {
      window.location.href = '/module3';
    }, 500);
  });
});
