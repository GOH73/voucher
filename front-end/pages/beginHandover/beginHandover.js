// pages/beginHandover/beginHandover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basketCode: '',
    currentLocation: '',
    targetLocation: '',
    scannedVouchers: []
  },

  getCurrentLocation(){
    const app = getApp()
    wx.request({
      url: `http://${app.globalData.serverip}:5000/basket/get?barcode=${this.data.basketCode}`,
      method: 'GET',
      success: (res) => {
        this.setData({currentLocation: res.data.logs.to[0]})
      }
    })
  },

  scanVoucher() {
    wx.scanCode({
      success: (res) => {
        const voucherCode = res.result
        const scannedVouchers = [...this.data.scannedVouchers]
        
        if (!scannedVouchers.includes(voucherCode)) {
          scannedVouchers.push(voucherCode)
          this.setData({
            scannedVouchers: scannedVouchers
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
        wx.showToast({
          title: '扫描失败',
          icon: 'error'
        })
      }
    })
  },

  finishHandover() {
    if (this.data.scannedVouchers.length === 0) {
      wx.showModal({
        title: '提示',
        content: '请先扫描凭证条形码完成交接清点',
        showCancel: false
      })
      return
    }
    
    const app = getApp()
    wx.request({
      url: `http://${app.globalData.serverip}:5000/basket/handover`,
      method: 'POST',
      data: {
        barcode: this.data.basketCode,
        vouchers: this.data.scannedVouchers,
        node_to: this.data.targetLocation,
        to_user: app.globalData.userInfo.user_id
      },
      success: (res) => {
        if (res.data.msg === '更新成功') {
          this.generateHandoverPDF();

          wx.showToast({
            title: '交接成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 2000)
            }
          })
        } else if(res.data.msg==='凭证清单不匹配'){
          const checkRes = res.data.check_res;
          let message = '凭证清单不匹配：\n';
          
          if (checkRes.missing.length > 0) {
            message += `\n缺少以下凭证：\n${checkRes.missing.join('\n')}`;
          }
          
          if (checkRes.extra.length > 0) {
            message += `\n\n多扫描了以下凭证：\n${checkRes.extra.join('\n')}`;
          }
          
          wx.showModal({
            title: '清点错误',
            content: message,
            showCancel: false,
            success: () => {
              // 清空已扫描列表，重新开始扫描
              this.setData({
                scannedVouchers: []
              });
            }
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        })
      }
    })
  },

  generateHandoverPDF() {
    const app = getApp()
    wx.showLoading({ title: '生成交接清单...' })
    
    // 准备交接清单数据
    const handoverData = {
      basket_code: this.data.basketCode,
      current_location: this.data.currentLocation,
      target_location: this.data.targetLocation,
      vouchers: this.data.scannedVouchers,
      handover_time: new Date().toLocaleString(),
      handler: app.globalData.userInfo.user_name
    }
  
    // 请求后端生成PDF
    wx.request({
      url: `http://${app.globalData.serverip}:5000/basket/generate_pdf`,
      method: 'POST',
      data: handoverData,
      responseType: 'arraybuffer',  // 接收二进制数据
      success: (res) => {
        // 将二进制数据保存为PDF文件
        const fs = wx.getFileSystemManager()
        const fileName = `handover_${this.data.basketCode}_${new Date().getTime()}.pdf`
        const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`
        
        fs.writeFile({
          filePath: filePath,
          data: res.data,
          encoding: 'binary',
          success: () => {
            wx.hideLoading()
            // 显示保存选项
            wx.showModal({
              title: '交接清单已生成',
              content: '是否保存PDF文件？',
              showCancel: true,
              confirmText: '保存',
              cancelText: '仅查看',
              success: (res) => {
                if (res.confirm) {
                  // 永久保存文件
                  wx.saveFile({
                    tempFilePath: filePath,
                    success: (res) => {
                      const savedFilePath = res.savedFilePath
                      wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                      })
                      // 打开保存的文件
                      wx.openDocument({
                        filePath: savedFilePath,
                        fileType: 'pdf',
                        showMenu: true,  // 显示文件操作菜单
                        success: () => {
                          console.log('打开PDF成功')
                        },
                        fail: (err) => {
                          console.error('打开PDF失败:', err)
                          wx.showToast({
                            title: '打开PDF失败',
                            icon: 'error'
                          })
                        }
                      })
                    },
                    fail: (err) => {
                      console.error('永久保存失败:', err)
                      wx.showToast({
                        title: '保存失败',
                        icon: 'error'
                      })
                    }
                  })
                } else {
                  // 仅查看文件
                  wx.openDocument({
                    filePath: filePath,
                    fileType: 'pdf',
                    showMenu: true,
                    success: () => {
                      console.log('打开PDF成功')
                    },
                    fail: (err) => {
                      console.error('打开PDF失败:', err)
                      wx.showToast({
                        title: '打开PDF失败',
                        icon: 'error'
                      })
                    }
                  })
                }
              }
            })
          },
          fail: (err) => {
            console.error('保存PDF失败:', err)
            wx.hideLoading()
            wx.showToast({
              title: '保存PDF失败',
              icon: 'error'
            })
          }
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '生成PDF失败',
          icon: 'error'
        })
      }
    })
  },

  processData(data){
    this.setData({
      basketCode: data.barcode,
      targetLocation: data.node_to
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
      this.getCurrentLocation()
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