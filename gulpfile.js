"use strict";

let gulp = require("gulp");
let plumber = require("gulp-plumber");
let sourcemap = require("gulp-sourcemaps");
let sass = require("gulp-sass");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let csso = require("gulp-csso");
let rename = require("gulp-rename");
let imagemin = require("gulp-imagemin");
let svgstore = require("gulp-svgstore");
let del = require("del");
let posthtml = require("gulp-posthtml");
let include = require("posthtml-include");
let server = require("browser-sync").create();
let jsmin = require("gulp-jsmin");
let babel = require('gulp-babel');
// let twig = require('gulp-twig');

const htmlPage = ["src/*.html", "src/**/*.html", "!src/html-const/**/*.html", "!src/html-const/*.html"];

const jsFileCopy = ["src/js/lib/**/*.js"];

let pathPublic = 'public/assets/';
let pathPublicHTML = 'public/';

gulp.task("css", function() {
    return gulp
        .src("src/styles/main.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(
            sass({
                includePaths: require("node-normalize-scss").includePaths
            })
        )
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(`${pathPublic}/css/`))
        .pipe(csso())
        .pipe(rename("main.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest(`${pathPublic}/css/`))
        .pipe(server.stream());
});

gulp.task("html", function() {
    return gulp
        .src(htmlPage)
        .pipe(posthtml([include()]))
        .pipe(gulp.dest(pathPublicHTML));
});

gulp.task("jscopy", async function() {
  return gulp
        .src(jsFileCopy)
        .pipe(gulp.dest(`${pathPublic}js/lib/`));
});

gulp.task('jsmin', function () {
    return  gulp.src('src/js/main.js')
        .pipe(plumber())
        .pipe(babel({
          presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest(`${pathPublic}js/`))
        .pipe(jsmin())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(`${pathPublic}js/`))
        .pipe(server.stream());
});

gulp.task("images", function() {
    return gulp
        .src(["src/img/**/*.{png,jpg,webp,svg,ico}"])
        .pipe(
            imagemin([
                imagemin.optipng({ optimizationLevel: 3 }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.svgo()
            ])
        )
        .pipe(gulp.dest(`${pathPublic}img/`));
});

gulp.task("imagesFast", function() {
    return gulp
        .src(["src/img/**/*.{png,jpg,webp,svg,ico}"])
        .pipe(gulp.dest(`${pathPublic}img/`));
});

gulp.task("copy", function() {
    return gulp
        .src("src/**/*.{ttf,woff,woff2}")
        .pipe(gulp.dest(pathPublic));
});


gulp.task("copyIco", function() {
    return gulp
        .src("src/**/*.ico")
        .pipe(gulp.dest(pathPublicHTML));
});


gulp.task("sprite", function() {
    return (
        gulp
            .src("src/img/svg-sprite/**/*.svg")
            .pipe(
                svgstore({
                    inLineSvg: true,
                    minify: false
                })
            )
            .pipe(rename("sprite.svg"))
            .pipe(gulp.dest(`${pathPublic}img/`))
    );
});

// gulp.task('compile', function () {
//     'use strict';
//     var twig = require('gulp-twig');
//     return gulp.src('src/*.twig')
//         .pipe(twig({
//             data: {
//                 title: 'Gulp and Twig',
//                 benefits: [
//                     'Fast',
//                     'Flexible',
//                     'Secure'
//                 ]
//             }
//         }))
//         .pipe(gulp.dest(`${pathPublicHTML}`));
// });

gulp.task("clean", function() {
    return del([
        `${pathPublic}/**`,
        `${pathPublic}/*`,
        `${pathPublicHTML}/*.html`,
        "!public/.git",
        "!public/.gitignore",
        // "compiled/**",
    ]);
});

gulp.task("server", function() {
    server.init({
        server: "public/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("src/styles/**/*.{scss,sass}", gulp.series("css", "refresh"));
    gulp.watch("src/**/*.html", gulp.series("html", "refresh"));
    // gulp.watch("src/**/*.twig", gulp.series("compile", "refresh"));
    gulp.watch("src/js/**/*.js", gulp.series("jscopy", "jsmin", "refresh"));
    gulp.watch("src/img/**/*.{png,jpg,svg}", gulp.series("imagesFast", "refresh"));
    gulp.watch("src/img/**/*.svg", gulp.series("sprite", "html", "refresh"));
});

gulp.task("refresh", function(done) {
    server.reload();
    done();
});


gulp.task("prodPath", function (done) {
  pathPublic = 'public/assets/';
  pathPublicHTML = 'public/';
  done();
});

gulp.task(
    "start",
    gulp.series(
        "clean",
        "imagesFast",
        "sprite",
        "css",
        "copy",
        "jscopy",
        "jsmin",
        "html",
        // "compile",
        "copyIco",
        "server"
    )
);

gulp.task(
    "build",
    gulp.series("clean", "images", "sprite", "css", "copy", "jscopy", "jsmin", "html", "copyIco")
);

gulp.task(
  "build-prod",
  gulp.series("clean","prodPath","images", "sprite", "css", "copy", "jscopy", "jsmin", "copyIco")
);
