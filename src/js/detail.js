require(["config"],()=>{
	require(["url","template","header","footer","zoom","fly"],(url,template,header,footer)=>{
		//console.dir($);
		class Detail{
			constructor(){
				this.container = $("#detaiContainer")

				this.init();
				
			}
			//根据id请求得到数据
			init(){
				let id = Number(location.search.slice(4));
				//let id = 4;
				$.get(url.baseListUrl + 'hotList',res =>{
					if(res.res_code === 1){
						var data = Array.from(res.res_body.list).filter( item =>{
							return item.id == id;
						})[0];
						this.data = data;
						this.render();
					}

				})
			}
			render(){
				let data = this.data;
				this.container.html(template('detailModle',{data}));
				//数据渲染之后再绑定事件
				this.bindEvent();
				//放大镜
				this.zoom();
			}
			bindEvent(){
				//点击加号
				$("#addBtn").on("click",()=>{
					let num = Number($("#numWrap").html());
					$("#numWrap").html(++num);
				})
				//点击减号
				$("#subBtn").on("click",()=>{
					let num = Number($("#numWrap").html());
					if(--num<1)num = 1;
					$("#numWrap").html(num);
				})

				//点击添加购物车
				$("#addCart").on("click",()=>{
					this.addcart();
					//alert("正在实现中。。。")
				})

				//点击立即购买
				$("#shopNow").on("click",()=>{
					alert("正在实现中。。。")
				})
			}
			addcart(){
				console.log(this.data);

				//生成一张下图片，滑动到购物车的位置
				$(`<img src = '${this.data.images[0]}' style = 'width:30px;height:30px;'>`).fly({
					start:{
						left:$("#addCart").clientX,
						top:$("#addCart").clientY
					},
					end:{
						left:$("#cart").offset().left,
						top:$("#cart").offset().top
					},
					//结束后消失
					onEnd:function(){

					}
				})
			}

			zoom(){
				// 点击切换+放大镜 插件
				//大图
				$(".zoom-img").elevateZoom({
					gallery:'gal1',//小图容器
					cursor: 'pointer',
					galleryActiveClass: 'active',
					borderSize:'1',    
					borderColor:'#888'
				});
			}
		}
		new Detail();
	})
})