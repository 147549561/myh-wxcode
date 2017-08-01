const ASKURL = 'https://api.du-ms.com/';//123.207.88.225     https://api.du-ms.com/   https://api.classcode.cn/
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function getDate() {
  var time = new Date()
  var year = time.getFullYear()
  var month = time.getMonth()
  month = month < 10 ? '0' + month : month
  var day = time.getDay()
  day = day < 10 ? '0' + day : day
  return [year, month, day].join('-')
}

function getTime() {
  var time = new Date()
  var hours = time.getHours()
  hours = hours < 10 ? '0' + hours : hours
  var minute = time.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = time.getSeconds()
  second = second < 10 ? '0' + second : second
  return [hours, minute].join(':')
}

//检查是否登录
function checkLogin(fun){
  wx.getStorage({
    key: 'privateToken',
    success: function (res) {
      console.log(res.data)
      if (!res.data) {
        wx.navigateTo({
          url: "../login/login"
        })
      }else{
        fun();
      }
    }
  })
}

//去登陆
function goLogin(showFlag,showinfo){
  if (showFlag){
    showToast(showinfo || '身份过期,请重新登录');
  }
  setTimeout(function () {
    wx.navigateTo({
      url: '../login/login',
    })
  }, 1500)
}

//检查金额数字
function checkMoney(num) {
  var pReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
  return pReg.test(num);
};

//检查是否为空
function isNull(value) {
  value = value.replace(/(^\s*)|(\s*$)/g, "");
  return (value === "null" || value === null || value === "" || value === "undefined") ? true : false;
}

//检查6位数字密码
function isPwd(pwd){
  var pReg = /^[0-9]*$/;
  return pReg.test(pwd);
}

//公共请求方法
function mypost(url, pdata, success, fail,method){
  // console.log("pdata======" + JSON.stringify(pdata));
  // console.log("askType=====" + method);
  wx.request({
    url: ASKURL + url,
    data: pdata,
    header: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    method: method || 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      // success
      // console.log("返回结果===" + JSON.stringify(res));
      success ? success(res) : '';
    },
    fail: fail,
    complete: function () {
      // complete
    }
  })
}

//显示toast
function showToast(title){
  wx.showToast({
    title: title || '',
    icon: 'success',
    image: '',
    duration: 1500,
    mask: true,
    success: null,
    fail: null,
    complete: null
  })
}


function checkPhone(phone) {
  var pReg = /^1[0-9]{10}$/;
  return pReg.test(phone);
}

module.exports = {
  mypost: mypost,
  formatTime: formatTime,
  getDate: getDate,
  getTime: getTime,
  checkLogin: checkLogin,
  showToast: showToast,
  checkPhone: checkPhone,
  isNull: isNull,
  checkMoney: checkMoney,
  goLogin: goLogin,
  isPwd: isPwd
}
