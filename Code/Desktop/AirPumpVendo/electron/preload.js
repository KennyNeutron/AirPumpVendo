// File: electron/preload.js
// Purpose: Safe, minimal bridge for fullscreen controls and SerialPort IPC.

const { contextBridge, ipcRenderer } = require("electron");

// Fullscreen
const fullscreenAPI = {
  enterFullscreen: () => ipcRenderer.invoke("fullscreen:enter"),
  exitFullscreen: () => ipcRenderer.invoke("fullscreen:exit"),
  toggleFullscreen: () => ipcRenderer.invoke("fullscreen:toggle"),
};

// Serial
const serialAPI = {
  serialList: () => ipcRenderer.invoke("serial:list"),
  serialOpen: (path, baud) => ipcRenderer.invoke("serial:open", path, baud),
  serialWrite: (data) => ipcRenderer.invoke("serial:write", data),
  serialClose: () => ipcRenderer.invoke("serial:close"),
};

contextBridge.exposeInMainWorld("electronAPI", {
  ...fullscreenAPI,
  ...serialAPI,
});
