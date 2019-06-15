
//注意此处参数一为一个数组
require(["config"],()=>{
	require(["url","template","header","footer","jquery"],(url,template,header,footer,$) =>{

		class Newlist{
			constructor(){

				this.render();
				this.bindEvents();

				//初始化一个空的条件数组,存放筛选条件
				//前七个存放可选，第八个存放删除所有
				this.condition = [];
				localStorage.setItem("condition",JSON.stringify(this.condition));
			}

			render(){

				//渲染商品列表
				this.renderShop("all");

				//渲染页面导航,页面名称
				this.renderPageNav();

				//渲染条件
				this.renderCondition();
			}
			renderShop(condition){
				// 价格由低到高排序
				if(condition === "lowPrice"){
					this.list.sort(sortBy('low'))
				}else if(condition === "highPrice"){//价格由高到低排序
					this.list.sort(sortBy('high'))
				}else if(condition === "all"){

					// 重新获取数据
					$.ajax({
						url:url.baseListUrl + 'hotList',
						type:"get",
						dataType:"json",
						success:data =>{
							if(data.res_code == 1){
								this.list = data.res_body.list;
								let list = this.list;
								$("#mainWrap").html(template('newlist-template',{list}));
							}
						}
					})
				}else{//价格区间筛选-过滤
					let price = condition.split('-');
					let min = Number(price[0].slice(1));
					let max = Number(price[1].slice(1));
					this.list = this.list.filter(function(item){
						return item.price <= max && item.price >= min;
					})
				}

				let list = this.list;
				$("#mainWrap").html(template('newlist-template',{list}));

				// 商品排序方法，由低到高/由高到低
				function sortBy(condition){
					if(condition === "low"){
						 return function(a,b) {
					        return a.price - b.price;
					    }
					}else if(condition === "high"){
						 return function(a,b) {
					        return b.price - a.price;
					    }
					}
				}
			}

			sortBy(condition){
				if(condition === "low"){
					 return function(a,b) {
					 	console.log(a);
				        return a.price - b.price;
				    }
				}else if(condition === "high"){
					 return function(a,b) {
				        return b.price - a.price;
				    }
				}
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
					// 价格筛选
					if($(this).parents('ol[data-index]').attr('data-index') == 5){
						_this.renderShop(text);
					}
					// 价格排序
					if($(this).parents('ol[data-index]').attr('data-index') == 6){
						let sort = $(this).attr('class');
						_this.renderShop(sort);
					}
					let dataIndex = Number($(this).parent().attr('data-index'));
					_this.condition[dataIndex] = text;
					//只要存在条件，就有清除所有标签
					_this.condition[8] = "清除所有选项";
					//localStorage.setItem("condition",_this.condition);
					localStorage.setItem("condition",JSON.stringify(_this.condition));

					_this.renderCondition();

					//第一次添加，要添加清除所有
					/*if($("#labelBox").html() == ''){
						$("#labelBox").html('<li id="clearAll">清除所有选项</li>');
						$("#labelBox").prepend('<li>'+text+'<i class="iconfont icon-X-copy"></i></li>')
					}else{
						$("#labelBox").prepend('<li>'+text+'<i class="iconfont icon-X-copy"></i></li>')

					}*/
				})

				//点击清除所有条件
				$("#labelBox").on("click",'#clearAll',function(){
					_this.condition = [];
					localStorage.setItem("condition",JSON.stringify(_this.condition));
					_this.renderCondition();
					_this.renderShop("all");
				})

				//点击已选条件的删除
				$("#labelBox").on("click",".iconfont",function(){
					//最后两个标签全部删除
					if($(this).parents('.labelBox').children().length == 2){
						_this.condition = [];
						localStorage.setItem("condition",JSON.stringify(_this.condition));
						_this.renderCondition();
						// $("#labelBox").html('');
					}else{
						let dataIndex = Number($(this).parent().attr("data-index"));
						console.log(dataIndex);
						_this.condition[dataIndex] = "";
						localStorage.setItem("condition",JSON.stringify(_this.condition));
						_this.renderCondition();
						// $(this).parent().remove();
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
				this.condition = localStorage.getItem("condition");
				if(this.condition){
					this.condition = JSON.parse(this.condition);
					let html = "";
					this.condition.forEach((item,index)=>{
						if(item){
							if(index === 8){
								html += '<li id="clearAll" >清除所有选项</li>';
							}else{
								html += '<li data-index='+index+'>'+item+'<i class="iconfont icon-X-copy"></i></li>';
							}
						}
					})
					$("#labelBox").html(html);
				}
			}
		}
		new Newlist();

	});
})