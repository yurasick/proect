const {src, dest, watch, parallel,series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');


function browsersync(){
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notofy: false
    })
} 


function styles(){
    return src('app/scss/style.scss')
    .pipe(scss())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions']
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function images(){
    return src('app/images/1.jpg')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}


function build(){
    return src ([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
    ],{base:'app'})
    .pipe(dest('dict')) 
}


function watching(){
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js','!app/js/main.min.js'], scripts)
    watch(['app/**/*.html']).on('change',browserSync.reload)
}

function scripts(){
    return src([
        'node_modules/jquery/dist/jquery.js',        
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/@fancyapps/ui/dist/fancybox.umd.js', 
        'node_modules/rateyo/src/jquery.rateyo.js',         
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}


exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.build = series(images,build);

exports.default =parallel(styles,scripts,browsersync,watching);