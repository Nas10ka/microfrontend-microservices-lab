import { spawn } from 'node:child_process';

const commands = [
  ['apps/virtualization', 'build:watch'],
  ['apps/virtualization', 'preview'],
  ['apps/booking-hub', 'build:watch'],
  ['apps/booking-hub', 'preview'],
  ['services/booking-service', 'start:dev'],
  ['apps/shell', 'dev'],
];

const children = new Set();
let stopping = false;

function shutdown(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;

  for (const child of children) {
    if (!child.pid) continue;
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/t', '/f']);
    } else {
      try {
        // Each npm process owns a group containing its watchers and servers.
        process.kill(-child.pid, 'SIGTERM');
      } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
    }
  }
}

for (const [directory, script] of commands) {
  const child = spawn('npm', ['--prefix', directory, 'run', script], {
    stdio: 'inherit',
    detached: process.platform !== 'win32',
    shell: process.platform === 'win32',
  });
  children.add(child);
  child.on('error', (error) => {
    console.error(error);
    shutdown(1);
  });
  child.on('exit', (code) => {
    children.delete(child);
    shutdown(code ?? 1);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
