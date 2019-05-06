const gulp = require('gulp'),
	  jsMini = require('gulp-uglify'),//压缩js
	  gulpSass = require('gulp-sass'),//sass转css 
	  cssMini = require('gulp-minify-css'),//压缩css
	  htmlMini = require('gulp-htmlmin'),//压缩html
	  babel = require('gulp-babel'),
	  connect = require('gulp-connect');

//制定css任务，先将sass文件转成css，再压缩css文件，最后放到dist/css文件夹下
gulp.task('css',()=>{

	//src取文件源
	//pipe管道，文件传输，在传输过程中可对文件进行操作
	gulp.src('src/css/*.scss')
		.pipe(gulpSass())//sass转css
		.pipe(cssMini())//压缩css
		.pipe(gulp.dest('dist/css'))//将压缩文件放到dist文件夹下的css文件夹下
		.pipe(connect.reload());
	});

//html压缩
gulp.task('html',()=>{
	gulp.src('src/**/*.html')//**表示任意文件夹  *表示任意文件
	.pipe(htmlMini({
			 removeComments: true,//清除HTML注释
	        collapseWhitespace: true,//压缩HTML
	        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input checked />
	        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
	        removeStyleLinkTypeAttributes: true//删除<style>和<link>的type="text/css"
    }))
	.pipe(gulp.dest('dist'))//直接存放在dist目录下，会按照打开的文件生成
	.pipe(connect.reload());
});

//js任务，取出js，ES6转换为ES5(babel） 压缩
gulp.task("js",()=>{
	gulp.src('src/js/**/*.js')
		.pipe(babel({
			presets:['@babel/env']
		}))
		.pipe(jsMini())
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());

});

//libs任务，直接将文件放入dist即可
gulp.task("libs",()=>{
	gulp.src('src/libs/**/*')
	.pipe(gulp.dest('dist/libs'));
});

gulp.task("font",()=>{
	gulp.src('src/font/**/*')
	.pipe(gulp.dest('dist/font'));
});

//images任务
gulp.task('images',()=>{
	gulp.src('src/images/**/*')
		.pipe(gulp.dest('dist/images'));
});

//制定开启服务器的任务
gulp.task('server',()=>{
	connect.server({
		root:"dist",//项目执行根目录，注意是上线目录dist，而不是Armour
		port:2333,
		livereload:true //支持热更新，但是还没有实现，在任务执行的后面添加重新加载
	});
}) 

//制定一个监听任务，代码改动时任务立即执行
gulp.task('watch',()=>{
	//监听所有html，如果有改动，则html任务自动执行
	gulp.watch('src/**/*.html',['html']);
	gulp.watch('src/js/**/*.js',['js']);
	gulp.watch('src/css/**/*.scss',['css']);
})

//任务集中在default执行
gulp.task('default',['html','css','js','libs','font','images','server','watch']);