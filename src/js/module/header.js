
//header模块
define(["jquery","template","cookie"], ($ ,template) =>{
	class Header{
		constructor(){
			this.container = $("header");
			this.load();
		}
		load(){
			this.container.load("/htmls/module/header.html", ()=>{

				//绑定事件
				this.bindEvent();

				//取得kooie，判断是否登录
				this.showUser();

				/*//渲染购物车预览
				this.renderSmallCart()*/

				//计算购物车数量
				this.calcCartNum();
			});
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

			//点击进入男子装备页面
			$("#man").on("click",() =>{
				//设置页面mans,womans,child
				$.cookie("html","mans",{path:'/'});
			})
			//点击进入女子装备页面
			$("#woman").on("click",() =>{
				//设置页面mans,womans,child
				$.cookie("html","womans",{path:'/'});
			})
			//点击进入少年装备页面
			$("#child").on("click",() =>{
				//设置页面mans,womans,child
				$.cookie("html","child",{path:'/'});
			})

			//点击退出登录
			$("#outLogin").on("click",()=>{
				// 阻止冒泡
				event.stopPropagation();
				$.cookie("username","",{path:'/'});
				alert("退出登录成功，即将跳转首页！");
				location.href = '/';
				// 退出登录时，无需清空购物车数据
				/*localStorage.removeItem('cart');
				this.calcCartNum();*/
				this.showUser();
			})

			//点击商品预览的删除商品
			$("#smallCart").on("click",".delBtn",function(){
				let index = Number($(this).parents('li').attr('data-index'));
				_this.cart.splice(index,1);
				let cart = _this.cart;
				localStorage.setItem("cart",JSON.stringify(cart));
				//重新渲染购物车预览 与 购物车上面的数量
				_this.renderSmallCart();
				_this.calcCartNum();
				console.log(_this.cart);
			})

			// 购物车hover事件，采用css写与js存在冲突
			$("#cartLi").mouseenter(function (){  
				_this.renderSmallCart();
			 }).mouseleave(function (){  
				$("#smallCart").hide();
			});  
		}

		renderSmallCart(){
			let user = localStorage.getItem('user');
			if(user){
				this.cart = JSON.parse(user).cart;
				if(this.cart.length == 0){//购物车为空，预览不显示
					$("#smallCart").hide();
				}else{
					$("#smallCart").show();
					let list = this.cart;
					$("#smallCart").html(template("smallCartModel",{list}));

					//计算预览购物车商品总价
					let allMoney = 0;
					this.cart.forEach(item=>{
						allMoney += item.num * item.price;
					})
					$("#cartTotalMoney").html(allMoney);
				}
			}else{//购物车没有，预览不显示
				$("#smallCart").hide();
			}
		}

		showUser(){
			if($.cookie("username")){//存在登录,显示用户与购物车
				$("#userLi").show();
				$("#login").hide();
				$("#cartLi").show();

				$("#userSpan").html($.cookie("username"));
			}else{
				$("#login").show();
				$("#cartLi").hide();
				$("#userLi").hide();
			}
		}
		//计算购物车商品数量，并渲染
		calcCartNum(){
			let user = localStorage.getItem('user');
			let num = 0;
			if(user){
				let cart = JSON.parse(user).cart;
				if(cart.length>0){
					num = cart.reduce((n, shop) =>{
						n += shop.num;
						return n;
					},0);
				}
				
			}
			$('#cartNum').html(num);
			
		}
	}
	return new Header();
	
})