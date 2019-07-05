// pages/template/templates/templates.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateList: [],
    nowPage: 1,
    nextPage: 1,
    isLoadingData: false,
    isRefreshing: false,
    hasMoreData: true,
    scrollViewHeight: 0,
    keyWord: "",
    isShowSearchData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 54;
    this.setData({
      scrollViewHeight: tempHeight,
    });


    this.loadListData(false);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.isLoadingData || this.data.isRefreshing) {
      Toast("正在加载数据，请稍后再试")
      wx.stopPullDownRefresh();
    } else {
      this.setData({ isRefreshing: true })
      if (this.data.isShowSearchData) {
        this.loadSearchData();
      } else {
        this.loadListData(true);
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  reachBottom: function () {
    if (this.data.isShowSearchData) {
      this.loadMoreSearchData();
    } else {
      this.loadMoreListData();
    }
  },



  //加载列表数据
  loadListData: function (isShowTips) {

    this.setData({
      goodsList: app.globalData.goodsList.list,
      nowPage: app.globalData.goodsList.nowPage,
      nextPage: app.globalData.goodsList.nextPage,
      hasMoreData: false,
      isShowSearchData: false
    })

    // this.setData({
    //   isLoadingData: true
    // })
    // wx.request({
    //   url: app.globalData.api.tInfoList,
    //   data: {
    //     token: app.globalData.token,
    //     pageNum: 1,
    //     pageSize: 3
    //   },
    //   success: res => {
    //     if (res.data.code === 200) {
    //       let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
    //       this.setData({
    //         templateList: res.data.data.list,
    //         nowPage: res.data.data.nowPage,
    //         nextPage: res.data.data.nextPage,
    //         hasMoreData: hasMoreData,
    //         isShowSearchData: false
    //       })
    //       if (isShowTips) {
    //         Toast.success("刷新成功");
    //       }
    //     } else {
    //       Toast.fail(res.data.message);
    //     }
    //   },
    //   fail: res => {
    //     Toast.fail("网络异常");
    //   },
    //   complete: res => {
    //     this.setData({
    //       isLoadingData: false,
    //       isRefreshing: false
    //     })
    //     wx.stopPullDownRefresh();
    //   }
    // })
  },

  //加载更多列表数据
  loadMoreListData: function () {
    if (this.data.nowPage === this.data.nextPage) {
      Toast("没有更多内容啦")
    } else if (this.data.isLoadingData) {
      Toast("正在加载数据，请稍后再试")
    } else {
      this.setData({ isLoadingData: true })
      wx.request({
        url: app.globalData.api.tInfoList,
        data: {
          token: app.globalData.token,
          pageNum: this.data.nextPage,
          pageSize: 3
        },
        success: res => {
          if (res.data.code === 200) {
            let temList = this.data.templateList.concat(res.data.data.list)
            // temList.push(res.data.data.list)
            let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
            this.setData({
              templateList: temList,
              nowPage: res.data.data.nowPage,
              nextPage: res.data.data.nextPage,
              hasMoreData: hasMoreData,
              isShowSearchData: false
            })
          } else {
            Toast.fail(res.data.messege);
          }
        },
        fail: res => {
          Toast.fail("网络异常");
        },
        complete: res => {
          this.setData({ isLoadingData: false })
          wx.stopPullDownRefresh();
        }
      })
    }
  },

  //搜索
  onSearch: function (e) {
    if (e.detail === "" || (e.detail.length > 0 && e.detail.trim().length === 0)) {
      Notify("搜索关键词不能为空")
    } else if (this.data.isLoadingData) {
      Toast("正在加载数据，请稍后再试")
    } else {
      this.setData({ keyWord: e.detail })
      this.loadSearchData();
    }
  },

  onCancel: function () {
    if (this.data.isLoadingData) {
      Toast("正在加载数据，请稍后再试")
    } else {
      this.loadListData(false);
    }
  },

  //加载更多的搜索数据
  loadMoreSearchData: function () {
    if (this.data.nowPage === this.data.nextPage) {
      Toast("没有更多内容啦")
      return;
    } else if (this.data.isLoadingData) {
      Toast("正在加载中")
      return;
    } else {
      this.setData({ isLoadingData: true })
      wx.request({
        url: app.globalData.api.tInfoSearch,
        data: {
          token: app.globalData.token,
          pageNum: this.data.nextPage,
          keyWord: this.data.keyWord,
          pageSize: 3
        },
        success: res => {
          if (res.data.code === 200) {
            let temList = this.data.templateList.concat(res.data.data.list)
            // temList.push(res.data.data.list)
            let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
            this.setData({
              templateList: temList,
              nowPage: res.data.data.nowPage,
              nextPage: res.data.data.nextPage,
              hasMoreData: hasMoreData,
              isShowSearchData: true
            })
          } else {
            Toast.fail(res.data.messege);
          }
        },
        fail: res => {
          Toast.fail("网络异常");
        },
        complete: res => {
          this.setData({ isLoadingData: false })
        }
      })
    }
  },

  loadSearchData: function () {
    this.setData({ isLoadingData: true })
    wx.request({
      url: app.globalData.api.tInfoSearch,
      data: {
        token: app.globalData.token,
        keyWord: this.data.keyWord,
        pageSize: 3
      },
      success: res => {
        if (res.data.code === 200) {
          let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
          this.setData({
            templateList: res.data.data.list,
            nowPage: res.data.data.nowPage,
            nextPage: res.data.data.nextPage,
            hasMoreData: hasMoreData,
            isShowSearchData: true
          })
          Toast.success("搜索完成");
        } else {
          Toast.fail(res.data.message);
        }
      },
      fail: res => {
        Toast.fail("网络异常");
      },
      complete: res => {
        this.setData({
          isLoadingData: false,
          isRefreshing: false
        })
        wx.stopPullDownRefresh();
      }
    })
  }
})