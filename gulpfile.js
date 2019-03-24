const gulp = require('gulp'),
    newer = require('gulp-newer'),
    git = require('gulp-git'),
    args = require('yargs').argv;
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    uglify = require('gulp-uglify'),
    imagein = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),
    deploy = require('gulp-gh-pages'),
    devBuild = (process.env.NODE_ENV !== 'production'),
    folder = {
        src: '',
        build: 'dist/'
    }
;
gulp.task('images', function() {
    var out = folder.build + 'images/';
    return gulp.src(folder.src + 'images/*').pipe(newer(out)).pipe(imagein({ optimizationLevel: 5 })).pipe(gulp.dest(out)).pipe(livereload());
});
gulp.task('html', function() {
    var out = folder.build;
    var page = gulp.src(folder.src + '*.html').pipe(newer(out));
    page = page.pipe(htmlclean());
    return page.pipe(gulp.dest(out));
});
gulp.task('css', function(){
    var postCssOpts = [
       assets({loadPaths: ['images/']}),
       autoprefixer({ browsers: ['last 2 versions', '> 2%']}),
       mqpacker
    ];
    postCssOpts.push(cssnano);
    return gulp.src(folder.src + 'css/*').pipe(newer(folder.build + 'css/')).pipe(postcss(postCssOpts)).pipe(gulp.dest(folder.build + 'css/'));
});
gulp.task('js', function() {
    return gulp.src(folder.src + 'js/*').pipe(newer(folder.build + 'js/')).pipe(uglify()).pipe(gulp.dest(folder.build + 'js/')).pipe(livereload());
});
gulp.task('extras', function(){
    return gulp.src(folder.src + 'sitemap.xml',).pipe(gulp.dest(folder.build));
});
gulp.task('build', gulp.series('js', 'html', 'images', 'css', 'extras'));
gulp.task('run', function(){
    gulp.watch(folder.src + 'images/*', gulp.series('images'));
    gulp.watch(folder.src + 'js/*', gulp.series('js'));
    gulp.watch(folder.src + 'html/*', gulp.series('html'));
    gulp.watch(folder.src + 'css/*', gulp.series('css'));
});
gulp.task('deploy', gulp.series('build', function() {
    return gulp.src('./dist/**/*').pipe(deploy());
}));
gulp.task('default', gulp.series('run'));