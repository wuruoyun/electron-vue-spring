# Electron-Vue-Spring

> An opionated desktop application with web front-end and Java backend.

In some cases, you may like to use Java backend for an Electron desktop app. The reasons could be you have some legacy Java codes that you want to reuse, or you want to have the same codes run on Cloud as well as on desktop.

This project has two sub projects:

1. `vue`: a Vue 3 app in TypeScript as the front-end, based on the scaffold project created using Vite. You may also replace this project with a React or Angular project with similar design.
2. `spring`: a Spring Boot application as the backend, based on a Maven project created by [Spring Initializer](https://start.spring.io/) with Web dependency.

Both Windows and Mac OS are supported.

> NOTE: This project uses your system Java to run the spring web app. If you prefer to bundle JRE into the app, configure the `extraFiles` of Electron Builder to copy it when making the installer.

## Build Installer

Build the final installer, which can be found in folder `dist`. It is an `exe` file for Windows and `dmg` file for Mac.

```bash
# install dependencies
npm install

# install dependencies for vue project
cd vue
npm install
cd ..

# build installer for production
npm run build
```

## Development Setup

During development, you may work on front-end and backend separately with independent tools, such as using Visual Studio Code for front-end and IntelliJ for backend. Note that the front-end `vue` project has its own `package.json` so it can be built independently.

- To run backend, import the Maven project into your favorite Java IDE and launch from there. The embedded Tomcat server will be running on port `8080`.
- To run front-end, run `npm run dev` in `vue` folder. Vite will run a server on port `9000` with hot reload. It is configured to proxy `actuator/health` and `api` URL to port `8080`.
- To run the Electron part, run `npm run start` in root folder. The Electron app loads the home page at `http://localhost:9000`, therefore you should run both backend and front-end first.

## How it works

The main idea is to use Electron as a browser, and the front-end and backend of the app work as a web app. It might not be a common design, but is helpful in some cases.

The backend is a typical Spring Boot app, serving API to the front-end. The front-end is a typical Vue app, consuming API from the backend.

### Build process

When building the final desktop app installer:

1. Front-end is built first. The final artifacts, including `index.html` and JavaScript files, are copied into `spring/src/main/resources/public` folder.
2. Backend is built second. It creates a web app with the front-end artifacts created above and an executable jar.
3. Electron installer is built last. It includes the web app created above in the bundle and creates an executable installer.

However, both `vue` sub project and `spring` sub project are free of Electron and can be built independently without building the Electron part. They can be deployed online, instead of packaged into Electron app, allowing you to use the same code base for online and desktop deployment.

### Launch process

When launching the Electron app:

1. Electron app detects an available port and starts the backend server with Node `child_process` at the specified port. The PID of the server process is kept to potentially kill the process before quiting the app.
2. Electron app then displays a splash window, at the same time pings the `actuator/health` URL of the backend server periodically.
3. Once the `actuator/health` ping returns OK (the web app is up), Electron app closes the splash window and open a new window to load the home page of the web app.

> The Electron app starts the backend server only in production build. During development, you will need to manually start the front-end dev server as mentioned earlier.

### Shutdown process

When shutting down the Electron app:

1. Electron app handles the `will-quit` event by trying to stop the backend server and cancel the quit.
2. The first attempt is to shutdown gracefully via the `actuator/shutdown` URL of the backend server.
3. If that fails, the Electron app will attempt to kill the process by its PID.
4. Either of the shutsown attempts above will clear up the `baseUrl` and call `app.quit()` again.
5. With `baseUrl` being cleared, `will-quit` handler will not prevent the quitting this time.

### Node access

Although the Java backend is running locally, it is more secure to load the page with Node integration disabled (defualt behavior). This prevents third-party JavaScript libraries used by your web app from accessing Node directly, and mitigates the risk if your app navigates to external website.

The access to Node can be selectively re-introduced back to the web app via [preload.js](electron/preload.js), which defines a set of API on a global `window.interop` object. This object is provided by the Vue app instance in [main.ts](vue/src/main.ts) for injection into Vue components via key `KEY_INTEROP`. This allows any UI component to call the API.

### Log Aggregation

The log messages from Electron, Vue and Spring apps are aggregated into the [electron logger](https://www.npmjs.com/package/electron-log) in Electron app. By default it writes logs to the following locations:

- on Linux: `~/.config/{app name}/logs/{process type}.log`
- on macOS: `~/Library/Logs/{app name}/{process type}.log`
- on Windows: `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`

In the Vue app, the electron logger is wrapped by the `log` property of `window.interop` object. This `log` object is provided by Vue app instance in [main.ts](vue/src/main.ts) for injection into Vue components via key `KEY_LOG`. Calling `$log.info(...)` will send the log messages (after attaching a prefix to identify it is from UI) to electron logger. Other logging level works in the same way.

In the Spring app, `logback-spring.xml` configuration sends the log to console, which is the standard output received by the Electron app. The logback message pattern put the log level (`INFO`, `DEBUG`, etc.) at the begining of the message so that Electron app checks and calls the corresponding function (`info`, `debug`, etc.) on the electron logger.

## License

[MIT](LICENSE)
