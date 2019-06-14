
//引入需要的模块
require(["config"],() =>{
	require(["header","footer","lunbo","cookie"], (header,footer,lunbo) =>{
		//首页轮播图片
		let bannerImg = ["/images/bg_scroll_1.jpg","images/bg_scroll_2.jpg","/images/bg_scroll_3.jpg"];
		
		//console.dir(lunbo);
		lunbo.render(bannerImg);
	});
})