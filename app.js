//app.js
import { TEST_WSS } from './config.js'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 测试wss
    let socketTask = wx.connectSocket({
      url: TEST_WSS
    })

    socketTask.onOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
    socketTask.onError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    socketTask.onClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    socketTask.onMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.startRecord()
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})