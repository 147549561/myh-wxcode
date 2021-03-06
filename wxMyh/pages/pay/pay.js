const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
var vaccinumId = null, that = null, privateToken = null;
var orderId = null, orderType = 0, payPwd = null, fee = 0, payType = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order_type: '疫苗接种定金',
    price: 0,
    amount:0,
    payment_mode: 1,//默认支付方式 微信支付
    isFocus: false,//控制input 聚焦
    wallets_password_flag: false//密码输入遮罩
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    orderId = options.orderId;
    orderType = options.type
    fee = options.fee || 0;
    console.log("fee============" + options.fee);
    that.setData({
      order_type: options.order_type,
      price: fee
    })
    that.myMoneyIndex();
  },myMoneyIndex:function(){//获取余额
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (privateToken) {
          var pdata = {
            privateToken: privateToken
          }
          api.pay.myMoneyIndex(pdata, function (data) {
            if (data.data.code == 0) {
              that.setData({
                amount: data.data.data[0][0].amount || 0
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
  },toPay:function(e){
    var data = e.currentTarget.dataset;
    payType = data.id;
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (privateToken) {
          if (0 == payType){
            console.log("that.data.amount=========" + that.data.amount);
            console.log("feet=========" + fee);
            if (Number(fee) > Number(that.data.amount || 0)){
              wx.showModal({
                title: '提示',
                content: '余额不足，请选择钱包充值或是微信支付'
              })
              return
            }else{
              var pdata = {
                privateToken: privateToken
              }
              api.pay.checkUserPayPwd(pdata, function (data) {
                if (data.data.code == 0) {
                  //调起密码输入框
                  that.setData({
                    wallets_password_flag: true,
                    isFocus: true
                  })
                } else if (data.data.code == 1) {
                  util.showToast('请设置登录密码');
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../upPayPassword/upPayPassword'
                    })
                  }, 1000)
                } else if (data.data.code == 500 && '未登录' == data.data.msg) {
                  util.goLogin('身份失效,请重新登录');
                } else {
                  util.showToast(data.data.msg);
                }
              }, function () {
                util.showToast('操作异常，请重试');
              })
            }
          }else if(1 == payType){//微信支付
            that.wx_pay();
          }
        } else {
          util.goLogin('请先登录');
        }
      }, fail: function () {
        util.goLogin('请先登录');
      }
    })
  }, wx_pay() {//转换为微信支付
    that.setData({
      payment_mode: 1
    })
    var pdata = {
      payType: payType,
      orderType: orderType,
      amount: fee * 100,
      orderId: orderId
    }
    if(privateToken){
      wx.getStorage({
        key: 'privateToken',
        success: function (res) {
          if (res.data) {
            pdata.privateToken = res.data;
            pdata.type = 2;
            wx.getStorage({
              key: 'openid',
              success: function (ress) {
                pdata.openid = ress.data.openid;
                api.pay.wxPay(pdata, function (data) {
                  if (data.data.code == 0) {
                    var wxPayUrl = data.data.data.wxPayUrl;
                    console.log(wxPayUrl);
                    wx.request({
                      url: wxPayUrl || '',
                      success: function (res) {
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
                          'timeStamp': timeStamp + '',
                          'nonceStr': nonceStr + '',
                          'package': prepay_id + '',
                          'signType': 'MD5',
                          'paySign': sign,
                          'success': function (res) {
                            console.log("success res========" + JSON.stringify(res))
                            util.showToast('支付成功');
                            setTimeout(function () {
                             wx.navigateBack({
                               delta:2
                             })
                            }, 500)
                          },
                          'fail': function (res) {
                            console.log("fail res========" + JSON.stringify(res))
                            var isCancel = res.errMsg && res.errMsg.indexOf('cancel') > 0 ? true : false;
                            if (isCancel) {
                              util.showToast('已取消支付');
                            } else {
                              util.showToast(res.errMsg || '支付失败请重试');
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
  },
  set_wallets_password(e) {//获取钱包密码
    that.setData({
      wallets_password: e.detail.value
    });
    console.log("that.data.wallets_password.length=======" + that.data.wallets_password.length);
    if (that.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
      wallet_pay(that)
    }
  },
  set_Focus() {//聚焦input
    console.log('isFocus', that.data.isFocus)
    that.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    that.setData({
      isFocus: false
    })
  },
  close_wallets_password() {//关闭钱包输入密码遮罩
    that.setData({
      isFocus: false,//失去焦点
      wallets_password_flag: false,
    })
  }
})
/*-----------------------------------------------*/
/*支付*/
// 钱包支付
function wallet_pay(_this) {
  console.log('钱包支付请求函数')
  /*
  1.支付成功
  2.支付失败：提示；清空密码；自动聚焦isFocus:true，拉起键盘再次输入
  */
  var pdata = {
    privateToken: privateToken,
    payPwd :_this.data.wallets_password,
    payType:0,
    orderType: orderType,
    amount: that.data.price * 100,
    orderId: orderId
  }
  api.pay.balancePay(pdata, function (data) {
    if (data.data.code == 0) {
      util.showToast('支付成功');
      setTimeout(function(){
       wx.navigateBack({
         delta:1
       })
      },1000)
    } else if (data.data.code == 1) {
      util.showToast(data.data.msg);
    } else if (data.data.code == 500 && '未登录' == data.data.msg) {
      util.goLogin('身份失效,请重新登录');
    } else {
      //调起密码输入框
      that.setData({
        wallets_password_flag: true,
        isFocus: true
      })
      util.showToast(data.data.msg);
    }
  }, function () {
    util.showToast('操作异常，请重试');
  })
}