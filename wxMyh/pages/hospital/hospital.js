const api = require('../../utils/api.js');
var message = require('../../component/message/message');
var limit = 6, page = 0;
var vgeneList = [], len = 0, hasMore = true;
Page({
  data: {
    resData: [],
    hasMore: true,
    showLoading: true,
    imgServer: 'https://img.du-ms.com/'
  },
  onLoad: function () {
    var that = this;
    page = 0;
    message.hide.call(that)
    //获取数据
    api.hospital.getHospital({ "offset": limit * page, "limit": limit }, function (data) {
      vgeneList = data.data.data.hospitals;
      len = vgeneList && vgeneList.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        resData: vgeneList,
        hasMore: hasMore,
        showLoading: false
      });
    }, function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
    });
  },
  onPullDownRefresh: function () {
    var that = this;
    message.hide.call(that);
    page = 0;
    //获取数据
    api.hospital.getHospital({ "offset": limit * page, "limit": limit }, function (data) {
      vgeneList = data.data.data.hospitals;
      len = vgeneList && vgeneList.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        resData: vgeneList,
        hasMore: hasMore,
        showLoading: false
      });
      wx.stopPullDownRefresh();
    }, function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    var that = this;
    message.hide.call(that)
    if (that.data.hasMore) {
      //获取数据
      api.hospital.getHospital({ "offset": limit * page, "limit": limit }, function (data) {
        len = data.data.data.hospitals.length;
        vgeneList  =  vgeneList.concat(data.data.data.hospitals || []);
        hasMore = len < limit ? false : true;
        page++;
        that.setData({
          resData: vgeneList,
          hasMore: hasMore,
          showLoading: false
        });
      }, function () {
        that.setData({
          showLoading: false
        })
        message.show.call(that, {
          content: '网络开小差了',
          icon: 'offline',
          duration: 3000
        })
      });
    }
  }, toHosDoctor:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../hospitalDoctors/hospitalDoctors?hid=" + data.id + "&&hospitalName=" + data.name
    })
  }
})
