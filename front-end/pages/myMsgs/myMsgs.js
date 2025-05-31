// pages/myMsgs/myMsgs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    applications_id: [],
    applicants_id: [],
    applicants_name: [],
    times: [],
    baskets_barcode: [],
    nodes_to: [],
    status: [],
    type: [],
    content: []
  },

  buildContent(data){
    const applicants_name= data.applicants_name
    const baskets_barcode=data.baskets_barcode
    const type=data.type
    const status=data.status
    const content = []
    // Loop through all entries and build content array
    for (let i = 0; i < applicants_name.length; i++) {
      var msgContent=''
      if (type[i] === 'application') {
        msgContent = `${applicants_name[i]} 申请接管 ${baskets_barcode[i]} ，接管后新节点的`
      }else if (type[i] === 'receipt') {
        if (status[i] === 1) {
          msgContent = `${applicants_name[i]} 同意了你对 ${baskets_barcode[i]} 的接管申请`
        }else if (status[i] === 2) {
          msgContent = `${applicants_name[i]} 拒绝了你对 ${baskets_barcode[i]} 的接管申请`
        }
      }
      content.push(msgContent.substring(0,25)+'...')
    }
    
    // Update the content in data
    this.setData({
      content: [...this.data.content, ...content]
    })
  },

  processData(data) {
    const applications_id = data.applications_id
    const applicants_id = data.applicants_id
    const applicants_name = data.applicants_name
    const times = data.times
    const baskets_barcode = data.baskets_barcode
    const nodes_to = data.nodes_to
    const status = data.status
    const type = data.type

    this.setData({
      applications_id: [...this.data.applications_id, ...applications_id],
      applicants_id: [...this.data.applicants_id, ...applicants_id],
      applicants_name: [...this.data.applicants_name, ...applicants_name],
      times: [...this.data.times, ...times],
      baskets_barcode: [...this.data.baskets_barcode, ...baskets_barcode],
      nodes_to: [...this.data.nodes_to, ...nodes_to],
      status: [...this.data.status, ...status],
      type: [...this.data.type, ...type]
    })
  },

  msgDetail(e){
    const index = e.currentTarget.dataset.index;
    const { applications_id, applicants_id, applicants_name, times, baskets_barcode, nodes_to, status, type, content } = this.data;
    wx.navigateTo({
      url: '/pages/msgDetail/msgDetail',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          application_id: applications_id[index],
          applicant_id: applicants_id[index],
          applicant_name: applicants_name[index],
          time: times[index],
          basket_barcode: baskets_barcode[index],
          node_to: nodes_to[index],
          status: status[index],
          type: type[index],
          content: content[index],
        });
      }
    });
  },

  fetchMsgs(){
    wx.showLoading({ title: '加载中...' });
    const app = getApp()
    wx.request({
      url: `http://${app.globalData.serverip}:5000/application/get?user_id=${app.globalData.userInfo.user_id}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        this.setData({isLoading: false})
        console.log(res)
        if (res.data.msg === '没有申请消息') {
          wx.showToast({
            title: '没有申请消息',
            icon: 'none'
          })
        }else{
          this.buildContent(res.data)
          this.processData(res.data)
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: '申请消息获取失败',
          icon: 'error'
        })
      }
    })

    wx.request({
      url: `http://${app.globalData.serverip}:5000/receipt/get?user_id=${app.globalData.userInfo.user_id}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        this.setData({isLoading: false})
        console.log(res)
        if (res.data.msg === '没有回执消息') {
          wx.showToast({
            title: '没有回执消息',
            icon: 'none'
          })
        }else{
          this.buildContent(res.data)
          this.processData(res.data)
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: '回执消息获取失败',
          icon: 'error'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchMsgs()
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