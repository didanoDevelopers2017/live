//index.js
//获取应用实例
const app = getApp()

import { HOST, defaultLiveCover } from './../../config.js'

Page({
  data: {
    defaultLiveCover: defaultLiveCover,
    formData: {},
    isFetch: true,
    isEmpty: true,
  },
  onLoad: function() {
    this.fetchData(() => {})
  },
  onShow() {
    this.fetchData(() => {})
  },
  fetchData(cb) {
    let openId = wx.getStorageSync('openId'),
      url = `${HOST}/live/getHandVdVideoLiveByid/${openId}`,
      __this = this
    if (openId) {
      wx.showLoading({
        title: '正在获取数据',
        mask: true
      })
      wx.request({
        header: {
          'content-type': "multipart/form-data;charset=utf-8",
        },
        method: 'GET',
        url: url,
        success({data}) {
          if (data.success) {
            if(data.data) {
              cb()
              __this.setData({
                'isEmpty': false
              })
              __this.setData({
                'formData': data.data
              })
              app.globalData.formData = data.data
            } else {
              wx.showToast({
                icon: 'none',
                title: '暂无直播信息或未到开播时间'
              })
            }
          } else {
            wx.showToast({
              icon: 'none',
              title: '获取直播信息失败'
            })
          }
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '获取直播信息失败'
          })
        },
        complete() {
          wx.hideLoading()
        }
      })
    }
  },
  getCoverImg() {
    // POST /base/fileupload/single
    let __this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0]
        var tempFile = res.tempFiles[0]
        this.setData({
          'formData.coverUrl': tempFilePath
        })
        wx.uploadFile({
          url: `${HOST}/base/fileupload/single`,
          header: {
            'content-type': "multipart/form-data;charset=utf-8",
          },
          method: 'POST',
          name: 'file',
          filePath: tempFilePath,
          formData: {
            'extension': 'jpg',
            'module': 900
          },
          success(res) {
            __this.setData({
              'formData.coverUrl': JSON.parse(res.data).data
            })
            wx.showToast({
              title: JSON.parse(res.data).message
            })
          }
        })
      }
    })
  },
  updateChannel(cb) {
    wx.request({
      method: 'POST',
      url: `${HOST}/live/createOrUpdateVideoLiveChannel`,
      data: this.data.formData,
      success(res) {
        cb()
        console.log(res)
      }
    })
  },
  jumpLive() {
    let __this = this
    wx.getSetting({
      success: (res) => {
        console.log(res.authSetting)
        if (!res.authSetting['scope.record'] || !res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.record,scope.camera',
            success: () => {
              UpdateChannel(() => {
                wx.navigateTo({
                  url: '/pages/live/live'
                })
              })
            },
            fail: () => {
              wx.showModal({
                title: '是否要打开设置页面重新授权',
                content: '需要获取您的某些信息,否则功能将不能正常使用，请到小程序的设置中打开授权',
                confirmText: '去设置',
                cancelColor: '#999999',
                confirmColor: '#ffb72c',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({})
                  }
                }
              })
            }
          })
        } else {
          __this.updateChannel(() => {
            wx.navigateTo({
              url: '/pages/live/live'
            })
          })
        }
      }
    })
  },
  bindChangeTopic(e) {
    console.log(e.detail.value)
    this.setData({
      'formData.topic': e.detail.value
    })
  },
  bindChangeIntroduction(e) {
    this.setData({
      'formData.introduction': e.detail.value
    })
  }
})
