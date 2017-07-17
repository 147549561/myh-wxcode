var util = require('../../utils/util')
const api = require('../../utils/api.js');
var that = null, picker_arr = [], id_arr = [], privateToken = null;
Page({
  data: {
    sex: 0,
    genderArray: ['男', '女'],
    illnessSelect: [],
    picker_arr: ['Ⅰ期', 'Ⅱ期', 'Ⅲ期', 'Ⅳ期','无'],//picker中range属性值
    id_arr: [1,2,3,4,0],//存储id数组
    index: 0,
    stages: 0
  },
  onLoad: function (options) {
    that = this
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        privateToken = res.data;
        if (!privateToken) {
          util.goLogin();
        }
      }
      })
  },
  toAdd: function (e) {
    var pdata = e.detail.value || {};
    //提交保存
    console.log("pdata==============" + JSON.stringify(pdata));
    if (privateToken){
      pdata.privateToken = privateToken
      //添加病历
      api.cases.addIllness(pdata, function (data) {
        if (data.data.code == 0) {
          util.showToast(data.data.msg || '操作失败，请重试');
          setTimeout(function(){
            wx.navigateTo({
              url: '../case/case',
            })
          },500)
        } else if (data.data.code == 500 && '未登录' == data.data.msg) {
          util.goLogin();
        }
      }, function () {

      });
    }
  },
  changeGender: function (e) {
    console.log(e)
    var genderIndex = e.detail.value
    if (genderIndex != "null") {
      that.setData({
        sex: genderIndex,
        gender: this.data.genderArray[this.data.sex]
      })
    }
  },
  changeStages: function (e) {
    var stages = that.data.id_arr[e.detail.value]
    console.log("stages===========" + stages);
    that.setData({
      index: e.detail.value,
      stages: stages
    })
  }
})