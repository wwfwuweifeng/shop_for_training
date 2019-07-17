const app = getApp()
Page({
  data: {
    userPersonalInfo:{},
    hasAddress: false,
    totalPrice: 0,
    carts: [],
  },

  onShow() {
    // const self = this;
    // this.setData({
    //   address: { phone: "17862705895", name:"吴小锋",detail:"上海市浦东新区云雅路555弄31号401室"},
    //   hasAddress: true
    // })
    // wx.getStorage({
    //   key: 'address',
    //   success(res) {
    //     self.setData({
    //       address: res.data,
    //     })
    //   }
    // })
  },

  onLoad: function (options) {
    console.log(options.sumPrice)
    this.setData({
      carts: app.globalData.cartsForOrder,
      totalPrice: typeof (options.sumPrice) == "undefined" ? 0 : parseInt(options.sumPrice),
      userPersonalInfo: app.globalData.shopUserInfo.userPersonalInfo,
      hasAddress: app.globalData.shopUserInfo.userPersonalInfo.haveReceiverAddress==1
    })
  },

  
  submitOrder() {
    wx.redirectTo({
      url: '/pages/order/orderContent/orderContent',
    })
    // var self = this;
    // var sn = wx.getStorageSync('sn');
    // if (sn == '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您还未登录,请先登录后完成操作！',
    //     showCancel: false,
    //     complete() {
    //       wx.switchTab({
    //         url: '/page/component/user/user'
    //       })
    //     }
    //   })
    //   return;
    // }
    // if (this.data.address.detail == null) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '地址不能为空！',
    //     showCancel: false
    //   })
    //   return;
    // }

  }
})