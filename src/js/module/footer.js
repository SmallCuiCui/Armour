define(["tools"],tools =>{
	class Footer{
		constructor(){
			this.container = document.querySelector("footer");
			this.load();
		}
		load(){
			tools.ajaxGetPromise("htmls/module/footer.html",null,false).then(html =>{
				this.container.innerHTML = html;
			})
		}
	}
	return new Footer();
	
})