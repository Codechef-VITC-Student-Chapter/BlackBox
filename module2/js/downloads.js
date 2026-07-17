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
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {}
  },
  playSuccess() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1300, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
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
    
    // Slight 3D rotation on evidence cards
    const cards = document.querySelectorAll('.evidence-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width/2);
      const y = e.clientY - rect.top - (rect.height/2);
      
      const xRot = (y / rect.height) * 4; // Max 4deg
      const yRot = -(x / rect.width) * 4; 
      
      card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateY(-4px)`;
    });
  });
  
  document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.evidence-card');
    cards.forEach(card => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorTrack();
  
  const proceedBtn = document.getElementById('proceed-btn');
  const downloadedFiles = {
    backup: false,
    server: false,
    voice: false,
    recovery: false
  };
  
  const dlButtons = document.querySelectorAll('.dl-btn');
  
  dlButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      synth.init();
      const fileKey = btn.getAttribute('data-file');
      const url = btn.getAttribute('data-url');
      const filename = btn.getAttribute('data-filename');
      
      // Select wrapper elements
      const card = btn.closest('.evidence-card');
      const progressContainer = card.querySelector('.progress-container');
      const progressBar = card.querySelector('.progress-bar');
      const transferStatus = card.querySelector('.holo-transfer');
      const pctText = card.querySelector('.transfer-pct');
      
      // Hide button and show progress elements
      btn.style.display = 'none';
      progressContainer.style.display = 'block';
      transferStatus.style.display = 'flex';
      
      let pct = 0;
      synth.playProgress();
      
      const interval = setInterval(() => {
        pct += Math.floor(Math.random() * 15) + 5;
        if (pct >= 100) {
          pct = 100;
          clearInterval(interval);
          
          // Complete transfer
          progressBar.style.width = '100%';
          pctText.innerText = '100%';
          transferStatus.querySelector('span:first-child').innerText = 'DOWNLOAD COMPLETED';
          transferStatus.querySelector('span:first-child').style.color = '#27c93f';
          synth.playSuccess();
          
          // Trigger actual browser download
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Mark file as downloaded
          downloadedFiles[fileKey] = true;
          checkAllDownloads();
        } else {
          progressBar.style.width = `${pct}%`;
          pctText.innerText = `${pct}%`;
          if (pct % 3 === 0) {
            synth.playClick();
          }
        }
      }, 100);
    });
  });
  
  function checkAllDownloads() {
    const allDownloaded = Object.values(downloadedFiles).every(status => status === true);
    if (allDownloaded) {
      proceedBtn.disabled = false;
      proceedBtn.style.opacity = '1';
      proceedBtn.style.animation = 'pulseGlow 2.5s infinite';
    }
  }
  
  proceedBtn.addEventListener('click', () => {
    synth.playSuccess();
    const container = document.querySelector('.os-container');
    container.style.animation = 'fadeOut 0.5s ease forwards';
    setTimeout(() => {
      window.location.href = 'recover.html';
    }, 500);
  });
});
