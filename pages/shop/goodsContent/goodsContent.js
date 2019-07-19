import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({
  data: {
    scrollViewHeight: 0,
    goodsInfo:null,
    goods:null,
    num: 1,
    curIndex: 0,
    goodsId:"",
    comeFromShop:0,
    isOnAdd:false,
    sumPrice:0,
    show:false
  },
  onShow(){
    app.globalData.cartsForOrder = []
  },
  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 50;
    this.setData({
      scrollViewHeight: tempHeight,
      goodsId:options.goodsId,
      comeFromShop: typeof (options.comeFromShop) == "undefined" ? 0 : options.comeFromShop
    });
    wx.request({
      url: app.globalData.api.getGoodsDetailByBuyer,
      data: {
        token: app.globalData.token,
        goodsId: options.goodsId,
      },
      success: res => {
        if (res.data.code === 200) {
          this.setData({
            goodsInfo:res.data.data,
            goods: res.data.data.goods,
            ["goods.buyNum"]:1,
            sumPrice:res.data.data.goods.price  //单位分
          })
        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  addToCart(){
    if(this.data.isOnAdd){
      return;
    }else{
      this.setData({isOnAdd:true})
    }
    wx.request({
      url: app.globalData.api.addNewGoodsToCart,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        token:app.globalData.token,
        goodsId: this.data.goodsId
      },
      success:res=>{
        if(res.data.code==200){
          Toast.success(res.data.message)
        }else{
          Toast.fail(res.data.message)
        }
      },
      fail:res=>{
        Toast.fail("稍后重试");
      },
      complete:res=>{
        this.setData({isOnAdd:false})
      }
    })
  },
  goToBuy(){
    this.setData({show:true})
  },

  addNum() {
    let sumPrice=this.data.sumPrice+this.data.goods.price;
    let buyNum=this.data.goods.buyNum+1
    this.setData({ sumPrice: sumPrice, ["goods.buyNum"]: buyNum})
  },

  subNum() {
    let sumPrice = this.data.sumPrice - this.data.goods.price;
    let buyNum = this.data.goods.buyNum - 1
    this.setData({ sumPrice: sumPrice, ["goods.buyNum"]: buyNum })
  },
  onCancel(){
    this.setData({show:false})
  },
  goToSubmit(){
    let cart={shopId:this.data.goods.shopId,shopName:this.data.goods.shopName,list:[]}
    cart.list.push(this.data.goods)
    app.globalData.cartsForOrder.push(cart);
    wx.navigateTo({
      url: '/pages/order/submitOrder/submitOrder?byBuy=1&sumPrice=' + this.data.sumPrice ,//单位是分
    })
  }
})