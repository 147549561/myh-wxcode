const api = require('../../utils/api.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
var geneId = null, that = null, privateToken = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    price:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    geneId = options.geneId;
    api.server.getServerDetail({ geneId: options.geneId }, function (data) {
      WxParse.wxParse('content', 'html', data.data.data[0][0].detail, that, 5);
      that.setData({
        name: data.data.data[0][0].name,
        price: data.data.data[0][0].price || 0.00
      })
    })
  }, gene_checkPayView:function(){
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (privateToken) {
          var pdata = {
            privateToken: privateToken,
            geneId: geneId
          }
          api.pay.gene_checkPayView(pdata, function (data) {
            if (data.data.code == 0) {
              var orderId = data.data.data.orderId;
              wx.navigateTo({
                url: '../pay/pay?type=3&order_type="基因检测专业咨询服务费"&orderId=' + orderId + '&fee=' + that.data.price,
              })
            } else if (data.data.code == 500 && '未登录' == data.data.msg) {
              util.goLogin('身份失效,请重新登录');
             } else {
              util.showToast(data.data.msg);
            }
          }, function () {
            util.showToast('操作异常，请重试');
          })
        }else{
          util.goLogin('请先登录');
        }
      }, fail: function () {
        util.goLogin('请先登录');
      }
    })

  }
})