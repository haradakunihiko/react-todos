var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var duration = require('gulp-duration');
var gulpUtil = require('gulp-util');

var buildScript = function(watch){
    var bundler = browserify(['./src/app.js'],{
        cache:{},
        packageCache:{},
        verbose:true,
        debug:true
    });
    if(watch){
        bundler = watchify(bundler);
    }
    bundler.transform(reactify);

    var rebundle = function(){
        gulpUtil.log('start bundle');
        return bundler.bundle()
        .on('error',function(err){
                console.log(err.message);
                this.emit('end');
            })
        .pipe(source('bundle.js'))
        .pipe(duration('rebuilding files'))
        .pipe(gulp.dest('./build/'));
    }

    bundler.on('update',rebundle);
    return rebundle();
}

gulp.task('build', function() {
    return buildScript(false);
});
gulp.task('watch', function() {
    return buildScript(true);
});
