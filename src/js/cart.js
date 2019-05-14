require(["config"],()=>{

	require(["template","shopDis"], (template,shopdis) =>{
		class Cart{
			constructor(){
				this.all = $("#allBtn");
				this.tbody = $("tbody");
				this.checks = $(".checkBtns")
				this.render();
			}
			render(){

				//渲染购物车下面的猜你喜欢商品
				shopdis.render('hotList');
			}
			bindEvent(){
				this.tbody.on("click",()=>{
					
				})
			}
		}

		new Cart();
	})
})