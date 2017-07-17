var util = require('../../utils/util.js')
const api = require('../../utils/api.js');
var orderId = null, privateToken = null, that = null;
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
    clsCancelShow:false,
    clsPayShow:false
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
    
  }
})
