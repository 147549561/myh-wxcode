var util = require('../../utils/util')
Page({
  data:{
    nickName: '',
    gender: 0,
    genderArray: ['男', '女'],
    genderIndex: 0,
    birthday: '',
    birthdayEndDate: ''
  },
  onLoad:function(options){
    var birthdayEndDate = util.getDate()
    var that = this
    wx.getStorage({
      key: 'person_info',
      success: function(res){
        var data = res.data
        that.setData({
          nickName: data.nickName,
          gender: data.gender,
          age: data.age,
          birthday: data.birthday,
          birthdayEndDate: birthdayEndDate
        })
      }
    })
  },
  savePersonInfo: function(e) {
    var data = e.detail.value
    console.log(data);
    wx.setStorage({
      key: 'person_info',
      data: {
        nickName: data.nickName,
        gender: data.gender,
        birthday: data.birthday
      },
      success: function(res){
        wx.showToast({
          title: '资料修改成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '../personInfo/personInfo'
          })
        },2000)
      }
    })
  },
  changeGender: function(e) {
    console.log(e)
    var genderIndex = e.detail.value
    if (genderIndex != "null") {
      this.setData({
        genderIndex: genderIndex,
        gender: this.data.genderArray[this.data.genderIndex]
      })
    }
  },
  changeBirthday: function(e) {
    var birthday = e.detail.value
    if (birthday != "null") {
      this.setData(
        {birthday: birthday}
      )
    }
  },
  changeConstellation: function(e) {
    var constellationIndex = e.detail.value
    if (constellationIndex != "null") {
      this.setData({
        constellationIndex: constellationIndex,
        constellation: this.data.constellationArray[this.data.constellationIndex]
      })
    }
  }
})