//header模块
define(["tools"],tools =>{
	class Header{
		constructor(){
			this.container = document.querySelector("header");
			this.load();
		}
		load(){
			tools.ajaxGetPromise("htmls/module/header.html",null,false).then(html =>{
				this.container.innerHTML = html;
			})
		}
	}
	return new Header();
	
})