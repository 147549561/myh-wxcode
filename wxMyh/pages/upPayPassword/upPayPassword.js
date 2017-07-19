const api = require('../../utils/api.js');
var util = require('../../utils/util')
var disabled = true, that = null, payPwd = null, reNewPwd = null;
var privateToken = null;
Page({
  data: {
    disabled: disabled
  },
  onLoad: function () {
    that = this;
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (!privateToken) {
          util.goLogin('请先登录');
        }
      }, fail: function () {
        util.goLogin('请先登录');
      }
    })
  }, setPayPassword: function (e) {
    var data = e.detail.value
    if (privateToken) {
      if (util.isNull(payPwd)) {
        util.showToast('请输入新密码');
        return
      } else if (util.isNull(reNewPwd)) {
        util.showToast('请输入确认密码');
        return
      } else if (payPwd != reNewPwd) {
        util.showToast('两次输入密码不同');
        return
      }
      var pdata = {
        privateToken: privateToken,
        payPwd: payPwd,
        rePayPwd: reNewPwd
      }
      console.log(pdata);
      api.user.setPayPassword(pdata, function (data) {
        if (data.data.code == 0) {
        util.showToast('修改成功');
         wx.navigateBack({
           delta: 0
         })
        } else if (data.data.code == 500 && '未登录' == data.data.msg) { } else {
          util.showToast(data.data.msg);
        }
      }, function (error) {
        util.showToast('操作异常，请重试');
      })
    } else {
      util.goLogin('请先登录');
    }
  }, newPwdInput: function (e) {
    payPwd = e.detail.value;
    if (payPwd && payPwd.length > 0 && payPwd.length == 6 && util.isPwd(payPwd) && reNewPwd && reNewPwd.length > 0 && payPwd == reNewPwd) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  }, renewPwdInput: function (e) {
    reNewPwd = e.detail.value;
    if (payPwd && payPwd.length > 0 && reNewPwd.length == 6 && util.isPwd(reNewPwd) && reNewPwd && reNewPwd.length > 0 && payPwd == reNewPwd) {
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