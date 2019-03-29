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

 
  },
  globalData: {
    url:'https://www.ableya.cn/',
    userInfo: null,
    place:'',
    pageType:0,
  }
})