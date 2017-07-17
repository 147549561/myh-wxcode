const api = require('../../utils/api.js');
var util = require('../../utils/util')
const APPID = 'wx81efd5b083081914';
const SECRET = '143bcf3ae727511c24c3ac0bf0438226';
var disabled = true, that = null,mobile = null ,password = null;
Page({
  data: {
    disabled: disabled
  },
  onLoad: function () {
    that = this;
    that.checkBind();
  }, checkBind: function () {
    wx.getStorage({
      key: 'openid',
      complete: function (res) {
        if (res.data) {
          var openid = res.data.openid;
          console.log("checkbind-====" + openid)
          api.user.checkBind(openid, function (data) {
            if (data.data.code == 5) {
              wx.showToast({
                title:  '请先绑定手机号',
              });
              setTimeout(function(){
                wx.navigateTo({
                  url: "../bindPhone/bindPhone?openId=" + openid + "&oId=weixin"
                })
              },1000);
            } else if (data.data.code == -1) {
              wx.showToast({
                title: data.data.msg || '',
              });
            } else if (data.data.code == 0) {
              var privateToken = data.data.data.privateToken;//拿到privateToken
              console.log("已经绑定了得到了ptoken==========" + privateToken);
              wx.setStorage({
                key: 'privateToken',
                data: privateToken,
              })
            }
          })
        } else {
            wx.login({
              success: function (res) {
                if (res.code) {
                  //发起网络请求获取openid
                  var openid = "";
                  api.user.getOpenId({ appid: APPID, secret: SECRET, js_code: res.code }, function (data) {
                    if (data.data.code == 0) {
                      openid = data.data.data.data.openid;
                      api.user.checkBind(openid, function (data) {
                        if (data.data.code == 5) {
                          wx.redirectTo({
                            url: "../bindPhone/bindPhone?openId=" + openid + "&oId=weixin"
                          })
                        } else if (data.data.code == -1) {
                          wx.showToast({
                            title: data.msg || '',
                          });
                        } else if (data.code == 0) {
                          var privateToken = data.data.privateToken;//拿到privateToken
                          console.log("已经绑定了得到了ptoken==========" + privateToken);
                          wx.setStorage({
                            key: 'privateToken',
                            data: privateToken,
                          })
                        }
                      })
                      wx.setStorage({
                        key: 'openid',
                        data: {
                          openid: openid
                        },
                        success: function (res) {
                          console.log("获取openid成功===" + openid);
                        }
                      })
                    } else {
                      util.showToast("无法获取用户标识,请退出重试");
                    }
                  })
                } else {
                  console.log('获取用户登录态失败！' + res.errMsg)
                }
              }
            });
        }
      }
    })
  }, toLogin: function (e) {
    var data = e.detail.value
    var pdata = {
      user: data.account,
      pwd: data.password,
      userType: 1
    }
    api.user.toLogin(pdata, function (data) {
      if (data.data.code == 0) {
        var privateToken = data.data.data.privateToken;
        wx.setStorage({
          key: 'privateToken',
          data: privateToken,
          success: function (res) {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 0
              })
              // wx.switchTab({
              //   url: '/pages/index/index'
              // })
            }, 2000)
          }
        })
      } else {
        util.showToast(data.data.msg);
      }
    },function(error){

    })
  }, telInput:function(e){
    mobile = e.detail.value;
    if (mobile && mobile.length == 11 && util.checkPhone(mobile) && password && password.length > 0) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  }, pwdInput: function (e) {
    password = e.detail.value;
    if (mobile && mobile.length == 11 && util.checkPhone(mobile) && password && password.length > 0) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  }
})