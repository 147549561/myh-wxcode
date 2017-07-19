const util = require('util.js');
const TOKEN = '85FBCA0D01D6EB76A3888C5F8E4118D5';
const user = {
  //用户身份
  checkBind(openId, success) {//检查是否绑定手机号
    util.mypost('api/checkBind', { bindType: 1, openId: openId, token: TOKEN }, success)
  }, toLogin: function (pdata, success, error) {
    pdata.token = TOKEN;
    util.mypost('api/login', pdata, success, error, "POST")
  }, sendCode: function (pdata, success, error) {
    pdata.token = TOKEN;
    util.mypost('api/sendIdentifyCode', pdata, success, error,'POST')
  }, checkCode: function (pdata, success, error) {
    pdata.token = TOKEN;
    util.mypost('api/checkVerificationCode', pdata, success, error)
  }, bindPhone: function (pdata, success, error) {//去绑定手机号
    pdata.token = TOKEN;
    pdata.bindType = 1; 
    util.mypost('api/thirdPartBind', pdata, success, error)
  }, myMoneyIndex: function (pdata, success, error) {//去绑定手机号
    pdata.token = TOKEN;
    util.mypost('user_center/myMoneyIndex', pdata, success, error)
  }, recharge: function (pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('user_pay/recharge', pdata, success, error)
  }, tradeOrder: function (pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('user_center/tradeLog', pdata, success, error)
  }, getOpenId(pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('api/getOpenId', pdata, success, error)
  }, updatePwd(pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('user_center/updatePwd', pdata, success, error)
  }, setPayPassword(pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('user_center/setPayPassword', pdata, success, error)
  }, submitFeedback(pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('user_center/feedback', pdata, success, error)
  }
}

//支付相关
const pay ={
  gene_checkPayView(pdata, success, error){
    pdata.token = TOKEN;
    util.mypost('gene_check/payView', pdata, success)
  } ,vaccinumPayView(pdata, success, error) {
    pdata.token = TOKEN;
    util.mypost('vaccinum/payView', pdata, success)
  }, myMoneyIndex(pdata, success, error){//获取余额
    pdata.token = TOKEN;
    util.mypost('user_center/myMoneyIndex', pdata, success)
  }, balancePay(pdata, success, error) {//余额支付
    pdata.token = TOKEN;
    util.mypost('user_pay/orderPay', pdata, success)
  }, wxPay(pdata, success, error) {//微信支付
    pdata.token = TOKEN;
    util.mypost('user_pay/orderPay', pdata, success)
  }, checkUserPayPwd(pdata, success, error){//检查密码
    pdata.token = TOKEN;
    util.mypost('user_center/checkUserPayPwd', pdata, success)
  }
}

//药品相关api
const medical = {
  //获取药品数据
  getMedical(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('medicine/medicineList', pdata, success)
  },
  //获取药品详情
  getMedicalDetail(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('medicine/medicineDetail', pdata, success)
  }
}

//首页
const index = {
  getIndex(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('user_index/index', pdata, success, null)
  }
}

//资讯
const news = {
  getNewsDetail(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('news/getNewsDetail', pdata, success)
  }, getNewsList(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('news/getNewsList', pdata, success)
  }
}
//医生
const doctor = {
  getDoctor(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('doctor/getDoctorList', pdata, success)
  }, getDoctorByHid(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('doctor/getDoctorList', pdata, success)
  }, getDoctorDetail(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('doctor/getDoctorDetail', pdata, success)
  }
}


//医院列表
const hospital = {
  getHospital(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('hospital/getHospitalList', pdata, success)
  }
}

//检测服务
const server = {
  getServer(pdata, success, fail) {
    pdata.token = TOKEN;
    util.mypost('gene_check/geneCheckList', pdata, success, fail)
  }, getServerDetail(pdata, success, fail) {
    pdata.token = TOKEN;
    util.mypost('gene_check/geneCheckDetail', pdata, success, fail)
  }
}

//疫苗种类
const vaccinum = {
  getVaccinum(pdata, success, fail) {
    pdata.token = TOKEN;
    util.mypost('vaccinum/vaccinumList', pdata, success, fail)
  },
  //获取疫苗详情
  getVaccinumDetail(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('vaccinum/vaccinumDetail', pdata, success)
  }
}
//预约挂号
const reg_num = {
  regNumView(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('reg_num/regNumView', pdata, success)
  }, reAppointSubmit(pdata, success) {//重新提交预约
    pdata.token = TOKEN;
    util.mypost('reg_num/reAppointSubmit', pdata, success)
  }, payView(pdata, success) {//提交预约
    pdata.token = TOKEN;
    util.mypost('reg_num/payView', pdata, success)
  }, appointDetail(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('user_center/appointDetail', pdata, success)
  }
}

//订单
const order = {
  appointList(pdata, success){//我的预约
    pdata.token = TOKEN;
    util.mypost('user_center/appointList', pdata, success)
  }, order(pdata, success) {//我的订单
    pdata.token = TOKEN;
    util.mypost('user_center/order', pdata, success)
  }, cancelOrder(pdata, success) {//取消未支付的预约订单
    // pdata.orderType = 3;//预约订单类型
    pdata.token = TOKEN;
    util.mypost('user_center/orderCancel', pdata, success)
  }, toComment(pdata, success) {//取消订单
    pdata.token = TOKEN;
    util.mypost('user_center/evaluate', pdata, success)
  }, appointCancel(pdata, success) {//取消预约
    pdata.token = TOKEN;
    util.mypost('user_center/appointCancel', pdata, success)
  }
}

const cases = {
  getIllnessList(pdata, success){
    pdata.token = TOKEN;
    util.mypost('medical/getIllnessList', pdata, success)
  }, delIllness(pdata, success){
    pdata.token = TOKEN;
    util.mypost('medical/delIllness', pdata, success)
  },addIllness(pdata, success) {
    pdata.token = TOKEN;
    util.mypost('medical/addIllnessHistory', pdata, success,function(){},'post')
  }
}


module.exports = {
  medical: medical,
  index: index,
  doctor: doctor,
  hospital: hospital,
  server: server,
  vaccinum: vaccinum,
  news: news,
  user: user,
  reg_num: reg_num,
  order: order,
  pay: pay,
  cases: cases
};