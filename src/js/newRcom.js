
//注意此处参数一为一个数组
require(["config"],()=>{
	require(["url","template","header","footer","jquery","shopDis"],(url,template,header,footer,$,shopdis) =>{

		class Newlist{
			constructor(){

				this.render();
				this.bindEvents();
			}
			render(){

				//渲染商品列表
				shopdis.render('hotList');
			}
			bindEvents(){
				$("#shopNav").on("click", e =>{
					if(e.target.parentNode.nodeName === "LI"){
						let index = e.target.parentNode.getAttribute("data-index");
						
						//采用filter过滤
						let cssDiplsy = $("#shopSelect ol").filter(function(){
							return $(this).attr("data-index") == index;
						}).css("display");

						if(cssDiplsy == "none"){
							$("#shopSelect").css("display","block");
							$("#shopSelect ol").filter(function(){
								return $(this).attr("data-index") == index;
							}).css("display","flex").siblings().css("display","none");
						}else{
							$("#shopSelect").css("display","none");
							$("#shopSelect ol").map(function(){
								$(this).css("display","none");
							});
						}
						

						//采用map
						/*$("#shopSelect ol").map(function(){
							if($(this).attr("data-index") == index){
								$(this).css("display","block").siblings().css("display","none");
							}
						})*/
					}
				})

				$("#shopSelect").on("click",function(e){
					console.log(e.target.innerHTML);
				})
			}
		}
		new Newlist();

	});
})