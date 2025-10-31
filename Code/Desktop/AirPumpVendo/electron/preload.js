// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  enterFullscreen: () => ipcRenderer.invoke("fullscreen:enter"),
  exitFullscreen: () => ipcRenderer.invoke("fullscreen:exit"),
  toggleFullscreen: () => ipcRenderer.invoke("fullscreen:toggle"),
});
