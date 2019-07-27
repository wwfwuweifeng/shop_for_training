// pages/contract/infoContent/infoContent.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
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
    expressNum:"",
    // btOperate:"",
    orderInfo:{},
    isShow: false,
    payStype: '0',
    payStypeDesc: "银联",
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
              orderInfo: res.data.data,
              // btOperate: res.data.data.btOperate
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
  },
  fieldInput(event){
    this.setData({
      expressNum : event.detail
    })
  },
  onClickMainAction: function () {
    if (this.data.orderInfo.btOperate=="pay"){
      //付款
      this.setData({
        isShow: true,
      })
    }else if(this.data.orderInfo.btOperate=="send"){
      //发货
      this.setData({isShow:true})
    }else{
      this.signOrReceipt()
    }
  },
  clickRadio: function (event) {
    this.setData({
      payStype: event.target.dataset.name,
      payStypeDesc: event.target.dataset.msg
    });
  },
  payMoney() {
    wx.request({
      url: app.globalData.api.payByOrder,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        token: app.globalData.token,
        orderId: this.data.orderInfo.orderId,
        totalMoney: this.data.orderInfo.order.orderTotalMoney,
        payType: this.data.payStype
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({ 
            isShow: false ,
            orderInfo:res.data.data,
            // btOperate: res.data.data.btOperate
            })
          Toast.success("支付成功");
        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  },
  sendGoods(){
    if (this.data.expressNum === "" ||(this.data.expressNum.length > 0 && this.data.expressNum.trim().length === 0)){
      Notify("请填写快递单号")
    }
    wx.request({
      url: app.globalData.api.sendGoodsForOrder,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        token: app.globalData.token,
        orderId: this.data.orderId,
        expressNum:this.data.expressNum,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            isShow: false,
            orderInfo: res.data.data,
            // btOperate: res.data.data.btOperate
          })
          Toast.success("发货完成");
        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  },
  onClose(){
    this.setData({
      isShow:false
    })
  },
  signOrReceipt(){
    Dialog.confirm({
      title: "请确认",
      message: '是否'+this.data.orderInfo.msgForBt,
      asyncClose: true
    }).then(() => {
      let tip = this.data.orderInfo.msgForBt + "成功";
      wx.request({
        url: app.globalData.api.operateForOrder + this.data.orderInfo.btOperate,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          token: app.globalData.token,
          orderId: this.data.orderId
        },
        success: res => {
          if (res.data.code == 200) {
            Toast.success(tip);
            this.setData({
              isShow: false,
              orderInfo: res.data.data
            })
          } else {
            Toast.fail(res.data.message);
          }
        },
        complete: res => {
          Dialog.close();
        }

      })
    }).catch(() => {
      // on cancel
      Dialog.close();
    });
  }
})