const api = require('../../utils/api.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
var that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    bannerHei: "200px",
    loading: false,
    plain: false,
    banner: [],
    medicalname:'',
    imgServer:'https://img.du-ms.com/',
    mid:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var arrBanner = [],objBanner = null,content = null;
    var bannerHei = 0;
    wx.getSystemInfo({
      success: function (res) {
        bannerHei = res.windowWidth / 10 * 7 + "px";
      }
    })
    that.setData({
      mid: options.mid
    })
    api.medical.getMedicalDetail({ mid:options.mid},function(data){
      objBanner = data.data.data.detail.banner;
      content = data.data.data.detail.content;
      if(objBanner){
        if (objBanner.banner_1) {
          arrBanner.push(objBanner.banner_1);
        }
        if (objBanner.banner_2) {
          arrBanner.push(objBanner.banner_2);
        }
        if (objBanner.banner_3) {
          arrBanner.push(objBanner.banner_3);
        }
        if (objBanner.banner_4) {
          arrBanner.push(objBanner.banner_4);
        }
        if (objBanner.banner_5) {
          arrBanner.push(objBanner.banner_5);
        }
      }

      
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
        WxParse.wxParse('content', 'html', content, that, 5);
        that.setData({
          banner: arrBanner,
          medicalname: data.data.data.detail.name,
          bannerHei: bannerHei
        })
        wx.setNavigationBarTitle({
          title: data.data.data.detail.name || '药品详情',
        })
    })
  }, onShareAppMessage: function () {
    return {
      title: that.data.medicalname,
      path: '/pages/medicalDetail/medicalDetail?mid=' + that.data.mid,
      success: function (res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },toTel:function(){
    wx.showModal({
      title: '是否拨打客服电话 400-9306288',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4009306288' //客服电话
          })
        }
      }
    })
  }
})