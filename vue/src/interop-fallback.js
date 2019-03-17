/* eslint-disable no-console */
function promptNoElectron() {
  alert('You are not in Electron.');
}

// The following will be used if front end is run in browser during development.
export default {
  log: {
    info (msg) {
      console.info(msg);
    },
    debug (msg) {
      console.debug(msg);
    },
    warn (msg) {
      console.warn(msg);
    },
    error (msg) {
      console.error(msg);
    },
    log (msg) {
      console.log(msg);
    }
  },
  setBadgeCount(/*count*/) {
    promptNoElectron();
  },
  showOpenDialog(/*options, callback*/) {
    promptNoElectron();
    // You may choose to return something for testing instead
  },
  showSaveDialog(/*options, callback*/) {
    promptNoElectron();
    // You may choose to return something for testing instead
  }
}