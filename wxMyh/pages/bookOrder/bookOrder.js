const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var message = require('../../component/message/message');
var limit = 10, page = 0;
var orders = [], len = 0, hasMore = true, privateToken = null, that = null;
Page({
  data: {
    resData: [],
    hasMore: true,
    showLoading: true
  },
  onLoad: function () {
    that = this;
    message.hide.call(that)
    wx.getStorage({
      key: 'privateToken',
      success: function(res) {
        privateToken = res.data;
        if (privateToken){
          //获取数据
          api.order.appointList({ "offset": limit * page, "limit": limit, privateToken: privateToken}, function (data) {
            if (data.data.code == 0) {
              orders = data.data.data[0] || [];
              len = orders && orders.length;
              hasMore = len < limit ? false : true;
              console.log("orders========" + JSON.stringify(orders));
              page++;
              for (var i = 0; i < orders.length; i++) {
                if (orders[i].status == '完成' ){
                  orders[i].statusClass = 'color_finished'
                } else if (orders[i].status == '预约失败') {
                  orders[i].statusClass = 'unpay'
                }else{
                  orders[i].statusClass = 'color_common'
                }
              }
              that.setData({
                resData: orders,
                hasMore: hasMore,
                showLoading: false
              });
            } else if (data.data.code == 500 && '未登录' == data.data.msg) {
              util.goLogin();
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
          util.goLogin();
        }
      }
    })
  },
  onPullDownRefresh: function () {
    message.hide.call(that);
    page = 0;
    if (privateToken) {
      //获取数据
      api.order.appointList({ "offset": limit * page, "limit": limit, privateToken: privateToken}, function (data) {
        orders = data.data.data[0] || [];
        len = orders && orders.length;
        hasMore = len < limit ? false : true;
        page++;
        for (var i = 0; i < orders.length; i++) {
          if (orders[i].status == '完成') {
            orders[i].statusClass = 'color_finished'
          } else if (orders[i].status == '预约失败') {
            orders[i].statusClass = 'unpay'
          } else {
            orders[i].statusClass = 'color_common'
          }
        }
        that.setData({
          resData: orders,
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
    } else {
      util.goLogin();
    }
  },
  onReachBottom: function () {
    message.hide.call(that)
    if (that.data.hasMore) {
      if (privateToken){
        //获取数据
        api.order.appointList({ "offset": limit * page, "limit": limit, privateToken: privateToken}, function (data) {
          len = data.data.data[0] && data.data.data[0].length || 0;
          orders = orders.concat(data.data.data[0] || []);
          hasMore = len < limit ? false : true;
          page++;
          for (var i = 0; i < orders.length; i++) {
            if (orders[i].status == '完成') {
              orders[i].statusClass = 'color_finished'
            } else if (orders[i].status == '预约失败') {
              orders[i].statusClass = 'unpay'
            } else {
              orders[i].statusClass = 'color_common'
            }
          }
          that.setData({
            resData: orders,
            hasMore: hasMore,
            showLoading: false
            })
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
    }
  }, toDetail:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../bOrderDetail/bOrderDetail?orderId=' + orderId
    })
  }
})