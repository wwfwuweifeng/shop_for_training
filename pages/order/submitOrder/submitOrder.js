import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({
  data: {
    payInfo:{},
    isShowPay:false,
    userPersonalInfo:{},
    payStype:'0',
    payStypeDesc:"银联",
    hasAddress: false,
    totalPrice: 0,
    carts: [],
    byBuy:0   //是否是通过商品页点击购买进入的
  },

  onShow() {
    this.setData({
      userPersonalInfo: app.globalData.shopUserInfo.userPersonalInfo,
      hasAddress: app.globalData.shopUserInfo.userPersonalInfo.haveReceiverAddress == 1
    })
  },

  onLoad: function (options) {
    console.log(options.sumPrice)
    this.setData({
      carts: app.globalData.cartsForOrder,
      totalPrice: typeof (options.sumPrice) == "undefined" ? 0 : parseInt(options.sumPrice),
      byBuy: typeof (options.byBuy) == "undefined" ? 0 : 1,
    })
  },

  submitOrder(){
    if (!this.data.hasAddress){
      Toast.fail("请选择收货地址")
    }else if(this.data.byBuy==1){
      this.submitOrderByBuy();
    }else{
      this.submitOrderByCart();
    }
  },
  
  submitOrderByCart() {
    let buyGoodsList=[]
    for(let cart of this.data.carts){
      for(let goods of cart.list){
        let oneCart = { goodsId: goods.goodsId, shopId: goods.shopId, num:goods.buyNum}
        buyGoodsList.push(oneCart);
      }
    }
    wx.request({
      url: app.globalData.api.submitOrderByCart,
      method:"POST",
      header: { "Content-Type": "application/json" },
      data:{
        token:app.globalData.token,
        receiverPeople: this.data.userPersonalInfo.receiverName + "  " + this.data.userPersonalInfo.receiverTel,
        receiverAddress: this.data.userPersonalInfo.receiverAddressSimple + this.data.userPersonalInfo.receiverAddressDetail,
        cartList: buyGoodsList,
        totalMoney: this.data.totalPrice
        // cart:{}
      },
      success:res=>{
        if(res.data.code==200){
          this.setData({
            isShowPay: true,
            payInfo: res.data.data
          })
        }else{
          Toast.fail(res.data.message)
        }
      }
    })
  },
  submitOrderByBuy(){
    let goods=this.data.carts[0].list[0];
    let oneCart = { goodsId: goods.goodsId, shopId: goods.shopId, num: goods.buyNum }
    wx.request({
      url: app.globalData.api.submitOrderByBuy,
      method: "POST",
      // header: { "Content-Type": "application/x-www-form-urlencoded" },
      header: { "Content-Type": "application/json" },
      data: {
        token: app.globalData.token,
        receiverPeople: this.data.userPersonalInfo.receiverName + "  " + this.data.userPersonalInfo.receiverTel,
        receiverAddress: this.data.userPersonalInfo.receiverAddressSimple + this.data.userPersonalInfo.receiverAddressDetail,
        cart: oneCart,
        totalMoney: this.data.totalPrice
        // cartList:[]
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            isShowPay: true,
            payInfo:res.data.data
          })
        } else {
          Toast.fail(res.data.message)
        }
      }
    })
  },
  clickRadio: function (event) {
    this.setData({
      payStype: event.target.dataset.name,
      payStypeDesc: event.target.dataset.msg
    });
  },
  onClose(){
    wx.redirectTo({
      url: '/pages/order/buyOrderList/buyOrderList',
    })
  },
  //有时间接入微信支付
  payMoney(){
    if (this.data.byBuy == 1) {
      this.payForOrder();
    } else {
      this.payForCart();
    }
  },
  payForCart(){
    wx.request({
      url: app.globalData.api.payByCart,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        token:app.globalData.token,
        cartNum: this.data.payInfo.cartNum,
        totalMoney: this.data.payInfo.totalMoney,
        payType:this.data.payStype
      },
      success:res=>{
        if(res.data.code==200){
          this.setData({ isShowPay: false })
          Toast.success("支付成功");
          setTimeout(() => {
            Toast.clear();
            wx.redirectTo({
              url: "/pages/order/buyOrderList/buyOrderList"
            })
          }, 1500)
        }else{
          Toast.fail(res.data.message);
        }
      }
    })
  },
  payForOrder() {
    wx.request({
      url: app.globalData.api.payByOrder,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        token: app.globalData.token,
        orderId: this.data.payInfo.orderId,
        totalMoney: this.data.payInfo.totalMoney,
        payType: this.data.payStype
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({isShowPay:false})
          Toast.success("支付成功");
          setTimeout(() => {
            Toast.clear();
            wx.redirectTo({
              url: "/pages/order/buyOrderList/buyOrderList"
            })
          }, 1500)
        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  }
})