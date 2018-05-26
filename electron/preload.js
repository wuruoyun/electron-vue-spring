const {remote} = require('electron');

window.versions = process.versions;

window.interop = {
  setBadgeCount(count) {
    return remote.app.setBadgeCount(count);
  }
};
