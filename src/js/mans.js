require(["config"], () =>{
	require(["url","template","header","footer"] ,(url,template,header,footer) =>{
		class Mans{
			constructor(){
				this.showWrap = $("#showWrap");

				this.getData();
			}
			getData(){
				$.ajax({
					url:url.baseListUrl + "mans",
					type:"get",
					dataType:"json",
					success: data =>{

						if(data.res_code === 1){
							let list = data.res_body.list;
							$("#showWrap").html(template("recommandShop",{list}))
						}
					}
				})

				$.ajax({
					url:url.baseListUrl + "mansTow",
					type:"get",
					dataType:"json",
					success: data =>{

						if(data.res_code === 1){
							console.log(data.res_body.list);
							let list = data.res_body.list;
							$("#towmodoWrap").html(template("towmodo",{list}))
						}
					}
				})

				$.ajax({
					url:url.baseListUrl + "mansThree",
					type:"get",
					dataType:"json",
					success: data =>{

						if(data.res_code == 1){
							console.log(data.res_body.list);
							let list = data.res_body.list;
							$("#threemodoWrap").html(template("threemodo",{list}))
						}
					}
				})
			}
		}

		new Mans();
	})
})