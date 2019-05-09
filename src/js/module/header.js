
//header模块
define(["jquery"], $ =>{
	class Header{
		constructor(){
			this.container = $("header");
			this.load();
		}
		load(){
			this.container.load("/htmls/module/header.html", ()=>{
				this.bindEvent();
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
		}
	}
	return new Header();
	
})