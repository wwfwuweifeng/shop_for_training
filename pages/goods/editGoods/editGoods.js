import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: { classifyName: "点击选择"},
    isSelectUploadImage:false,
    goodsId:"",
    active: 0,
    tags:{},
    containerViewHeight: 0,
    isShow: false,
    showMessage: "",
    isShowClassify: false,
    goodsClassifies: {},
    columns: [],
    goodsParamList:[],
    paramKey:"",
    paramValue:"",
    imageFilePath:"",
    steps: [{text: '商品信息'},{text: '商品介绍'},{text: '商品参数'},{text: '商品封面'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var sysInfo = wx.getSystemInfoSync();
    var tempHeight = sysInfo.windowHeight - 54;
    let goodsId =typeof (options.goodsId) == "undefined" ? "" : options.goodsId
    this.setData({
      containerViewHeight: tempHeight,
      goodsId:goodsId,
      ["goods.goodsId"]:goodsId
    });
    this.loadGoodsInfo();
    this.loadGoodsClassify();
  },

  fieldInput: function(event) {
    let fieldName = event.target.dataset.field;
    if (fieldName === "name") {
      this.setData({
        ["goods.name"]: event.detail
      })
    } else if (fieldName === "price") {
      this.setData({
        ["goods.strPrice"]: event.detail
      })
    } else if (fieldName === "remainNum") {
      this.setData({
        ["goods.remainNum"]: event.detail
      })
    } else if(fieldName==="detail"){
      this.setData({
        ["goods.detail"]:event.detail
      })
    }else{
      console.log("fieldName为非法值");
    }
  },
  onConfirmClassify: function(event) {
    // console.log(event.detail.value)
    this.setData({
      isShowClassify: false,
      ["goods.classifyName"]: event.detail.value[1]
    })
  },
  onClose() {
    this.setData({
      isShowClassify: false
    });
  },
  showClassify(event) {
    this.setData({
      isShowClassify: true
    });
  },
  loadGoodsClassify() {
    let goodsClassifies = {}
    wx.request({
      url: app.globalData.api.getGoodsClassifyList,
      data: {
        token: app.globalData.token
      },
      success: res => {
        let parentClassify="";
        if (res.data.code === 200) {
          for (let firstClassify of res.data.data) {
            let secondClassifies = []
            for (let secondClassify of firstClassify.secondGoodsClassifyList) {
              secondClassifies.push(secondClassify.classifyName)
            }
            if (secondClassifies.length > 0) {
              if (parentClassify==""){
                parentClassify = firstClassify.firstClassifyName;
              }
              goodsClassifies[firstClassify.firstClassifyName] = secondClassifies
            }
          }
          let columns = [{
              values: Object.keys(goodsClassifies),
              className: 'column1'
            },
            {
              values: goodsClassifies[parentClassify],
              className: 'column2',
            }
          ]
          this.setData({
            goodsClassifies: goodsClassifies,
            columns: columns
          })
        }
      }
    })
  },
  onChangeClassify(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, this.data.goodsClassifies[value[0]]);
  },
  selectImage(){
    var self=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        self.setData({ imageFilePath: res.tempFilePaths[0], isSelectUploadImage:true})
      },
      fail(res){
        Toast.fail("选择失败")
      }
    })
  },
  addParam(){
    if (this.data.paramKey === "" || (this.data.paramKey.length > 0 && this.data.paramKey.trim().length === 0)){
      Notify("参数名不能为空")
    } else if (this.data.paramValue === "" || (this.data.paramValue.length > 0 && this.data.paramValue.trim().length === 0)) {
      Notify("参数值不能为空")
    }else{
      let paramList=this.data.goodsParamList;
      paramList.push({ paramName: this.data.paramKey, paramValue:this.data.paramValue})
      this.setData({
        goodsParamList:paramList,
        paramKey:"",
        paramValue: ""
      })
      // this.setData({ paramValue: ""})
    }
  },
  delParam(event){
    let index = event.target.dataset.index;
    let paramList=this.data.goodsParamList;
    paramList.splice(index,1)
    this.setData({
      goodsParamList:paramList
    })
  },
  fieldInputTag(event){
    let fieldName = event.target.dataset.field;
    if(fieldName==="tagOne"){
      this.setData({ ["tags.tagOne"]:event.detail})
    }else if(fieldName==="tagTwo"){
      this.setData({ ["tags.tagTwo"]: event.detail })
    }else if(fieldName==="tagThree"){
      this.setData({ ["tags.tagThree"]: event.detail })
    }else{
      console.log("fieldName为非法值");
    }
  },
  fieldInputParam(event){
    let fieldName = event.target.dataset.field;
    if (fieldName === "paramKey") {
      this.setData({ paramKey: event.detail })
    } else if (fieldName === "paramValue") {
      this.setData({ paramValue: event.detail })
    } else {
      console.log("fieldName为非法值");
    }
  },

  previousStep: function () {
    this.setData({
      active: this.data.active - 1
    });
  },

  //下一步，此处不对填写内容进行检验，交由后台进行校验
  nextStep: function () {
    if(this.data.active==0){//首页
      let tag=this.data.tags.tagOne;
      if (tag == null || tag === "" || (tag.length > 0 && tag.trim().length === 0)){
        Notify("请填写标签1")
      }else{
        if (this.data.tags.tagTwo != null && this.data.tags.tagTwo!=""&&this.data.tags.tagTwo.trim().length > 0){
          tag = tag + "&" + this.data.tags.tagTwo
        }
        if (this.data.tags.tagThree != null && this.data.tags.tagThree!=""&&this.data.tags.tagThree.trim().length > 0) {
          tag = tag + "&" + this.data.tags.tagThree
        }
        this.setData({
          ["goods.tag"]: tag,
          active: this.data.active + 1
        })
      }
    }else if(this.data.active==1){
      if (this.data.goods.detail == null || this.data.goods.detail === "" || (this.data.goods.detail.length > 0 && this.data.goods.detail.trim().length === 0)) {
        Notify("商品介绍不能为空")
      }else{
      this.setData({
        active: this.data.active + 1
      });
      }
    }else if(this.data.active==2){
      this.setData({
        active: this.data.active + 1
      });
    }else if(this.data.active==3){
      if (!this.data.isSelectUploadImage&&this.data.goodsId==""){
        Notify("请选择商品封面图片")
      }else{
        if(this.data.isSelectUploadImage){
          this.saveGoodsEditWithImage();
        }else{
          this.saveGoodsEditWithOutImage();
        }
      }
    }
  },
  saveGoodsEditWithOutImage(){
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '提交中',
      loadingType: 'spinner',
      mask: true
    });
    let goods = this.data.goods;
    let goodsParamList = this.data.goodsParamList;
    wx.request({
      url: app.globalData.api.editGoodsDetailBySellerWithOutImage,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data:{
        token: app.globalData.token,
        goodsId:goods.goodsId,
        name: goods.name,
        strPrice: goods.strPrice,
        remainNum: goods.remainNum,
        classifyName: goods.classifyName,
        tag: goods.tag,
        detail: goods.detail,
        goodsParamList: JSON.stringify(goodsParamList)
      },
      success:res=>{
        if (res.data.code == 200) {
          Toast.success("提交成功");
          setTimeout(() => {
            Toast.clear();
            wx.redirectTo({
              url: "/pages/goods/goodsInfo/goodsInfo?goodsId=" + res.data.data.goodsId,
            })
          }, 1500)
        } else {
          Toast.fail(res.data.message)
        }
      },
      fail:res=>{
        Toast.fail("请确保所有必填项均已填写")
      }
    })
  },
  saveGoodsEditWithImage(){
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '提交中',
      loadingType: 'spinner',
      mask: true
    });
    let goods=this.data.goods;
    let goodsParamList=this.data.goodsParamList
    wx.uploadFile({
      // header: { "Content-Type": "application/json" },
      url: app.globalData.api.editGoodsDetailBySellerWithImage,
      filePath: this.data.imageFilePath,
      name: "imageFile",
      formData: {
        token: app.globalData.token,
        goodsId:goods.goodsId,
        name:goods.name,
        strPrice: goods.strPrice,
        remainNum:goods.remainNum,
        classifyName:goods.classifyName,
        tag:goods.tag,
        detail:goods.detail,
        goodsParamList: JSON.stringify(goodsParamList)
        // goodsParamList: this.data.goodsParamList
      },
      success:res=>{
        let data = JSON.parse(res.data)
        if(data.code==200){
          Toast.success("提交成功");
          setTimeout(() => {
            Toast.clear();
            wx.redirectTo({
              url: "/pages/goods/goodsInfo/goodsInfo?goodsId=" + data.data.goodsId,
            })
          }, 1500)
        }else{
          Toast.fail(data.message)
        }
      },
      fail: res => {
        Toast.fail("请确保所有必填项均已填写")
      }
    })
  },
  loadGoodsInfo(){
    if(this.data.goodsId===""){
      return;
    }
    wx.request({
      url: app.globalData.api.getGoodsDetailByBuyer,
      data: {
        token: app.globalData.token,
        goodsId: this.data.goodsId,
      },
      success: res => {
        if (res.data.code === 200) {
          let goods=res.data.data.goods;
          let tags={}
          tags.tagOne=goods.tagList[0]
          tags.tagTwo = goods.tagList.length > 1 ? goods.tagList[1]:""
          tags.tagThree = goods.tagList.length > 2 ? goods.tagList[2] : ""
          this.setData({
            goodsParamList: res.data.data.paramList,
            goods: goods,
            tags:tags
            })
        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  }
})