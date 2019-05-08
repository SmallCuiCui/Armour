require(["config"],() =>{
	require(["url","template","header","footer",],(url,template,header,footer) =>{
		class Login{
			constructor(){
				this.inputUser = $("#inputUser");
				this.inputPsw = $("#inputPsw");
				this.loginBtn = $("#btnLogin");

				//标记正则是否通过验证，为true才能进行登录
				this.regPass = false;
				this.bindEvent();
			}
			bindEvent(){
				//用户名验证
				this.inputUser.blur( () =>{
					this.regUser();
				});
				this.inputPsw.blur(()=>{
					this.regPsw();
				});
				this.loginBtn.on("click", ()=>{
					this.login();
				})
				
			}

			regUser(){
				this.user = this.inputUser.val();

				if(!(/^1(3|4|5|7|8)\d{9}$/.test(user)) && !(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/).test(user)){
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
				arr.push(/^.{8,16}$/.test(psw));
				arr.push(/\d/.test(psw));
				arr.push(/[a-zA-Z]/.test(psw));
				arr.push(/[^0-9a-zA-Z]/.test(psw));
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
					$.ajax({
						url: '/api/login.php',
						type: 'POST',
						dataType: 'json',
						success:data=>{
							connsole.log(data);
						}
					});
					
				}else{
					return;
				}
			}
		}

		new Login();
	})
})