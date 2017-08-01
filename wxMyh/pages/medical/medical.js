const App = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    imgServer: 'https://img.du-ms.com/',
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0
  },
  onLoad() {
    var pdata = { "offset": 0, "limit": 100, cid: 1};
    const that = this;
    //获取癌种种类-所有药品
    api.medical.getMedical(pdata, function (data) {
      var leftData = data.data.data.category;
      // leftData = leftData.unshift({ "cid": "0", "cateName": "全部癌种" })
      console.log("lef----"+JSON.stringify(leftData));
      that.setData({
        navRightItems: data.data.data.medicine,
        navLeftItems: leftData
      });
    });
  },
  //事件处理函数
  switchRightTab: function (e) {
    let cid = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    console.log("cid==" + cid);
    this.setData({
      curNav: cid,
      curIndex: index
    })
    this.loadData(cid);
  },
  loadData(cid) {
    var pdata = { "offset": 0, "limit": 100, cid: cid };
    const that = this;
    //获取癌种种类-所有药品
    api.medical.getMedical(pdata, function (data) {
      that.setData({
        navRightItems: data.data.data.medicine
      });
    });
  }, bindfocus:function(){
    wx.navigateTo({
      url: '../medicalSearchList/medicalSearchList',
    })
  }, onShareAppMessage: function () {
    return {
      title: '名医汇跨境平台-药品',
      path: '/pages/medical/medical',
      success: function (res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});