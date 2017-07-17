const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var message = require('../../component/message/message');
var privateToken = null;
Page({
  data: {
    resData: [],
    showLoading: true
  },
  onLoad: function () {
    var that = this;
    message.hide.call(that);
    wx.getStorage({
      key: 'privateToken',
      success: function(res) {
        privateToken = res.data;
        if (!util.isNull(privateToken)){
          //获取数据
          api.user.tradeOrder({ privateToken : privateToken}, function (data) {
            if(data.data.code == 0){
              console.log("data============" + data.data.data[0]);
              var list = data.data.data[0];
              for(var i = 0 ; i< list.length;i++){
                if (list[i].tradeType == "充值" || list[i].tradeType == "预约挂号退款" || list[i].tradeType == "电话问诊退款"){
                  list[i].mark = '+'
                }else{
                  list[i].mark = '-';
                }
              }
              that.setData({
                resData: list || [],
                showLoading: false
              });
            }else if(data.data.code == 500 && "未登录" == data.data.msg){
              util.toLogin("请重新登录")
            }else{
              util.showToast(data.data.msg);
            }
          }, function () {
            that.setData({
              showLoading: false
            })
            message.show.call(that, {
              content: '网络开小差了',
              icon: 'offline',
              duration: 3000
            })
          });
        }else{
          util.toLogin("请重新登录")
        }
      },fail:function(){
        util.toLogin("请重新登录")
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    message.hide.call(that);
    if (!util.isNull(privateToken)) {
      //获取数据
      api.user.tradeOrder({ privateToken: privateToken }, function (data) {
        if (data.data.code == 0) {
          var list = data.data.data[0];
          for (var i = 0; i < list.length; i++) {
            if (list[i].tradeType == "充值" || list[i].tradeType == "预约挂号退款" || list[i].tradeType == "电话问诊退款") {
              list[i].mark = '+'
            } else {
              list[i].mark = '-';
            }
          }
          that.setData({
            resData: list || [],
            showLoading: false
          });
        } else if (data.data.code == 500 && "未登录" == data.data.msg) {
          util.toLogin("请重新登录")
        }
      }, function () {
        that.setData({
          showLoading: false
        })
        message.show.call(that, {
          content: '网络开小差了',
          icon: 'offline',
          duration: 3000
        })
      });
    } else {
      util.toLogin("请重新登录")
    }
    wx.stopPullDownRefresh();
  }
})
