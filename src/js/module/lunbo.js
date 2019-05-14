//轮播图模块
define(["jquery","template","swiper"], ($,template,Swipter) =>{
	class Lunbo{
		constructor(){
			//轮播容器，规定容器为#banner
			this.container = $("#banner");

		}
		
		//引入模块后调用，并传入轮播图片路径 数组
		render(images){
			this.images = images;
			//现将模板引入到容器，再进行数据渲染，渲染数据之后调用轮播
			this.container.load("/htmls/module/lunbo.html",() =>{
				//load异步加载
				
				this.container.html(template("lunboModle",{list:images}));
				this.banner();//插件方法实现轮播
			})
		}

		banner(){
			var mySwiper = new Swipter(".swiper-container",{
				autoplay:true,//自动播放
				loop:true,//循环播放
				//分页
				pagination:{
					el:'.swiper-pagination',
					clickable:true
				},
				//前后切换按钮
				navigation:{
					nextEl:'.swiper-button-next',
					prevEl:'.swiper-button-prev'
				}
			})
		}


	}
	return new Lunbo();

})