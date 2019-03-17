const {remote} = require('electron');
const {dialog} = remote;
const logger = require('./logger');

const LOG_PREFIX = '[ui]';

window.versions = process.versions;

window.interop = {
  log: {
    info (msg) {
      logger.info(`${LOG_PREFIX} ${msg}`);
    },
    debug (msg) {
      logger.debug(`${LOG_PREFIX} ${msg}`);
    },
    warn (msg) {
      logger.warn(`${LOG_PREFIX} ${msg}`);
    },
    error (msg) {
      logger.error(`${LOG_PREFIX} ${msg}`);
    },
    log (msg) {
      logger.silly(`${LOG_PREFIX} ${msg}`);
    }
  },
  setBadgeCount(count) {
    return remote.app.setBadgeCount(count);
  },
  showOpenDialog(options, callback) {
    dialog.showOpenDialog(options, callback);
  },
  showSaveDialog(options, callback) {
    dialog.showSaveDialog(options, callback);
  }
};
