const api = require('../../utils/api.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    author:'名医汇',
    time:'',
    nid:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      nid: options.nid
    })
    api.news.getNewsDetail({ nid: options.nid }, function (data) {
      WxParse.wxParse('content', 'html', data.data.data.news.content, that, 5);
      that.setData({
        name: data.data.data.news.title,
        author: data.data.data.news.author+"    ",
        time: data.data.data.news.createTime
      })
    })
  }, onShareAppMessage: function () {
    return {
      title: that.data.name,
      path: '/pages/newsDetail/newsDetail?nid=' + that.data.nid,
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