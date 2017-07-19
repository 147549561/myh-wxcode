const api = require('../../utils/api.js');
var util = require('../../utils/util')
var disabled = true, that = null, content = null;
var privateToken = null, docId = '';
Page({
  data: {
    disabled: disabled,
    num: 0
  },
  onLoad: function (option) {
    that = this;
    docId = option.docId
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
  }, submitFeedback: function (e) {
    var data = e.detail.value
    content = data.content;
    if (privateToken) {
      if (util.isNull(content)) {
        util.showToast('请输入评价内容');
        return
      }
      var pdata = {
        privateToken: privateToken,
        content: content,
        docId: docId
      }
      api.order.toComment(pdata, function (data) {
        if (data.data.code == 0) {
          util.showToast('您的评价已提交成功');
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        } else if (data.data.code == 500 && '未登录' == data.data.msg) { } else {
          util.showToast(data.data.msg);
        }
      }, function (error) {
        util.showToast('操作异常，请重试');
      })
    } else {
      util.goLogin('请先登录');
    }
  }, bindinput: function (e) {
    content = e.detail.value;
    that.setData({
      num: content.length || 0
    })
    if (content && content.length > 6) {
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