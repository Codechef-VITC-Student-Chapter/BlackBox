const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware for parsing JSON requests
app.use(express.json());

// Serve assets, css, and js directories statically
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve HTML pages with clean routes and fallback to .html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/scan', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'scan.html'));
});

app.get('/evidence', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'evidence.html'));
});

app.get('/recover', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'recover.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'success.html'));
});

app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'verify.html'));
});

app.get('/module3', (req, res) => {
  res.send('<html><head><title>BLACKBOX OS - Module 3</title><link rel="stylesheet" href="/css/main.css"><link rel="stylesheet" href="/css/components.css"></head><body><div class="os-container"><main class="main-content"><div class="glass-panel" style="text-align: center; max-width: 600px; padding: 3rem;"><h1 class="text-cyan" style="font-size: 2.2rem; font-weight: bold; margin-bottom: 1rem;">MODULE 3</h1><p class="text-muted" style="margin-bottom: 2rem;">MODULE 3: UNDER CONSTRUCTON // SECURE CONNECTION STABLE</p><div style="font-family: monospace; padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 4px; border: 1px solid var(--border-color); color: #27c93f; text-shadow: 0 0 5px rgba(39,201,63,0.4); margin-bottom: 2rem;">SUCCESS: All Module 2 segments verified. Key signature: BBX-RECOVERY-9X41A authorized.</div><button class="btn-cyber" onclick="window.location.href=\'/\'">RETURN TO BOOT</button></div></main></div></body></html>');
});

// Also support direct .html access for robustness
app.use(express.static(path.join(__dirname, 'pages')));

// Backend API routes
const apiRouter = require('./api/recover');
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` BLACKBOX OS - MODULE 2: REPOSITORY RECOVERY`);
  console.log(` Running on port: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
