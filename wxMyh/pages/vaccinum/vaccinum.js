const api = require('../../utils/api.js');
var message = require('../../component/message/message');
var limit = 6, page = 0, dataList = [], len = 0, hasMore = true, keyword = "";
var that = null;
Page({
  data: {
    geneList: [],
    hasMore: true,
    showLoading: true,
    keyword:""
  },
  onLoad: function () {
    that = this;
    page = 0;
    message.hide.call(that)
    //获取数据
    that.loadData(function (data) {
      dataList = data.data.data.vaccinumList;
      len = dataList && dataList.length;
      hasMore = len < limit ? false : true;
      console.log("dataList========" + JSON.stringify(dataList));
      page++;
      that.setData({
        geneList: dataList,
        hasMore: hasMore,
        showLoading: false
      });
    });
  },
  onPullDownRefresh: function () {
    message.hide.call(that);
    page = 0, keyword = "";
    //获取数据
    that.loadData(function (data) {
      dataList = data.data.data.vaccinumList;
      len = dataList && dataList.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        geneList: dataList,
        hasMore: hasMore,
        showLoading: false,
        keyword:""
      });
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    message.hide.call(that)
    if (that.data.hasMore) {
      that.loadData(function (data) {
        len = data.data.data.vaccinumList.length;
        hasMore = len < limit ? false : true;
        page++;
        that.setData({
          geneList: dataList && dataList.concat(data.data.data.vaccinumList || []),
          hasMore: hasMore,
          showLoading: false
        });
      });
    }
  }, bindconfirm :function(e){
    keyword = e.detail.value;
    page = 0;
    console.log(keyword);
    that.loadData(function (data) {
      dataList = data.data.data.vaccinumList;
      len = dataList && dataList.length;
      hasMore = len < limit ? false : true;
      page++;
      that.setData({
        geneList: dataList,
        hasMore: hasMore,
        showLoading: false
      });
    });
  }, loadData: function (success) {
    //获取数据
    api.vaccinum.getVaccinum({ "offset": limit * page, "limit": limit, keyword: keyword}, success, function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
    });
  }, onShareAppMessage: function () {
    return {
      title: '名医汇跨境平台-疫苗接种',
      path: '/pages/vaccinum/vaccinum',
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