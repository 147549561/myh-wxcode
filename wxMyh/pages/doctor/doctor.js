const api = require('../../utils/api.js');
var message = require('../../component/message/message');
var limit = 10, page = 0,that = null;
var arrDoctors = [], len = 0, hasMore = true, keyword = "";
Page({
  data: {
    resData: [],
    hasMore: true,
    showLoading: true,
    keyword:'',
    imgServer: 'https://img.du-ms.com/'
  },
  onLoad: function () {
    that = this;
    message.hide.call(that)
    keyword = "";
    //获取数据
    api.doctor.getDoctor({ "offset": limit * page, "limit": limit, keyword: keyword}, function (data) {
      arrDoctors = data.data.data.doctors;
      len = arrDoctors && arrDoctors.length;
      hasMore = len < limit ? false : true;
      console.log("arrDoctors========" + JSON.stringify(arrDoctors));
      page++;
      that.setData({
        resData: arrDoctors,
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
    message.hide.call(that);
    keyword = "";
    page = 0;
    //获取数据
    api.doctor.getDoctor({ "offset": limit * page, "limit": limit, keyword: keyword }, function (data) {
      arrDoctors = data.data.data.doctors;
      len = arrDoctors && arrDoctors.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        resData: arrDoctors,
        hasMore: hasMore,
        showLoading: false,
        keyword:""
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
    message.hide.call(that)
    if (that.data.hasMore) {
      //获取数据
      api.doctor.getDoctor({ "offset": limit * page, "limit": limit, keyword: keyword}, function (data) {
        len = data.data.data.doctors.length;
        arrDoctors = arrDoctors.concat(data.data.data.doctors || []);
        hasMore = len < limit ? false : true;
        page++;
        that.setData({
          resData: arrDoctors,
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
  }, toDoctorDetail:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../doctorDetail/doctorDetail?docId=" + data.id
    })
  }, bindconfirm: function (e) {
    keyword = e.detail.value;
    page = 0;
    console.log(keyword);
    arrDoctors = [];
    //获取数据
    api.doctor.getDoctor({ "offset": limit * page, "limit": limit, keyword: keyword}, function (data) {
      arrDoctors = data.data.data.doctors;
      len = arrDoctors && arrDoctors.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        resData: arrDoctors,
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
    });
  }
})