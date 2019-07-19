import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({
  data: {
    userPersonalInfo:{},
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
    console.log(this.data.byBuy)
    if(this.data.byBuy==1){
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
        // cart:{}
      },
      success:res=>{
        if(res.data.code==200){
          console.log(res.data.data)
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
        // cartList:[]
      },
      success: res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
        } else {
          Toast.fail(res.data.message)
        }
      }
    })
  }
})