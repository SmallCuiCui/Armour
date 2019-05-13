
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
	}
	return new Header();
	
})