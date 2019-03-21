//index.js

// 引用百度地图微信小程序JSAPI模块 
let bmap = require('../../utils/bmap-wx.js'); 
//获取应用实例
const app = getApp()



Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    //新建百度地图对象
    let BMap = new bmap.BMapWX({
      ak:'W7hAvDTOExW6AkI4madc834p21EZwmGx'
    })
    let fail = function (data) {
      console.log(data)
    };
    let success = function (data) {
      let weatherData = data.currentWeather[0];
      let temperature = weatherData.date;
      temperature = temperature.substr(temperature.length - 4).split(')')[0];
      let weatherDesc = weatherData.weatherDesc;
      let weatherIcon = '../../images/qingtian.png'
      if (weatherDesc.indexOf('云')>-1){
        weatherIcon = '../../images/duoyun.png'
      } else if (eatherDesc.indexOf('阴') > -1){
        weatherIcon = '../../images/yintian.png'
      } else if (eatherDesc.indexOf('雨') > -1) {
        weatherIcon = '../../images/yutian.png'
      }
      //weatherIcon
          // let place = weatherData.currentCity 
      that.setData({
        weather: weatherDesc,
        temperature: temperature,
        weatherIcon: weatherIcon
      });
    } 
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 



    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  }
 
})

