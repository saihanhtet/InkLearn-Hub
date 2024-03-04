const { contextBridge, ipcRenderer } = window.require('electron')
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      saveCookies: () => {
        ipcRenderer.send('save-cookies')
      },
      clearCookies: () => {
        ipcRenderer.send('clear-cookies')
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    saveCookies: () => {
      ipcRenderer.send('save-cookies')
    },
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    clearCookies: () => {
      ipcRenderer.send('clear-cookies')
    }
  }
  // @ts-ignore (define in dts)
  window.api = api
}

ipcRenderer.on('set-cookies', (_, cookies) => {
  localStorage.setItem('cookies', cookies)
})

ipcRenderer.on('remove-cookies', () => {
  localStorage.clear()
})
