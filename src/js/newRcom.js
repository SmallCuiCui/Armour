
//注意此处参数一为一个数组
require(["config"],()=>{
	require(["url","template","header","footer","jquery","shopDis"],(url,template,header,footer,$,shopdis) =>{

		class Newlist{
			constructor(){

				this.render();

			}
			render(){
				shopdis.render('hotList');
			}
		}
		new Newlist();

	});
})