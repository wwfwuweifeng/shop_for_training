const app = getApp()
Page({
  data: {
    imgUrls: [
      'http://image.wuweifeng.top/shop/1.png',
      'http://image.wuweifeng.top/shop/2.png',
      'http://image.wuweifeng.top/shop/3.png',
      'http://image.wuweifeng.top/shop/4.png'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    goodsList: [
      { "picture": 'http://image.wuweifeng.top/shop/1.png', "name": "超级无敌大香菜","sellPrice":100},
      { "picture": 'http://image.wuweifeng.top/shop/1.png', "name": "宇宙超级无敌究极大香菜，快买啦", "sellPrice": 100 },
      { "picture": 'http://image.wuweifeng.top/shop/1.png', "name": "香菜", "sellPrice": 100 },
      { "picture": 'http://image.wuweifeng.top/shop/1.png', "name": "超级无敌大香菜", "sellPrice": 100 },
      { "picture": 'http://image.wuweifeng.top/shop/1.png', "name": "超级无敌大香菜", "sellPrice": 100 }
    ]
  },
  onLoad: function () {
    // var self = this;
    // //获取首页最近新品信息
    // wx.request({
    //   url: app.globalData.api.newList,
    //   success(res) {
    //     self.setData({
    //       goodsList: res.data.data
    //     })
    //   }
    // })
  }
})