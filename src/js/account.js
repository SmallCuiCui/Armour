require(["config"],()=>{
	require(["header","url","template","cookie","footer"],(hearder,url,template)=>{
		class User{
			constructor(){
				this.user = JSON.parse(localStorage.getItem('user'));
				this.render();
			}
			render(){

				// 判根据地址中不同type显示
				let type = Number(location.search.slice(6));
				$(".nav-li").eq(type).addClass('ac').siblings().removeClass('ac');
				$(".box-li").eq(type).addClass("ac").siblings().removeClass('ac');

				// 渲染用户订单数据
				let orders = this.user.order;
				// let orders = [];
				if(orders.length>0){
					console.log(111);

					$("#orderWrap").html(template("orderModule",{orders}));
				}else{
					console.log(222);
					$("#orderWrap").html('<div class="noData"><i class="iconfont icon-order"></i><p>您还没有此类订单</p></div>');
				}
				

				// 渲染用户地址簿
				let address = [];
				this.user.address.forEach(function(item){
					address.push(item.split(','));
				})
				$("#addressWrap").html(template("addressModule",{address}));

				// 渲染个人账户信息
				let info = this.user.info;
				$("#InfoWrap").html(template("userModule",{info}));

				this.bindEvent();
			}
			bindEvent(){
				let _this = this;

				// 点击订单分类
				$(".order-li").on("click",function(){
					$(this).addClass("ac").siblings().removeClass('ac');
					var index = $(this).index();
					$(".order-class>li").eq(index).show().siblings().hide();
				})

				// 新建地址
				$("#newAdressBtn").on("click",function(){
					$(this).hide();
					$(".newAdress").show();
				})
				// 新建地址-取消
				$("#cancelBtn").on("click",function(){
					$(".newAdress").hide();
					$("#newAdressBtn").show();
				})
				// 新建地址-设为默认地址
				$("#defaultAdress").on("click",function(){
					$(this).toggleClass("selected");
				})
				// 新建地址-保存
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
					}else{

					}
					// 设为默认地址则从数组头部插入，否则插入尾部
					if($(".inputBox .checkBtn").hasClass("selected")){
						_this.user.address.unshift(inputVal.join());
					}else{
						_this.user.address.push(inputVal.join());
					}
					$(".newAdress").hide();
					$("#newAdressBtn").show();
					localStorage.setItem('user',JSON.stringify(_this.user));

					// 渲染用户地址簿
					let address = [];
					_this.user.address.forEach(function(item){
						address.push(item.split(','));
					})
					$("#addressWrap").html(template("addressModule",{address}));
				})

				// 编辑状态下点击取消
				$(".cancel").on("click",function(){
					// 隐藏修改区
					$(this).parents("ol").find("li>div").hide();
					$(this).parents("ol").find("li>p>span").show();
					// 显示点击按钮
					$(this).parents("ol").find("li:last-child").show();
				})

				// 点击修改邮箱
				$(".cgEmail").on('click',function(){
					$(this).parents('ol').find('li:nth-child(1)>p').hide();
					$(this).parents('ol').find('li:nth-child(1)>div').show();
					$(this).parents("ol").find("li:last-child").hide();
				})
				// 点击保存邮箱
				$(".saveEmail").on("click",function(){
					let email = $(this).parents('.email').find('input').val();
					if(email){
						_this.user.info.email = email;
						// 更新页面email
						$(this).parents('ol').find('li:nth-child(1)>p').html('邮箱：'+email+'<a href="javascript:;">验证邮箱</a>')
						$(this).parents('ol').find('li:nth-child(1)>p').show();
						$(this).parents('ol').find('li:nth-child(1)>div').hide();
						$(this).parents("ol").find("li:last-child").show();
						localStorage.setItem('user',JSON.stringify(_this.user));
					}else{
						alert('请输入邮箱！');
					}
				})

				// 点击修改密码
				$(".cgPsw").on('click',function(){
					$(this).parents('ol').find('li:nth-child(2)>p').hide();
					$(this).parents('ol').find('li:nth-child(2)>div').show();
					$(this).parents("ol").find("li:last-child").hide();
				})
				// 点击保存密码-涉及数据库，懒得修改
				$(".savePsw").on("click",function(){
					// 隐藏修改区
					$(this).parents("ol").find("li>div").hide();
					$(this).parents("ol").find("li>p>span").show();
					// 显示点击按钮
					$(this).parents("ol").find("li:last-child").show();
				})


				// 点击订阅与个人信息-修改
				$(".edit").on("click",function(){
					// 显示修改区
					$(this).parents("ol").find("li>div").show();
					// 隐藏原有数据
					$(this).parents("ol").find("li>p>span").hide();
					// 隐藏点击按钮
					$(this).parents("ol").find("li:last-child").hide();
				})

				// 个人信息修改-性别选择
				$(".sex").on("click",function(){
					$(this).addClass('ac').siblings().removeClass('ac');
				})

				// 个人信息修改-保存
				$(".saveInfo").on("click",function(){
					let name = $(".nameInput").val(),
						sex = $(this).parents('ol').find('.ac').text(),
						year = $(".yearInput").val(),
						month = $(".monthInput").val(),
						day = $(".dayInput").val();
					let birthday = year +"/"+ month +"/"+ day;
					if(name=='' || year == '' || month == '' || day == '' || sex==''){
						alert("请输入个人信息！");
					}else{
						_this.user.info.name = name;
						_this.user.info.sex = sex;
						_this.user.info.birthday = birthday;

						localStorage.setItem('user',JSON.stringify(_this.user));

						// 更新页面数据
						$(this).parents("ol").find('li:nth-child(1) p span').html(name);
						$(this).parents("ol").find('li:nth-child(2) p span').html(sex);
						$(this).parents("ol").find('li:nth-child(3) p span').html(birthday);
						// 隐藏修改区
						$(this).parents("ol").find("li>div").hide();
						$(this).parents("ol").find("li>p>span").hide();
						// 显示点击按钮
						$(this).parents("ol").find("li:last-child").show();
					}
					
					console.log(name,sex,birthday);
				})

				// 订阅信息修改-选择订阅
				$(".ckeckBox p").on("click",function(){
					$(this).toggleClass('ac');
				})
				// 订阅信息修改-保存
				$(".dingyueBtn").on("click",function(){
					let selectP = [];
					$(".ckeckBox p").each(function(){
						if($(this).hasClass('ac')){
							selectP.push($(this).text());
						}
					})
					$(this).parents("ol").find("li>p>span").html(selectP.join());
					// 隐藏修改区
					$(this).parents("ol").find("li>div").hide();
					$(this).parents("ol").find("li>p>span").show();
					// 显示点击按钮
					$(this).parents("ol").find("li:last-child").show();
				})

				// 点击取消订单
				$(".cancelOrder").on("click",function(){
					if(confirm("确定取消此订单吗？")){
						let index_order = Number($(this).parents('li[index-order]').attr('index-order'));
						_this.user.order[index_order].status = '2';
						localStorage.setItem('user',JSON.stringify(_this.user));
						_this.render();
					}
				})

				// 点击立即支付
				$(".payOrder").on("click",function(){
					if(confirm("确定支付此订单吗？")){
						let index_order = Number($(this).parents('li[index-order]').attr('index-order'));
						_this.user.order[index_order].status = '1';
						localStorage.setItem('user',JSON.stringify(_this.user));
						_this.render();
					}
				})
			}
		}
		new User();
	})
})