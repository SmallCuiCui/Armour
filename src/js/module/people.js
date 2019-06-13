define(["jquery","url","template"],($,url,template) =>{
	class People{
		constructor(){
			//渲染男子，女子，少年页面下的数据
		}

		render(data){
			this.data = data;
				//先加载模板到指定页面，再渲染数据
				
				$("#content").load("/htmls/module/people.html",() =>{
					this.getData();
				})
				
			}

			getData(){
				$.ajax({
					url:url.baseListUrl + this.data.reconmand,
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
					url:url.baseListUrl + this.data.peopleTow,
					type:"get",
					dataType:"json",
					success: data =>{

						if(data.res_code === 1){
							let list = data.res_body.list;
							$("#towmodoWrap").html(template("towmodo",{list}))
						}
					}
				})

				$.ajax({
					url:url.baseListUrl + this.data.peopleThree,
					type:"get",
					dataType:"json",
					success: data =>{

						if(data.res_code == 1){
							let list = data.res_body.list;
							$("#threemodoWrap").html(template("threemodo",{list}))
						}
					}
				})
			}

		}
		return new People();
	})