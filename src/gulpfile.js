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
    devBuild = (process.env.NODE_ENV !== 'production'),
    folder = {
        src: 'src/',
        build: 'build/'
    }
;
gulp.task('images', function() {
    var out = folder.build + 'images/';
    gulp.src(folder.src + 'images/*').pipe(newer(folder.build + 'src/images/')).pipe(gulp.dest(folder.build + 'src/images/'));
    return gulp.src(folder.src + 'images/*').pipe(newer(out)).pipe(imagein({ optimizationLevel: 5 })).pipe(gulp.dest(out)).pipe(livereload());
});
gulp.task('html', function() {
    var out = folder.build;
    var page = gulp.src(folder.src + 'html/*').pipe(newer(out));
    page = page.pipe(htmlclean());
    gulp.src(folder.src + 'html/*').pipe(newer(folder.build + 'src/html/')).pipe(gulp.dest(folder.build + 'src/html/'));
    return page.pipe(gulp.dest(out)).pipe(livereload());
    
});
gulp.task('css', function(){
    var postCssOpts = [
       assets({loadPaths: ['images/']}),
       autoprefixer({ browsers: ['last 2 versions', '> 2%']}),
       mqpacker
    ];
    postCssOpts.push(cssnano);
    gulp.src(folder.src + 'css/*').pipe(newer(folder.build + 'src/css/')).pipe(gulp.dest(folder.build + 'src/css/'));
    return gulp.src(folder.src + 'css/*').pipe(newer(folder.build + 'css/')).pipe(postcss(postCssOpts)).pipe(gulp.dest(folder.build + 'css/')).pipe(livereload());
});
gulp.task('js', function() {
    gulp.src(folder.src + 'js/*').pipe(newer(folder.build + 'src/js/')).pipe(gulp.dest(folder.build + 'src/js/'));
    return gulp.src(folder.src + 'js/*').pipe(newer(folder.build + 'js/')).pipe(uglify()).pipe(gulp.dest(folder.build + 'js/')).pipe(livereload());
});
gulp.task('extras', function(){
    gulp.src(folder.src + '*', folder.src + '!css/*', folder.src + '!js/', folder.src + '!html/*', folder.src + '!images/*').pipe(gulp.dest(folder.build + 'src/'));
    gulp.src('gulpfile.js').pipe(gulp.dest(folder.build + 'src/'));
    gulp.src('package.json').pipe(gulp.dest(folder.build + 'src/'));
    return gulp.src(folder.src + '*', folder.src + '!css/*', folder.src + '!js/*', folder.src + '!html/*', folder.src + '!images/*').pipe(gulp.dest(folder.build));
});
gulp.task('build', gulp.series('js', 'html', 'images', 'css', 'extras'));
gulp.task('run', function(){
    gulp.watch(folder.src + 'images/*', gulp.series('images'));
    gulp.watch(folder.src + 'js/*', gulp.series('js'));
    gulp.watch(folder.src + 'html/*', gulp.series('html'));
    gulp.watch(folder.src + 'css/*', gulp.series('css'));
});
gulp.task('add', function (){
    process.chdir(folder.build);
    return gulp.src('*').pipe(git.add());
});
gulp.task('commit', function (){
    process.chdir(folder.build);
    return gulp.src(folder.build + '*').pipe(git.commit(args.m));
})
gulp.task('push', function(){
    process.chdir(folder.build);
    git.push('https://github.com/jakesnake523/jakesnake523.github.io', 'master', function (err) {
        if (err) throw err;
    });
});
gulp.task('updateSource', function (){
    gulp.src(folder.build + 'src/gulpfile.js').pipe(newer('./')).pipe(gulp.dest('./'));
    gulp.src(folder.build + 'src/package.json').pipe(newer('./')).pipe(gulp.dest('./'));
    return gulp.src(folder.build + 'src/*', folder.build + 'src/!gulpfile.js', folder.build + 'src/!package.json').pipe(newer(folder.src)).pipe(gulp.dest(folder.src));
});
gulp.task('pull', gulp.series(function (){
    process.chdir(folder.build);
    return git.pull('https://github.com/jakesnake523/jakesnake523.github.io', 'master', function (err) {
        if (err) throw err;
    });
}, 'updateSource'));
gulp.task('fetch', function (){
    process.chdir(folder.build);
    git.fetch('origin', '', function (err) {
        if (err) throw err;
    });
});
gulp.task('default', gulp.series('run'));