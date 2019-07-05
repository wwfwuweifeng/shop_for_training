// pages/user/myInfo/myInfo.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxName: "用户未授权",
    userSex: "只可设置一次",
    myInfo: {},
    address: [],
    isEdit: false,
    myAddress: "点击设置",
    columns: ['男', '女'],
    isEditSex: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Toast({
    //   duration: 0, // 持续展示 toast
    //   message: '功能开发中...',
    // });
    if (app.globalData.userInfo) {
      this.setData({
        wxName: app.globalData.userInfo.nickName
      })
    }
    wx.request({
      url: app.globalData.api.uDetailedInfo,
      data: {
        token: app.globalData.token,
        wxName: this.data.wxName
      },
      success: res => {
        if (res.data.code === 200) {
          this.setData({
            myInfo: res.data.data,
            userSex: res.data.data.userSex === "" ? this.data.userSex : res.data.data.userSex,
            myAddress: res.data.data.address === "" ? this.data.myAddress : res.data.data.address
          })
        } else {
          Toast.fail(res.data.message)
        }
      },
      fail: res => {
        Toast.fail('网络异常');
      }
    })
    console.log("myInfo.onlaundch isperfectinfo=" + app.globalData.isPerfectInfo)
  },

  onConfirmSex(event) {
    // console.log(event.detail);
    // const { picker, value, index } = event.detail;
    this.setData({
      isEditSex: false,
      userSex: event.detail.value,
      ["myInfo.userSex"]: event.detail.value,
      isEdit: true
    })
  },

  onCancelSex() {
    this.setData({ isEditSex: false })
  },
  editSex() {
    if (this.data.myInfo.isAllowModify === 0) {
      Toast("无法修改")
    } else {
      this.setData({ isEditSex: true })
    }
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
      ["myInfo.address"]: myAddress,
      myAddress: myAddress,
      isEdit: true
    })
  },

  saveEdit: function () {
    if (this.data.myInfo.userName === "" || (this.data.myInfo.userName.length > 0 && this.data.myInfo.userName.trim().length === 0)) {
      Notify("我的姓名不能为空")
    } else if (this.data.myInfo.userSex === "" || (this.data.myInfo.userSex.length > 0 && this.data.myInfo.userSex.trim().length === 0)) {
      Notify("性别不能为空")
    } else {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '保存中',
        loadingType: 'spinner',
        mask: true
      });
      wx.request({
        url: app.globalData.api.uEditUserInfo,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          token: app.globalData.token,
          wxName: this.data.myInfo.wxName,
          userName: this.data.myInfo.userName,
          userSex: this.data.myInfo.userSex,
          telNum: this.data.myInfo.telNum,
          email: this.data.myInfo.email,
          address: this.data.myInfo.address
        },
        success: res => {
          Toast.clear()
          if (res.data.code === 200) {
            this.setData({
              myInfo: res.data.data,
              userSex: res.data.data.userSex === "" ? this.data.userSex : res.data.data.userSex,
              myAddress: res.data.data.address === "" ? this.data.myAddress : res.data.data.address,
              isEdit: false
            })
            Toast.success("保存成功")
            //此部分只是临时使用
            // app.globalData.isPerfectInfo = 1;
            // wx.setStorageSync("isPerfectInfo", 1)
            //下面的才是正确的代码
            app.globalData.userName = this.data.myInfo.userName;
            wx.setStorageSync("userName", this.data.myInfo.userName)
            app.globalData.isPerfectInfo = res.data.data.isPerfectInfo;
            wx.setStorageSync("isPerfectInfo", res.data.data.isPerfectInfo)
            // console.log("myInfo.save isperfectinfo=" + app.globalData.isPerfectInfo)
          } else {
            Toast.fail(res.data.message)
          }
        },
        fail: res => {
          Toast.fail('网络异常');
        }
      })
    }
  },
  fieldInput: function (event) {
    if (!this.data.isEdit) {
      this.setData({ isEdit: true })
    }
    // console.log(event)
    let fieldName = event.target.dataset.field;
    if (fieldName === "userName") {
      this.setData({
        ["myInfo.userName"]: event.detail,
      })
    } else if (fieldName === "telNum") {
      this.setData({
        ["myInfo.telNum"]: event.detail
      })
    } else if (fieldName === "email") {
      this.setData({
        ["myInfo.email"]: event.detail
      })
    }
  }
})