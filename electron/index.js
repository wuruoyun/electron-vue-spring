const electron = require('electron');
const path = require('path');
const url = require('url');
var findPort = require("find-free-port");
const isDev = require('electron-is-dev');
const logger = require('./logger');
const axios = require('axios');

const { app, BrowserWindow, dialog } = electron;
const JAR = 'spring-1.0.0.jar'; // how to avoid manual update of this?
const MAX_CHECK_COUNT = 10;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// The server url and process
let serverProcess;
let baseUrl;

function startServer(port) {
  logger.info(`Starting server at port ${port}`)

  const server = `${path.join(app.getAppPath(), '..', '..', JAR)}`;
  logger.info(`Launching server with jar ${server} at port ${port}...`);

  serverProcess = require('child_process')
    .spawn('java', [ '-jar', server, `--server.port=${port}`]);

  serverProcess.stdout.on('data', logger.server);

  if (serverProcess.pid) {
    baseUrl = `http://localhost:${port}`;
    logger.info("Server PID: " + serverProcess.pid);
  } else {
    logger.error("Failed to launch server process.")
  }
}

function stopServer() {
  logger.info('Stopping server...')
  axios.post(`${baseUrl}/actuator/shutdown`, null, {
    headers: {'Content-Type': 'application/json'}
  })
    .then(() => logger.info('Server stopped'))
    .catch(error => {
      logger.error('Failed to stop the server gracefully.', error)
      if (serverProcess) {
        logger.info(`Killing server process ${serverProcess.pid}`);
        const kill = require('tree-kill');
        kill(serverProcess.pid, 'SIGTERM', function (err) {
          logger.info('Server process killed');
          serverProcess = null;
          baseUrl = null;
          app.quit(); // quit again
        });
      }
    })
    .finally(() => {
      serverProcess = null;
      baseUrl = null;
      app.quit(); // quit again
    })
}

function createSplash() {
  const splash = new BrowserWindow({ width: 400, height: 300, frame: false });
  splash.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }));
  return splash
}

function createWindow(callback) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // hide until ready-to-show
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  loadHomePage();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (callback) callback()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

function quitOnError(title, content) {
  logger.error(content)
  dialog.showErrorBox(title, content)
  app.quit()
}

function loadHomePage() {
  logger.info(`Loading home page at ${baseUrl}`)
  // check server health and switch to main page
  checkCount = 0
  setTimeout(function cycle() {
    axios.get(`${baseUrl}/actuator/health`)
      .then(() => mainWindow.loadURL(`${baseUrl}?_=${Date.now()}`))
      .catch(e => {
        if (e.code === 'ECONNREFUSED') {
          if (checkCount < MAX_CHECK_COUNT) {
            checkCount++;
            setTimeout(cycle, 1000);
          } else {
            quitOnError('Server timeout',
              `UI does not receive server response for ${MAX_CHECK_COUNT} seconds.`)
            app.quit()
          }
        } else {
          logger.error(e)
          quitOnError('Server error', 'UI receives an error from server.')
        }
      });
  }, 200);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  logger.info('###################################################')
  logger.info('#               Application Starting              #')
  logger.info('###################################################')

  if (isDev) {
    // Assume the webpack dev server is up at port 9000
    baseUrl = `http://localhost:9000`;
    createWindow();
  } else {
    // Create window first to show splash before starting server
    const splash = createSplash();

    // Start server at an available port (prefer 8080)
    findPort(8080, function(err, port) {
      if (!err) {
        startServer(port);
        createWindow(() => splash.close());
      } else {
        quitOnError('Error', 'Unable to get a server port.')
      }
    });
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

app.on('will-quit', e => {
  if (!isDev && baseUrl != null) {
    stopServer();
    e.preventDefault(); // will quite later after stopped the server
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.