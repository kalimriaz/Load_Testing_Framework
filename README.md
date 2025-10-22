# K6 Electron GUI (Minimal)

This repository contains a minimal Electron-based GUI that can run a TypeScript k6 script (simple GET request) with a configurable number of VUs. It's intended as a basic example/framework to get started.

Prerequisites
- Node.js (18+ recommended)
- npm or yarn
- k6 installed and on PATH (https://k6.io/docs/getting-started/installation)

Quick start
1. Install dependencies:

   npm install

2. (Optional) Build the TypeScript k6 script to dist (the repo already includes a JS `dist/test.js` you can run directly):

   npm run build

3. Run the Electron GUI:

   npm start

Notes on k6
- This GUI spawns the `k6` executable. Make sure k6 is installed and available on your PATH. On macOS you can install via Homebrew:

  brew install k6

Usage
- Enter a target URL and number of VUs (default 10). Click Start Test. The GUI will stream k6 output into the textarea. The example test performs simple GET requests and checks for HTTP 200.

Limitations
- This is a minimal example focusing on a simple GET test. It doesn't include advanced test scenarios, result persistence, or charts. To extend: add CSV export, WebSocket handling, xk6-browser for browser-driven scenarios, or more k6 options.

Usage
- Enter a target URL and VUs in the GUI (defaults to 10 VUs). Click "Start Test" to run k6. The GUI will spawn k6 and stream stdout/stderr.

Notes
- This is intentionally minimal. It expects `k6` to be available on the system PATH. The k6 script is a TypeScript file compiled/bundled into `dist/test.bundle.js` for clarity.
