// pages/user/myInfo/myInfo.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxName: "用户未授权",
    userSex: "只可设置一次",
    sexIsChange:false,
    myInfo: {},
    isEdit: false,
    columns: ['女', '男'],
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
    this.setData({
      myInfo: app.globalData.shopUserInfo.userPersonalInfo,
      ["myInfo.userName"]: app.globalData.shopUserInfo.userSysInfo.userName
    })
    if(this.data.myInfo.userSex==1||this.data.myInfo.userSex==0){
      this.setData({ userSex: this.data.myInfo.userSex == 1?"男":"女"})
    }
  },

  onConfirmSex(event) {
    // console.log(event.detail);
    // const { picker, value, index } = event.detail;
    this.setData({
      isEditSex: false,
      userSex: event.detail.value,
      ["myInfo.userSex"]: event.detail.value=="男"?1:0,
      isEdit: true,
      sexIsChange:true
    })
  },

  onCancelSex() {
    this.setData({ isEditSex: false })
  },
  editSex() {
    if (typeof(this.data.myInfo.sex)!=undefined) {
      Toast("无法修改")
    } else {
      this.setData({ isEditSex: true })
    }
  },

  saveEdit: function () {
    if (this.data.myInfo.userName==null||this.data.myInfo.userName === "" || (this.data.myInfo.userName.length > 0 && this.data.myInfo.userName.trim().length === 0)) {
      Notify("我的姓名不能为空")
    } else if (this.data.myInfo.userSex != 0 && this.data.myInfo.userSex != 1) {
      Notify("性别不能为空")
    }else {
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
          userName: this.data.myInfo.userName,
          userSex: this.data.userSex,
          telNum: this.data.myInfo.telNum,
          email: this.data.myInfo.email,
          shopName: this.data.myInfo.shopName
        },
        success: res => {
          Toast.clear()
          if (res.data.code === 200) {
            this.setData({
              isEdit: false
            })
            app.globalData.shopUserInfo.userPersonalInfo=res.data.data;
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
    }else if(fieldName==="shopName"){
      this.setData({
        ["myInfo.shopName"]: event.detail
      })
    }
  }
})