import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, '..', 'static', 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('run-k6', async (event, args) => {
  const { target, vus } = args;
  if (!target) return { error: 'No target provided' };

  // Build k6 command arguments
  const k6Args = ['run', '--vus', String(vus || 10), '--duration', '10s', '--quiet', '-\', 'dist/test.bundle.js'];

  // Instead of passing bundle path as last arg with -, we'll pass script via --out as environment handled below
  const env = { ...process.env, TARGET: target, VUS: String(vus || 10) };

  // Spawn k6 process
  const proc = spawn('k6', ['run', 'dist/test.bundle.js'], { env });

  proc.stdout.on('data', (data) => {
    win?.webContents.send('k6-stdout', data.toString());
  });

  proc.stderr.on('data', (data) => {
    win?.webContents.send('k6-stderr', data.toString());
  });

  proc.on('close', (code) => {
    win?.webContents.send('k6-exit', code);
  });

  return { pid: proc.pid };
});

app.on('window-all-closed', () => {
  app.quit();
});
