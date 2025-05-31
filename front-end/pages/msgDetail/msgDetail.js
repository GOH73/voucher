// pages/msgDetail/msgDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    application_id: '',
    applicant_id: '',
    applicant_name: '',
    time: '',
    basket_barcode: '',
    node_to: '',
    status: '',
    type: '',
    content: '',
  },

  processData(data){
    this.setData({
      application_id: data.application_id,
      applicant_id: data.applicant_id,
      applicant_name: data.applicant_name,
      time: data.time,
      basket_barcode: data.basket_barcode,
      node_to: data.node_to,
      status: data.status,
      type: data.type,
      content: data.content,
    })
  },

  checkBasket(){
    wx.navigateTo({
      url: `/pages/basketDetail/basketDetail?barcode=${this.data.basket_barcode}`,
    })
  },

  beginHandover(){
    const that = this;
    wx.navigateTo({
      url: '/pages/beginHandover/beginHandover',
      success: function(res) {
        console.log(`success:${res}`)
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          barcode: that.data.basket_barcode,
          node_to: that.data.node_to,
        });
      },
      fail: function(res) {
        console.log(`fail:${res}`)
      }
    });
  },

  approve(){
    wx.showModal({
      title: '提示',
      content: '是否同意该申请？',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定
          console.log('用户点击确定')
          const app = getApp()
          wx.request({
            url: `http://${app.globalData.serverip}:5000/receipt/input`,
            method: 'POST',
            data: {
              sender_id: app.globalData.userInfo.user_id,
              receiver_id: this.data.applicant_id,
              application_id: this.data.application_id,
              status: 1
            },
            success(res) {
              console.log(res.data)
            }
          })
        }
      }
    })
  },

  
  reject(){
    wx.showModal({
      title: '提示',
      content: '是否拒绝该申请？',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定
          console.log('用户点击确定')
          const app = getApp()
          wx.request({
            url: `http://${app.globalData.serverip}:5000/receipt/input`,
            method: 'POST',
            data: {
              sender_id: app.globalData.userInfo.user_id,
              receiver_id: this.data.applicant_id,
              application_id: this.data.application_id,
              status: 2
            },
            success(res) {
              console.log(res.data)
              if (res.data.msg == '回复成功') {
                wx.showToast({
                  title: '已拒绝该申请',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取通信通道
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
        //对发送过来的数据进行处理
        this.processData(data)
    })
    console.log(this.data)
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