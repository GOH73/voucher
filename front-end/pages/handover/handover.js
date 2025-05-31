// pages/handover/handover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    barcode: '',
    nodes: [],
    node: '',
    new_node: -1, // 是 nodes 列表中的索引
    basket_user: -1,
    cur_user: -1,
    vouchers: []
  },

  dialogSwitch(){
    this.setData({showDialog: !this.data.showDialog})
    if (this.data.showDialog){
      wx.request({
        url: `http://${getApp().globalData.serverip}:5000/node/all`,
        method: 'GET',
        success: (res) => {
          this.setData({
            nodes: res.data.nodes
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '请求节点信息失败',
            icon: 'error'
          })
        }
      })
    } else {
      this.setData({new_node: -1})
    }
  },

  updateNode(){
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/basket/update_node`,
      method: 'POST',
      data:{
        barcode: +this.data.barcode,
        node_to: this.data.nodes[this.data.new_node]
      },
      success: (res) => {
        if (res.data.msg === '更新成功'){
          wx.showToast({
            title: '更新成功',
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '请求失败',
          icon: 'error'
        })
      }
    })
    this.dialogSwitch()
  },

  apply(){
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/application/inp`,
      method: 'POST',
      data:{
        barcode: +this.data.barcode,
        node_to: this.data.nodes[this.data.new_node],
        applicant: this.data.cur_user
      },
      success: (res) => {
        if (res.data.msg === '发送成功'){
          wx.showToast({
            title: '发送成功',
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '请求失败',
          icon: 'error'
        })
      }
    })
    this.dialogSwitch()
  },

  bindNewNode(e){
    this.setData({new_node: +e.detail.value})
  },

  processData(data) {
    this.setData({
      basket_user: data.user_id,
      node: data.logs.to[0],
      vouchers: data.vouchers
    })
    console.log(this.data)
  },

  fetchBasket() {
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/basket/get`,
      method: 'GET',
      data: {barcode: +this.data.barcode}, 
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data;
          this.processData(data)
        } else {
          console.error('请求失败，状态码：', res.statusCode);
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      barcode: options.barcode,
      cur_user: getApp().globalData.userInfo.user_id
    })
    this.fetchBasket()
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