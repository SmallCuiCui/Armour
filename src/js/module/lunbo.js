//轮播图模块
define(["jquery","template"], ($,template) =>{
	class Lunbo{
		constructor(){
			//轮播容器
			this.container = $("#banner");

			//获取屏幕宽度(可用工作区的宽度)用于轮播的
			this.width = window.screen.availWidth;

			this.index = 0;//当前播放图片
			this.next = 0;//即将显示图片
			this.timer = null; //定时器
		}
		
		load(){
			return new Promise(resolve =>{
				this.container.load("/htmls/module/lunbo.html",() =>{
					//load异步加载
					resolve();
				});
			})	
		}
		//引入模块时调用，并传入轮播图片路径 数组
		render(images){
			this.images = images;
			this.load().then( ()=>{
				this.container.html(template("lunboModle",{list:images}));
				this.autoPlay();
			})
			
		}

		autoPlay(){
			$("#lunboUl .imgWrap:nth-child(1)").addClass("first");
			this.timer = setInterval(() =>{
				this.next ++;
				if(this.next >= this.images.length)this.next = 0;
				this.srcollplay();
				this.index = this.next;
			},4000);
		}

		srcollplay(){
			//console.log(this.next);
			//console.log(this.index);
			
			//	向左滑,即将显示小于当前显示
			if(this.index < this.next){
			
			//		stop(true,true):关掉所有附带效果
			$("#lunboUl .imgWrap").eq(this.index).stop(true,true).animate({"left":-this.width+"px"});
			$("#lunboUl .imgWrap").eq(this.next).css("left","720px").stop(true,true).animate({"left":"0px"})
		}
			//	向左滑,即将显示大于当前显示	
			else if(this.index > this.next){
				$("#lunboUl .imgWrap").eq(this.index).stop(true,true).animate({"left":this.width+"px"});
				$("#lunboUl .imgWrap").eq(this.next).css("left","-720px").stop(true,true).animate({"left":"0px"})
			}

			//	处理圆点填充 siblings()过滤掉不需要添加的元素
			$("#list li").eq(this.next).addClass("white").siblings().removeClass("white");
		}
	}
	return new Lunbo();

})