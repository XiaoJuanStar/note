// pages/takeNotes/takeNotes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    duration:500,
    imageList: ['../../images/cameraImg.jpg'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  chioceImage:function(){
    let that = this;
    wx.chooseImage({
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths
      console.log(tempFilePaths);
      that.setData({
        imageList: tempFilePaths
      })
    }
  })
  }
  

})