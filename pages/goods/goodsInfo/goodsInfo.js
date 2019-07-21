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
    goodsId: "",
    goods:{},
    goodsInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 50;
    this.setData({
      scrollViewHeight: tempHeight,
      goodsId: options.goodsId,
    });
    this.loadGoodsInfo();
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadGoodsInfo()
  },

  onClickMainAction: function () {

  },

  //取消按钮
  onLowerShelf: function () {
    Dialog.confirm({
      title: "请确认",
      message: '是否下架该商品',
      asyncClose: true
    }).then(() => {
      wx.request({
        url: app.globalData.api.operateGoodsStateBySeller,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          token: app.globalData.token,
          goodsId: this.data.goodsId,
          operate: 2
        },
        success: res => {
          if (res.data.code === 200) { //响应成功
            Toast.success("商品已下架")
            this.setData({
              goodsInfo: res.data.data
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
  loadGoodsInfo: function () {
    wx.request({
      url: app.globalData.api.getGoodsDetailBySeller,
      data: {
        token: app.globalData.token,
        goodsId: this.data.goodsId,
      },
      success: res => {
        if (res.data.code === 200) { //响应成功
          this.setData({
            goodsInfo: res.data.data,
            goods: res.data.data.goods
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
        wx.stopPullDownRefresh();
      }
    })
  }
})