require(["config"], () =>{
	require(["header","footer","lunbo","people","cookie"] ,(header,footer,lunbo,people) =>{
		
		//console.log(lunbo);
		class Mans{
			constructor(){

				//获取存放的cookie来判断当前渲染的页面是男子，女子，还是少年
				this.html = $.cookie("html");
				this.setData();
				
			}

			setData(){
				switch(this.html){
					case "mans":
					this.data = {
						bannerImg:["/images/people/man_bg1.jpg","/images/people/man_bg2.jpg"],
						reconmand:"mans",//推荐商品数据接口
						peopleTow:"mansTow",//两个模块数据接口
						peopleThree:"mansThree"//三个模块数据接口
					}
					break;

					case "womans":
					this.data = {
						bannerImg:["/images/people/woman_bg1.jpg","/images/people/woman_bg2.jpg"],
						reconmand:"mans",//推荐商品数据接口
						peopleTow:"mansTow",//两个模块数据接口
						peopleThree:"mansThree"//三个模块数据接口
					}
					break;

					case "child":
					this.data = {
						//轮播图
						bannerImg:["/images/people/child_bg1.jpg","/images/people/child_bg2.jpg"],
						reconmand:"mans",//推荐商品数据接口
						peopleTow:"mansTow",//两个模块数据接口
						peopleThree:"mansThree"//三个模块数据接口
					}
					break;
				}
				this.load();
			}

			load(){
				//渲染轮播
				lunbo.render(this.data.bannerImg);

				//渲染主体内容
				this.people = people;
				this.people.render(this.data);
			}
			
		}

		new Mans();
	})
})