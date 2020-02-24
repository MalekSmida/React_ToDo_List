const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    }
  });

  let winRenderer = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  /*   win.loadFile('index.html')
   */

  win.loadURL("http://localhost:3000/");
  winRenderer.loadFile(__dirname + "/index.html");

  win.webContents.openDevTools();
  winRenderer.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("closed", () => {
  win = null;
  winRenderer = null;
  app.exit(0);
});

//ipc test
const ipc = require("electron").ipcMain;
/* ipc.on('synMessage', (event, args) => {
 console.log(args);
 event.returnValue = 'Main said I received your Sync message';
}) */

ipc.on("aSynMessage", (event, args) => {
  console.log(args);
  event.sender.send("aSynReply", "Main said: Async message received");
});
