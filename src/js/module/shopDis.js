
//商品展示 模块  在推荐商品，热卖商品，购物车下都会展示商品
define(["jquery","template","url"], ($,template,url) =>{
	class Shopdis{
		constructor(){

		}

		//外部调用接口，传入数据接口
		render(dataUrl) {
			$.ajax({
				url:url.baseListUrl + dataUrl,
				type:"get",
				dataType:"json",
				success:data =>{

					if(data.res_code == 1){
						//调用页面有固定的模板存在
						let list = data.res_body.list;
						$("#mainWrap").html(template('newlist-template',{list}));
					}
				}
			})
		}

		//仅渲染8个
		renderLess(dataUrl){
			$.ajax({
				url:url.baseListUrl + dataUrl,
				type:"get",
				dataType:"json",
				success:data =>{

					if(data.res_code == 1){
						//调用页面有固定的模板存在
						let list = data.res_body.list;
						list.length = 8;
						$("#mainWrap").html(template('newlist-template',{list}));
					}
				}
			})
		}
	}

	return new Shopdis();
})