//app.js
App({
  data:{
    code:''
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
          this.code = res.code;
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.globalData.userInfo = res.userInfo
              const { encryptedData, iv } = res;
              wx.request({
                url: this.globalData.url +'users/wxLogin',
                method:'post',
                data: {
                  "code": this.code,
                  "encryptedData": encryptedData,
                  "iv": iv
                },
                success(res) {
                  let jwt = res.data;
                  wx.setStorageSync('jwt', jwt)
                }
              })
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
  },
  globalData: {
    url:'https://www.ableya.cn/',
    userInfo: null
  }
})