/**
  学习目标：
      1. 学习拷贝
      2. 编译样式(less)
      3. babel 编译
      4. 压缩图片
      5. copy静态目录
      6. 删除文件
      7. 开发服务器
 */
const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const ejs = require('gulp-ejs');
const gulpClean = require('gulp-clean');
const browserSync = require('browser-sync'); 
const path = require('path');
const browserServer = browserSync.create();
const plugins = require('gulp-load-plugins')();

function copyTask() {
  // console.log('执行拷贝任务');
  return src('src/**/*.js').pipe(dest('dist'));
}

const styles = () => {
  return src("src/styles/*.less", {
      base: 'src'
    })
    .pipe(less())
    .pipe(dest('dist'))
}

const scripts = () => {
  return src("src/scripts/**/*.js", {
      base: 'src'
    }) 
    .pipe(babel({
      presets: ["@babel/preset-env"] 
    })) 
    .pipe(dest('dist')) 
}

const html = () => {
  
  return src("src/*.html", {
      base: 'src'
    }).pipe(ejs({
      title: 'gulp'
    })).pipe(dest('dist')) 
}

const images = async () => {
  let imagemin = await import('gulp-imagemin'); 
  return src("src/assets/**/*.@(jpg|png|gif|svg)", {
      base: 'src'
    }).pipe(imagemin.default()).pipe(dest('dist')) 
}
//拷贝不需要任务编译 处理的静态文件，到输出目录
const static = () => {
  return src("static/**", {base: 'static'})
    .pipe(dest('dist'))
}
const clean = () => {
 
  return src("dist/**", {
      read: false
    }).pipe(gulpClean()) 
}

//  console.log(path.join(process.cwd(), '../node_modules'))
const serve = () => {
  watch("src/styles/*.less", styles); 
  watch("src/scripts/*.js", scripts); 
  watch("src/*.html", html); 
  watch([
    "src/assets/images/**/*.@(jpg|png|gif|svg)",
    "static/**" 
  ], browserServer.reload);
  return browserServer.init({
    notify: false,
    files: ['dist/**'],
    server: {
      baseDir: ['dist', 'src', 'static'],
      routes: {
        '/node_modules': path.join(process.cwd(),'../node_modules')
      } 
    } 
  });
}

const concat = () => {
  //src index.html
  //经过useref处理之后变成 里面有三个文件了index.html build.css build.js
  return src('dist/**/*.html', {
      base: 'dist'
    })
    .pipe(plugins.useref({
      searchPath: ['dist', '../']
    }))
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cleanCss()))
    .pipe(plugins.if('*.html', plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('tem'))
}

exports.styles = styles;
exports.default = copyTask;
exports.scripts = scripts;
exports.html = html;
const compile = parallel(styles, scripts, html);
exports.compile = compile;
exports.images = images; // 有node版本限制的问题
exports.static = static; // 有node版本限制的问题
// const build = parallel(compile, static);
// const build = series(clean, parallel(compile, static));
const dev = series(clean, compile, serve);
const build = series(clean, parallel(series(compile, concat), images, static));
exports.clean = clean;
exports.serve = serve;
exports.build = build;
exports.dev = dev;
