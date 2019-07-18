// pages/user/myInfo/myInfo.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPersonalInfo:{},
    address: [],
    isEdit: false,
    myAddress: "点击设置",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userPersonalInfo: app.globalData.shopUserInfo.userPersonalInfo
    })
  },


  bindRegionChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let region = e.detail.value;
    let myAddress;
    if (region[0] === region[1]) {
      myAddress = region[0] + "-"
    } else {
      myAddress = region[0] + "-" + region[1] + "-"
    }
    myAddress = myAddress + region[2]
    this.setData({
      address: region,
      ["userPersonalInfo.receiverAddressSimple"]: myAddress,
      isEdit: true
    })
  },

  saveEdit: function () {
    if (typeof (this.data.userPersonalInfo.receiverName) == "undefined"||this.data.userPersonalInfo.receiverName === "" ||this.data.userPersonalInfo.receiverName.trim().length === 0){
      Notify("收货人的姓名不能为空")
    } else if (typeof (this.data.userPersonalInfo.receiverTel) == "undefined"||this.data.userPersonalInfo.receiverTel === "" || this.data.userPersonalInfo.receiverTel.trim().length === 0){
      Notify("收货人的手机号码不能为空")
    } else if (typeof (this.data.userPersonalInfo.receiverAddressSimple) == "undefined" ||this.data.userPersonalInfo.receiverAddressSimple === "" || this.data.userPersonalInfo.receiverAddressSimple.trim().length === 0) {
      Notify("所在地区不能为空")
    } else if (typeof (this.data.userPersonalInfo.receiverAddressDetail) == "undefined" ||this.data.userPersonalInfo.receiverAddressDetail === "" || this.data.userPersonalInfo.receiverAddressDetail.trim().length === 0) {
      Notify("详细地址不能为空")
    }else {
      this.submitEdit();
    }
  },
  fieldInput: function (event) {
    if (!this.data.isEdit) {
      this.setData({ isEdit: true })
    }
    // console.log(event)
    let fieldName = event.target.dataset.field;
    if (fieldName === "receiverName") {
      this.setData({
        ["userPersonalInfo.receiverName"]: event.detail,
      })
    } else if (fieldName === "receiverTel") {
      this.setData({
        ["userPersonalInfo.receiverTel"]: event.detail
      })
    } else if (fieldName === "receiverAddressDetail") {
      this.setData({
        ["userPersonalInfo.receiverAddressDetail"]: event.detail
      })
    }
  },
  submitEdit(){
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '保存中',
      loadingType: 'spinner',
      mask: true
    });
    wx.request({
      url: app.globalData.api.editUserInfo,
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        token: app.globalData.token,
        receiverName: this.data.userPersonalInfo.receiverName,
        receiverTel: this.data.userPersonalInfo.receiverTel,
        receiverAddressSimple: this.data.userPersonalInfo.receiverAddressSimple,
        receiverAddressDetail: this.data.userPersonalInfo.receiverAddressDetail,
        isEditReceiverAddress: 1
      },
      success: res => {
        Toast.clear()
        if (res.data.code === 200) {
          this.setData({
            userPersonalInfo: res.data.data,
            isEdit: false
          })
          app.globalData.shopUserInfo.userPersonalInfo = res.data.data
          Toast.success("保存成功")
        } else {
          Toast.fail(res.data.message)
        }
      },
      fail: res => {
        Toast.fail('网络异常');
      }
    })
  }
})