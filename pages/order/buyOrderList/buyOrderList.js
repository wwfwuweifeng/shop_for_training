// pages/contract/contracts/contracts.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    scrollViewHeight: 0,
    isShowSearchData: false,
    hasMoreData: false,
    nextPage: 1,
    nowPage: 1,
    keyword: "",
    orderList:[],
    orderState:["0","2","3","4","5","6","7"]
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 98;
    this.setData({
      scrollViewHeight: tempHeight,
    });
    this.loadListData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  reachBottom: function () {
    this.loadMoreListData();
  },



  //加载列表数据
  loadListData: function () {
    this.setData({
      isLoadingData: true
    })
    wx.request({
      url: app.globalData.api.getOrderListByBuyer,
      data: {
        token: app.globalData.token,
        pageNum: this.data.nextPage,
        keyword: this.data.keyword,
        state:this.data.orderState[this.data.state]
      },
      success: res => {
        if (res.data.code === 200) {
          let hasMoreData = res.data.data.nowPage != res.data.data.nextPage;
          let tempKeyword = this.data.keyword;
          let temList = this.data.orderList.concat(res.data.data.list)
          this.setData({
            orderList: temList,
            nowPage: res.data.data.nowPage,
            nextPage: res.data.data.nextPage,
            hasMoreData: hasMoreData,
            isShowSearchData: !(tempKeyword === "" || (tempKeyword.length > 0 && tempKeyword.trim().length === 0))
          })
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
        // wx.stopPullDownRefresh();
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
      this.loadListData();
    }
  },

  //搜索
  onSearch: function (e) {
    if (e.detail === "" || (e.detail.length > 0 && e.detail.trim().length === 0)) {
      Notify("搜索关键词不能为空")
    } else if (this.data.isLoadingData) {
      Toast("正在加载数据，请稍后再试")
    } else {
      this.setData({
        orderList: [],
        nowPage: 1,
        nextPage: 1,
        keyword: e.detail
      })
      this.loadListData();
    }
  },

  onCancel: function () {
    if (this.data.isLoadingData) {
      Toast("正在加载数据，请稍后再试")
    } else {
      this.setData({
        keyword: "",
        orderList: [],
        nowPage: 1,
        nextPage: 1
      })
      this.loadListData();
    }
  },
  changeType: function (event) {
    if (this.data.isLoadingData) {
      Toast.fail("数据正在加载中，请稍后再试")
      this.setData({
        stateType: this.data.state
      })
    } else {
      let tempStateType = event.detail.index;
      this.setData({
        keyword: "",
        orderList:[],
        state: tempStateType,
        nowPage: 1,
        nextPage: 1
      })
      this.loadListData();
      
    }
  },
})