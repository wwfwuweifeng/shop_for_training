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
    this.loginServer();
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取token
        wx.request({
          url: app.globalData.api.login,
          method: "POST",
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            code: res.code
          },
          success: res => {
            if (res.data.code === 200 && res.data.data.isRegister===1) {  //已注册，登录成功
              app.globalData.token = res.data.data.token;
              app.globalData.shopUserInfo=res.data.data;
              Toast.success("登录成功");
              wx.switchTab({
                url: '/pages/recommend/index/index',
              })
            }else if(res.data.code===200&&res.data.data.isRegister===0){
              app.globalData.token = res.data.data.token;
              Toast.fail("请先注册")
            } else {
              Toast.fail("登录失败")
            }
          }
        })
      },
      fail: res => {
        Toast.fail("稍后重试")
      }
    })
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
    wx.request({
      url: app.globalData.api.registerByCode,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        registerCode: this.data.registerCode,
        token:app.globalData.token
      },
      success: res => {
        if (res.data.code === 200 && res.data.data.isRegister === 1) {  //注册成功
          app.globalData.token = res.data.data.token;
          app.globalData.shopUserInfo = res.data.data;
          Toast.success("注册成功");
          setTimeout(
            () => {
              wx.switchTab({
                url: '/pages/recommend/index/index',
              })},1200
          );
        } else {
          Toast.fail(res.data.message)
        }
      }
    })
  }

})