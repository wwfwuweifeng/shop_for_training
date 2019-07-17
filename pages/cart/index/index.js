// page/component/new-pages/cart/cart.js
const app=getApp()
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
  },
  onShow() {
    // var self = this;

    
    // // var localCarts = wx.getStorageSync('carts');
    // var localCarts = app.globalData.cartList;

    // // console.log(localCarts);
    // this.setData({
    //   carts: localCarts,
    //   hasList: false
    // });
    // if (localCarts.length > 0) {
    //   self.setData({
    //     hasList: true
    //   });
    //   self.getTotalPrice();
    // }

    this.getCarts();

  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    let isAllSelect = this.data.selectAllStatus && !selected
    this.setData({
      carts: carts,
      selectAllStatus:isAllSelect
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    wx.setStorageSync('carts', carts);
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    //判断是否小于等于库存
    if (num + 1 > carts[index].inventory) {
      wx.showModal({
        title: '提示',
        content: '已达到最大库存',
        showCancel: false
      })
      return;
    }
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    wx.setStorageSync('carts', carts);
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    wx.setStorageSync('carts', carts);
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  /**
   * 获取购物车列表
   */
  getCarts(){
    wx.request({
      url: app.globalData.api.getGoodsListByCart,
      data:{
        token:app.globalData.token
      },
      success:res=>{
        if(res.data.code==200){
          this.setData({
            carts:res.data.data,
            hasList: res.data.data.length>0?true:false
          })
        }
      }
    })
  }

})