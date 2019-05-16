require(["config"],()=>{

	require(["template","shopDis"], (template,shopdis) =>{
		class Cart{
			constructor(){
				this.all = $("#allBtn");
				this.tbody = $("tbody");
				this.allBtn = $("#allBtn");

				//选中商品数量 
				this.checknum = 0;

				//商品列表数量 ，tr数量 购物车中商品数
				this.num = 0;

				this.render();
				this.bindEvent();

				//渲染购物车下面的猜你喜欢商品
				shopdis.renderLess('hotList');
			}
			//渲染商品列表
			render(){
				this.cart = JSON.parse(localStorage.getItem('cart'));
				
				//购物车先判断存在，然后再判断有没有东西
				if(this.cart){
					if(this.cart.length > 0){
						console.log(this.cart);
						this.num = this.cart.length;
						$("#shopList").show();
						$("#noGoods").hide();
					}else{
						$("#shopList").hide();
						$("#noGoods").show();
					}
				}else{
					$("#shopList").hide();
					$("#noGoods").show();
				}


				let list = this.cart;
				this.tbody.html(template("cartModel",{list}));

				//渲染商品选中数量
				$(".checkBox").html(this.checknum);

				//渲染合计
				this.calcAllMoney();
			}
			bindEvent(){
				let _this = this;

				//颜色，尺码选择
				this.tbody.on("click",".checkLi",function(e){

					$(this).toggleClass('show');
					$(this).siblings('li').toggleClass('show');
					$(this).parent().children('li:first-child').addClass('show');
					$(this).find('i').toggleClass('hidden');

					let checkdata = $(this).find('span').html();
					$(this).parent().children('li:first-child').find('span').html(checkdata);
					$(this).parent().children('li:first-child').find('div').css("background-color",checkdata);

				})

				//点击编辑
				this.tbody.on("click",'.editBtn',function(e){
					$(this).parents('tr').toggleClass('edit');
				})

				//点击删除
				this.tbody.on("click",'.delBtn',function(e){
					if(confirm("确定删除吗？")){
						let shopIndex = Number($(this).parent().parent().attr('data-index'));
						//从cart中 删除shopIndex 重新存本地localstorage 重新渲染
						_this.cart.splice(shopIndex,1)
						localStorage.setItem('cart',JSON.stringify(_this.cart));
						_this.render();
						//$(this).parent().parent().remove();
						_this.calcAllMoney();
					}
					
				})

				//点击确定
				this.tbody.on("click",'.okBtn',function(e){

					//更新数据
					let shopIndex = Number($(this).parents('tr').attr('data-index'));
					_this.cart[shopIndex].size = $(this).parents('tr').find("#sizeSpan").html();
					_this.cart[shopIndex].color = $(this).parents('tr').find("#colorSpan").html();
					_this.cart[shopIndex].num = Number($(".numFont").html());

					// 判断是存在相同商品(id，color，size都相同的商品)需要合并
					let ItemCart = _this.cart[shopIndex];
					_this.cart.splice(shopIndex, 1);
					
					let _index = -1;
					if(_this.cart.some(function(shop,i){
						_index = i;
						return shop.id === ItemCart.id && shop.size === ItemCart.size && shop.color === ItemCart.color;
					})){
						_this.cart[_index].num += ItemCart.num;
					}else{
						_this.cart.push(ItemCart);
					}


					localStorage.setItem('cart',JSON.stringify(_this.cart));
					_this.render();
					_this.calcAllMoney();
					$(this).parent('tr').toggleClass('edit');
				})

				//点击商品选择框
				this.tbody.on("click",'.checkShop',function(e){
					$(this).find('i').toggleClass('ischeck');
					if($(this).find('i').hasClass('ischeck')){
						_this.checknum ++;
					}else{
						_this.checknum --;
					}

					//判断是否选中全选框
					if(_this.checknum === _this.num){
						$("#allBtn").find('i').addClass('ischeck');
					}else{
						$("#allBtn").find('i').removeClass('ischeck');
					}

					_this.calcAllMoney();
				})

				//点击商品全选
				$("#allBtn").on("click",function(e){
					$(this).find('i').toggleClass('ischeck');
					//全选
					if($(this).find('i').hasClass('ischeck')){
						$(".checkShop").find('i').addClass('ischeck');
						_this.checknum = _this.cart.length;
					}else{//全不选
						$(".checkShop").find('i').removeClass('ischeck');
						_this.checknum = 0;
					}

					$(".checkBox").html(_this.checknum);
					_this.calcAllMoney();
				})

				//编辑状态下点击减号
				this.tbody.on("click",'.jianSpan',function(e){
					let num = $(this).siblings('font').html();
					if(--num<1)num = 1;
					$(this).siblings('font').html(num);


				})
				//编辑状态下点击加
				this.tbody.on("click",'.jiaSpan',function(e){
					let num = $(this).siblings('font').html();
					$(this).siblings('font').html(++num);

				})

				
			}
			//计算总价
			calcAllMoney(){
				let allMoney = 0;
				$(".checkShop i").each((index,item) =>{
					//each遍历之后得到原生DOM元素

					if(item.classList.contains('ischeck')){
						let tr = item.parentNode.parentNode.parentNode;
						let xiaoji = Number(tr.querySelector(".xiaoji").innerHTML);
						allMoney += xiaoji;
					}
				})

				$("#allMoneyBox").html(allMoney);

			}
		}

		new Cart();
	})
})


