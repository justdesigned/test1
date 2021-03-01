"use strict";
const { watch, series, parallel, src, dest } = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const webpack = require("webpack-stream");
const gulpif= require("gulp-if");

const conf = {
  dest: "./build",
};

let isDev = true;
let isProd = !isDev;

const webpackConfig = {
  output: {
    filename: "main.min.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  mode: isDev ? "development" : "production",
  devtool: isDev ? "eval-source-map" : "none",
};

function del() {
  return src("build/").pipe(clean({ force: true }));
}

function html() {
  return src("./src/**/*.html")
    .pipe(dest(conf.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(["./src/scss/**/*.scss"])
    .pipe(gulpif(isProd, sass({ outputStyle: "compressed" }).on("error", sass.logError)))
    .pipe(gulpif(isDev, sass({ outputStyle: "expanded" }).on("error", sass.logError)))
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: false,
      })
    )
    .pipe(concat("main.css"))
    .pipe(dest(conf.dest + "/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("src/js/main.js")
    .pipe(webpack(webpackConfig))
    .pipe(dest(conf.dest + "/js"))
    .pipe(browserSync.stream());
}

function images() {
  return src("./src/img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(conf.dest + "/img"));
}

function fonts() {
  return src("./src/fonts/**/*.{eot,svg,ttf,woff,woff2}").pipe(
    dest(conf.dest + "/fonts")
  );
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "./build/",
    },
  });
  watch("./src/**/*.html", html);
  watch("./src/scss/**/*.scss", styles);
  watch("./src/js/**/*.js", scripts);
}

exports.del = del;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;


exports.build = series(del, parallel(html, styles, scripts, images, fonts));
exports.default = watching;
