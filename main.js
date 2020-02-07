const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

/*   win.loadFile('index.html')
 */
  win.loadURL('http://localhost:3000/')
/*   win.webContents.openDevTools() */
}

app.on('ready', createWindow)

app.on("closed", () => {
  win= null;
  app.exit(0);
})
