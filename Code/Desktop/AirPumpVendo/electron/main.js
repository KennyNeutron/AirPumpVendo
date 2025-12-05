// File: electron/main.js
// Purpose: Electron main; maximized window, robust SerialPort IPC (platform-aware), CRLF writes, and no-op reopen if same port.

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport");

const isDev = process.env.NODE_ENV !== "production";
const DEV_URL = process.env.DEV_SERVER_URL || "http://localhost:3000";

// Make Chromium show OSK on touch devices
app.commandLine.appendSwitch("enable-virtual-keyboard");

let win;

// ---- Serial state & helpers ----
let serial = null;
let serialPath = null;
let serialBaud = null;

// Common USB-serial vendor IDs: Arduino, CH340, CP210x, FTDI
const ARDUINO_VIDS = new Set(["2341", "2a03", "1a86", "10c4", "0403"]);

async function listSerialPorts() {
  try {
    return await SerialPort.list();
  } catch (e) {
    console.warn("[serial] list failed:", e.message);
    return [];
  }
}

function guessPort(ports) {
  // Prefer known Arduino-like VIDs, else first port
  const byVid = ports.find((p) => ARDUINO_VIDS.has((p.vendorId || "").toLowerCase()));
  return (byVid || ports[0] || null)?.path || null;
}

async function openSerial(portPath, baud = 115200) {
  if (!portPath) throw new Error("No port path specified");

  // If already open with the same port/baud, keep it
  if (serial && serial.isOpen && serialPath === portPath && serialBaud === baud) {
    return { path: serialPath, baud: serialBaud };
  }

  // Close previous if different
  if (serial && serial.isOpen) {
    await new Promise((res) => serial.close(() => res()));
    serial = null;
  }

  return new Promise((resolve, reject) => {
    serial = new SerialPort({ path: portPath, baudRate: baud }, (err) => {
      if (err) return reject(err);
      serialPath = portPath;
      serialBaud = baud;
      console.log(`[serial] opened ${portPath} @ ${baud}`);
      serial.on("error", (e) => console.error("[serial] error:", e));
      serial.on("close", () => console.log("[serial] closed"));
      resolve({ path: portPath, baud });
    });
  });
}

function writeSerial(line) {
  return new Promise((resolve, reject) => {
    if (!serial || !serial.isOpen) return reject(new Error("Serial not open"));
    // Append CRLF and wait for drain to ensure delivery
    const data = line.endsWith("\n") ? line : line + "\r\n";
    serial.write(data, "utf8", (err) => {
      if (err) return reject(err);
      serial.drain((err2) => (err2 ? reject(err2) : resolve(true)));
    });
  });
}

// ---- IPC exposed to renderer ----
ipcMain.handle("serial:list", async () => await listSerialPorts());
ipcMain.handle("serial:open", async (_e, portPath, baud) => {
  try {
    return await openSerial(portPath, baud || 115200);
  } catch (e) {
    throw new Error(e.message || String(e));
  }
});
ipcMain.handle("serial:write", async (_e, data) => await writeSerial(String(data)));
ipcMain.handle("serial:close", async () => {
  if (serial && serial.isOpen) await new Promise((res) => serial.close(() => res()));
  serial = null;
  serialPath = null;
  serialBaud = null;
  return true;
});
ipcMain.handle("serial:status", async () => ({
  isOpen: Boolean(serial && serial.isOpen),
  path: serialPath,
  baud: serialBaud,
}));

// Platform-aware auto-open (nice for kiosk boot)
async function autoOpenSerial() {
  const platform = process.platform;

  if (platform === "linux") {
    for (const p of ["/dev/ttyUSB0", "/dev/ttyACM0"]) {
      try { await openSerial(p, 115200); return; } catch {}
      try { await openSerial(p, 9600); return; } catch {}
    }
  }

  // Fallback: enumerate and guess
  const ports = await listSerialPorts();
  const portPath = guessPort(ports);
  if (!portPath) {
    console.warn("[serial] no ports found to auto-open");
    return;
  }
  try {
    await openSerial(portPath, 115200);
  } catch (e1) {
    console.warn(`[serial] 115200 failed on ${portPath}:`, e1.message);
    try {
      await openSerial(portPath, 9600);
    } catch (e2) {
      console.warn(`[serial] 9600 failed on ${portPath}:`, e2.message);
    }
  }
}

// ---- Window bootstrap ----
function createWindow() {
  win = new BrowserWindow({
    fullscreen: false,
    kiosk: false,
    alwaysOnTop: false,
    autoHideMenuBar: true,
    backgroundColor: "#0b0f12",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once("ready-to-show", () => {
    win.maximize();
    win.show();
  });

  if (isDev) {
    win.loadURL(DEV_URL);
  } else {
    win.loadFile(path.join(__dirname, "../ui/out/index.html"));
  }
}

// Fullscreen controls (unchanged)
ipcMain.handle("fullscreen:enter", () => win && win.setFullScreen(true));
ipcMain.handle("fullscreen:exit", () => win && win.setFullScreen(false));
ipcMain.handle("fullscreen:toggle", () => win && win.setFullScreen(!win.isFullScreen()));

app.whenReady().then(async () => {
  createWindow();
  await autoOpenSerial();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
