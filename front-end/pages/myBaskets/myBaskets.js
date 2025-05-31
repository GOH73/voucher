// pages/myBaskets/myBaskets.js
Page({
  data: {
    user_id: '',
    baskets: []
  },

  onLoad(options) {
    this.setData({user_id: options.user_id})
    this.fetchBaskets()
  },

  onReady() {

  },

  onShow() {
    this.fetchBaskets()
  },

  onHide() {

  },

  onUnload() {

  },

  fetchBaskets() {
    const app = getApp()
    wx.showLoading({ title: '加载中...' })
    
    wx.request({
      url: `http://${app.globalData.serverip}:5000/basket/mine`,
      method: 'GET',
      data: {
        user_id: app.globalData.userInfo.user_id
      },
      success: (res) => {
        console.log(res)
        if (res.data.msg === '非空') {
          this.setData({
            baskets: res.data.barcodes
          })
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'error'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  basketDetail(e) {
    const barcode = e.currentTarget.dataset.barcode
    wx.navigateTo({
      url: `/pages/basketDetail/basketDetail?barcode=${barcode}`
    })
  },

  onPullDownRefresh() {
    this.fetchBaskets()
    wx.stopPullDownRefresh()
  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})