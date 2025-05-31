// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    phoneNumber: '',
    msgsNum: -1
  },
  
  myTask(){
    wx.navigateTo({
      url: '/pages/myTasks/myTasks',
    })
  },

  myRole(){
    wx.navigateTo({
      url: '/pages/myRole/myRole',
    })
  },

  logout() {
    const app = getApp();
    // 退出登录时重置 globalData.userInfo
    app.globalData.userInfo = null;
    // 清除本地存储的用户信息
    wx.removeStorageSync('userInfo');
    // 可以添加其他退出登录的逻辑，如跳转到登录页面等
    wx.redirectTo({
      url: '/pages/login/login'
    });
  },

  myBaskets(){
    const app = getApp()
    wx.navigateTo({
      url: `/pages/myBaskets/myBaskets?user_id=${app.globalData.userInfo.user_id}`,
    })
  },

  myMsgs() {
    const user_id=getApp().globalData.userInfo.user_id
    wx.navigateTo({
      url: `/pages/myMsgs/myMsgs?user_id=${user_id}`,
    })
  },

  msgsNum() {
    const user_id=getApp().globalData.userInfo.user_id
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/msg/count?user_id=${user_id}`,
      method: 'GET',
      success: (res) => {
        console.log(res)
        this.setData({
          msgsNum: res.data.num
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '消息获取失败',
          icon: 'error',
        })
      }
    })
  },

  editInfo() {
    wx.navigateTo({
      url: '/pages/editInfo/editInfo'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp()
    this.setData({
      userName: app.globalData.userInfo.user_name,
      phoneNumber: app.globalData.userInfo.phone_number
    })
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
    this.msgsNum()
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