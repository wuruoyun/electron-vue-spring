const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const isProd = process.execPath.search('electron-prebuilt') === -1;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// Keep a global reference of the server process, 
let serverProcess;

function launchServer(port) {
  console.log(`Launching server at port ${port}...`);
  const platform = process.platform;

  if (platform === 'win32') {
    const launcher = isProd ? 
      'server/spring.exe' : 'spring/target/bundles/spring/spring.exe';
    serverProcess = require('child_process')
      .spawn(launcher);
  } else if (platform === 'darwin') {
    serverProcess = require('child_process')
      .spawn(app.getAppPath() + '/TODO');
  }

  if (serverProcess) {
    serverProcess.stdout.on('data', data => {
      console.log('SERVER: ' + data);
    });
    serverProcess.stderr.on('data', data => {
      console.log('SERVER: ' + data);
    });
  
    console.log("Server PID: " + serverProcess.pid);
  }
}

function createWindow() {
  // Launch the backend server
  launchServer(8080);

  // Create the browser window
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the splash screen of the app
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  // check server health and switch to main page
  const axios = require('axios');
  setTimeout(function cycle() {
    axios.get('http://localhost:8080/health')
      .then(response => {
        mainWindow.loadURL('http://localhost:8080');
      })
      .catch(e => {
        //console.log(e);
        setTimeout(cycle, 1000);
      });
  }, 200);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.