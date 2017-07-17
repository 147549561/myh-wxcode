const api = require('../../utils/api.js');
var util = require('../../utils/util')
var disabled = true, that = null, oldPwd = null, newPwd = null, reNewPwd = null;
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
  }, setLoginPassword: function (e) {
    var data = e.detail.value
    if (privateToken) {
      if (util.isNull(oldPwd)){
        util.showToast('请输入原先密码');
        return
      } else if (util.isNull(newPwd)){
        util.showToast('请输入新密码');
        return
      } else if (util.isNull(reNewPwd)) {
        util.showToast('请输入确认密码');
        return
      } else if (newPwd !== reNewPwd) {
        util.showToast('两次输入密码不同');
        return
      }
      var pdata = {
        privateToken: privateToken,
        oldPwd: oldPwd,
        newPwd: newPwd,
        reNewPwd: reNewPwd
      }
      console.log(pdata);
      api.user.updatePwd(pdata, function (data) {
        if (data.data.code == 0) {
          util.goLogin('密码修改成功，请重新登录');
        }else if(data.data.code == 500 && '未登录' == data.data.msg){
          util.goLogin('身份失效,请重新登录');
        } else {
          util.showToast(data.data.msg);
        }
      }, function (error) {
        util.showToast('操作异常，请重试');
      })
    }else{
      util.goLogin('请先登录');
    }
  }, oldPwdInput: function (e) {
    oldPwd = e.detail.value;
    if (oldPwd && oldPwd.length > 0 && newPwd && newPwd.length > 0 && reNewPwd && reNewPwd.length > 0 && newPwd == reNewPwd) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  }, newPwdInput: function (e) {
    newPwd = e.detail.value;
    if (oldPwd && oldPwd.length > 0 && newPwd && newPwd.length > 0 && reNewPwd && reNewPwd.length > 0 && newPwd == reNewPwd) {
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
    if (oldPwd && oldPwd.length > 0 && newPwd && newPwd.length > 0 && reNewPwd && reNewPwd.length > 0 && newPwd == reNewPwd) {
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