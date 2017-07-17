Page({
  data:{
    cells: []
  },
  onLoad:function(options){
    var that = this
    wx.getStorage({
      key: 'person_info',
      success: function(res){
        var data = res.data
        var cells = [[],[],[]]
        cells[0].push({title: '昵称', text: data.nickName == '' ? '未填写' : data.nickName, access: false, fn: ''})
        cells[0].push({title: '性别', text: data.gender == '' ? '未填写' : data.gender, access: false, fn: ''})
        cells[0].push({title: '生日', text: data.birthday == '' ? '未填写' : data.birthday, access: false, fn: ''})
        that.setData({
          cells: cells
        })
      }
    })
  }
})