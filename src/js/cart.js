require(["config"],()=>{

	require(["jquery","template","url"], ($,template,url) =>{
		class Cart{
			constructor(){
				this.all = $("#allBtn");
				this.tbody = $("tbody");
				this.allBtn = $("#allBtn");

				//选中商品数量 
				this.checknum = 0;

				//商品列表数量 ，tr数量 购物车中商品数
				this.num = 0;

				this.render();
				this.bindEvent();

				//渲染购物车下面的猜你喜欢商品
				this.renderLess();
			}
			//渲染商品列表
			render(){
				// let cart = JSON.parse(localStorage.getItem('cart'));
				this.user = JSON.parse(localStorage.getItem('user'));
				let cart = this.user.cart;
				//购物车先判断存在，然后再判断有没有东西
				if(cart){
					if(cart.length > 0){
						this.num = cart.length;
						$("#shopList").show();
						$("#noGoods").hide();

						// 将商品删选一遍，状态为cart以及confirm的进行渲染，状态为order的商品进行过滤
						/*this.cart = cart.filter(function(item) {
							// return item.status === "order";
							return item.status === "cart" || item.status === "confirm";
						});*/
						this.cart = cart;
					}else{
						$("#shopList").hide();
						$("#noGoods").show();
					}
				}else{
					$("#shopList").hide();
					$("#noGoods").show();
				}


				let list = this.cart;
				this.tbody.html(template("cartModel",{list}));

				//渲染商品选中数量
				$(".checkBox").html(this.checknum);

				//渲染合计
				this.calcAllMoney();
			}
			renderLess(){
				$.ajax({
					url:url.baseListUrl + 'hotList',
					type:"get",
					dataType:"json",
					success:data =>{

						if(data.res_code == 1){
							//调用页面有固定的模板存在
							let list = data.res_body.list;
							list.length = 8;
							$("#mainWrap").html(template('newlist-template',{list}));
						}
					}
				})
			}
			bindEvent(){
				let _this = this;

				// 鼠标滚动时固定头部导航
				$(document).ready(function(){
					$(window).scroll(function(){
		                var scrollPos=$(window).scrollTop();
		                if(scrollPos >=34){
		                    $("header nav").addClass("fixed");
		                }else{
		                    $("header nav").removeClass("fixed");
		                }
		            });
				})

				//颜色，尺码选择
				this.tbody.on("click",".checkLi",function(e){

					$(this).toggleClass('show');
					$(this).siblings('li').toggleClass('show');
					$(this).parent().children('li:first-child').addClass('show');
					$(this).find('i').toggleClass('hidden');

					let checkdata = $(this).find('span').html();
					$(this).parent().children('li:first-child').find('span').html(checkdata);
					$(this).parent().children('li:first-child').find('div').css("background-color",checkdata);

				})

				//点击编辑
				this.tbody.on("click",'.editBtn',function(e){
					$(this).parents('tr').toggleClass('edit');
				})

				//点击删除，采用全部渲染
				this.tbody.on("click",'.delBtn',function(e){
					if(confirm("确定删除吗？")){
						let shopIndex = Number($(this).parent().parent().attr('data-index'));
						//从cart中 删除shopIndex 重新存本地localstorage 重新渲染
						_this.cart.splice(shopIndex,1);

						_this.user.cart = _this.cart;
						// localStorage.setItem('cart',JSON.stringify(_this.cart));
						localStorage.setItem('user',JSON.stringify(_this.user));

						_this.render();
						//$(this).parent().parent().remove();
						_this.calcAllMoney();
					}
					
				})

				//点击确定，购物车重新渲染
				this.tbody.on("click",'.okBtn',function(e){

					//更新数据
					let shopIndex = Number($(this).parents('tr').attr('data-index'));
					_this.cart[shopIndex].size = $(this).parents('tr').find("#sizeSpan").html();
					_this.cart[shopIndex].color = $(this).parents('tr').find("#colorSpan").html();
					_this.cart[shopIndex].num = Number($(".numFont").html());

					// 判断是存在相同商品(id，color，size都相同的商品)需要合并
					let ItemCart = _this.cart[shopIndex];
					_this.cart.splice(shopIndex, 1);
					
					let _index = -1;
					if(_this.cart.some(function(shop,i){
						_index = i;
						return shop.id === ItemCart.id && shop.size === ItemCart.size && shop.color === ItemCart.color;
					})){
						_this.cart[_index].num += ItemCart.num;
					}else{
						_this.cart.push(ItemCart);
					}

					_this.user.cart = _this.cart;
					// localStorage.setItem('cart',JSON.stringify(_this.cart));
					localStorage.setItem('user',JSON.stringify(_this.user));
					_this.render();
					_this.calcAllMoney();
					/*console.log($(this).parents('tr')[0]);
					$(this).parents('tr').toggleClass('edit');*/
				})

				//点击商品选择框
				this.tbody.on("click",'.checkShop',function(e){
					$(this).find('i').toggleClass('ischeck');
					if($(this).find('i').hasClass('ischeck')){
						_this.checknum ++;
					}else{
						_this.checknum --;
					}

					//判断是否选中全选框
					if(_this.checknum === _this.num){
						$("#allBtn").find('i').addClass('ischeck');
					}else{
						$("#allBtn").find('i').removeClass('ischeck');
					}

					_this.calcAllMoney();
				})

				//点击商品全选
				$("#allBtn").on("click",function(e){
					$(this).find('i').toggleClass('ischeck');
					//全选
					if($(this).find('i').hasClass('ischeck')){
						$(".checkShop").find('i').addClass('ischeck');
						_this.checknum = _this.cart.length;
					}else{//全不选
						$(".checkShop").find('i').removeClass('ischeck');
						_this.checknum = 0;
					}

					$(".checkBox").html(_this.checknum);
					_this.calcAllMoney();
				})

				//编辑状态下点击减号
				this.tbody.on("click",'.jianSpan',function(e){
					let num = $(this).siblings('font').html();
					if(--num<1)num = 1;
					$(this).siblings('font').html(num);


				})
				//编辑状态下点击加
				this.tbody.on("click",'.jiaSpan',function(e){
					let num = $(this).siblings('font').html();
					$(this).siblings('font').html(++num);

				})

				// 点击立即结算
				$("#confirmBtn").on("click",function(){
					
					let num = $(".ischeck").parents("tr[data-index]").length;
					if(num === 0){
						alert("您还未选中任何商品！");
					}else{
						// 更改选中商品的status为confirm状态，未选中商品的status为cart
						$("tr[data-index]").each(function(){
							let data_index = Number($(this).attr("data-index"));
							if($(this).find(".iconfont").hasClass("ischeck")){
								_this.cart[data_index].status = "confirm";
							}else{
								_this.cart[data_index].status = "cart";
							}
						});
						_this.user.cart = _this.cart;
						// localStorage.setItem('cart',JSON.stringify(_this.cart));
						localStorage.setItem('user',JSON.stringify(_this.user));
						location.href = "/htmls/confirmOrder.html";
					}
					
				})

				
			}
			//计算总价
			calcAllMoney(){
				let allMoney = 0;
				$(".checkShop i").each((index,item) =>{
					//each遍历之后得到原生DOM元素

					if(item.classList.contains('ischeck')){
						let tr = item.parentNode.parentNode.parentNode;
						let xiaoji = Number(tr.querySelector(".xiaoji").innerHTML);
						allMoney += xiaoji;
					}
				})

				$("#allMoneyBox").html(allMoney);

			}
		}

		new Cart();
	})
})


