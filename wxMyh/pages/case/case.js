const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
var message = require('../../component/message/message');
var limit = 10, page = 0;
var cases = [], len = 0, hasMore = true, privateToken = null,that = null;
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
      success: function (res) {
        page = 0;
        privateToken = res.data;
        if (privateToken) {
          //获取数据
          api.cases.getIllnessList({ "offset": limit * page, "limit": limit, privateToken: privateToken }, function (data) {
            if (data.data.code == 0) {
              cases = data.data.data[0];
              len = cases && cases.length;
              hasMore = len < limit ? false : true;
              console.log("cases========" + JSON.stringify(cases));
              page++;
              that.setData({
                resData: cases,
                hasMore: hasMore,
                showLoading: false
              });
            } else if (data.data.code == 500 && '未登录' == data.data.msg) {
              util.goLogin();
            }else{
              util.showToast(data.data.msg || '请求异常');
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
          util.goLogin();
        }
      }
    })

  },
  onPullDownRefresh: function () {
    page = 0;
    if (privateToken) {
      //获取数据
      api.cases.getIllnessList({ "offset": limit * page, "limit": limit, privateToken: privateToken }, function (data) {
        if (data.data.code == 0) {
         cases = data.data.data[0];
          len = cases && cases.length;
          hasMore = len < limit ? false : true;
          page++;
          that.setData({
            resData: cases,
            hasMore: hasMore,
            showLoading: false
          });
        } else if (data.data.code == 500 && '未登录' == data.data.msg) {
          util.goLogin();
        } else {
          util.showToast(data.data.msg || '请求异常');
        }
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
    if (that.data.hasMore) {
      if (privateToken) {
        //获取数据
        api.cases.getIllnessList({ "offset": limit * page, "limit": limit, privateToken: privateToken }, function (data) {
          if (data.data.code == 0) {
            len = data.data.data[0] && data.data.data[0].length || 0;
            cases = cases.concat(data.data.data[0] || []);
            hasMore = len < limit ? false : true;
            page++;
            that.setData({
              resData: cases,
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
      }
    }
  }, toAdd:function(){
    wx.redirectTo({
      url: '../addCase/addCase'
    })
  },del:function(option){
    var illId = option.currentTarget.dataset.id;
    console.log("illid=======" + illId);
    wx.showModal({
      title: '提示',
      content: '确定要删除该病历吗',
      success: function (res) {
        if (res.confirm) {
          api.cases.delIllness({ privateToken: privateToken, illId: illId }, function (data) {
            if (data.data.code == 0) {
              util.showToast(data.data.msg || '操作失败,请重试');
              page = 0;
              setTimeout(function(){
                //获取数据
                api.cases.getIllnessList({ "offset": limit * page, "limit": limit, privateToken: privateToken }, function (data) {
                  if (data.data.code == 0) {
                    cases = data.data.data[0];
                    len = cases && cases.length;
                    hasMore = len < limit ? false : true;
                    console.log("cases========" + JSON.stringify(cases));
                    page++;
                    that.setData({
                      resData: cases,
                      hasMore: hasMore,
                      showLoading: false
                    });
                  } else if (data.data.code == 500 && '未登录' == data.data.msg) {
                    util.goLogin();
                  } else {
                    util.showToast(data.data.msg || '请求异常');
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
              },500)
            } else if (data.data.code == 500 && '未登录' == data.data.msg) {
              util.goLogin();
            }
          }, function () {
          });
        } else if (res.cancel) {

        }
      }
    })
  }
})