var app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    gridList: [
      { enName: 'wallet', zhName: '我的钱包'},
      { enName: 'order', zhName: '我的记录' },
      { enName: 'case', zhName: '我的病历' },
      { enName: 'feedback', zhName: '意见反馈' },
      { enName: 'setting', zhName: '设置' }
    ],
    contact_label:'联系客服'
  },
  onLoad: function (cb) {
    var that = this
    console.log("==========="+app.globalData.userInfo)
    // 检测是否存在用户信息
    if (app.globalData.userInfo != null) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.getUserInfo(function (userInfo){
        that.setData({
          userInfo: userInfo
        })
      })
    }
    typeof cb == 'function' && cb()
  },
  onShow: function () {
    var that = this
  },
  onPullDownRefresh: function () {
    this.onLoad(function () {
      wx.stopPullDownRefresh()
    })
  },
  viewGridDetail: function (e) {
    var data = e.currentTarget.dataset
      wx.navigateTo({
        url: "../" + data.url + '/' + data.url
      })
  }
})