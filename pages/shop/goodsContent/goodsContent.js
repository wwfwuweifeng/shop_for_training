const app = getApp()
Page({
  data: {
    scrollViewHeight: 0,
    goods: [],
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  onLoad: function (options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 50;
    this.setData({
      scrollViewHeight: tempHeight,
      // contractId:"1130 6973 3022 0607"
    });

    var self = this;
    self.setData({
      goods: {
        "id": "392ec96928d849bb86858dec5c72369f",
        "name": "红枣",
        "type": "干果",
        "standard": "500g",
        "sellPrice": 22,
        "originalPrice": 30,
        "inventory": 71,
        "integral": 4,
        "introduce": "关于红枣商品描述",
        "picture": "http://s.twinking.cn/files/eshop/g3.png"
      }
    })

    // wx.request({
    //   url: app.globalData.api.goodsDetail,
    //   data: {
    //     id: options.goodsId
    //   },
    //   success: function (res) {
    //     //查看是否加入过购物车
    //     self.findInCarts(options.goodsId);
    //   }
    // })
  },
  findInCarts(goodsId) {
    var carts = wx.getStorageSync('carts');
    for (var i = 0; i < carts.length; i++) {
      var goods = carts[i];
      if (goodsId == goods.id) {
        this.setData({
          hasCarts: true,
          totalNum: goods.num
        })
        return;
      }
    }
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },

  addToCart() {
    console.log("i am add to cart")
    const self = this;
    //本次添加数量
    const num = this.data.num;
    //添加总数量
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout(function () {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true

        })
        self.putGoodsToCarts();
      }, 200)
    }, 300)
    this.setData({
      totalNum: num + total
    })
  },

  //将数据存入微信缓存
  putGoodsToCarts() {
    var carts = wx.getStorageSync('carts');
    for (var i = 0; i < carts.length; i++) {
      var goods = carts[i];
      if (this.data.goods.id == goods.id) {
        //缓存存在商品 更新缓存信息
        goods.id = this.data.goods.id;
        goods.title = this.data.goods.name;
        goods.image = this.data.goods.picture;
        goods.standard = this.data.goods.standard;
        goods.integral = this.data.goods.integral;
        goods.inventory = this.data.goods.inventory;
        goods.num = this.data.num + goods.num;
        goods.originalPrice = this.data.goods.originalPrice;
        goods.price = this.data.goods.sellPrice;
        wx.setStorageSync('carts', carts);
        return;
      }
    }
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }

})