require(["config"],()=>{
	require(["header","url","cookie","footer"],(hearder,url)=>{
		class User{
			constructor(){
				this.getData();
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
		}
		new User();
	})
})