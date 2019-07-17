const app = getApp()
Page({
  data: {
    classifyList: [],
    // categoryCount: 0,
    curIndex: 0,
    isScroll: false,
    toView: ''
  },
  onLoad(){
    wx.request({
      url: app.globalData.api.getGoodsClassifyList,
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (res.data.code === 200) {
          this.setData({
            classifyList: res.data.data,
            toView: 'cid_' + res.data.data[0].firstId
          })
        } else {
          console.log(res.data.message)
        }
      }
    })
  },
  // onReady() {
  //   var self = this;
  //   //获取商品类别
  //   self.setData({
  //     goodsClassify: app.globalData.classify.data,
  //     // categoryCount: app.globalData.classify.data.typeList.length,
  //     toView: 'cid_' + app.globalData.classify.data.typeList[0].id
  //   })
  // },
  switchTab(e) {
    //console.log(e)
    this.setData({
      isScroll: true
    })
    const self = this;
    setTimeout(function () {
      self.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)
  }

})