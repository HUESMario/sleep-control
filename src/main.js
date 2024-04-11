const { app, BrowserWindow, Menu } = require('electron/main')
const path = require('node:path')
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:  {
      nodeIntegration:  true,
      contextIsolation: false,
      devTools: false
  },
  resizable: false
  })

  win.loadFile('./src/index.html')
}

Menu.setApplicationMenu(null)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})