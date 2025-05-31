// pages/voucherInput/voucherInput.js
var wxbarcode = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [],
    basketCode: '',
    basketSaved: false,
    voucherCode: '',
    curNode: -1,
    vouchers: []  // 添加新的数据字段
  },

  bindCurNode(e){
    this.setData({
      curNode: +e.detail.value
    })
  },

  getNodes() {
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/node/all`,
      method: 'GET',
      success: (res) => {
        this.setData({
          nodes: res.data.nodes
        })
      }
    })
  },

  inputBasket() {
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/basket/input`,
      method: 'POST',
      data: {
        barcode: this.data.basketCode,
        node: this.data.nodes[this.data.curNode],
        user: getApp().globalData.userInfo.user_id
      },
      success: (res) => {
        if (res.data.msg === '成功添加流转包' || res.data.msg === '此流转包已存在'){
          return
        }
        else if (res.data.statusCode != 200) {
          wx.showToast({
            title: '返回值异常',
            icon: 'error'
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '请重试',
          icon: 'error'
        })
      }
    })
  },

  saveBarcode() {
    if (this.data.curNode===-1){
      wx.showToast({
        title: '请先选择科室',
        icon: 'none'
      })
      return
    }
    const that = this;
    const ctx = wx.createCanvasContext('barcode', this);

    // 将canvas内容导出为图片
    wx.canvasToTempFilePath({
      canvasId: 'barcode',
      success: function(res) {
        const tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function() {
            that.inputBasket()
            that.setData({basketSaved: true})
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: function(err) {
            wx.showToast({
              title: '保存失败',
              icon: 'error'
            });
          }
        });
      },
      fail: function(err) {
        console.error('获取图片失败', err);
        wx.showToast({
          title: '获取图片失败',
          icon: 'error'
        });
      }
    }, that);
  },

  toBarcode(canvasId, codeStr, width, height){
    wxbarcode.toBarcode(canvasId, codeStr, width, height)
  },

  scanBarcode(){
    const that = this

    if (!this.data.basketSaved){
      wx.showToast({
        title: '请先保存流转包',
        icon: 'error'
      })
      return
    }
    
    wx.scanCode({
      scanType: 'barCode',
      success: (res) => {
        const voucherCode = res.result
        // 检查是否已扫描过
        if (!this.data.vouchers.includes(voucherCode)) {
          this.setData({
            vouchers: [...this.data.vouchers, voucherCode]
          })
          wx.showToast({
            title: '扫描成功',
            icon: 'success'
          })
          that.inputVoucher(voucherCode)
        } else {
          wx.showToast({
            title: '已扫描过',
            icon: 'error'
          })
        }
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

  inputVoucher(barcode){
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/voucher/input`,
      method: 'POST',
      data:{
        barcode: barcode,
        basket: this.data.basketCode
      },
      success: (res) => {
        wx.showToast({
          title: `录入成功：${barcode}`,
          icon: 'success'
        })
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: `录入失败`,
          icon: 'error'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNodes()
    this.toBarcode("barcode", options.barcode + " ", 300, 200);
    this.setData({
      basketCode: options.barcode
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