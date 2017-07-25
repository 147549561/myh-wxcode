const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var message = require('../../component/message/message');
var limit = 5, page = 0;
var arrEvaluate = [], len = 0, hasMore = true,that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickName:'',
    docLevel:'',
    hospitalName:'',
    officeName:'',
    answerNum:0,
    summary:'0',
    goodAt:'暂无介绍',
    imgServer: 'https://img.du-ms.com/',
    docId: 1,
    evaluate:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    page = 0;
    that.setData({
      docId: options.docId
    })
    api.doctor.getDoctorDetail({ docId: options.docId, "offset": 0, "limit": limit}, function (data) {
      len = data.data.data.evaluate.length || 0;
      arrEvaluate = data.data.data.evaluate || [];
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        avatar: data.data.data.doctor[0].avatar,
        nickName: data.data.data.doctor[0].nickname,
        docLevel: data.data.data.doctor[0].docLevel,
        hospitalName: data.data.data.doctor[0].hospitalName,
        officeName: data.data.data.doctor[0].officeName,
        summary: data.data.data.doctor[0].summary || '暂无介绍',
        goodAt: data.data.data.doctor[0].goodAt ||'暂无介绍',
        answerNum: data.data.data.doctor[0].answerNum,
        evaluate: arrEvaluate,
        hasMore: hasMore,
        showLoading: false
      })
    }, function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
    })
  },
  onReachBottom: function () {
    message.hide.call(that)
    if (that.data.hasMore) {
      //获取数据
      api.doctor.getDoctorDetail({ docId: that.data.docId, "offset": limit * page, "limit": limit }, function (data) {
        len = data.data.data.evaluate.length || 0;
        hasMore = len < limit ? false : true;
        arrEvaluate = arrEvaluate.concat(data.data.data.evaluate || []);
        page++;
        that.setData({
          evaluate: arrEvaluate,
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
  },toBook:function(){
    wx.navigateTo({
      url: '../book/book?type=2&docId=' + that.data.docId
    })
  }, onShareAppMessage: function () {
    return {
      title: that.data.nickName,
      path: '/pages/doctorDetail/doctorDetail?docId=' + that.data.docId,
      success: function (res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})