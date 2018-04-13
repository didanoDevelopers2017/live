//app.js
import { HOST } from './config.js'

App({
  globalData: {
    formData: null
  },
  onLaunch() {
    // 获取openId
    if (!wx.getStorageSync('openId')) {
      this.wxAuthorize()
    }
  },
  onShow() {
    // 获取openId
    if (!wx.getStorageSync('openId')) {
      this.wxAuthorize()
    }
  },
  wxRequest: function (options) {
    var promise = new Promise((resolve, reject) => {
      //网络请求
      wx.request({
        url: options.url,
        data: options.data,
        method: options.method ? options.method : 'POST',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: function (e) {
          reject(e);
        }
      })
    });
    return promise;
  },
  wxAuthorize: function () {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              // 用户已经同意小程序使用获取用户信息
              this.wxUserInfo()
            },
            fail: () => {
              //获m取用户信息失败，重新让用户打开获取用户信息
              this.wxOpenSetting();
            }
          })
        } else {
          this.wxUserInfo()
        }
      }
    })
  },
  //获取用户的信息
  wxUserInfo: function () {
    wx.login({
      success: ({code}) => {
        wx.getUserInfo({
          withCredentials: true,
          success: (res) => {
            let formData = {
              url: `${HOST}/mini/getSessionInfo`,
              data: {
                encryptedData: res.encryptedData,
                ivStr: res.iv,
                jsCode: code,
                oriId: 'xiaonuo_live',
              }
            }
            this.wxUserOpendId(formData);
          },
          fail: (res) => {
            //获取用户信息失败，重新让用户打开获取用户信息
            this.wxOpenSetting()
          }
        })
      }
    })
  },
  //获取用户的openid
  wxUserOpendId: function (data) {
    this.wxRequest(data).then((res) => {
      res.code == 1007 ? wx.setStorageSync('openId', res.data) : "";
    }).catch((errMsg) => {
      console.log(errMsg);
    })
  },
  //用户再次打开授权
  wxOpenSetting() {
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