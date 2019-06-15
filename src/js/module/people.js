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

			// 渲染推荐商品
			$.ajax({
				url:url.baseListUrl + this.data.reconmand,
				type:"get",
				dataType:"json",
				success: data =>{
					if(data.res_code === 1){
						let list = data.res_body.list;
						$("#showWrap").html(template("recommandShop",{list}));
						// 点击切换
						this.bindEvents();
					}
				}
			})

			// 渲染两个模块数据
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

			// 渲染三个模块数据
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

		bindEvents(){
			let _this = this;
			// 点击左切换，margin-left减少
			$("#leftBtn").on("click",function(){
				// 区别Number转换数字
				let mgValue = parseInt($("#showWrap").css('left'));
				// 获取dl宽度，移动宽度
				let width = $("#showWrap dl").outerWidth(true);
				let max_width = $("#showWrap").outerWidth(true) - width;
				if(-mgValue >= max_width){
					return;
				}else{
					$("#showWrap").animate({left:mgValue - width}, 500);
					// $("#showWrap").css('left',mgValue - width);
				}
			})

			// 点击左切换，margin-left减少
			$("#rightBtn").on("click",function(){
				// 区别Number转换数字,获取当前left值
				let mgValue = parseInt($("#showWrap").css('left'));
				// 获取dl宽度，移动宽度
				let width = $("#showWrap dl").outerWidth(true);
				let max_width = $("#showWrap").outerWidth(true) - width;
				if(mgValue >= 0){
					return;
				}else{
					// $("#showWrap").css('left',mgValue + width);
					$("#showWrap").animate({left:mgValue + width}, 500);
				}
			})
		}

	}
	return new People();
})