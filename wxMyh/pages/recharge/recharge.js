var util = require('../../utils/util')
const api = require('../../utils/api.js');
var that = null;

var timeStamp = null, nonceStr = null, _package = null, paySign = null, appId = null, prepay_id = null;
Page({
  data: {
  },
  onLoad: function (options) {
    that = this
  },
  toPay: function (e) {
    var data = e.detail.value;
    var amount = data.amount;
    if (util.isNull(amount)) {
      util.showToast('请输入支付金额');
      return
    } else if (!util.checkMoney(amount)) {
      util.showToast('请正确输入支付金额');
      return
    }
    var pdata = {};
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        if (res.data) {
          pdata.privateToken = res.data;
          pdata.payType = 1;
          pdata.amount = amount * 100;
          pdata.type = 2;
          wx.getStorage({
            key: 'openid',
            success: function (ress) {
              pdata.openid = ress.data.openid;
              api.user.recharge(pdata, function (data) {
                if (data.data.code == 0) {
                  var wxPayUrl = data.data.data.wxPayUrl;
                  console.log(wxPayUrl);
                  wx.request({
                    url: wxPayUrl || '',
                    success: function (res) {
                      // var data = JSON.parse(res.data);
                      console.log("wxpaydata=====================" + res.data);
                      console.log("res.data==========" + JSON.stringify(res.data));
                      var timeStamp = res.data.timeStamp;
                      var nonceStr = res.data.nonceStr;
                      var appId = res.data.appId;
                      var prepay_id = res.data.package;
                      var sign = res.data.sign;
                      console.log("prepay_id==========" + prepay_id);
                      wx.requestPayment({
                        'appId': appId,
                        'timeStamp': timeStamp+'',
                        'nonceStr': nonceStr+'',
                        'package': prepay_id+'',
                        'signType': 'MD5',
                        'paySign': sign,
                        'success': function (res) {
                          console.log("success res========" + JSON.stringify(res))
                          util.showToast('充值成功');
                          setTimeout(function(){
                            wx.redirectTo({
                              url: '../wallet/wallet',
                            })
                          },500)
                        },
                        'fail': function (res) {
                          console.log("fail res========"+JSON.stringify(res))
                          var isCancel = res.errMsg && res.errMsg.indexOf('cancel') > 0?true:false;
                          if (isCancel){
                            util.showToast('已取消支付');
                          }else{
                            util.showToast(res.errMsg || '充值失败请重试');
                          }
                        }
                      })
                    },
                    fail: function (res) {
                      console.log("wxpayfail=====================" + JSON.stringify(res));
                    }
                  })
                } else if (data.data.code == 500 || data.data.msg == '未登录') {
                  util.goLogin(true, '请重新登录');
                }
              })
            }
          })
        } else {
          util.goLogin(true, '请重新登录');
        }
      }, fail: function () {
        util.goLogin(true, '请重新登录');
      }
    })
  }
})