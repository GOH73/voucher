// pages/insertVoucher/insertVoucher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basketCode: '',
    vouchers: []
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

  },

  scanBasket() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          basketCode: res.result,
          vouchers: [] // 切换流转包时清空凭证列表
        })
      },
      fail: (err) => {
        if (err.errMsg === 'scanCode:fail cancel') {
          return
        }
        wx.showToast({
          title: '扫描失败',
          icon: 'error'
        })
      }
    })
  },

  scanVoucher() {
    wx.scanCode({
      success: (res) => {
        const voucherCode = res.result
        if (!this.data.vouchers.includes(voucherCode)) {
          this.setData({
            vouchers: [...this.data.vouchers, voucherCode]
          })
          wx.showToast({
            title: '扫描成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '已扫描过',
            icon: 'error'
          })
        }
      },
      fail: (err) => {
        if (err.errMsg === 'scanCode:fail cancel') {
          return
        }
        wx.showToast({
          title: '扫描失败',
          icon: 'error'
        })
      }
    })
  },

  submitInsert() {
    if (!this.data.basketCode || this.data.vouchers.length === 0) {
      return
    }

    const app = getApp()
    wx.request({
      url: `http://${app.globalData.serverip}:5000/basket/insert`,
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        basket_code: +this.data.basketCode,
        vouchers: this.data.vouchers
      },
      success: (res) => {
        if (res.data.msg === '凭证插入成功') {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
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