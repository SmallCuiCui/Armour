
//注意此处参数一为一个数组
require(["config"],()=>{
	require(["url","template","header","footer","jquery"],(url,template,header,footer,$) =>{

		class Newlist{
			constructor(){
				this.getData();
			}
			getData() {
				$.ajax({
					url:url.baseListUrl + 'hotList',
					type:"get",
					dataType:"json",
					success:data =>{
						

						if(data.res_code == 1){
						
							this.render(data.res_body.list);
						}
					}
				})
			}
			render(list){
				//console.log($("#mainWrap"));
				$("#mainWrap").html(template('newlist-template',{list}));
			}
		}
		new Newlist();

	});
})