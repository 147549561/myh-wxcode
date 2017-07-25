const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
var vaccinumId = null, that = null, privateToken = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    price:0,
    remainAmount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    vaccinumId = options.vaccinumId;
    api.vaccinum.getVaccinumDetail({ vaccinumId:vaccinumId }, function (data) {
      WxParse.wxParse('content', 'html', data.data.data[0][0].detail, that, 5);
      that.setData({
        name: data.data.data[0][0].name,
        price: data.data.data[0][0].price,
        remainAmount: data.data.data[0][0].remainAmount
      })
    })
  }, vaccinumPayView: function () {
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (privateToken) {
          var pdata = {
            privateToken: privateToken,
            vaccinumId: vaccinumId
          }
          api.pay.vaccinumPayView(pdata, function (data) {
            if (data.data.code == 0) {
              var orderId = data.data.data.orderId;
              var price = data.data.data.price[0].price;
              wx.navigateTo({
                url: '../pay/pay?type=2&order_type=疫苗接种定金&orderId=' + orderId + '&fee=' + price,
              })
            } else if (data.data.code == 500 && '未登录' == data.data.msg) {
              util.goLogin('身份失效,请重新登录');
            } else {
              util.showToast(data.data.msg);
            }
          }, function () {
            util.showToast('操作异常，请重试');
          })
        } else {
          util.goLogin('请先登录');
        }
      }, fail: function () {
        util.goLogin('请先登录');
      }
    })
  }, onShareAppMessage: function () {
    return {
      title: that.data.name,
      path: '/pages/vaccinumDetail/vaccinumDetail?vaccinumId=' + vaccinumId,
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