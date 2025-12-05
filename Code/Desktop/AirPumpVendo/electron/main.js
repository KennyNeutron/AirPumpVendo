// File: electron/main.js
// Purpose: Launch maximized (not fullscreen) and provide SerialPort IPC to send "PAYMENT" from renderer.

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport"); // ← new

const isDev = process.env.NODE_ENV !== "production";
const DEV_URL = process.env.DEV_SERVER_URL || "http://localhost:3000";

// Help Chromium show the on-screen keyboard on touch devices
app.commandLine.appendSwitch("enable-virtual-keyboard");

let win;

// ---- Serial state & helpers ----
let serial = null;

// Common USB-serial vendor IDs: Arduino, CH340, CP210x, FTDI
const ARDUINO_VIDS = new Set(["2341", "2a03", "1a86", "10c4", "0403"]);

async function listSerialPorts() {
  try {
    return await SerialPort.list();
  } catch {
    return [];
  }
}

function guessPort(ports) {
  const byVid = ports.find((p) => ARDUINO_VIDS.has((p.vendorId || "").toLowerCase()));
  return (byVid || ports[0] || null)?.path || null;
}

async function openSerial(portPath, baud = 9600) {
  if (serial && serial.isOpen) {
    await new Promise((res) => serial.close(() => res()));
    serial = null;
  }
  return new Promise((resolve, reject) => {
    serial = new SerialPort({ path: portPath, baudRate: baud }, (err) => {
      if (err) return reject(err);
      console.log(`[serial] opened ${portPath} @ ${baud}`);
      serial.on("error", (e) => console.error("[serial] error:", e));
      serial.on("close", () => console.log("[serial] closed"));
      resolve({ path: portPath, baud });
    });
  });
}

function writeSerial(line) {
  if (!serial || !serial.isOpen) throw new Error("Serial not open");
  const data = line.endsWith("\n") ? line : line + "\n";
  serial.write(data);
}

// ---- IPC exposed to renderer ----
ipcMain.handle("serial:list", async () => await listSerialPorts());
ipcMain.handle("serial:open", async (_e, portPath, baud) => await openSerial(portPath, baud || 9600));
ipcMain.handle("serial:write", async (_e, data) => {
  writeSerial(String(data));
  return true;
});
ipcMain.handle("serial:close", async () => {
  if (serial && serial.isOpen) await new Promise((res) => serial.close(() => res()));
  serial = null;
  return true;
});

// Optional: auto-open if we detect any serial device
async function autoOpenSerial() {
  const ports = await listSerialPorts();
  const portPath = guessPort(ports);
  if (!portPath) {
    console.warn("[serial] no ports found to auto-open");
    return;
  }
  try {
    await openSerial(portPath, 9600);
  } catch (e) {
    console.warn("[serial] auto-open failed:", e.message);
  }
}

// ---- Window bootstrap (kept from your current file) ----
function createWindow() {
  win = new BrowserWindow({
    fullscreen: false, // not fullscreen on launch
    kiosk: false,
    alwaysOnTop: false,
    autoHideMenuBar: true,
    backgroundColor: "#0b0f12",
    show: false, // show after we maximize
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once("ready-to-show", () => {
    win.maximize(); // open maximized
    win.show();
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    // win.webContents.openDevTools({ mode: "detach" }); // optional
  } else {
    win.loadFile(path.join(__dirname, "../ui/out/index.html"));
  }
}

// Fullscreen controls (optional)
ipcMain.handle("fullscreen:enter", () => win && win.setFullScreen(true));
ipcMain.handle("fullscreen:exit", () => win && win.setFullScreen(false));
ipcMain.handle("fullscreen:toggle", () => win && win.setFullScreen(!win.isFullScreen()));

app.whenReady().then(async () => {
  createWindow();
  await autoOpenSerial(); // harmless if nothing is plugged in
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
