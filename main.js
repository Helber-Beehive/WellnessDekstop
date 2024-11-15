// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const isMac = process.platform === "darwin";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Serial Testing Software",
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.maximize();
  mainWindow.setFullScreen(true);
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
