// File: electron/preload.js
// Purpose: Safe bridge for fullscreen controls and SerialPort IPC, including a subscription to line data.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Fullscreen controls
  enterFullscreen: () => ipcRenderer.invoke("fullscreen:enter"),
  exitFullscreen: () => ipcRenderer.invoke("fullscreen:exit"),
  toggleFullscreen: () => ipcRenderer.invoke("fullscreen:toggle"),

  // Serial controls
  serialList: () => ipcRenderer.invoke("serial:list"),
  serialOpen: (path, baud) => ipcRenderer.invoke("serial:open", path, baud),
  serialWrite: (data) => ipcRenderer.invoke("serial:write", data),
  serialClose: () => ipcRenderer.invoke("serial:close"),
  serialStatus: () => ipcRenderer.invoke("serial:status"),

  // Serial data subscription (returns an unsubscribe function)
  onSerialData: (handler) => {
    const listener = (_event, line) => {
      try {
        handler(line);
      } catch {}
    };
    ipcRenderer.on("serial:data", listener);
    return () => ipcRenderer.removeListener("serial:data", listener);
  },
});
