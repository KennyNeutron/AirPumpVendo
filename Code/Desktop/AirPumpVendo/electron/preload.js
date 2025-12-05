// File: electron/preload.js
// Purpose: Safe bridge for fullscreen controls and SerialPort IPC (+ platform check if needed later).

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
});
