// electron/main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";
const DEV_URL = process.env.DEV_SERVER_URL || "http://localhost:3000";

// Help Chromium show the on-screen keyboard on touch devices
app.commandLine.appendSwitch("enable-virtual-keyboard");

let win;

function createWindow() {
  win = new BrowserWindow({
    fullscreen: false, // ← not fullscreen on launch
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
    win.maximize(); // ← open maximized instead
    win.show();
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    // win.webContents.openDevTools({ mode: "detach" }); // optional
  } else {
    win.loadFile(path.join(__dirname, "../ui/out/index.html"));
  }
}

// Fullscreen controls (optional, to use later from renderer)
ipcMain.handle("fullscreen:enter", () => win && win.setFullScreen(true));
ipcMain.handle("fullscreen:exit", () => win && win.setFullScreen(false));
ipcMain.handle(
  "fullscreen:toggle",
  () => win && win.setFullScreen(!win.isFullScreen())
);

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
