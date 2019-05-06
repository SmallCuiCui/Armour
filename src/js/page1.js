require(["config"], () =>{
	class Page1{
		constructor(){
			this.main = document.querySelector(".main");
			this.init();
		}
		init(){
			//此处引入模块中路径不正确，footer与header使用的是相对于index.html的绝对路径，
			
			/*require(["header","footer"],(header,footer) =>{
				this.main.innerHtml = "头部与尾部成功加载";
			})*/
		}
	}

	new Page1();
})