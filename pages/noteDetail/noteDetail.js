// pages/noteDetail/noteDetail.js
const utils = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
        res.data[0]['date'] = utils.formatTime(new Date(res.data[0].created_at)); 
        let src = res.data[0].note_picture == '' ? []:res.data[0].note_picture.split(',');
        this.setData({
          detailData: res.data[0],
          src: src
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
    wx.showModal({
      title: '删除',
      content: '是否删除该日记',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})