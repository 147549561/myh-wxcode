var util = require('../../utils/util')
const api = require('../../utils/api.js');
var that = null, mobile = null, code = null, disabled = true, sub_disabled = true, wait = null, openId = null;
Page({
  data: {
    disabled: disabled,
    sub_disabled: sub_disabled,
    btnText: "获取验证码"
  }, onLoad: function (option) {
    that = this;
    openId = option.openId;
    console.log("openId============================="+JSON.stringify(openId));
  },
  getCode: function () {
    //发送验证码
    api.user.sendCode({ mobile: mobile }, function (data) {
      if (data.data.code.result == 0 && data.data.msg == '请求成功'){
        wait = 60;
        that.time();
        util.showToast("验证码已发送");
        that.setData({
          disabled: true
        })
      }else{
        util.showToast(data.data.msg || '访问失败请重试');
      }
    }, function (err) {
      util.showToast('请求失败请重试');
    })
  }, time: function () {//倒计时获取验证码
    if (wait == 0) {
      that.setData({
        disabled: false,
        btnText: "获取验证码"
      })
      wait = 60;
    } else {
      that.setData({
        btnText: "倒计时(" + wait + "s)"
      })
      wait--;
      setTimeout(function () {
        that.time();
      }, 1000)
    }
  }, telInput: function (e) {
    console.log("mobile===" + e.detail.value);
    mobile = e.detail.value;
    if (mobile && that.checkPhone(mobile)) {
      disabled = false;
    } else {
      disabled = true;
    }
    that.setData({
      disabled: disabled
    })
  }, checkPhone: function (phone) {
    var pReg = /^1[0-9]{10}$/;
    return pReg.test(phone);
  }, checkCode: function (e) {
    console.log("code===" + e.detail.value);
    code = e.detail.value;
    if (code && code.length == 6) {
      api.user.checkCode({ mobile: mobile, code: code }, function (data) {
        if(data.data.code == 0){
          that.setData({
            sub_disabled: false
          })
        }else{
          util.showToast(data.data.msg);
        }
      })
    }else{
      that.setData({
        sub_disabled: true
      })
    }
  }, bindPhone: function () {
    if ("" == mobile){
      util.showToast("请输入手机号");
      return
    }else if("" == code){
      util.showToast("请输入验证码")
      return
    }
    api.user.bindPhone({ openId: openId, code: code, telephone: mobile }, function (data) {
      wx.showToast({
        title: data.data.msg || '请求异常 请重试',
      })
      if (data.data.code == 0) {
        var privateToken = data.data.data.privateToken;
        wx.setStorage({
          key: 'privateToken',
          data: privateToken
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 2
          })
        },300)
      }
    });
  }
})