// pages/live/live.js
const app = getApp()

import { HOST } from './../../config.js'

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
    this.fetchAvailTime()
  },
  /**
   * 切换前后摄像头
   */
  bindChangeCamera() {
    let pusher = wx.createLivePusherContext()
    pusher.switchCamera()
  },
  /**
   * 是否开启声音
   */
  bindChangeRecord() {
    this.setData({
      'muted': !this.data.muted
    })
  },
  /**
   * 是否开启美颜
   */
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
  /**
   * 是否结束当前直播
   */
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
  },
  /**
   * 获取当前直播频道剩余可用时间
   */
  fetchAvailTime() {
    let __this = this
    wx.request({
      url: `${HOST}/live/getCountdownByVdVideoLiveId/${this.data.formData.id}`,
      success(res) {
        console.log(res.data.data)
        if(res.data.success) {
          if(res.data.data && res.data.data > 0) {
            __this.setData({
              leftTime: res.data.data
            })
          } else {
            // TODO
          }
        } else {
          // TODO
        }
      },
      fail() {

      }
    })
  }
})