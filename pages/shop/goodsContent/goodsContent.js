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
    isOnAdd:false
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
            goods: res.data.data.goods
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
    app.goodsListForOrder
  }
})