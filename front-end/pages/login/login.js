// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: 'sms', // 默认选择验证码登录
    phone: '',
    code: '',
    password: '',
    codeSent: false,
    countdown: 60,
    timer: null
  },

  bindPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },

  bindCode(e){
    this.setData({
      code: e.detail.value
    })
  },

  bindPassword(e){
    this.setData({
      password: e.detail.value
    })
  },

  // 切换登录方式
  switchLoginType(e) {
    const newType = e.detail.value;
    this.setData({
      loginType: newType,
      code: '',
      password: '',
      // phone: newType === 'sms' ? this.data.phone : ''
    });
  },
  

  varify(){
    var temp=this.data.phone
    var reg=/^1[3|4|5|6|7|8|9]\d+$/
    if (temp.length != 11 || !reg.test(temp)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'error'
      })
      return
    }
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/wx/code`,
      data: {phone: this.data.phone},
      method: 'POST',
      success: (res) => {
        this.setData({ codeSent: true })
        const timer = setInterval(() => {
          this.setData({ countdown: --this.data.countdown });
          if (this.data.countdown <= 0) {
            clearInterval(timer);
            this.setData({ codeSent: false, countdown: 60 });
          }
        }, 1000);
    
        wx.showToast({
          title: '发送成功',
        })
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: '发送失败',
          icon: 'error'
        })
      }
    })
  },
  
  login(){
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/wx`,
      data: {
        phone: this.data.phone,
        type: this.data.loginType,
        code: this.data.code,
        password: this.data.password
      },
      method: 'POST',
      success: (result) => {
        console.log(result)
        if (result.data.msg=='验证成功') {
          wx.showToast({
            title: '验证成功',
          })
          wx.setStorageSync('userInfo', result.data.user_info)
          const app = getApp();
          app.globalData.userInfo = result.data.user_info
          wx.switchTab({
            url: '/pages/function/function',
          })
        }else if (result.data.msg=='验证码错误') {
          wx.showToast({
            title: '验证码错误',
            icon: 'error'
          })
        }else if (result.data.msg=='密码错误') {
          wx.showToast({
            title: '密码错误',
            icon: 'error'
          })
        }else if (result.data.msg=='初次登录请使用验证码注册') {
          wx.showToast({
            title: '注册请使用验证码',
            icon: 'none'
          })
        }else {
          wx.showToast({
            title: '返回值错误',
            icon: 'error'
          })
        }
      },
      fail: (result) =>{
        // console.log(result)
        wx.showToast({
          title: '请求失败',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})