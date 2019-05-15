require(["config"],()=>{
	require(["url","template","header","footer","shopDis","zoom","fly"],(url,template,header,footer,shopdis)=>{
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
						//num记录加入购物车商品数量，初始为1
						this.data = data;
						this.cartdata = {...data,num:1};
						this.render();
					}

				})
			}
			//渲染页面
			render(){
				let data = this.data;
				this.container.html(template('detailModle',{data}));

				//渲染购物车下面的猜你喜欢商品
				shopdis.renderLess('hotList');

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
					$("#numFont").html(num);
				})
				//点击减号
				$("#subBtn").on("click",()=>{
					let num = Number($("#numWrap").html());
					if(--num<1)num = 1;
					$("#numWrap").html(num);
					$("#numFont").html(num);
				})

				//点击添加购物车
				$("#addCart").on("click",e=>{
					this.addcart(e);
				})

				//点击立即购买
				$("#shopNow").on("click",()=>{
					alert("正在实现中。。。")
				})

				//点击商品描述或尺码表 隐藏或显示
				$("#miaosu").on("click",function(e){
					//存在hidden就删除，不存在就添加
					$(this).parent().toggleClass('hidden');
				})

				$("#chima").on("click",function(e){
					//存在hidden就删除，不存在就添加
					$(this).parent().toggleClass('hidden');
				})
				//点击查看尺码表
				$("#chimafont").on("click",function(e){

					$("#chima").parent().removeClass('hidden');
				})

				//点击尺码选择或者颜色选择
				$(".spanBtn").on("click",function(e){
					$(this).addClass('cheched').siblings().removeClass('cheched');
					$(this).parent().find("#wrapcolor").html($(this).css('color'));
					$(this).parent().find("#wrapsize").html($(this).html());
					$(".tips").hide();
				})
			}
			addcart(e){

				//加入选择的数据num color size
				this.cartdata.num = Number($("#numWrap").html());
				//判断是否选择颜色
				if($("#wrapcolor").html()){
					this.cartdata.color = $("#wrapcolor").html();
					$("#wrapcolor").siblings('.tips').hide();
				}else{
					$("#wrapcolor").siblings('.tips').show();
					return;
				}
				//判断是否选择尺码
				if($("#wrapsize").html()){
					this.cartdata.size = $("#wrapsize").html();
					$("#wrapsize").siblings('.tips').hide();
				}else{
					$("#wrapsize").siblings('.tips').show();
					return;
				}

				
				//生成一张下图片，滑动到购物车的位置
				let img = $("#showImg").prop("src");
				$(`<img src = '${img}' style = 'width:30px;height:30px;'>`).fly({
					start:{
						left:e.clientX,
						top:e.clientY
					},
					end:{
						left:$("#cart").offset().left,
						top:$("#cart").offset().top
					},
					//结束后消失
					onEnd:function(){
						this.destroy();
					}
				});

				//将商品添加到本地存储
				let cart = localStorage.getItem('cart');
				if(cart){//购物车不为空
					cart = JSON.parse(cart);

					//由于数据的随机性，同一id的商品名称会不同
					//方便看出不同，将id相同的商品名称改为一致
					cart.forEach(item=>{
						if(item.id === this.cartdata.id){
							item.shopName = this.cartdata.shopName;
						}
					})

					//判断购物车中是否含有该商品
					let index = -1;
					if(cart.some((shop,i)=>{
						index = i;
						//同时满足商品id，color，size相同才合并为同一条商品
						return shop.id === this.cartdata.id && shop.size===this.cartdata.size && shop.color===this.cartdata.color;
					})){
						//在购物车中查询本条商品，索引为index，进行数量增加

						//判断商品尺码
						cart[index].num += this.cartdata.num;
					}else{
						cart.push(this.cartdata);
					}
					console.log(this.cartdata);


				}else{//购物车为空
					//cart未定义时不能采用push放入
					cart = [{...this.cartdata}];
				}

				localStorage.setItem('cart',JSON.stringify(cart));

				//调用计算商品数量的方法
				header.calcCartNum();

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