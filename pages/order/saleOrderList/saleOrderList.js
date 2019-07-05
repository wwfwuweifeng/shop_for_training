// pages/contract/contracts/contracts.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
const myConst = app.globalConst;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterCondition: 0,
    stateType: 0,
    scrollViewHeight: 0,
    showTabs: false,
    contractList: [],
    isShowSearchData: false,
    hasMoreData: false,
    nextPage: 1,
    nowPage: 1,
    keyWord: "",
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let contractType = myConst.filterCondition[options.filterCondition];
    // if (typeof (contractType) != "undefined") {
    //   wx.setNavigationBarTitle({
    //     title: contractType.barTitle
    //   });
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 98;
    this.setData({
      // filterCondition: contractType.state,
      scrollViewHeight: tempHeight,
      // orderList: app.globalData.orderList
      // showTabs: contractType.showTabs
    });
    // this.loadListData(false)
  },

  onShow: function (options) {
    // this.loadListData(false)
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

  changeType: function (event) {
    if (this.data.isLoadingData) {
      Toast.fail("数据正在加载中，请稍后再试")
      this.setData({
        stateType: this.data.stateType
      })
    } else {
      let tempStateType = event.detail.index;
      tempStateType = tempStateType == 0 ? 0 : tempStateType + 1
      this.setData({
        stateType: tempStateType
      })
      if (this.data.isShowSearchData) {
        this.loadSearchData()
      } else {
        this.loadListData(false)
      }
    }
  },

  //加载列表数据
  loadListData: function (isShowTips) {
    this.setData({
      isLoadingData: true
    })
    wx.request({
      url: app.globalData.api.cInfoList,
      data: {
        token: app.globalData.token,
        pageNum: 1,
        pageSize: 3,
        filterCondition: this.data.filterCondition,
        stateType: this.data.stateType
      },
      success: res => {
        if (res.data.code === 200) {
          let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
          this.setData({
            contractList: res.data.data.list,
            nowPage: res.data.data.nowPage,
            nextPage: res.data.data.nextPage,
            hasMoreData: hasMoreData,
            isShowSearchData: false
          })
          if (isShowTips) {
            Toast.success("刷新成功");
          }
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
        url: app.globalData.api.cInfoList,
        data: {
          token: app.globalData.token,
          pageNum: this.data.nextPage,
          pageSize: 3,
          filterCondition: this.data.filterCondition,
          stateType: this.data.stateType
        },
        success: res => {
          if (res.data.code === 200) {
            let temList = this.data.contractList.concat(res.data.data.list)
            // temList.push(res.data.data.list)
            let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
            this.setData({
              contractList: temList,
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
  loadSearchData: function () {
    this.setData({ isLoadingData: true })
    wx.request({
      url: app.globalData.api.cInfoSearch,
      data: {
        token: app.globalData.token,
        keyWord: this.data.keyWord,
        filterCondition: this.data.filterCondition,
        stateType: this.data.stateType,
        pageNum: 1,
        pageSize: 3
      },
      success: res => {
        if (res.data.code === 200) {
          let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
          this.setData({
            contractList: res.data.data.list,
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
        url: app.globalData.api.cInfoSearch,
        data: {
          token: app.globalData.token,
          pageNum: this.data.nextPage,
          keyWord: this.data.keyWord,
          pageSize: 3,
          filterCondition: this.data.filterCondition,
          stateType: this.data.stateType
        },
        success: res => {
          if (res.data.code === 200) {
            let temList = this.data.contractList.concat(res.data.data.list)
            // temList.push(res.data.data.list)
            let hasMoreData = res.data.data.nowPage != res.data.data.nextPage
            this.setData({
              contractList: temList,
              contractList: res.data.data.list,
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
})