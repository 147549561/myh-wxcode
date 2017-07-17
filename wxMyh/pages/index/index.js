const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const APPID = 'wx81efd5b083081914';
const SECRET = '143bcf3ae727511c24c3ac0bf0438226';
//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    bannerHei: "200px",
    loading: false,
    plain: false,
    banner: [],
    doctor: [],
    news: [],
    imgServer: 'https://img.du-ms.com/'
  },
  onLoad: function () {
    console.log('onLoad');
    var self = this;
    self.wxLogin();
    var bannerHei = 0;
    wx.getSystemInfo({
      success: function (res) {
        bannerHei = res.windowWidth / 10 * 7 + "px";
      }
    })
    //获取首页数据
    api.index.getIndex({ "offset": 0, "limit": 10 }, function (data) {
      if(data.data.code == 0){
        var news2 = data.data.data.news || [];
        for (var i = 0; i < news2.length; i++) {
          news2[i].createTime = news2[i].createTime.substr(0, 10);
        }
        self.setData({
          bannerHei: bannerHei,
          banner: data.data.data.banner,
          doctor: data.data.data.doctor,
          news: news2
        });
      }else{
        wx.showToast({
          title: data.data.msg || '访问错误',
        })
      }
     
    });
  }, toHospital: function () {
    wx.navigateTo({
      url: '../hospital/hospital'
    })
  }, toServer: function () {
    wx.navigateTo({
      url: '../server/server'
    })
  }, toVaccinum: function () {
    wx.navigateTo({
      url: '../vaccinum/vaccinum'
    })
  }, toMedical: function () {
    wx.switchTab({
      url: '/pages/medical/medical'
    })
  }, toNews: function () {
    wx.navigateTo({
      url: '../news/news'
    })
  }, toDoctor: function () {
    wx.switchTab({
      url: '/pages/doctor/doctor'
    })
  }, toNewsDetail(e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../newsDetail/newsDetail?nid=" + data.id
    })
  }, toDoctorDetail: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../doctorDetail/doctorDetail?docId=" + data.id
    })
  }, toBook: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../book/book?type=2&docId=" + data.id
    })
  }, wxLogin: function () {
    // wx.clearStorage();
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求获取openid
          var openid ="";
          api.user.getOpenId({ appid: APPID, secret: SECRET, js_code: res.code},function(data){
            if(data.data.code == 0){
              openid = data.data.data.data.openid;
              wx.setStorage({
                key: 'openid',
                data: {
                  openid: openid
                },
                success: function (res) {
                  console.log("获取openid成功===" + openid);
                }
              })
            }else{
              util.showToast("无法获取用户标识,请退出重试");
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
})
