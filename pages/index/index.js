//index.js
const utils = require('../../utils/util.js')
// 引用百度地图微信小程序JSAPI模块 
let bmap = require('../../utils/bmap-wx.js'); 
//获取应用实例
const app = getApp()



Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    calendarList:[],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
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
      let des = weatherData.weatherDesc;
      let weatherDesc = des.substr(des.length-1);
      let weatherIcon = '../../images/qingtian.png'
      if (weatherDesc.indexOf('云')>-1){
        weatherIcon = '../../images/duoyun.png'
      } else if (weatherDesc.indexOf('阴') > -1){
        weatherIcon = '../../images/yintian.png'
      } else if (weatherDesc.indexOf('雨') > -1) {
        weatherIcon = '../../images/yutian.png'
      }
      
      app.globalData.place = weatherData.currentCity;
      // let place = weatherData.currentCity 
      that.setData({
        weatherData: weatherData,
        weather: des,
        temperature: temperature,
        weatherIcon: weatherIcon,
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
  onShow:function(){
    if (app.globalData.userInfo === null) {
      this.getUser();
     }else{
      this.getCalendarList();
     }
  },
  onPullDownRefresh: function () {
    console.log('下拉动作')
    this.getUser()
  },
  getUser(){
    let that = this;
    wx.login({
      success: res => {
        this.code = res.code;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && this.code!=null) {
          console.log('2')
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              const { encryptedData, iv } = res || res.detail;
              wx.request({
                url: app.globalData.url + 'users/wxLogin',
                method: 'post',
                data: {
                  "code": this.code,
                  "encryptedData": encryptedData,
                  "iv": iv
                },
                success(res) {
                  let jwt = res.data;
                  wx.setStorageSync('jwt', jwt);
                  that.getCalendarList();
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail:err=>{
              console.log('登录接口失败')
            },
            complete:msg=>{
              console.log('加载完')
            }
          })
        }
      }
    })
  },
  getChioceDay:function(e){
    console.log(e.detail.time);
    this.getCalendarList(e.detail.time)
   
  },
  getCalendarList: function (time){
    wx.showLoading({
      title: '加载中',
    })
    const jwt = wx.getStorageSync('jwt');
    if (jwt != null && jwt.toString().indexOf('<')<0){
      //获取日记列表
      wx.request({
        url: app.globalData.url + 'notes/notes/getNotesList',
        method: 'post',
        data: {
          token: jwt,
          "time": time || ''
        },
        success: (res) => {
          wx.hideLoading()
          console.log('获取日记列表');
          let data = res.data;
          let tempData = [];
          console.log(data);
          if (data != null && data.length>0){
            for (let i = 0; i <data.length; i++) {
              let formatDate = new Date(data[i].created_at);
              data[i].day = '周' + (utils.formatDay(formatDate.getDay()) || '');
              data[i].date = formatDate.getDate();
              data[i].time = (utils.formatTime(formatDate, 'hms') || '00:00').split(' ')[1].substr(0, 5);
              data[i].src = (data[i].note_picture) != null ? data[i].note_picture.split(',')[0] : null;
              data[i].note_content = decodeURIComponent(data[i].note_content);
              data[i].note_title = decodeURIComponent(data[i].note_title)
              tempData.push(data[i]);
            }
            console.log('tempData')
            console.log(tempData);
            this.setData({
              calendarList: tempData || [],

            })
          } else{
            this.setData({
              calendarList: []
            })
          }
        },
        fail: err => {
          console.log('登录接口失败')
          wx.hideLoading()
          wx.showToast({
            title: '登录接口出错',
            icon: 'fail',
            duration: 2000
          })
        },
        complete: msg => {
          wx.hideLoading()
          console.log('加载完')
          if (this.data.calendarList.length<1){
            wx.showToast({
              title: '加载失败',
              image: '../../images/error.png',
              duration: 2000
            })
          }
        },
      })
    }
    

   
  },
  getUserInfo: function(code) {
    let that = this;
    console.log('getUserInfo')
    console.log(app.globalData.userInfo )
    if (app.globalData.userInfo === null){
      that.getUser()
    }
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        console.log('userInfo')
        console.log(userInfo)
        app.globalData.userInfo = userInfo
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })
      }
    })
    
  },
  
})
