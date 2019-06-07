require(["config"],()=>{
	require(["jquery"],($)=>{
		class confirmOrder{
			constructor(){
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

				// 选择地址
				$(".adressBox ul p").on("click",function(){
					$(this).addClass("ac").siblings().removeClass('ac');
					let html = $(this).prop("outerHTML");
					$(".adressBox>div").html(html);
					$(".adressBox>div").show();
					$(".adressBox ul").hide();
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
				// 点击保存并使用改地址



				// 点击选择订单相关信息
				$(".select").on("click",function(){
					$(this).addClass("ac").siblings().removeClass("ac");
				})
			}
		}
		new confirmOrder();
	})
})