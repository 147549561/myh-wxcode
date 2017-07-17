const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({
  data: {
    cells: [
      [
        { title: '充值', text: '', access: true, fn: 'viewRecharge' },
        { title: '交易记录', text: '', access: true, fn: 'viewOrder' }
      ]
    ],
    money:'0.00'
  },
  onLoad: function (options) { 
    var that = this
    var privateToken  = null;
    wx.getStorage({
      key: 'privateToken',
      success: function(res) {
        privateToken = res.data;
        if(privateToken){
          api.user.myMoneyIndex({ privateToken: privateToken},function(data){
              if(0 == data.data.code){
                that.setData({
                  money: data.data.data[0][0].amount || 0.00
                })
              } else if (data.data.code == 500 || data.data.msg == '未登录'){
                util.goLogin(true, "身份过期,请重新登录");
              }
          });
        }else{
          util.goLogin(true, "请重新登录");
        }
      },fail:function(){
        util.goLogin(true,"请重新登录");
      }
    })
  }, 
  viewRecharge: function () {
    wx.redirectTo({
      url: "../recharge/recharge"
    })
  }, viewOrder: function () {
    wx.navigateTo({
      url: "../tradeLog/tradeLog"
    })
  }
})