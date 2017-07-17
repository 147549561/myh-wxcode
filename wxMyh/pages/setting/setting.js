var app = getApp()
Page({
  data: {
    cells: [
      [{ title: '设置登录密码', text: '', access: true, fn: 'viewUpLogin' }, { title: '设置余额支付密码', text: '', access: true, fn: 'viewUpPayPassword' }, { title: '意见反馈', text: '', access: true, fn: 'feedBack' },{ title: '退出当前账号', text: '', access: true, fn: 'clearStorage' }
      ]
    ]
  },
  onLoad: function (options) { },
  viewUpLogin: function () {
    wx.navigateTo({
      url: "../upLoginPassword/upLoginPassword"
    })
  }, viewUpPayPassword: function () {
    wx.navigateTo({
      url: "../upPayPassword/upPayPassword"
    })
  }, feedBack: function () {
    wx.navigateTo({
      url: "../feedback/feedback"
    })
  },
  clearStorage: function () {
    wx.showModal({
      title: '确认要退出',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage();
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 2000)
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  }
})