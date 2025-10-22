import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  runK6: (opts: { target: string; vus: number }) => ipcRenderer.invoke('run-k6', opts),
  onStdout: (cb: (data: string) => void) => ipcRenderer.on('k6-stdout', (_e, d) => cb(d)),
  onStderr: (cb: (data: string) => void) => ipcRenderer.on('k6-stderr', (_e, d) => cb(d)),
  onExit: (cb: (code: number) => void) => ipcRenderer.on('k6-exit', (_e, code) => cb(code))
});
