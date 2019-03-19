# Pug Sass Typescript Gulp Starter Kit

A starter kit for compiling Pug, Sass, Typescript and running a dev server.

### Version

1.3.0


### Installation

Install the dependencies:  
```js
  "devDependencies": {
    "acorn": "^6.1.1",
    "autoprefixer": "^9.5.0",
    "browser-sync": "^2.18.13",
    "child_process": "^1.0.2",
    "cssnano": "^4.1.10",
    "del": "^3.0.0",
    "gulp": "^4.0.0",
    "gulp-concat": "^2.6.1",
    "gulp-eslint": "^5.0.0",
    "gulp-imagemin": "^5.0.3",
    "gulp-newer": "^1.4.0",
    "gulp-plumber": "^1.2.1",
    "gulp-postcss": "^8.0.0",
    "gulp-pug": "^3.3.0",
    "gulp-pug-lint2": "^1.0.0",
    "gulp-rename": "^1.4.0",
    "gulp-sass": "^3.1.0",
    "gulp-sass-lint": "^1.4.0",
    "gulp-typescript": "^4.0.2",
    "gulp-uglify": "^3.0.0",
    "pug-lint": "^2.5.0",
    "typescript": "^2.9.2",
    "webpack": "^4.29.6",
    "webpack-stream": "^5.2.1"
  },
```
* ### At this point webpack is not used.

```sh
$ npm install
```

(Optional)Install gulp globally if you want to run the gulp command in your CLI.

```sh
$ npm install -g gulp
```

## Usage

This kit works with pug by default. You change the pug files in the pug folder and the files are compiled to html.

In the assets folder you upload the images and js files this folder will be copied to the build folder.

With the last version typescript was added. You can use it or not just be careful if you save changes to the main.ts file the main.js will be overwritten. Best is if you DO NOT want to use typescript just delete the
main.ts file and it will not be compiled to main.js.

Never change the src/index.html or the assets/css/ files because it will be overwritten with the compiled files.

### Run

This will watch your sass/pug files and run your dev server at http://localhost:3000

```sh
$ npm start
```

### Ready for deployment

After you are ready to deploy you project. Run this command to create the dist folder and your files will be ready to deploy. Just upload the files in the dist to your server.

```sh
$ gulp build
```

### Help

Run this command to see the all available commands.

```sh
$ gulp help
```
