const api = require('../../utils/api.js');
var message = require('../../component/message/message');
var limit = 6, page = 0;
var newsList = [], len = 0, hasMore = true;
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
    api.news.getNewsList({ "offset": limit * page, "limit": limit }, function (data) {
      newsList = data.data.data.news;
      len = newsList && newsList.length;
      hasMore = len < limit ? false : true;
      page++;
      var news2 = newsList || [];
      for (var i = 0; i < newsList.length; i++) {
        news2[i].createTime = newsList[i].createTime.substr(0, 10);
      }
      that.setData({
        resData: news2,
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
    api.news.getNewsList({ "offset": limit * page, "limit": limit }, function (data) {
      if(data.data.code == 0){
        newsList = data.data.data.news;
        len = newsList && newsList.length || 0;
        hasMore = len < limit ? false : true;
        page++;
        var news2 = newsList || [];
        for (var i = 0; i < newsList.length; i++) {
          news2[i].createTime = newsList[i].createTime.substr(0, 10);
        }
        that.setData({
          resData: news2,
          hasMore: hasMore,
          showLoading: false
        });
        wx.stopPullDownRefresh();
      }else{
        wx.stopPullDownRefresh();
        util.showToast(data.data.msg);
      }
    }, function () {
      wx.stopPullDownRefresh();
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
  onReachBottom: function () {
    var that = this;
    message.hide.call(that)
    if (that.data.hasMore) {
      //获取数据
      api.news.getNewsList({ "offset": limit * page, "limit": limit }, function (data) {
        len = data.data.data.news.length || 0;
        newsList = newsList.concat(data.data.data.news || []);
        hasMore = len < limit ? false : true;
        page++;
        var news2 = newsList || [];
        for (var i = 0; i < newsList.length; i++) {
          news2[i].createTime = newsList[i].createTime.substr(0, 10);
        }
        that.setData({
          resData: news2,
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
  }, toNewsDetail: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../newsDetail/newsDetail?nid=" + data.id
    })
  }
})
