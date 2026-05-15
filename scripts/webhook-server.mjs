#!/usr/bin/env node
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 9001;
const PROJECT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOG_FILE = '/var/log/portfolio-build.log';

let building = false;
let pending = false;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try { appendFileSync(LOG_FILE, line); } catch {}
}

function runBuild() {
  if (building) {
    pending = true;
    log('Build in progress — queued another');
    return;
  }
  building = true;
  log('Build started');

  const proc = spawn('npm', ['run', 'build'], {
    cwd: PROJECT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', d => log(d.toString().trimEnd()));
  proc.stderr.on('data', d => log(d.toString().trimEnd()));

  proc.on('close', code => {
    building = false;
    log(code === 0 ? 'Build succeeded' : `Build failed (exit ${code})`);
    if (pending) {
      pending = false;
      log('Running queued build...');
      runBuild();
    }
  });
}

const server = createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200).end('ok');
  log('Webhook received');
  runBuild();
});

server.listen(PORT, () => log(`Webhook server listening on :${PORT}`));