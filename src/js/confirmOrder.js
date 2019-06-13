require(["config"],()=>{
	require(["jquery","template"],($,template)=>{
		class confirmOrder{
			constructor(){
				
				this.order = {
					time:"",
					address:"",
					status:"0",//状态0表示待支付，状态1表示已完成，状态2表示已取消
					shopNum:"",
					totalMoney:"",
					shopList:[]
				}
				this.render();
			}
			render(){
				this.user = JSON.parse(localStorage.getItem('user'));
				
				// 初始订单默认地址
				this.order.address = this.user.address[0];

				// 渲染已选商品，购物车中商品status为confirm
				let shops = this.user.cart;
				this.order.shopList = shops.filter(function(item) {
					return item.status === "confirm";
				});


				shops = this.order.shopList;
				$("#confirmShop").html(template("checkedShop",{shops}));

				// 渲染商品总价
				let num = 0;
				let total = shops.reduce(function(prv,next){
					num += next.num;
					return prv+=next.num*next.price;
				},0)
				$(".total").html("￥"+total)
				this.order.totalMoney = total;

				// 渲染商品总数
				$("#shopNum").html("共 "+num+" 件");
				this.order.shopNum = num;

				// 渲染默认地址，即用户地址列表的第一条地址数据
				let address = [];
				this.user.address.forEach(function(item,index){
					address.push(item.split(','))
				})
				console.log(address);
				if(address.length>0){
					$("#showAll").show();
					let html = `
						<p class="ac">
								<span>${address[0][0]}</span>
								<span>${address[0][1]}</span>
								<span>${address[0][2]}</span>
								<span>${address[0][3]}</span>
								<span>${address[0][4]}</span>
								<span>${address[0][5]}</span>
								<a href="javascript:;" class="checkBtn"><i class="iconfont icon-zhengque"></i></a>
							</p>
					`;
					console.log(html);
					$(".adressBox>div").html(html);

					// 渲染所有地址列表
					$("#allAdress").html(template("addressModle",{address}));
				}else{//此用户没有地址，不显示'显示地址列表'
					$("#showAll").hide();
				}


				this.bindEvent();
			}
			bindEvent(){
				let _this = this;
				// 鼠标滚动时固定头部导航
				$(document).ready(function(){
					$(window).scroll(function(){
		                var scrollPos=$(window).scrollTop();

		                if(scrollPos >=34){
		                    $("header nav").addClass("fixed");
		                }else{
		                    $("header nav").removeClass("fixed");
		                }
		            });
				});

				/*新建地址交互*/
				// 点击新增配送地址
				$("#addAdress").on("click",function(){
					$(".adressBox").hide();
					$(".newAdress").show();
				})
				// 点击显示所有地址
				$("#showAll").on("click",function(){
					$(".adressBox>div").hide();
					$(".adressBox ul").show();
					$("#hideAll").show();
					$(this).hide();
				})
				// 点击收起所有地址
				$("#hideAll").on("click",function(){
					$(".adressBox>div").show();
					$(".adressBox ul").hide();
					$("#showAll").show();
					$(this).hide();
				})

				// 选择地址,后面会新添加地址，采用事件绑定
				$(".adressBox ul").on("click","p",function(){
					$(this).addClass("ac").siblings().removeClass('ac');
					let html = $(this).prop("outerHTML");
					$(".adressBox>div").html(html);
					$(".adressBox>div").show();
					$(".adressBox ul").hide();
					$("#showAll").show();
					$("#hideAll").hide();

					// 更新订单地址
					let address = [];
					$(this).find("span").each(function(){
						address.push($(this).text());
					})
					_this.order.address = address.join();
				})

				// 选择默认地址
				$("#defaultAdress").on("click",function(){
					$(this).toggleClass("selected");
				})
				// 点击取消
				$("#cancelBtn").on("click",function(){
					$(".adressBox").show();
					$(".newAdress").hide();
				})
				// 添加地址时，点击保存并使用改地址
				$("#okBtn").on("click",function(){
					// 新增地址数据 
					let inputVal = [];
					let tag = true;
					$(".inputBox input").each(function(){
						if(!$(this).val()){
							tag = false;
						}else{
							inputVal.push($(this).val());
						}
					})
					if(!tag){
						alert("请完善地址信息");
						return;
					}
					// 更新订单地址
					_this.order.address = inputVal.join();
					let html = `
						<p class="ac">
								<span>${$(".inputBox input")[0].value}</span>
								<span>${$(".inputBox input")[1].value}</span>
								<span>${$(".inputBox input")[2].value}</span>
								<span>${$(".inputBox input")[3].value}</span>
								<span>${$(".inputBox input")[4].value}</span>
								<span>${$(".inputBox input")[5].value}</span>
								<a href="javascript:;" class="checkBtn"><i class="iconfont icon-zhengque"></i></a>
							</p>
					`
					$(".adressBox>div").html(html);
					$(".adressBox").show();
					$(".newAdress").hide();

					// 设为默认地址则从数组头部插入，否则插入尾部
					if($(".inputBox .checkBtn").hasClass("selected")){
						_this.user.address.unshift(inputVal.join());
					}else{
						_this.user.address.push(inputVal.join());
					}
					localStorage.setItem('user',JSON.stringify(_this.user));

					// 渲染所有地址列表
					let address = [];
					_this.user.address.forEach(function(item,index){
						address.push(item.split(','))
					})
					$("#allAdress").html(template("addressModle",{address}));
				})

				// 点击选择订单相关信息
				$(".select").on("click",function(){
					$(this).addClass("ac").siblings().removeClass("ac");
				})

				// 点击提交订单
				$("#confirmOrder").on("click",function(){

					// 从购物车中删除选中下单商品的数据
					let shops = _this.user.cart;
					let newCart = shops.filter(function(item) {
						return item.status === "cart";
					});
					_this.user.cart = newCart;

					// 订单商品数据，订单时间，订单状态，订单地址，商品(总量，总价，商品列表)

					// 获取时间
					let date = new Date();
					let year = date.getFullYear(),
						month = date.getMonth()+1,
						day = date.getDate(),
						h = date.getHours(),
						m = date.getMinutes();
					let time = year +"-"+ month +"-"+ day + " "+h+":"+m;
					_this.order.time = time;

					
					// 为用户添加当前订单
					_this.user.order.push(_this.order);
					localStorage.setItem('user',JSON.stringify(_this.user));
					if(confirm("订单提交成功，立即查看？")){
						location.href = "/htmls/account.html";
					}

				})

			}
		}
		new confirmOrder();
	})
})