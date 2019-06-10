require(["config"],()=>{
	require(["header","url","cookie","footer"],(hearder,url)=>{
		class User{
			constructor(){
				// this.getData();
				this.bindEvent();
			}
			getData(){
				let userphone = $.cookie("username");
				$.ajax({
					url:url.phpBaseUrl+'getUserData.php',
					type:'post',
					dataType:"json",
					data:{userphone},
					success:data=>{
						console.log(data);
					}
				})
			}
			render(){

			}
			bindEvent(){
				let _this = this;
				// 编辑状态下点击取消
				$(".cancel").on("click",function(){
					// 隐藏修改区
					$(this).parents("ol").find("li>div").hide();
					// 显示点击按钮
					$(this).parents("ol").find("li:last-child").show();
				})
				// 点击订阅与个人信息的修改
				$(".edit").on("click",function(){
					// 显示修改区
					$(this).parents("ol").find("li>div").show();
					// 隐藏点击按钮
					$(this).parents("ol").find("li:last-child").hide();
				})
			}
		}
		new User();
	})
})