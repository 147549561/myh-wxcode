const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var message = require('../../component/message/message');
var limit = 5, page = 0;
var order = [], len = 0, hasMore = true,privateToken = null,that = null;
Page({
  data: {
    resData: [],
    hasMore: true,
    showLoading: true,
    imgServer: 'https://img.du-ms.com/'
  },
  onLoad: function () {
    that = this;
    page = 1;
    message.hide.call(that)
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (privateToken) {
          //获取数据
          api.order.order({ "offset": 0, "limit": limit, privateToken: privateToken }, function (data) {
            if (data.data.code == 0) {
              order = data.data.data.order;
              
              len = order && order.length;
              hasMore = len < limit ? false : true;
              for (var i = 0; i < order.length; i++) {
                if (order[i].status == '未付款') {
                  order[i].statusClass = 'unpay'
                  order[i].flag = true;
                } else if (order[i].status == '已付款') {
                  order[i].statusClass = 'payed'
                  order[i].flag = false
                } else {
                  order[i].statusClass = 'finished'
                  order[i].flag = false
                }
              }
              that.setData({
                resData: order,
                hasMore: hasMore,
                showLoading: false
              });
            } else if (data.data.code == 500 && data.data.msg == '未登录') {
              util.goLogin('身份过期请重新登录');
            } else {

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
          util.goLogin(true, "请重新登录");
        }
      }, fail: function () {
        util.goLogin(true, "请重新登录");
      }
    })
  },
  onPullDownRefresh: function () {
    message.hide.call(that);
    page = 1;
    //获取数据
    api.order.order({ "offset": 0, "limit": limit, privateToken: privateToken}, function (data) {
      order = data.data.data.order;
      len = order && order.length;
      hasMore = len < limit ? false : true;
      for (var i = 0; i < order.length; i++) {
        if (order[i].status == '未付款') {
          order[i].statusClass = 'unpay'
          order[i].flag = true;
        } else if (order[i].status == '已付款') {
          order[i].statusClass = 'payed'
          order[i].flag = false
        } else {
          order[i].statusClass = 'finished'
          order[i].flag = false
        }
      }
      that.setData({
        resData: order,
        hasMore: hasMore,
        showLoading: false
      });
      wx.stopPullDownRefresh();
    }, function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    message.hide.call(that)
    if (that.data.hasMore) {
      //获取数据
      api.order.order({ "offset": limit * page, "limit": limit, privateToken: privateToken }, function (data) {
        len = data.data.data.order.length;
        order = order.concat(data.data.data.order || []);
        hasMore = len < limit ? false : true;
        page++;
        for (var i = 0; i < order.length; i++) {
          if (order[i].status == '未付款') {
            order[i].statusClass = 'unpay'
            order[i].flag = true;
          } else if (order[i].status == '已付款') {
            order[i].statusClass = 'payed'
            order[i].flag = false
          } else {
            order[i].statusClass = 'finished'
            order[i].flag = false
          }
        }
        that.setData({
          resData: order,
          hasMore: hasMore,
          showLoading: false
        });
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
    }
  }, toDetail: function (e) {
    var data = e.currentTarget.dataset;
    var ordertype = data.ordertype;
    if (ordertype == "疫苗订单") {
      wx.navigateTo({
        url: "../vaccinumDetail/vaccinumDetail?vaccinumId=" + data.id
      })
    } else if (ordertype == "基因订单") {
      wx.navigateTo({
        url: "../serverDetail/serverDetail?geneId=" + data.id
      })
    }
  }, toCancel:function(e){
    var data = e.currentTarget.dataset;
    var oid = data.id;
    wx.showModal({
      title: '提示',
      content: '是否确定取消该订单', 
      success: function (res) {
        if (res.confirm) {
          //获取数据
          api.order.cancelOrder({ oid: oid, orderType:4, privateToken: privateToken }, function (data) {
            page = 0;
            if(data.data.code == 0){
              util.showToast('取消成功');
              api.order.order({ "offset": limit * page, "limit": limit, privateToken: privateToken }, function (data) {
                if (data.data.code == 0) {
                  order = data.data.data.order;
                  len = order && order.length;
                  hasMore = len < limit ? false : true;
                  page++;
                  for (var i = 0; i < order.length; i++) {
                    if (order[i].status == '未付款') {
                      order[i].statusClass = 'unpay'
                      order[i].flag = true;
                    } else if (order[i].status == '已付款') {
                      order[i].statusClass = 'payed'
                      order[i].flag = false
                    } else {
                      order[i].statusClass = 'finished'
                      order[i].flag = false
                    }
                  }
                  that.setData({
                    resData: order,
                    hasMore: hasMore,
                    showLoading: false
                  });
                } else if (data.data.code == 500 && data.data.msg == '未登录') {
                  util.goLogin('身份过期请重新登录');
                } else {

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
            } else if (data.data.code == 500 && '未登录' == data.data.msg){
              util.goLogin('请重新登录');
            }else{
              util.showToast(data.data.msg ||  '操作异常请重试');
            }
          }, function (err) {
            util.showToast('操作异常请重试');
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }, toPay:function(e){
    var data = e.currentTarget.dataset;
    var orderId = data.id;
    var fee = data.price;
    var ordertype = data.ordertype;
    console.log(JSON.stringify(data));
    if ('疫苗订单' == ordertype){
      wx.navigateTo({
        url: '../pay/pay?type=2&&order_type=疫苗接种费用&&orderId=' + orderId + '&&fee=' + fee+''
      })
    } else if (ordertype == '基因订单'){
      wx.navigateTo({
        url: '../pay/pay?type=3&&order_type=检测服务专业咨询服务费&&orderId=' + orderId + '&&fee=' + fee + ''
      })
    }
  }
})
