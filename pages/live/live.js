// pages/live/live.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    beauty: 0,
    whiteness: 0,
    muted: false,
    canBeauty: false,
    formData: {}
  },
  onLoad() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.setData({
      'formData': app.globalData.formData
    })
  },
  bindChangeCamera() {
    let pusher = wx.createLivePusherContext()
    pusher.switchCamera()
  },
  bindChangeRecord() {
    this.setData({
      'muted': !this.data.muted
    })
  },
  bindChangeBeauty() {
    this.setData({
      'canBeauty': !this.data.canBeauty
    })
    this.setData({
      'beauty': this.data.canBeauty ? 5 : 0
    })
    this.setData({
      'whiteness': this.data.canBeauty ? 5 : 0
    })
  },
  endLive() {
    wx.showModal({
      title: '提示',
      content: '是否结束当前直播？',
      cancelColor: '#ccc',
      confirmColor: '#ffb72c',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/liveover/liveover'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})