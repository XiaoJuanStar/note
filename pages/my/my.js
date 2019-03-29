// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNumber();
  },




  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getNumber(){
    const jwt = wx.getStorageSync('jwt');
    console.log('jwt:' + jwt);
    if (jwt != null && jwt.indexOf('<') < 0) {
      //获取日记列表
      wx.request({
        url: app.globalData.url + 'notes/notes/getNotesList',
        method: 'post',
        data: {
          token: wx.getStorageSync('jwt')
        },
        success: (res) => {
          console.log('日记数量')
          let data = res.data;
          console.log(data);
          this.setData({
            number: res.data.length || 0
          })
        }
      })
    }
  },
})