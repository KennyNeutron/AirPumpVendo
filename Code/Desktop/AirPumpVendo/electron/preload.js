const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("api", {
  // Add safe, specific bridges later.
});
