/**
  学习目标：
      1. 学习拷贝
      2. 编译样式(less)
      3. babel 编译
      4. 压缩图片
 */
const {
  src,
  dest,
  parallel
} = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const ejs = require('gulp-ejs');
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
exports.styles = styles;
exports.default = copyTask;
exports.scripts = scripts;
exports.html = html;
const compile = parallel(styles, scripts, html);
exports.compile = compile;
exports.images = images; // 有node版本限制的问题
exports.static = static; // 有node版本限制的问题
const build = parallel(compile, static);
exports.build = build;