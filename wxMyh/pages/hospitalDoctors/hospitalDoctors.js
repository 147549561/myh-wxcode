const api = require('../../utils/api.js');
var message = require('../../component/message/message');
var limit = 6, page = 0, hid = null, hospitalName ="医生列表";
var arrDoctors = [], len = 0, hasMore = true;
Page({
  data: {
    resData: [],
    hasMore: true,
    showLoading: true,
    imgServer: 'https://img.du-ms.com/'
  },
  onLoad: function (option) {
    var that = this;
    hid = option.hid;
    hospitalName = option.hospitalName;
    page = 0;
    message.hide.call(that)
    //设置标题
    wx.setNavigationBarTitle({
      title: hospitalName,
    })

    //获取数据
    api.doctor.getDoctorByHid({ "offset": 0, "limit": limit, hid: hid }, function (data) {
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
    var that = this;
    message.hide.call(that);
    page = 0;
    //获取数据
    api.doctor.getDoctorByHid({ "offset": limit * page, "limit": limit, hid: hid }, function (data) {
      arrDoctors = data.data.data.doctors;
      len =  arrDoctors.length || 0;
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
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    var that = this;
    message.hide.call(that)
    if (that.data.hasMore) {
      //获取数据
      api.doctor.getDoctorByHid({ "offset": limit * page, "limit": limit, hid: hid}, function (data) {
        len = data.data.data.doctors.length || 0;
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
  }, toDoctorDetail: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../doctorDetail/doctorDetail?docId=" + data.id
    })
  }
})