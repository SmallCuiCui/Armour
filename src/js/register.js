require(["config"], () => {
    require(["url", "header", "footer"], (url) => {

        class Register {

            constructor() {

                //四个输入框
                this.inputEmail = $("#inputEmail");

                this.inputPhone = $("#inputPhone");
                this.inputPsw = $("#inputPsw");
                this.againPsw = $("#againPsw");

                //注册页面两个可选的复选框
                this.agree1 = $("#agree1");
                this.agree2 = $("#agree2");

                this.registerBtn = $("#registerBtn");

                //标记每一个输入框是否合法
                this.inputs = [true, true, true, true];
                //标记是否可注册
                this.isRegister = false;

                this.bindEvent();

            }
            bindEvent() {
                //邮箱验证,输入框失去焦点时进行验证
                this.inputEmail.blur(() => {
                    let email = this.inputEmail.val();
                    this.email = email;
                    this.inputs[0] = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(this.email);

                    this.isShowPonit();
                });

                //电话号码
                this.inputPhone.blur(() => {
                    let phone = this.inputPhone.val();
                    this.phone = phone;
                    this.inputs[1] = /^1(3|4|5|7|8)\d{9}$/.test(this.phone);
                    this.isShowPonit();
                });

                //密码验证
                this.inputPsw.blur(() => {
                    this.inputs[2] = this.regPsw();

                    if(this.againPsw.val() !== ""){
                     this.inputs[3] = this.againPsw.val() == this.inputPsw.val();
                    }
                     this.isShowPonit();
                });

                //确认密码
                this.againPsw.blur(() => {
                    this.inputs[3] = this.againPsw.val() == this.inputPsw.val();
                    this.isShowPonit();
                });

                //点击复选框1
                this.agree1.on("click", () => {
                    //console.log($("#agree1 i"))
                    if (this.agree1.children().css("display") === "none") {
                        this.agree1.children().css("display", "inline");
                    } else {
                        this.agree1.children().css("display", "none");
                    }

                })

                //点击复选框2
                this.agree2.on("click", () => {
                    if (this.agree2.children().css("display") === "none") {
                        this.agree2.children().css("display", "inline");
                    } else {
                        this.agree2.children().css("display", "none");
                    }
                })

                //点击注册
                this.registerBtn.on("click", () => {
                	console.log(11);
                    this.register();
                })


            }
            //检测输入框的正则验证是否通过，来决定对应的错误提示是否显示
            isShowPonit() {
            	//console.log(this.inputs);
                if (this.inputs[0]) {
                    $("#emailPiont").css("opacity", 0);
                    this.isRegister = true;
                } else {
                    $("#emailPiont").css("opacity", 1);
                    this.isRegister = false;
                }

                if (this.inputs[1]) {
                    $("#phonePiont").css("opacity", 0);
                    this.isRegister = true;
                } else {
                    $("#phonePiont").css("opacity", 1);
                    this.isRegister = false;
                }

                if (this.inputs[2]) {
                    $("#pswPiont").css("opacity", 0);
                    this.isRegister = true;
                } else {
                    $("#pswPiont").css("opacity", 1);
                    this.isRegister = false;
                }

                if (this.inputs[3]) {
                    $("#apswPiont").css("opacity", 0);
                    this.isRegister = true;
                } else {
                    $("#apswPiont").css("opacity", 1);
                    this.isRegister = false;
                }
            }

            regPsw() {
                this.psw = this.inputPsw.val();
                let arr = [];
                arr.push(/^.{8,16}$/.test(this.psw));
                arr.push(/\d/.test(this.psw));
                arr.push(/[a-zA-Z]/.test(this.psw));
                arr.push(/[^0-9a-zA-Z]/.test(this.psw));
                if (arr[0]) {
                    if (arr[1] + arr[2] + arr[3] >= 2) return true;
                    else return false;
                } else {
                    return false;
                }
            }

            register() {
            	
            	if(this.isRegister){
            		let phone = this.phone,
            			email = this.email,
            			psw = this.psw;

            		$.ajax({
						url: url.phpBaseUrl +'register.php',
						type: 'post',
						data:{phone,email,psw},
						dataType: 'json',
						success: data =>{
							//登录成功，存储cookie
							//console.log(data);
							if(data.res_code === 1){
								alert(data.res_massage);
								location.href = '/htmls/login.html';
							}else{
								alert(data.res_massage);
								location.href = '/htmls/register.html';
							}
						}
					});
            	}else{
            		alert("请输入正确的内容");
            	}
            }
        }


        new Register();

    })


})