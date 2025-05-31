// pages/project/project.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: true, // 根据用户权限动态赋值
    user_id: '',
    user_name: '',
    phone_number: '',
    showDialog: false,
    voucher: '',
  },
  // 发起任务
  createBasket() {
    wx.navigateTo({ url: `/pages/voucherInput/voucherInput?barcode=${Date.now()}` }); // 跳转任务创建页
  },
  // 查看任务列表
  handover() {
    this.scanAndJump('handover')
  },

  searchVoucher() {
    const barcode = this.data.voucher;
    if (!barcode) {
        wx.showToast({
            title: '请输入凭证编号',
            icon: 'none'
        });
        return;
    }
    const app = getApp()
    wx.request({
      url: `http://${app.globalData.serverip}:5000/voucher/query?barcode=${barcode}`,
      method: 'GET',
      success:(res)=>{
        if (res.data.msg==='此凭证未录入'){
          wx.showToast({
            title: '此凭证未录入',
            icon: 'error'
          })
          return
        }
        this.dialogSwitch()
        wx.navigateTo({
          url: `/pages/basketDetail/basketDetail?barcode=${res.data.basket_barcode}`,
        })
      },
      fail:(res)=>{
        wx.showToast({
          title: '请求失败',
          icon: 'error'
        })
      }
    })
  },

  scanAndJump(page){
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        scanType: 'CODE_128'
        wx.showToast({
          title: res.result,
          icon: 'success'
        })
        wx.navigateTo({
          url: `/pages/${page}/${page}?barcode=${res.result}`,
        })
      },
      fail: (res) => {
        if (res.errMsg === 'scanCode:fail cancel') {
          return
        }
        wx.showToast({
          title: `扫描失败：${res.errMsg}`,
          icon: 'error'
        })
      }
    })
  },

  recogBasket(){
    this.scanAndJump('basketDetail')
  },

  insertVoucher(){
    wx.navigateTo({
      url: '/pages/insertVoucher/insertVoucher',
    })
  },

  createNode(){
    wx.navigateTo({
      url: '/pages/newNode/newNode',
    })
  },

  dialogSwitch(){
    this.setData({showDialog: !this.data.showDialog})
  },

  viewUnitList() {
    wx.navigateTo({
      url: '/pages/chkUnit/chkUnit',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user_id: wx.getStorageSync('userInfo').user_id,
      user_name: wx.getStorageSync('userInfo').user_name,
      phone_number: wx.getStorageSync('userInfo').phone_number
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

  }
})