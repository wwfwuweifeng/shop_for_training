import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({
  data: {
    recommendInfo:null,
    scrollViewHeight: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  onLoad: function () {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 54;
    this.setData({
      scrollViewHeight: tempHeight,
    });
    //获取首页最近新品信息
    wx.request({
      url: app.globalData.api.getRecommendGoods,
      data:{
        token:app.globalData.token
        },
      success:res=> {
        if(res.data.code===200){
          this.setData({
            recommendInfo: res.data.data
          })
        }else{
          console.log(res.data.message)
        }
      }
    })
  },

  //搜索
  onSearch: function (e) {
    if (e.detail === "" || e.detail=== null || (e.detail.length > 0 && e.detail.trim().length === 0)) {
      Toast("搜索关键词不能为空")
    }else{
      wx.navigateTo({
        url: '/pages/goods/goodsList/goodsList?keyword='+e.detail,
      })
    }
  },
})