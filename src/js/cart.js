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