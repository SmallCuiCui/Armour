require.config({
	baseUrl:"/",//此处表示根目录
	paths:{
		"header":"js/module/header",
		"footer":"js/module/footer",
		"lunbo":"js/module/lunbo",
		"people":"js/module/people",
		"shopDis":"js/module/shopDis",
		"tools":"libs/tools",
		"url":"js/module/url",
		"jquery":"libs/jquery/jquery-3.2.1",
		"template":"libs/art-template/template-web",
		"cookie":"libs/jquery-plugins/jquery.cookie",
		"fly":"libs/jquery-plugins/jquery.fly",//添加购物车时的动画效果
		"zoom":"libs/jquery-plugins/jquery.elevateZoom-3.0.8.min",//放大镜插件
		"swiper":"libs/swiper/js/swiper"//轮播图插件
	},
	// 垫片， 给不满足AMD规范的插件又要依赖于别的模块
	//不满足AMD规范，需要垫片，在使用的时候$.cookie方式使用
	//zoom文件引入后，相当于在$的原型上新增一个方法,所有$()选择的元素为一个实例，就可以调用原型上的方法了
	shim:{
		"cookie":{
			deps:['jquery']
		},
		"zoom":{
			deps:['jquery']
		},
		"fly" : {
			deps: ['jquery']
		}
	}
})