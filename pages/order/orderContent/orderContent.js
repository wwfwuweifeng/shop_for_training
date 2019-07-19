// pages/contract/infoContent/infoContent.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    scrollViewHeight: 0,
    orderId:"",
    role:0,
    orderInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 50;
    this.setData({
      scrollViewHeight: tempHeight,
      orderId: options.orderId,
      role: options.role
  });
    this.loadOrderInfo();
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadOrderInfo(true)
  },

  onClickMainAction: function () {
    
  },

  //取消按钮
  onClickCancel: function () {
    Dialog.confirm({
      title: "请确认",
      message: '是否取消该订单',
      asyncClose: true
    }).then(() => {
      wx.request({
        url: app.globalData.api.cancelOrder,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          token: app.globalData.token,
          orderId: this.data.orderId,
          role:this.data.role
        },
        success: res => {
          if (res.data.code === 200) { //响应成功
            Toast.success("取消成功")
            this.setData({
              orderInfo: res.data.data
            })
          } else { //响应失败
            Toast.fail(res.data.message);
          }
        },
        fail: res => {
          Toast.fail("网络异常");
          // Toast.fail("网络异常，请稍后再试");
        },
        complete: res => {
          Dialog.close();
        }

      })
    }).catch(() => {
      // on cancel
      Dialog.close();
    });
  },

  //加载合同信息
  loadOrderInfo: function (showTips) {
    wx.request({
      url: app.globalData.api.getOrderDetail,
      data: {
        token: app.globalData.token,
        orderId: this.data.orderId,
        role:this.data.role
      },
      success: res => {
        if (res.data.code === 200) { //响应成功
          this.setData({
            orderInfo: res.data.data,
          })
          if (showTips) {
            Toast.success("刷新成功")
          }
        } else { //响应失败
          Toast.fail(res.data.message);
        }
      },
      fail: res => {
        Toast.fail("网络异常");
        // Toast.fail("网络异常，请稍后再试");
      },
      complete: res => {
        wx.stopPullDownRefresh();
      }
    })
  }
})