
//header模块
define(["jquery","cookie"], $ =>{
	class Header{
		constructor(){
			this.container = $("header");
			this.load();
		}
		load(){
			this.container.load("/htmls/module/header.html", ()=>{
				this.bindEvent();
				//取得kooie，判断是否登录
				this.showUser();

				//计算购物车数量
				this.calcCartNum();
			});
		}
		bindEvent(){
			$("#man").on("click",() =>{
				//设置页面mans,womans,child
				$.cookie("html","mans",{path:'/'});
			})

			$("#woman").on("click",() =>{
				//设置页面mans,womans,child
				$.cookie("html","womans",{path:'/'});
			})

			$("#child").on("click",() =>{
				//设置页面mans,womans,child
				$.cookie("html","child",{path:'/'});
			})

			//点击退出登录
			$("#outLogin").on("click",()=>{
				$.cookie("username","",{path:'/'});
				this.showUser();
			})
		}

		showUser(){
			if($.cookie("username")){//存在登录
				$("#userLi").show();
				$("#login").hide();

				$("#userSpan").html($.cookie("username"));
			}else{
				$("#login").show();
				$("#userLi").hide();
			}
		}
		//计算购物车商品数量，并渲染
		calcCartNum(){
			let cart = localStorage.getItem('cart');
			let num = 0;
			if(cart){
				cart = JSON.parse(cart);
				num = cart.reduce((n, shop) =>{
					n += shop.num;
					return n;
				},0);
			}
			$('#cartNum').html(num);
			
		}
	}
	return new Header();
	
})