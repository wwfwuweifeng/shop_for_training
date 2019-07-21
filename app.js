//app.js
App({
  onLaunch: function () {

    for (var key in this.globalData.api) {
      this.globalData.api[key] = this.globalData.serverUrl + this.globalData.api[key];
      console.log("api :" + this.globalData.api[key]);
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    serverUrl:"http://api.wuweifeng.top/shop",
    userInfo: null, //微信官方返回的用户信息
    shopUserInfo:null,  //自己的应用服务器返回的用户信息
    token:null,
    cartsForOrder:[],
    api: {
      //用户模块
      login: '/user/login',  //登录并获取sessionId,
      // userInfo:'/user/userInfo', //获取用户信息，暂未使用
      editUserInfo:'/user/editUserInfo',  //编辑用户信息，含收货地址
      registerByCode:'/user/registerByCode',  //用户通过邀请码进行注册

      //cart模块
      addNewGoodsToCart:'/cart/add',  //添加商品至购物车
      delGoodsFromCart:'/cart/del', //从购物车中删除商品
      getGoodsListByCart:'/cart/goodsListByCart', //获取购物车中的商品

      //goods模块
      getRecommendGoods:'/goods/recommend', //获取推荐首页的内容
      getGoodsListByBuyer:'/goods/goodsListByBuyer',  //买家获取商品列表
      getGoodsListBySeller:'/goods/goodsListBySeller',  //卖家获取自己销售的商品
      getGoodsDetailByBuyer: '/goods/detailByBuyer', //买家获取商品的详细信息
      getGoodsDetailBySeller: '/goods/detailBySeller',//卖家获取商品的销售信息
      addGoodsBySeller:'/goods/addGoodsBySeller', //卖家添加商品,
      editGoodsBySeller:'/goods/editGoodsBySeller', //卖家编辑商品信息
      operateGoodsStateBySeller:'/goods/operateGoodsStateBySeller', //卖家操作商品状态
      getGoodsClassifyList: '/goods/classifyList',//获取商品的分类列表

      //order模块
      submitOrderByCart:'/order/submitOrderByCart', //通过购物车提交订单
      submitOrderByBuy: "/order/submitOrderByBuy", //直接在商品页点击购买，提交订单
      receiptOrder:'/order/receipt',  //卖家接单
      sendGoodsForOrder:'/order/send',  //为订单发货
      signOrder: '/order/sign',  //签收订单
      cancelOrder: '/order/cancel',  //取消订单
      getOrderListByBuyer: '/order/orderListByBuyer',  //买方获取订单列表
      getOrderListBySeller:'/order/orderListBySeller',  //卖家获取订单列表
      getOrderDetail:'/order/detail', //获取订单详情

      
    },
  }
})