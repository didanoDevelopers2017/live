// pages/liveover/liveover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '00:00',
    watchNum: 0
  },
  onLoad() {
    // 获取当前直播直播时间
    let time = wx.getStorageSync('time')
    let watchNum = wx.getStorageSync('watchNum')
    this.setData({
      'time': time
    })
    this.setData({
      'watchNum': watchNum
    })
  }
})