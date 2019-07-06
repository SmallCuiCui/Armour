
//注意此处参数一为一个数组
require(["config"],()=>{
	require(["url","template","header","bootstrap"],(url,template,header) =>{

		class Newlist{
			constructor(){

				// 分页当前页面为1
				this.pageIndex = 1;
				// 一页显示20个商品
				this.count = 20;

				//初始化商品数据
				this.initShopList("all");

				//渲染页面导航,页面名称
				this.renderPageNav();

				//渲染用户已选条件
				this.renderCondition();


				this.bindEvents();

				//初始化一个空的条件数组,存放筛选条件
				//前七个存放可选，第八个存放删除所有
				this.condition = [];
				localStorage.setItem("condition",JSON.stringify(this.condition));
			}

			// 根据条件获取满足条件的商品数据列表
			initShopList(condition){
				// 每次筛选之后，商品显示数量恢复为20
				this.count = 20;
				// 价格由低到高排序
				if(condition === "lowPrice"){
					this.listAll.sort(this.sortBy('low'));
					this.selectList = this.listAll;
					// this.renderShop()
				}else if(condition === "highPrice"){//价格由高到低排序
					this.listAll.sort(this.sortBy('high'))
					this.selectList = this.listAll;
					// this.renderShop()
				}else if(condition === "all"){
					// 重新获取数据
					$.ajax({
						url:url.baseListUrl + 'hotList',
						type:"get",
						dataType:"json",
						success:data =>{
							if(data.res_code == 1){
								this.listAll = data.res_body.list;
								this.selectList = this.listAll;
								// 此处由于异步，所以需要单独渲染页面
								// this.renderShop()
								this.count = 20;
								this.renderByMove();
							}
						}
					})
				}else{//价格区间筛选-过滤
					let price = condition.split('-');
					let min = Number(price[0].slice(1));
					let max = Number(price[1].slice(1));
					this.selectList = this.listAll.filter(function(item){
						return item.price <= max && item.price >= min;
					})
					// this.renderShop()
				}

				// this.renderByMove();
			}

			// 分页渲染商品，以及分页列表
			// selectList是当前所有满足筛选条件的商品列表
			renderShop(){
				this.pageCount = parseInt(this.selectList.length/20);

				// 渲染数据
				let pageList = this.selectList.filter((item,index) =>{
					let min = (this.pageIndex - 1) *20;
					let max = this.pageIndex * 20 -1;
					return index >= min && index <= max;
				});
				$("#mainWrap").html(template('newlist-template',{list:pageList}));

				// 渲染分页导航,渲染前先删除原有
				$(".pageLi").each((index,item)=>{
					item.remove();
				})
				for(let i=1;i<=this.pageCount;i++){
					if(i == this.pageIndex){
						$(".Next").before('<li class="pageLi ac"><a href="javascript:;">'+i+'</a></li>');
					}else{
						$(".Next").before('<li class="pageLi"><a href="javascript:;">'+i+'</a></li>');
					}
				}

			}

			// 滚动鼠标自动加载
			renderByMove(){
				// 此处不能直接将数组赋值给pageList,对象的赋值属于引用赋值，会影响selectList的长度
				let pageList = this.selectList.filter(function(item,index){
					return true;
				});
             	pageList.length = this.count;
             	$("#mainWrap").html(template('newlist-template',{list:pageList}));
				
			}

			// 商品排序方法，由低到高/由高到低
			sortBy(condition){
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
						_this.initShopList(text);
					}
					// 价格排序
					if($(this).parents('ol[data-index]').attr('data-index') == 6){
						let sort = $(this).attr('class');
						_this.initShopList(sort);
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
					_this.initShopList("all");
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

				// 点击分页导航
				// 点击前一页
				$(".pagination").on("click",".Previous",function(){
					if(--_this.pageIndex < 1)_this.pageIndex = 1;
					_this.renderShop();
				})
				// 点击某一页
				$(".pagination").on("click",".pageLi",function(){
					_this.pageIndex = Number($(this).text());
					$(this).addClass("ac").siblings().removeClass('ac');
					_this.renderShop();
					
				})

				// 点击后一页
				$(".pagination").on("click",".Next",function(){
					if(++_this.pageIndex > _this.pageCount)_this.pageIndex = _this.pageCount;
					_this.renderShop();
				})

				// 滚动加载商品
				//页面可视区域高度
				var winH = $(window).height(); 
				$(window).scroll(()=>{
					// 内容高度
					var pageH = $(document.body).height();
					//滚动条位置
                    var scrollT = $(window).scrollTop();

                    console.log(winH,pageH,scrollT);
                    var aa = (pageH - winH - scrollT) / winH;
                     if (aa < 0.02) {
                     	console.log(this.count);

                     	this.count += 20;
                     	
                     	if(this.count > this.selectList.length){
                     		this.count = this.selectList.length;
                     		this.renderByMove();
                     		$(".nodata").show().html("别再滚了，我是有底线的。。。");
                     	}else{
                     		$(".nodata").show().html("加载中。。。"); 
                     		setTimeout(()=>{
                     			this.renderByMove();
                     		},500)
                     	}
                     	
                     	
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