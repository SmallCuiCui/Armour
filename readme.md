#### 用户本地信息存储-数据结构

user {}

- cart  [{},{}]  //通过状态status标识显示在订单确认页面

- order [{},{}]  

  - time
  - address
  - status   //状态0：表示待支付，状态1：表示已完成，状态2：表示已取消
  - shopNum
  - totalMoney
  - shopList[{},{}]

- info  {}

  * phone
  * email

  * psw
  * name
  * sex
  * birthday

- address [{},{}]