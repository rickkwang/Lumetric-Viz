#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Lumetric-Viz development server and Electron app...');

// Start the Vite development server in the background
const devServer = spawn('npx', ['vite'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Wait a moment for the server to start, then launch Electron
setTimeout(() => {
  const electron = spawn('npx', ['electron', '.'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  electron.on('error', (err) => {
    console.error('Failed to start Electron:', err.message);
    console.log('Make sure you have Electron installed: npm install -D electron');
  });

  electron.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    devServer.kill();
  });
}, 3000);

devServer.on('error', (err) => {
  console.error('Failed to start development server:', err.message);
});

devServer.on('close', (code) => {
  console.log(`Dev server process exited with code ${code}`);
});