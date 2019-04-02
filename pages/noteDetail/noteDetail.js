// pages/noteDetail/noteDetail.js
const utils = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    // decodeURI()
    // encodeURI
    this.setData({
      noteId:options.id
    })
    this.getNotesDetail(options.id);
  },
  getNotesDetail(id){
    wx.request({
      url: app.globalData.url +'notes/notes/getNotesDetail',
      method:'post',
      data:{
        id:id
      },
      success:(res) =>{
        console.log('获取日记详情接口');
        let content = decodeURIComponent(res.data[0].note_content).split('\n');
        let title = decodeURIComponent(res.data[0].note_title);
        res.data[0]['date'] = utils.formatTime(new Date(res.data[0].created_at)); 
        let src = res.data[0].note_picture == '' ? []:res.data[0].note_picture.split(',');
        this.setData({
          detailData: res.data[0],
          src: src,
          content: content,
          title: title
        })
      }
    })
  },
  updateNotes() {
    wx.navigateTo({
      url: '../takeNotes/takeNotes?id=' + this.data.noteId,
    })
  },
  deleteNote(){
    let that = this;
    wx.showModal({
      title: '删除',
      content: '是否删除该日记',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url +'notes/notes/deleteNotes',
            method:'post',
            header: {
              'Authorization': wx.getStorageSync('jwt')
            },
            data:{
              id: Number(that.data.noteId)
            },
            success:res =>{
              console.log(res);
              if(res.data.result){
                wx.navigateBack({
                  delta: 999
                })
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'fail',
                  duration: 1000
                })
              }
              
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来瞅瞅，精彩的一天',
      path: '/pages/noteDetail/noteDetail?id=' + this.data.noteId 
    }
  }
})