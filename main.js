const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'dist', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'static', 'index.html'));
}

app.whenReady().then(createWindow);

let currentProc = null;

ipcMain.handle('run-k6', async (event, args) => {
  const { target, vus, duration } = args;
  if (!target) return { error: 'No target provided' };

  const env = Object.assign({}, process.env, { TARGET: target, VUS: String(vus || 10) });

  const k6Args = ['run'];
  if (duration) k6Args.push('--duration', String(duration));
  k6Args.push('dist/test.js');

  const proc = spawn('k6', k6Args, { env });
  currentProc = proc;

  proc.stdout.on('data', (data) => {
    if (win && win.webContents) win.webContents.send('k6-stdout', data.toString());
  });

  proc.stderr.on('data', (data) => {
    if (win && win.webContents) win.webContents.send('k6-stderr', data.toString());
  });

  proc.on('close', (code) => {
    if (win && win.webContents) win.webContents.send('k6-exit', code);
    currentProc = null;
  });

  return { pid: proc.pid };
});

ipcMain.handle('stop-k6', async () => {
  if (currentProc) {
    try {
      currentProc.kill('SIGINT');
      return { stopped: true };
    } catch (e) {
      return { stopped: false, error: String(e) };
    }
  }
  return { stopped: false, error: 'no-process' };
});

app.on('window-all-closed', () => {
  app.quit();
});
