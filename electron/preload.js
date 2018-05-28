const {remote} = require('electron');
const {dialog} = remote;

window.versions = process.versions;

window.interop = {
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
