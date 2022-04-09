const { app, contextBridge, ipcRenderer } = require('electron')
const logger = require('./logger')

const LOG_PREFIX = '[ui]'

contextBridge.exposeInMainWorld('interop', {
  log: {
    info(msg) {
      logger.info(`${LOG_PREFIX} ${msg}`)
    },
    debug(msg) {
      logger.debug(`${LOG_PREFIX} ${msg}`)
    },
    warn(msg) {
      logger.warn(`${LOG_PREFIX} ${msg}`)
    },
    error(msg) {
      logger.error(`${LOG_PREFIX} ${msg}`)
    },
    log(msg) {
      logger.silly(`${LOG_PREFIX} ${msg}`)
    },
  },
  setBadgeCount(count) {
    return ipcRenderer.send('app:badgeCount', count)
  },
  showOpenDialog() {
    return ipcRenderer.invoke('dialog:openFile')
  },
  showSaveDialog() {
    return ipcRenderer.invoke('dialog:saveFile')
  },
})
