
//header模块
define(["jquery"], $ =>{
	class Header{
		constructor(){
			this.container = $("header");
			this.load();
		}
		load(){
			/*tools.ajaxGetPromise("/htmls/module/header.html",null,false).then(html =>{
				this.container.innerHTML = html;
			})*/
			this.container.load("/htmls/module/header.html");
		}
	}
	return new Header();
	
})