require(["config"],()=>{
	require(["url","template","header","footer","shopDis","zoom","fly","cookie"],(url,template,header,footer,shopdis)=>{
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
					//登录状态下添加购物车成功,否则提示进行登录
					if($.cookie("username")){
						this.addcart(e);
					}else{
						if(confirm("您还为进行登录，请先登录!")){
							location.href = "/htmls/login.html";
						}
					}
					
				})

				//点击立即购买
				$("#shopNow").on("click",()=>{
					alert("正在实现中。。。")
				})

				//点击商品描述 隐藏或显示
				$("#miaosu").on("click",function(e){
					//存在hidden就删除，不存在就添加
					$(this).parent().toggleClass('hidden');
				})

				//点击商品尺码表 隐藏或显示
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

					//将颜色转换为16进制
					let rgb = $(this).css('color').split(',');
					let r = parseInt(rgb[0].split('(')[1]);
					let g = parseInt(rgb[1]);
					let b = parseInt(rgb[2].split(')')[0]);
					let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
					
					$(this).parent().find("#wrapcolor").html(hex);
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

				// 商品状态 cart表示在购物车中，confirm表示在结算页中，order表示已经提交订单 
				this.cartdata.status = 'cart';

				
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
				// let cart = localStorage.getItem('cart');
				let user = JSON.parse(localStorage.getItem('user'));
				if(user.cart.length >0){//购物车不为空
					let cart = user.cart;
					
					//由于数据的随机性，同一id的商品名称,随机颜色，单价会不同
					//方便看出不同，将id相同的商品的随机数量值改为一致
					cart.forEach(item=>{
						if(item.id === this.cartdata.id){
							item.shopName = this.cartdata.shopName;
							item.colors = this.cartdata.colors;
							item.price = this.cartdata.price;
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

					user.cart = cart;
				}else{//购物车为空
					//cart未定义时不能采用push放入
					let cart = [{...this.cartdata}];
					user.cart = cart;
				}
				
				localStorage.setItem('user',JSON.stringify(user));
				// localStorage.setItem('cart',JSON.stringify(cart));
				//调用计算商品数量的方法,调用渲染购物车预览
				header.calcCartNum();
				// header.renderSmallCart();

			}

			zoom(){
				// 点击切换+放大镜 插件
				//大图
				$(".zoom-img").elevateZoom({
					gallery:'gal1',//小图容器
					cursor: 'pointer',
					galleryActiveClass: 'active',
					borderSize:'1',    
					borderColor:'#888',
					lensShape:"round"
				});
			}
		}
		new Detail();
	})
})