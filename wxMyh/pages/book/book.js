var util = require('../../utils/util')
const api = require('../../utils/api.js');
var that = null, picker_arr = [], id_arr = [], docId = null;
Page({
  data: {
    fee: 0,
    address: '',
    appointTimeBeginDateOfDate: '',
    appointTimeBeginDateOfTime: '09:00',
    appointTimeOfTime: '请选择时间',
    appointTimeOfDate: '请选择日期',
    appointTimeEndDate: '',
    appointTime: '',
    person: '',
    sex: 0,
    genderArray: ['男', '女'],
    birthday: '请选择出生年月',
    birthdayEndDate: '',
    telephone: '',
    illnessSelect: [],
    picker_arr: [],//picker中range属性值
    id_arr: [],//存储id数组
    index: 0,
    illId: 0,
    remark: ''
  },
  onLoad: function (options) {
    var birthdayEndDate = util.getDate()//获取当前日期
    var appointTimeBeginDateOfTime = util.getTime()
    console.log("birthdayEndDate======" + birthdayEndDate);
    console.log("appointTimeBeginDateOfTime======" + appointTimeBeginDateOfTime);
    that = this
    that.setData({
      appointTimeBeginDateOfDate: birthdayEndDate,
      appointTimeBeginDateOfTime: appointTimeBeginDateOfTime
    })

    var pdata = {};
    pdata.docId = options.docId;
    docId = options.docId;
    wx.getStorage({
      key: 'privateToken',
      success: function (res) {
        pdata.privateToken = res.data;
        console.log("res==========" + JSON.stringify(res));
        if (res.data && res.data.length > 0) {
          api.reg_num.regNumView(pdata, function (data) {
            if (data.data.code == 500 || data.data.msg == '未登录') {
              util.showToast('身份过期请重新登录');
              setTimeout(function () {
                wx.redirectTo({
                  url: '../login/login',
                })
              }, 1500)
            } else {
              var data = data.data.data;
              var illnessSelect = data.illness || [];

              illnessSelect.forEach(function (e) {
                picker_arr.push(e.illName);
                id_arr.push(e.illId);
              })
              console.log("data=======" + JSON.stringify(picker_arr));
              that.setData({
                illnessSelect: illnessSelect,
                picker_arr: picker_arr,
                id_arr: id_arr,
                index: 0,
                fee: data.fee[0].regNumFee,
                address: data.address[0].address,
                person: data.userInfo.nickname,
                telephone: data.userInfo.phone,
                birthdayEndDate: birthdayEndDate
              })
            }
          })
        } else {
          util.showToast('请重新登录');
          setTimeout(function () {
            wx.redirectTo({
              url: '../login/login',
            })
          }, 1500)
        }
      }, fail: function () {
        util.showToast('请重新登录');
        setTimeout(function () {
          wx.redirectTo({
            url: '../login/login',
          })
        }, 1500)
      }
    })
  },
  toBook: function (e) {
    var pdata = e.detail.value
    pdata.docId = docId;
    if ("" != that.data.appointTimeOfDate + that.data.appointTimeOfTime) {
      pdata.appointTime = that.data.appointTimeOfDate + that.data.appointTimeOfTime;
    } else {
      util.showToast('请选择日期');
    }
    console.log("pdata===" + JSON.stringify(pdata));
    if (privateToken) {
      api.reg_num.reAppointSubmit(pdata, function (data) {
        if (data.data.code == 500 || data.data.msg == '未登录') {
          util.showToast('身份过期请重新登录');
          setTimeout(function () {
            wx.redirectTo({
              url: '../login/login',
            })
          }, 500)
        } else if (data.data.code == 0) {
          var orderId = data.data.data.orderId;
          wx.navigateTo({
            url: '../pay/pay?type=6&&order_type=预约挂号定金&&orderId=' + orderId + '&&fee=' + fee+''
          })
        }
      })
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
  changeBirthday: function (e) {
    console.log(e)
    var birthday = e.detail.value
    if (birthday != "null") {
      that.setData(
        { birthday: e.detail.value }
      )
    }
  },
  changeAppointTimeOfDate: function (e) {//预约日期
    var appointTimeOfDate = e.detail.value
    if (appointTimeOfDate != "null") {
      that.setData(
        { appointTimeOfDate: e.detail.value }
      )
    }
  }, changeAppointTimeOfTime: function (e) {//预约时间
    var appointTimeOfTime = e.detail.value

    if (appointTimeOfTime != "null") {
      console.log("appointTimeOfTime===" + appointTimeOfTime);
      this.setData({
        appointTimeOfTime: e.detail.value
      })
    }
  },
  changeIllId: function (e) {
    var illId = that.data.id_arr[e.detail.value.selector]
    console.log("illid===========" + illId);
    that.setData({
      index: e.detail.value,
      illId: that.data.id_arr[e.detail.value.selector]
    })
  }
})