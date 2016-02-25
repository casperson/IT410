var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    cache = require('gulp-cached');

gulp.task('sass', function () {
    return gulp.src('src/**/*.scss', 'src/*.scss')
        .pipe(changed('dist'))
        .pipe(cache('sass'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});


gulp.task('autoprefix', function() {
    return gulp.src('src/*.css', 'src/**/*.css')
        .pipe(changed('dist'))
        .pipe(cache('autoprefix'))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('minify-css', function () {
    return gulp.src('src/*.css', '/src/**/*.css')
        .pipe(changed('dist'))
        .pipe(cache('minify-css'))
        .pipe(csso())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./out'));
});

gulp.task('minify-html', function() {
    return gulp.src('src/*.html')
        .pipe(changed('dist'))
        .pipe(cache('minify-css'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'))
});

gulp.task('minify-images', function() {
    return gulp.src('src/images/*')
        .pipe(changed('dist/images'))
        .pipe(cache('minify-images'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('compress-js', function() {
    return gulp.src(['src/*.js', 'src/**/*.js'])
        .pipe(changed('dist'))
        .pipe(cache('compress-js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat-js-css', function () {
    return gulp.src('dist/*.js', 'dist/*.css')
        .pipe(changed('dist'))
        .pipe(cache('concat-js-css'))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Watch
gulp.task('watch', function() {

    gulp.watch('src/**/*.scss', 'src/*.scss', ['sass']);

    gulp.watch('src/*.css', 'src/**/*.css', ['autoprefix']);

    gulp.watch('src/*.css', 'src/**/*.css', ['minify-css']);

    gulp.watch('src/images/*', ['minify-images']);

    gulp.watch('src/*.js', 'src/**/*.js', ['compress-js']);

    gulp.watch('dist/*.js', 'dist/*.css', ['concat-js-css']);

});