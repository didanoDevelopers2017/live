//index.js
//获取应用实例
const app = getApp()

import { HOST, defaultLiveCover } from './../../config.js'

Page({
  data: {
    defaultLiveCover: defaultLiveCover,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    formData: {
      url: ''
    },
    isEmpty: false,
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getCoverImg() {
    // POST /base/fileupload/single
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        console.log(res)
        console.log(this)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0]
        var tempFile = res.tempFiles[0]
        wx.uploadFile({
          url: `https://${HOST}/base/fileupload/single`,
          header: {
            'content-type': "multipart/form-data;charset=utf-8",
          },
          method: 'POST',
          name: 'file',
          filePath: tempFilePath,
          formData: {
            'extension': 'jpg',
            'module': 7
          },
          success(res) {
            console.log(res)
            wx.showToast({
              title: JSON.parse(res.data).message
            })
          }
        })
        this.setData({
          'formData.url': tempFilePath
        })
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function(res) {
            console.log(res.width)
            console.log(res.height)
          }
        })
      }
    })
  },
  jumpLive() {
    wx.navigateTo({
      url: '/pages/live/live'
    })
  }
})
