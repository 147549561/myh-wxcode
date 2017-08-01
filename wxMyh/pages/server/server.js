const api = require('../../utils/api.js');
var message = require('../../component/message/message');
var limit = 6,page = 0;
var  vgeneList = [], len = 0, hasMore = true;
Page({
  data: {
    geneList: [],
    hasMore: true,
    showLoading: true
  },
  onLoad: function () {
    var that = this;
    page = 0;
    message.hide.call(that)
    //获取数据
    api.server.getServer({ "offset": limit * page, "limit": limit }, function (data) {
      vgeneList = data.data.data.GeneList;
      len = vgeneList && vgeneList.length;
      hasMore = len < limit?false:true;
      console.log("vgeneList========" + JSON.stringify(vgeneList));
      page++;
      that.setData({
        geneList: vgeneList,
        hasMore:hasMore,
        showLoading:false
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
    api.server.getServer({ "offset": limit * page, "limit": limit }, function (data) {
      vgeneList = data.data.data.GeneList;
      len = vgeneList && vgeneList.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        geneList: vgeneList,
        hasMore: hasMore,
        showLoading: false
      });
      wx.stopPullDownRefresh();
    },function(){
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
      api.server.getServer({ "offset": limit * page, "limit": limit }, function (data) {
        len = data.data.data.GeneList.length;
        vgeneList = vgeneList.concat(data.data.data.GeneList || [])
        hasMore = len < limit ? false : true;
        page++;
        that.setData({
          geneList: vgeneList,
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
  }, onShareAppMessage: function () {
    return {
      title: '名医汇跨境平台-检测服务',
      path: '/pages/server/server',
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