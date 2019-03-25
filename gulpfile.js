const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp          = require("child_process");
const cssnano     = require("cssnano");
const del         = require("del");
const eslint      = require("gulp-eslint");
const gulp        = require("gulp");
const imagemin    = require("gulp-imagemin");
const sass        = require("gulp-sass");
const sasslint    = require("gulp-sass-lint");
const pug         = require("gulp-pug");
const puglint     = require("gulp-pug-lint2");
const plumber     = require("gulp-plumber");
const postcss     = require("gulp-postcss");
const rename      = require("gulp-rename");
const uglify      = require("gulp-uglify");
const newer       = require("gulp-newer");
const concat      = require("gulp-concat");

// BrowserSync
function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "./site/"
      },
      port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
    return del(["./site/**/*","./dist/**/*"]);
}

// Optimize Images
function images() {
    return gulp
        .src("./src/assets/img/**/*")
        .pipe(newer("./site/assets/img"))
        .pipe(
            imagemin([
	            imagemin.gifsicle({ interlaced: true }),
	            imagemin.jpegtran({ progressive: true }),
	            imagemin.optipng({ optimizationLevel: 5 }),
	            imagemin.svgo({
	            plugins: [
	                {
		                removeViewBox: false,
		                collapseGroups: true
	                }
	            ]
	            })
            ])
        )
        .pipe(gulp.dest("./site/assets/img"));
}

// CSS task
function css() {
    return gulp
        .src("./src/scss/**/*.scss")
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest("./site/assets/css/"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest("./site/assets/css/"))
        .pipe(browsersync.stream());
}

// Compile Pug
function pug2html() {
    return gulp
        .src("src/pug/**/*.pug")
        .pipe(puglint({failOnError: true}))
        .pipe(pug({
          doctype: "html",
          pretty: true
        }))
        .pipe(gulp.dest("./site"));
}

// Compile Sass & Inject Into Browser
function sass2css() {
    return gulp
        .src(["src/scss/**/*.sass"])
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
        .pipe(sass())
        .pipe(gulp.dest("site/assets/css"))
        .pipe(browsersync.stream());
}

// Lint js scripts
function scriptsLint() {
    return gulp
        .src(["./src/assets/js/**/*", "./gulpfile.js"])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
    return gulp
        .src(["./src/assets/js/**/*"])
        .pipe(plumber())
        .pipe(gulp.dest("./site/assets/js"))
        .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
    gulp.watch("./src/pug/**/*", gulp.series(pug2html, browserSyncReload));
    gulp.watch("./src/scss/**/*.sass", sass2css);
    gulp.watch("./src/scss/**/*.scss", css);
    gulp.watch("./src/assets/js/*.js", gulp.series(scriptsLint, scripts));
    gulp.watch("./src/assets/img/**/*", images);
/*
    gulp.watch(
        [
        ],
        gulp.series(jekyll, browserSyncReload)
    );
*/
}

// define complex tasks
const jscript = gulp.series(scriptsLint, scripts);
const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(clean, gulp.parallel(pug2html, sass2css, css, images), jscript, watch);

// export tasks
exports.images = images;
exports.pug2html = pug2html;
exports.sass2css = sass2css
exports.css = css;
exports.jscript = jscript;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;

// Default Task
// gulp.task("default", gulp.series("pug","sass","typescript","serve", () => {}));

// ********************************************************************************
// This is the Build part it creates the dist folder and readys all the files for deployment
// ********************************************************************************

// Copy HTML to dist folder
gulp.task("copyHtml", () => {
    return gulp.src(["src/*.html"])
        .pipe(gulp.dest("dist"));
});

// Copy Css to dist folder
gulp.task("copyCSS", () => {
    return gulp.src(["src/assets/css/*.css"])
        .pipe(gulp.dest("dist/assets/css"));
});

// ImageMin
gulp.task("imageMin", () => {
    return gulp.src(["src/assets/img/*"])
        .pipe(imageMin())
        .pipe(gulp.dest("dist/assets/img"));
});

// Minify, concat js files and copy them to dist folder
gulp.task("scripts", () => {
    return gulp.src(["src/assets/js/*.js"])
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/assets/js"));
});

// Builds to dist folder, ready to deploy
gulp.task("build", gulp.parallel(["imageMin", "scripts", "copyHtml", "copyCSS"]));

// Clean the build folder
gulp.task("clean", () => {
  console.log("-> Cleaning dist folder")
  del([
    "dist"
  ]);
});
