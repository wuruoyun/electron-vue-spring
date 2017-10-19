# Electron-Vue-Spring

> A bare-bone desktop application with web front-end and Java backend.

In some cases, you may like to use Java backend for an Electron desktop app. The reasons could be you have some legacy Java codes that you want to reuse, or you want to have the same codes run on Cloud as well as on desktop.

This project has two sub projects. Although they are just folders in this project, but they could be in their own Git repository and merged to this project using [Git subtree](https://help.github.com/articles/about-git-subtree-merges/).

1. `vue`: a Vue.js application as the front-end, based on Vue's [webpack-simple template](https://github.com/vuejs-templates/webpack-simple).
2. `spring`: a Spring Boot application as the backend, based on a Maven project created by [Spring Initializer](https://start.spring.io/) with Web dependency.

## Build Setup

Build the final installer, which can be found in folder `dist`.

``` bash
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

During development, you may simple work on front-end and backend with independent tools. Note that the front-end `vue` project has its own `package.json` so it can be built independently.

* For front-end, simple run `npm run dev` in `vue` folder. The webpack dev server will be running on port 9000 with hot reload. It is configured to proxy `health` and `api` URL to port 8080.
* For backend, import the Maven project into your favorite Java IDE and launch from there. The embedded Tomcat server will be running on port 8080.

## How it works

The main idea is to use Electron as a browser, and the front-end and backend of the app work as a web app. It might not be a common design, but is helpful in some cases.

The backend is a typical Spring Boot app, serving API to the front-end. The front-end is a typical Vue app, consuming API from the backend. 

### Build process

When building the final desktop app installer:

1. Front-end is built first. The final artifacts, including `index.html` and JavaScript files, are copied into `spring/src/main/resources/public` folder. 
2. Backend is built second. It creates a web app with the front-end artifacts created above and a native executable launcher.
3. Electron installer is built last. It includes the web app created above in the bundle and creates an executable installer.

However, both `vue` sub project and `spring` sub project are free of Electron and can be built independently without building the Electron part. This allows them to be deployed online, instead of packaged into Electron app.

### Launch process

When launching the Electron app:

1. Electron app spawns the backend launcher with Node `child_process`.
2. Electron app then displays a splash page, at the same time pings the `health` URL of the backend server.
3. Once the `health` ping returns OK (the web app is up),Electron app switches the page to the home page of the web app.

## License

[MIT](LICENSE)