const app = getApp()
Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    btnText: '确认订单'
  },

  onReady() {
    this.getTotalPrice();
  },

  onShow() {
    const self = this;
    this.setData({
      address: { phone: "17862705895", name:"吴小锋",detail:"上海市浦东新区云雅路555弄31号401室"},
      hasAddress: true
    })
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
    const self = this;
    self.setData({
      orders: app.globalData.cartList
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total*100
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

    // var orderData = [];
    // for (var i = 0; i < this.data.orders.length; i++) {
    //   var address = this.data.address.detail + " " + this.data.address.name + " " + this.data.address.phone;
    //   var goods = {
    //     goodId: this.data.orders[i].id,
    //     number: this.data.orders[i].num
    //   }
    //   orderData[i] = goods;
    // }
    // wx.request({
    //   url: app.globalData.api.toOrder,
    //   method: "POST",
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   data: {
    //     sn: sn,
    //     orderData: JSON.stringify(orderData),
    //     address: address
    //   },
    //   success(res) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '下单成功，请尽快完成支付',
    //       text: 'center',
    //       showCancel: false,
    //       complete() {
    //         //清空购物缓存
    //         wx.setStorageSync('carts', []);
    //         wx.switchTab({
    //           url: '/page/component/user/user'
    //         })
    //       }
    //     })
    //   }
    // })

  }
})