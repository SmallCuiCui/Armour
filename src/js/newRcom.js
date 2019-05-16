
//注意此处参数一为一个数组
require(["config"],()=>{
	require(["url","template","header","footer","jquery","shopDis"],(url,template,header,footer,$,shopdis) =>{

		class Newlist{
			constructor(){

				this.render();
				this.bindEvents();

				//初始化一个空的条件数组
				//前七个存放可选，第八个存放删除所有
				this.condition = [];
				localStorage.setItem("condition",this.condition)
			}
			render(){

				//渲染商品列表
				shopdis.render('hotList');

				//渲染页面导航,页面名称
				this.renderPageNav();

				//渲染条件
				this.renderCondition();
			}
			bindEvents(){
				let _this = this;

				//商品条件分类筛选
				$("#shopNav").on("click",'li', e =>{
					let index = e.target.parentNode.getAttribute("data-index");

					//采用filter过滤
					let cssDiplsy = $("#shopSelect ol").filter(function(){
						return $(this).attr("data-index") == index;
					}).css("display");

					if(cssDiplsy == "none"){
						$("#shopSelect").css("display","block");
						$("#shopSelect ol").filter(function(){
							return $(this).attr("data-index") == index;
						}).css("display","flex").siblings().css("display","none");
					}else{
						$("#shopSelect").css("display","none");
						$("#shopSelect ol").map(function(){
							$(this).css("display","none");
						});
					}

					//采用map
					/*$("#shopSelect ol").map(function(){
						if($(this).attr("data-index") == index){
							$(this).css("display","block").siblings().css("display","none");
						}
					})*/
				})

				//点击选择商品条件,添加到商品列
				$(".checkBtns").on("click",'li',function(e){
					let text = $(this).text();
					let dataIndex = Number($(this).parent().attr('data-index'));
					
					_this.condition[dataIndex] = text;
					localStorage.setItem("condition",_this.condition)

					//第一次添加，要添加清除所有
					if($("#labelBox").html() == ''){
						$("#labelBox").html('<li id="clearAll">清除所有选项</li>');
						$("#labelBox").prepend('<li>'+text+'<i class="iconfont icon-X-copy"></i></li>')
					}else{
						$("#labelBox").prepend('<li>'+text+'<i class="iconfont icon-X-copy"></i></li>')

					}
				})

				//点击清除所有条件
				$("#labelBox").on("click",'#clearAll',function(){
					$("#labelBox").html('');
					_this.condition = [];
				})

				//点击已选条件的删除
				$("#labelBox").on("click",".iconfont",function(){
					if($(this).parents('.labelBox').children().length == 2){
						$("#labelBox").html('');
					}else{
						$(this).parent().remove();
					}
				})
			}

			//渲染页面导航
			renderPageNav(){
				let arrType = location.href.split('?')[1].split('&');
				arrType = arrType.map(function(item){
					return decodeURI(item.split('=')[1]);
				});
				//arrType 为0,2是新品，为1是热卖
				if(arrType[0] == 1){//热卖商品
					$('title').html('热卖商品')
					$("#pagetype").html('热卖商品<span><font>154</font>件商品</span>');
				}else{
					$('title').html('新品推荐')
					$("#pagetype").html('推荐商品<span><font>154</font>件商品</span>');
				}

				arrType.forEach((item ,index)=>{
					if(index==arrType.length-1){//最后一个导航不需要链接
						if(item == 0 || item == 2){
							if(item == 0){
								$("#pageNav").append('<li>新品推荐</li>')
							}else{
								$("#pageNav").append('<li>全部推荐商品</li>')
							}
							
						}else if(item == 1){
							$("#pageNav").append('<li>热卖商品</li>')
						}else{
							$("#pageNav").append('<li>'+item+'</li>')
						}
					}else{
						if(item == 0 || item == 2){
							if(item == 0){
								$("#pageNav").append('<li><a href="/htmls/newRcom.html?type=0">新品推荐</a>/</li>')
							}else{
								$("#pageNav").append('<li><a href="/htmls/newRcom.html?type=0">新品推荐</a>/</li>')
							}
						}else if(item == 1){
							$("#pageNav").append('<li><a href="/htmls/newRcom.html?type=1">热卖商品</a>/</li>')
						}else{
							$("#pageNav").append('<li><a href="/htmls/newRcom.html?type=0?smallType='+item+'">'+item+'</a>/</li>')
						}
						
					}
				})

			}
			//渲染选择的筛选条件
			renderCondition(){

			}
		}
		new Newlist();

	});
})