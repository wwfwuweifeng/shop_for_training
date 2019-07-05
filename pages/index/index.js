import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerCode:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.loginServer();


    if (app.globalData.isRegistered===1){
      wx.switchTab({
        url: 'pages/recommend/index / index'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  //登陆微信服务器和自己的应用服务器
  loginServer:function(){
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '尝试登陆中',
      loadingType: 'spinner',
      mask: true
    });

    setTimeout(() => {
      Toast.fail("请先注册")
    }, 1200)
  },

  fieldInput: function (e) {
    this.setData({
      registerCode: e.detail
    })
  },
  register:function(){
    Toast.loading({
      duration: 1500, // 持续展示 toast ,到时候记得改为0
      forbidClick: true, // 禁用背景点击
      message: '注册中',
      loadingType: 'spinner',
      mask: true
    });

    setTimeout(() => {
      Toast.success("注册成功"),
      wx.switchTab({
        url: '/pages/recommend/index/index',
      })
    }, 1200)
  }

})