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
  playSuccessFanfare() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Arpeggio C4 to C6
      
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
          
          osc.start();
          osc.stop(this.ctx.currentTime + 0.4);
        }, idx * 100);
      });
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

// Animate numbers counting up
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorTrack();
  
  // Play Success Sound
  setTimeout(() => {
    synth.playSuccessFanfare();
  }, 300);
  
  const objVal = document.getElementById('stat-objects');
  const commitVal = document.getElementById('stat-commits');
  const branchVal = document.getElementById('stat-branches');
  const releaseVal = document.getElementById('stat-releases');
  const countdownText = document.getElementById('redirect-countdown');
  const continueBtn = document.getElementById('continue-btn');
  
  // Statistics Targets
  const stats = [
    { element: objVal, target: 142 },
    { element: commitVal, target: 318 },
    { element: branchVal, target: 5 },
    { element: releaseVal, target: 14 }
  ];
  
  // Start numbers animation
  setTimeout(() => {
    stats.forEach(item => {
      if (item.element) {
        animateValue(item.element, 0, item.target, 1500);
      }
    });
  }, 500);
  
  // Manage automatic countdown redirect
  const redirectUrl = 'verify.html';
  let countdownSecs = 5;
  
  const timer = setInterval(() => {
    countdownSecs--;
    if (countdownText) {
      countdownText.innerText = countdownSecs;
    }
    
    if (countdownSecs <= 0) {
      clearInterval(timer);
      triggerRedirect();
    }
  }, 1000);
  
  function triggerRedirect() {
    const container = document.querySelector('.os-container');
    if (container) {
      container.style.animation = 'fadeOut 0.5s ease forwards';
    }
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 500);
  }
  
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      synth.playClick();
      clearInterval(timer);
      triggerRedirect();
    });
  }
});
