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
    if (privateToken){
      pdata.privateToken = privateToken
      if (util.isNull(pdata.illName)){
        util.showToast('请输入病历名称');
      } else if (util.isNull(pdata.realName)){
        util.showToast('请输入就诊人姓名');
      } else if (util.isNull(pdata.age)){
        util.showToast('请输入年龄');
      } else if (util.isNull(pdata.sex)){
        util.showToast('请选择性别');
      } else if (util.isNull(pdata.result)){
        util.showToast('请输入诊断结果');
      }else{
        //添加病历
        api.cases.addIllness(pdata, function (data) {
          if (data.data.code == 0) {
            util.showToast(data.data.msg || '添加失败，请重试');
            setTimeout(function () {
              wx.redirectTo({
                url: '../case/case',
              })
            }, 500)
          } else if (data.data.code == 500 && '未登录' == data.data.msg) {
            util.goLogin();
          }
        }, function () {

        });
      }
    }else{
      util.goLogin('请重新登录');
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
    that.setData({
      index: e.detail.value,
      stages: stages
    })
  }
})