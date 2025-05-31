// pages/editInfo/editInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:'',
    nickname: '',
    phone: '',
    oldPassword: '',
    newPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const app = getApp()
    this.setData({
      user_id: app.globalData.userInfo.user_id,
      nickname: app.globalData.userInfo.name,
      phone: app.globalData.userInfo.phone
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

  },

  onNicknameChange(e) {
    this.setData({ nickname: e.detail.value })
  },

  onPhoneChange(e) {
    this.setData({ phone: e.detail.value })
  },

  onOldPwdChange(e) {
    this.setData({ oldPassword: e.detail.value })
  },

  onNewPwdChange(e) {
    this.setData({ newPassword: e.detail.value })
  },

  saveChanges() {
    const app = getApp()
    wx.request({
      url: `http://${app.globalData.serverip}:5000/user/update`,
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        name: this.data.nickname,
        phone: this.data.phone,
        old_passwd: this.data.oldPassword,
        new_passwd: this.data.newPassword
      },
      success: (res) => {
        if (res.data.msg === '更新成功') {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              // 更新全局用户信息
              app.globalData.userInfo.name = this.data.nickname
              app.globalData.userInfo.phone = this.data.phone
              setTimeout(() => {
                wx.navigateBack()
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        })
      }
    })
  }
})