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
    userInfoTitle: "",
    goodsList:[],
    sumMoney:100.35
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 50;
    this.setData({
      scrollViewHeight: tempHeight,
      goodsList: app.globalData.goodsList.list,
      goodsSteps: [
        {
          text: '等待揽件',
        },
        {
          text: '已发货',
          desc: '2019.01.01 12:05:00'
        },
        {
          text: '已付款',
          desc: '2019.01.01 12:02:00'
        }, 
        {
          text: '已下单',
          desc: '2019.01.01 12:00:00'
        }
      ]
      // contractId:"1130 6973 3022 0607"
    });
    // this.loadContractInfo(false);
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadContractInfo(true)
  },

  //立即付款
  onClickMainAction: function () {
    
  },

  //取消按钮
  onClickCancel: function () {
    Dialog.confirm({
      title: "请确认",
      message: '是否取消该合同',
      asyncClose: true
    }).then(() => {
      wx.request({
        url: app.globalData.api.cOperateCancel,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          token: app.globalData.token,
          contractId: this.data.contractId
        },
        success: res => {
          if (res.data.code === 200) { //响应成功
            Toast.success("取消成功")
            this.setData({
              contractInfo: res.data.data
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
  loadContractInfo: function (showTips) {
    wx.request({
      url: app.globalData.api.cInfoInfoContent,
      data: {
        token: app.globalData.token,
        contractId: this.data.contractId
      },
      success: res => {
        if (res.data.code === 200) { //响应成功
          this.setData({
            contractInfo: res.data.data,
            buttonMsgForHide: res.data.data.buttonMsgForHide,
            buttonMsgForRescind: res.data.data.buttonMsgForRescind
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
  },
  seeContract: function () {
    wx.navigateTo({
      url: "/pages/contract/fileContent/fileContent?contractId=" + this.data.contractId
    })
  },
  clickConfirm() {
    this.setData({ isShowUserInfo: false })
  }



})