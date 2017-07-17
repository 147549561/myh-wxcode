const api = require('../../utils/api.js');
var that = null;
Page({
  data: {
    imgServer: 'https://img.du-ms.com/',
    resData: [],
    keyword:'',
    showLoading: false,
  },
  onLoad() {
    that = this;
  },
  loadData(keyword) {
    that.setData({
      resData: [],
      showLoading: true
    });
    var pdata = { "offset": 0, "limit": 1000, keyword: keyword};
    //获取癌种种类-所有药品
    api.medical.getMedical(pdata, function (data) {
      if (data.data.code == 0) {
        var dataList = data.data.data.medicine || []
        if (dataList.length == 0){
          wx.showToast({
            title: '未找到相关的药品',
          })
        }
        that.setData({
          resData: dataList,
          showLoading: false
        });
      } else {
        wx.showToast({
          title: data.data.msg,
        })
        that.setData({
          resData: [],
          showLoading: false
        });
      }
    });
  }, bindconfirm: function (e) {
    that.loadData(e.detail.value);
  }
});