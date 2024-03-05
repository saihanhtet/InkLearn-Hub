import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const appPath = app.getAppPath()
console.log('App path :', appPath)
console.log('User data directory:', app.getPath('userData'))

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    darkTheme: false,
    maximizable: true,
    show: false,
    title: 'InkLearn-Hub',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true,
      nodeIntegration: true,
      allowRunningInsecureContent: false
    },
    center: true
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  // save cookies from response
  ipcMain.on('save-cookies', () => {
    mainWindow.webContents.session.cookies
      .get({})
      .then((cookies) => {
        const serializedCookies = JSON.stringify(cookies)
        mainWindow.webContents.send('set-cookies', serializedCookies)
      })
      .catch((error) => {
        console.error('Error getting cookies:', error)
      })
  })
  // clear cookies from response
  ipcMain.on('clear-cookies', () => {
    mainWindow.webContents.session
      .clearStorageData({
        storages: ['cookies']
      })
      .then(() => {
        console.log('Cookies cleared successfully')
      })
      .catch((error) => {
        console.error('Error clearing cookies:', error)
      })
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
