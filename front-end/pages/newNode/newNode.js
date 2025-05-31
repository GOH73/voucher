// pages/newNode/newNode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    node_name: '',
    description: ''
  },

  submit(){
    if (this.data.node_name.length===0){
      wx.showToast({
        title: '节点名不能为空',
        icon: 'error'
      })
      return
    }
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000//node/inp`,
      data: {
        node_name: this.data.node_name,
        description: this.data.description,
      },
      method: 'POST',
      success: (res) => {
        if (res.data.msg=='创建成功') {
          wx.showToast({
            title: '创建成功',
            icon: 'success'
          })
        }else if (res.data.msg==='节点已存在'){
          wx.showToast({
            title: '节点已存在',
            icon: 'error'
          })
        }else{
          wx.showToast({
            title: '返回值异常',
            icon: 'error'
          })
          console.log(res)
        }
      },
      fail: (res) =>{
        console.log(res)
        wx.showToast({
          title: '请求失败',
          icon: 'error'
        })
      }
    })
  },

  bindName(e) {
    this.setData({
      node_name: e.detail.value
    })
  },

  bindDesc(e) {
    this.setData({
      description: e.detail.value
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