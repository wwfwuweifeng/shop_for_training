const app = getApp()
Page({
  data: {
    category: [],
    categoryCount: 0,
    curIndex: 0,
    isScroll: false,
    toView: ''
  },
  onReady() {
    var self = this;
    //获取商品类别
    self.setData({
      category: app.globalData.classify.data,
      categoryCount: app.globalData.classify.data.typeList.length,
      toView: 'cid_' + app.globalData.classify.data.typeList[0].id
    })
  },
  switchTab(e) {
    //console.log(e)
    const self = this;
    this.setData({
      isScroll: true
    })
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