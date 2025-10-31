// CJS on purpose (root package has no "type":"module")
const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";
const DEV_URL = process.env.DEV_SERVER_URL || "http://localhost:3000";

// Hint Chromium to show the virtual keyboard on touch devices (RPi)
app.commandLine.appendSwitch("enable-virtual-keyboard");

function createWindow() {
  const win = new BrowserWindow({
    // Fullscreen-only so OSK can appear above the app window
    fullscreen: true,
    kiosk: false, // important: leave kiosk OFF
    alwaysOnTop: false, // important: leave alwaysOnTop OFF
    autoHideMenuBar: true,
    backgroundColor: "#0b0f12",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    // Open devtools in a separate window (doesn't block the OSK)
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // Load the static export from Next.js
    win.loadFile(path.join(__dirname, "../ui/out/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
