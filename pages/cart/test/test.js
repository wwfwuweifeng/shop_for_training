// pages/cart/test/test.js
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    hasList: false,
    selectAllStatus: false,
    sumPrice: 0,
    totalPriceStr:"0.00"
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCarts();
    app.globalData.cartsForOrder = [];
  },
  selectGoods(event) {

    let goodsId = event.target.dataset.goods_id;
    let checked = event.target.dataset.checked;
    // console.log(checked);
    // console.log(goodsId);
    let newCarts = this.data.carts;
    let sumPrice = this.data.sumPrice;
    for (let cart of newCarts) {
      // console.log(cart.shopName);
      for (let goods of cart.list) {
        // console.log(goods.goodsId)
        if (goodsId === goods.goodsId) {
          goods.checked = checked;
          if (checked === "1") { //选中
            sumPrice = sumPrice + (goods.price * goods.buyNum) / 100;

          } else {
            sumPrice = sumPrice - (goods.price * goods.buyNum) / 100;
          }
          this.setData({
            totalPriceStr: sumPrice.toFixed(2),
            sumPrice: sumPrice,
            carts: newCarts,
            selectAllStatus: checked == 0 ? false : this.data.selectAllStatus
          })
          return;
        }
      }
    }
    Toast.fail("操作非法");
  },

  delGoodsFromCart(event) {
    var goodsId = event.target.dataset.goods_id;
    let newCarts = this.data.carts;
    let sumPrice = this.data.sumPrice;
    wx.request({
      url: app.globalData.api.delGoodsFromCart,
      data: {
        token: app.globalData.token,
        goodsId: goodsId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.code === 200) {
          for (let cart of newCarts) {
            // console.log(cart.shopName);
            for (let i = 0; i < cart.list.length; i++) {
              // console.log(goodsId)
              if (goodsId === cart.list[i].goodsId) {
                if (cart.list[i].checked === "1") { //删除前处于选中状态
                  sumPrice = sumPrice - (cart.list[i].price * cart.list[i].buyNum) / 100;
                }
                cart.list.splice(i, 1)
                if (newCarts.length === 1 && cart.list.length === 0) {
                  this.setData({
                    carts: newCarts,
                    hasList: false,
                    totalPriceStr: sumPrice.toFixed(2),
                    sumPrice: sumPrice
                  })
                } else {
                  this.setData({
                    carts: newCarts,
                    totalPriceStr: sumPrice.toFixed(2),
                    sumPrice: sumPrice
                  })
                }
                return;
              }
            }
          }
          Toast.fail("操作非法");

        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  },
  /**
   * 获取购物车列表
   */
  getCarts() {
    wx.request({
      url: app.globalData.api.getGoodsListByCart,
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (res.data.code == 200) {
          let carts = res.data.data;
          for (let cart of carts) {
            // console.log(cart.shopName);
            for (let goods of cart.list) {
              // console.log(goods.goodsId)
              goods.checked = "0";
              goods.buyNum = 1;
            }
          }
          this.setData({
            carts: carts,
            hasList: res.data.data.length > 0 ? true : false
          })
        }
      }
    })
  },

  selectAll() {
    let sumPrice = 0;
    let newCarts = this.data.carts;
    for (let cart of newCarts) {
      // console.log(cart.shopName);
      for (let goods of cart.list) {
        // console.log(goods.goodsId)
        if (this.data.selectAllStatus) {
          //原本处于全选状态，此时应该是取消全选
          goods.checked = "0";
        } else {
          goods.checked = "1";
          sumPrice = (goods.price * goods.buyNum) / 100 + sumPrice;
        }
      }
    }
    this.setData({
      carts: newCarts,
      totalPriceStr: sumPrice.toFixed(2),
      sumPrice: sumPrice,
      selectAllStatus: !this.data.selectAllStatus
    })
  },

  addNum(event) {
    let goodsId = event.target.dataset.goods_id;
    let newCarts = this.data.carts;
    let sumPrice = this.data.sumPrice;
    for (let cart of newCarts) {
      // console.log(cart.shopName);
      for (let goods of cart.list) {
        // console.log(goods.goodsId)
        if (goodsId === goods.goodsId) {
          goods.buyNum += 1
          if(goods.checked==1){
            sumPrice = sumPrice + goods.price / 100;
          }
          this.setData({
            totalPriceStr: sumPrice.toFixed(2),
            sumPrice: sumPrice,
            carts: newCarts
          })
          return;
        }
      }
    }
  },

  subNum(event) {
    let goodsId = event.target.dataset.goods_id;
    let newCarts = this.data.carts;
    let sumPrice = this.data.sumPrice;
    for (let cart of newCarts) {
      // console.log(cart.shopName);
      for (let goods of cart.list) {
        // console.log(goods.goodsId)
        if (goodsId === goods.goodsId) {
          goods.buyNum -= 1
          if (goods.checked == 1) {
            sumPrice = sumPrice - goods.price / 100;
          }
          this.setData({
            totalPriceStr: sumPrice.toFixed(2),
            sumPrice: sumPrice,
            carts: newCarts
          })
          return;
        }
      }
    }
  },
  goToSubmit() {
    let _obj = JSON.stringify(this.data.carts);
    let newCarts = JSON.parse(_obj);
    // let newCarts = this.data.carts;
    for (let cart of newCarts) {
      // console.log(cart.shopName);
      for (let i = 0; i < cart.list.length; i++) {
        // console.log(goodsId)
        if (cart.list[i].checked === "0") {
          cart.list.splice(i, 1);
          i -= 1;
        }
      }
      if(cart.list.length>0){
        app.globalData.cartsForOrder.push(cart)
      }
    }
    if(app.globalData.cartsForOrder.length>0){
      wx.navigateTo({
        url: '/pages/order/submitOrder/submitOrder?sumPrice=' + this.data.sumPrice * 100,//因为后面提交订单栏的单位是分
      })
    }else{
      Toast.fail("请选择要购买的商品")
    }
  }
})