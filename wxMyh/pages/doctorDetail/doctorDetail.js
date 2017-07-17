const api = require('../../utils/api.js');
var util = require('../../utils/util')
var message = require('../../component/message/message');
var limit = 5, page = 0;
var arrEvaluate = [], len = 0, hasMore = true;
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
    var that = this;
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
    var that = this;
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
    var that = this
        wx.navigateTo({
          url: '../book/book?type=2&docId=' + that.data.docId
        })
  }
})