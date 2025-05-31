// pages/basketDetail/basketDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barcode: '',
    user: '',
    vouchers: [],
    logs: {
      time: [],
      from: [],
      to: [],
      sender_name: [],
      sender_id: [],
      receiver_name: [],
      receiver_id: [],
      comment: []
    },
    stepList: []
  },

  processData(data){
    const length = data.logs.time.length
    const events = data.logs.comment
    const stepList = []
      // 遍历数组，组合 time 和 name
    for (let i = 0; i < length; i++) {
      var event = ''
      if (events[i] === '装包'){
        event=`${data.logs.receiver_name[i]} 完成了装包`
      }else if (events[i] === '流转') {
        event=`${data.logs.receiver_name[i]} 完成了流转`
      }else if (events[i].includes('交接')) {
        event=`${data.logs.sender_name[i]} 将流转包交接给 ${data.logs.receiver_name[i]}`
      }else if (events[i].includes('添加凭证')){
        event=`${data.logs.sender_name[i]} ${events[i]}`
      }
      stepList.push({
        time: data.logs.time[i],
        name: `位置：${data.logs.to[i]}`,
        event: event,
        status: 1
      })
    }
    stepList.reverse()
    this.setData({
      barcode: data.barcode,
      user: data.user_name,
      vouchers: data.vouchers,
      logs: {
        time: data.logs.time,
        from: data.logs.from,
        to: data.logs.to,
        sender_name: data.logs.sender_name,
        sender_id: data.logs.sender_id,
        receiver_name: data.logs.receiver_name,
        receiver_id: data.logs.receiver_id
      },
      stepList: stepList
    })

  },

  fetchBasket(){
    wx.request({
      url: `http://${getApp().globalData.serverip}:5000/basket/get`,
      method: 'GET',
      data: {barcode: +this.data.barcode}, 
      // 在生成流转包条形码时，为了解决生成的条形码识别不出最后一位数，
      // 在条形码编码的末尾加上了一个space字符，所以这里要将其转为数字
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data;
          console.log(data)
          this.processData(data);
          console.log(this.data)
        } else {
          console.error('请求失败，状态码：', res.statusCode);
        }
      },
      fail: (err) => {
        console.error('请求出错：', err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({barcode: options.barcode})
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