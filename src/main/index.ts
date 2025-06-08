import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
const kill = require('tree-kill')

let BACKEND_PROCESS: ChildProcessWithoutNullStreams
let serverStartedCallback: (() => void) | null = null

const isDevelopmentEnv = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

const appPath = app.getAppPath()
const userDataPath = app.getPath('userData')

const spawnDjango = (): ChildProcessWithoutNullStreams => {
  const pythonPath = isDevelopmentEnv()
    ? path.join(appPath, 'venv', process.platform === 'win32' ? 'Scripts' : 'bin', 'python3')
    : path.join(userDataPath, 'venv', process.platform === 'win32' ? 'Scripts' : 'bin', 'python3')

  const djangoArgs = isDevelopmentEnv()
    ? [path.join('python', 'inkBackend', 'manage.py'), 'runserver', '--noreload']
    : ['inkBackend.exe', 'runserver', '--noreload']

  console.log('Python path:', pythonPath)
  console.log('Django args:', djangoArgs)

  const spawnOptions = {
    cwd: isDevelopmentEnv() ? appPath : userDataPath,
    shell: true
  }

  return spawn(pythonPath, djangoArgs, spawnOptions)
}

const startBackendServer = () => {
  BACKEND_PROCESS = spawnDjango()
  BACKEND_PROCESS.stdout.on('data', (data) => {
    console.log(`stdout:\n${data}`)
    if (data.includes('Starting development server')) {
      if (serverStartedCallback) {
        serverStartedCallback()
        serverStartedCallback = null
      }
    }
  })

  BACKEND_PROCESS.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  BACKEND_PROCESS.on('error', (error) => {
    console.error(`error: ${error.message}`)
  })

  BACKEND_PROCESS.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })

  return BACKEND_PROCESS
}
console.log('App path :', appPath)
console.log('User data directory:', app.getPath('userData'))

function createWindow(): void {
  // Create the browser window.
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

app.on('before-quit', async () => {
  kill(BACKEND_PROCESS.pid)
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // start the backend
  startBackendServer()
  // show the port running on
  console.log('Spawn on port: ', BACKEND_PROCESS.pid)

  serverStartedCallback = createWindow

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  console.log('Ending our backend server.')
  kill(BACKEND_PROCESS.pid)
})
