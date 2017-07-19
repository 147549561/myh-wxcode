var util = require('../../utils/util.js')
const api = require('../../utils/api.js');
var orderId = null, privateToken = null, that = null, status = null, id = null, fee =0;
Page({
  data: {
    contacts:'',
    sex: '男',
    docName: '',
    appointTime: '0000-00-00 00:00',
    appointTel: '',
    price: '0.00',
    hosAddr: '',
    officeName: '',
    hosName: '',
    orderId:'',
    docId: '',
    clsCancelShow:false,
    clsPayShow:false,
    commentShow:false,
    clsCancelShowSucc:false
  },
  onLoad: function (options) {
    that = this;
    orderId = options.orderId
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (privateToken) {
          api.reg_num.appointDetail({
            privateToken: privateToken, id: orderId
          }, function (data) {
            if(data.data.code == 0){
              that.setData({
                orderId: orderId,
                docId: data.data.data[0].docId,
                contacts: data.data.data[0].contacts,
                sex: data.data.data[0].sex,
                docName: data.data.data[0].docName,
                appointTime: data.data.data[0].appointTime,
                appointTel: data.data.data[0].appointTel,
                price: data.data.data[0].price,
                hosAddr: data.data.data[0].hosAddr,
                officeName: data.data.data[0].officeName,
                hosName: data.data.data[0].hosName,
                status: data.data.data[0].status
              })
              id = data.data.data[0].id
              status = data.data.data[0].status
              if('完成' == status){
                that.setData({
                  clsCancelShow: false,
                  clsPayShow: false,
                  commentShow:true
                })
              }else if('未支付' == status){
                that.setData({
                  clsCancelShow: true,
                  clsPayShow: true,
                  commentShow: false,
                  toCancel_success:false
                })
              }else if('预约成功' == status){
                that.setData({
                  clsCancelShow: false,
                  clsPayShow: false,
                  commentShow: false,
                  clsCancelShowSucc:true
                })
              }
            }else if(data.data.code == 500 && '未登录' == data.data.msg){
              util.goLogin('身份失效请重新登录');
            }
          }, function () {

          });
        } else {
          util.goLogin(true, "请重新登录");
        }
      }, fail: function () {
        util.goLogin(true, "请重新登录");
      }
    })
    
  }, toComment:function(){//评价
    wx.navigateTo({
      url: '../comment/comment?state=2&&docId=' + that.data.docId,
    })
  }, toCancel: function () {//取消
    wx.showModal({
      title: '提示',
      content: '是否确定取消?',
      success:function(res){
        if (res.confirm) {
          var pdata = {
            privateToken: privateToken,
            oid: orderId,
            orderType:3//预约订单类型
          }
          api.order.cancelOrder(pdata,function(res){
            if(res.data.code == 0){
              util.showToast('取消成功');
              setTimeout(function(){
                wx.navigateBack({
                  delta:1
                })
              },500)
            } else if (res.data.code == 500 && '未登录' == res.data.msg){
              util.goLogin(true, "请重新登录");
            }else {
              util.showToast(res.data.msg);
            }
          },function(error){

          })
        }
      }
    })
  },toCancel_success: function () {//预约成功过之后 取消
    wx.showModal({
      title: '是否确定取消?',
      content: '提前一星期退全款  提前三天退一半 提前一天不可退款',
      success: function (res) {
        if (res.confirm) {
          var pdata = {
            privateToken: privateToken,
            id: orderId
          }
          api.order.appointCancel(pdata, function (res) {
            if (res.data.code == 0) {
              util.showToast('取消成功');
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            } else if (res.data.code == 500 && '未登录' == res.data.msg) {
              util.goLogin(true, "请重新登录");
            } else {
              util.showToast(res.data.msg);
            }
          }, function (error) {

          })
        }
      }
    })
  }, toPay:function(){
    wx.navigateTo({
      url: '../pay/pay?type=6&&order_type=预约挂号定金&&orderId=' + orderId + '&&fee=' + that.data.price + ''
    })
  }
})
