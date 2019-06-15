require(["config"],() =>{
	require(["url","header","footer","cookie"],(url,header,footer) =>{
		class Login{
			constructor(){
				this.inputUser = $("#inputUser");
				this.inputPsw = $("#inputPsw");
				this.loginBtn = $("#btnLogin");
				this.checkBtn = $("#checkBtn");

				
				//标记正则是否通过验证，为true才能进行登录
				this.regPass = false;
				this.bindEvent();
			}
			bindEvent(){
				//用户名验证,输入框失去焦点时进行验证
				this.inputUser.blur( () =>{
					this.regUser();
				});
				// 密码失去焦点时验证密码格式
				this.inputPsw.blur(()=>{
					this.regPsw();
				});
				//点击登录按钮
				this.loginBtn.on("click", ()=>{
					this.login();
				})
				
			}

			regUser(){
				this.user = this.inputUser.val();

				if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.user)) && !(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/).test(user)){
					$("#userPoint").show();
					this.regPass = false;
				}else{
					$("#userPoint").hide();
					this.regPass = true;
				}
			}
			regPsw(){
				this.psw = this.inputPsw.val();
				let arr = [];
				arr.push(/^.{8,16}$/.test(this.psw));
				arr.push(/\d/.test(this.psw));
				arr.push(/[a-zA-Z]/.test(this.psw));
				arr.push(/[^0-9a-zA-Z]/.test(this.psw));
				if(arr[0]){
					if(arr[1] + arr[2] +arr[3] >= 2){
						$("#pswPoint").hide();
						this.regPass = true;
					}else{
						$("#pswPoint").show();
						this.regPass = false;
					}

				}else{
					$("#pswPoint").show();
					this.regPass = false;
				}
			}

			login(){

				if(this.regPass){//用户与密码正则验证通过才进行登录请求
					//请求php
					let user = this.user;
					let psw = this.psw;

					let jsonCallBackTest = this.jsonCallBackTest;
					$.ajax({
						url: url.phpBaseUrl +'login.php',
						type: 'post',
						data:{user,psw},
						dataType: 'json',
						success: data =>{
							//登录成功，存储cookie，仅保存用户电话号码或者邮箱
							if(data.res_code === 1){
								let expires = this.checkBtn.prop('checked')?{expires:10,path:'/'} : {path:'/'};
								$.cookie("username",user,expires);

								// 初始化用户数据，包括个人信息(对象)，购物车(对象数组)，订单(对象数组)，地址(对象数组)
								let userNew = {
									info:{'psw':psw,'phone':"",'email':"",'name':"",'sex':"",'birthday':""},
									cart:[],
									order:[],
									address:[]
								}

								// 使用电话号码登录
								if((/^1(3|4|5|7|8)\d{9}$/.test(user))){
									userNew.info.phone = user;
								}else{//邮箱登录
									userNew.info.phone = user;
								}
								localStorage.setItem('user',JSON.stringify(userNew));

								alert("登录成功，即将跳转首页！");
								location.href = '/';
							}
						}
					});
					
				}else{
					$("#userPoint").show();
					$("#pswPoint").show();
				}
			}


		}

		new Login();
	})
})