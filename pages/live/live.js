// pages/live/live.js
const app = getApp()

import { HOST, WSHOST } from './../../config.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    beauty: 0,
    whiteness: 0,
    muted: false,
    canBeauty: false,
    formData: {},
    currentTime: 0,
    watchNum: 0,
    currentFormat: '00:00:00',
    timeInterval: null,
    ws: null,
    leftTime: 0,
    connect: false,
    leftFormat: '00:00:00'
  },
  onLoad() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.setData({
      'formData': app.globalData.formData
    })
  },
  onShow() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.data.connect && this.fetchAvailTime()
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }
    })
  },
  onHide() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    this.closeWS()
    this.clearFormat()
  },
  onUnload() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    this.clearFormat()
  },
  binderror(e) {
    if (e.detail.errCode === 1001) {
      wx.showToast({
        duration: 3000,
        title: '未开启摄像头权限',
      })
    }
    if(e.detail.errCode === 1002) {
      wx.showToast({
        duration: 3000,
        title: '未开启录音权限',
      })
    }
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
    !this.data.connect && wx.showLoading({ title: '正在连接...' })
    if (e.detail.code == -1307) {
      wx.hideLoading()
      wx.showLoading({ title: '正在重新连接...' })
      this.clearFormat()
    }
    if (e.detail.code == 1002) {
      this.setData({'connect': true})
      wx.hideLoading()
      wx.showToast({
        duration: 3000,
        title: '连接成功...',
      })
      this.fetchAvailTime()
    }
    if (e.detail.code == -1301) {
      wx.showToast({ duration: 3000, title: '打开摄像头失败...' })
    }
    if (e.detail.code == -1301) {
      wx.showToast({ duration: 3000, title: '打开摄像头失败...' })
    }
    if (e.detail.code == -1302) {
      wx.showToast({ duration: 3000, title: '打开麦克风失败...' })
    }
    if (e.detail.code == -1309) {
      wx.showToast({ duration: 3000, title: '录屏失败...' })
    }
  },
  bindnetstatus(e) {
    console.log(e)
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
      'beauty': this.data.canBeauty ? 7 : 0
    })
    this.setData({
      'whiteness': this.data.canBeauty ? 8 : 0
    })
  },
  /**
   * 是否结束当前直播
   */
  endLive() {
    let __this = this
    wx.showLoading({
      title: '正在保存数据...',
      mask: true
    })
    wx.showModal({
      title: '提示',
      content: '是否结束当前直播？',
      cancelColor: '#ccc',
      confirmColor: '#ffb72c',
      success: function (res) {
        if (res.confirm) {
          __this.clearFormat()
          wx.setStorageSync('time', __this.data.currentFormat)
          wx.setStorageSync('watchNum', __this.data.watchNum)
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/liveover/liveover'
          })
        } else if (res.cancel) {
          wx.hideLoading()
          // console.log('用户点击取消')
        }
      }
    })
    wx.hideLoading()
  },
  // 显示实时时间
  getRealTime() {
    let __this = this
    if (!this.data.timeInterval) {
      let timeInter = setInterval(() => {
        __this.setData({
          'currentTime': __this.data.currentTime + 1
        })
        __this.setData({
          'leftTime': __this.data.leftTime - 1
        })
        __this.setData({
          'currentFormat': __this.formatDate(__this.data.currentTime)
        })
        __this.setData({
          'leftFormat': __this.formatDate(__this.data.leftTime)
        })
        __this.sendMessageToWS('ok')
        if(__this.data.leftTime <= 0) {
          __this.clearFormat()
          wx.setStorageSync('time', __this.data.currentFormat)
          wx.setStorageSync('watchNum', __this.data.watchNum)
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/liveover/liveover'
          })
        }
      }, 1000)
      this.setData({
        timeInterval: timeInter
      })
    }
  },
  /**
   * 获取当前直播频道剩余可用时间
   */
  fetchAvailTime() {
    let __this = this
    wx.showLoading({
      title: '正在获取可用时间',
      mask: true
    })
    wx.request({
      url: `${HOST}/live/getCountdownByVdVideoLiveId/${this.data.formData.id}`,
      success(res) {
        if(res.data.success) {
          // 如果还有可用时间
          if(res.data.data && res.data.data > 0) {
            __this.setData({
              leftTime: res.data.data
            })
            __this.getRealTime()
            __this.openWebSocket()
          } else {
            // 无可用时间
            wx.showToast({
              duration: 3000,
              title: '当前直播时间已到',
            })
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }
        } else {
          // 获取可用时间失败
          // 无可用时间
          wx.showToast({
            duration: 3000,
            title: '获取可用时间失败',
          })
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  // 构建时间
  showTime(num1, num2, num3) {
    if(num1 < 10) {
      num1 = `0${num1}`
    }
    if(num2 < 10) {
      num2 = `0${num2}`
    }
    if (num3 < 10) {
      num3 = `0${num3}`
    }
    return `${num1}:${num2}:${num3}`
  },
  // 格式化显示时间
  formatDate(timestamps) {
    if (timestamps) {
      let hours = Math.floor(timestamps/(60 * 60)),
        minutes = Math.floor((timestamps - hours * 60 * 60) / 60),
        seconds = Math.floor(timestamps - hours * 60 * 60 - minutes * 60)

      return this.showTime(hours, minutes, seconds)
    } else {
      return null;
    }
  },
  // 清除定时器
  clearFormat() {
    if (this.data.timeInterval) {
      clearInterval(this.data.timeInterval)
      this.setData({
        'timeInterval': null
      })
    }
  },
  // ws://localhost:8557/video/ws/live/12/sdfsdf/12/5
  // 打开websocket
  openWebSocket() {
    let __this = this
    if(this.data.ws) {
    } else {
      let openId = wx.getStorageSync('openId'),
        channelId = this.data.formData.channelId,
        broadcastUserId = this.data.formData.broadcastUserId,
        url = `${WSHOST}/video/ws/live/${channelId}/${openId}/${broadcastUserId}/6`,
        ws = wx.connectSocket({
          // /video/ws/live/{channelId}/{openId}/{userId}/{status}
          url: url
          // url: 'ws://localhost:6999'
        })

      this.setData({
        'ws': ws
      })
    }

    this.data.ws.onOpen(() => {
      console.log('open')
    })
    this.data.ws.onMessage(({data}) => {
      let __data = JSON.parse(data)
      console.log(__data)
      // 是否启用
      if (__data.data.type == 0) {
        __this.setData({
          'watchNum': __data.data.onlineCount
        })
      } else if(__data.data.type == 1) {
        wx.showToast({
          duration: 3000,
          title: '已被管理员关闭',
        })
        __this.clearFormat()
        wx.setStorageSync('time', __this.data.currentFormat)
        wx.setStorageSync('watchNum', __this.data.watchNum)
        wx.redirectTo({
          url: '/pages/liveover/liveover'
        })
      }
    })
    this.data.ws.onClose((err) => {
      console.log(err)
    })
    this.data.ws.onError(() => {
      // console.log('error')
    })
  },
  // 发送信息到ws
  sendMessageToWS(data) {
    console.log(data)
    this.data.ws && this.data.ws.send({data: data})
  },
  // 关闭ws
  closeWS() {
    this.data.ws && this.data.ws.close()
    this.setData({
      'ws': null
    })
  }
})