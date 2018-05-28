function promptNoElectron() {
  alert('You are not in Electron.');
}

// The following will be used if front end is run in browser during development.
export default {
  setBadgeCount(count) {
    promptNoElectron();
  },
  showOpenDialog(options, callback) {
    promptNoElectron();
    // You may choose to return something for testing instead
  },
  showSaveDialog(options, callback) {
    promptNoElectron();
    // You may choose to return something for testing instead
  }
}