var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function(){
  return gulp.src('sass/**/*.sass')
    .pipe(sass().on('error',sass.logError))
    .pipe(autoprefixer(['last 15 versions','>1%','ie 8','ie 7'],{cascade: true}))
    .pipe(gulp.dest('css'));
});

gulp.task('scripts', function(){
  return gulp.src([
    'libs/jquery/dist/jquery.min.js',
    'libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    'libs/bootstrap/dist/js/bootstrap.min.js',
    'libs/matchHeight/dist/jquery.matchHeight-min.js',
    'libs/bootstrap-fileinput/js/fileinput.min.js',
    'libs/sweetalert/dist/sweetalert.min.js',
    'libs/bootstrap-star-rating/js/star-rating.min.js',

  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('js'));
});

gulp.task('fonts',function(){
  return gulp.src([
    'libs/font-awesome/fonts/**/*',
    'libs/bootstrap/fonts/**/*',
  ])
  .pipe(gulp.dest('fonts'));
});

gulp.task('css-libs',['sass'], function(){
		return gulp.src('css/libs.css')
		.pipe(cssnano())
		.pipe(rename({
			suffix:'.min'
		}))
		.pipe(gulp.dest('css'));
});

gulp.task('clean', function(){
  return del.sync('dist');
});

gulp.task('clear', function(){
  return cache.clearAll();
});

gulp.task('img', function(){
  return gulp.src('img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['css-libs','scripts','fonts'], function(){
	gulp.watch('sass/**/*.sass',['sass']);
});

gulp.task('build', ['clean', 'img', 'css-libs', 'scripts','fonts'], function(){

  var buildCss= gulp.src([
    'css/style.css',
    'css/libs.min.css',
  ])
    .pipe(gulp.dest('dist/css'));
  var buildfonts = gulp.src('fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  var buildJs = gulp.src('js/**/*')
    .pipe(gulp.dest('dist/js'));
  var builHtml = gulp.src('../views/*.jade')
    .pipe(gulp.dest('dist/views'));

});
