// pages/takeNotes/takeNotes.js
const utils = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    indicatorDots:true,
    duration:500,
    imageList: ['../../images/cameraImg.jpg'],
    tempImg:[],
    title:'',
    content:'',
  },
  onLoad: function (options) {
    console.log(options)
    if (options.id !== null){
      // this.setData({
      //   noteId: options.id
      // })
      this.getNotesDetail(options.id);
    }else{
      this.setData({
        todayDate: utils.formatTime(new Date)
      })
    }
  },
  chioceImage(){
    let that = this;
    wx.chooseImage({
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths[0]
      wx.uploadFile({
        url: app.globalData.url +'upload/uploadImg',
        filePath: tempFilePaths,
        name: 'upload',
        formData: {
          upload: 'upload'
        },
        success(res) {
          const data = JSON.parse(res.data);
          console.log(data);
          that.data.tempImg.push(data.src);
          that.setData({
            imageList: that.data.tempImg
          })
          console.log('已上传的图片')
          console.log(that.data.tempImg);
        }
      })

    }
  })
  },
  saveNotes(e){
    const {tempImg} = this.data;
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    const jwt = wx.getStorageSync('jwt');
    let msg = '';
    if (title == ''){
      msg = '请填写标题'
    }else if(content == ''){
      msg = '请填写正文'
    }else{
      wx.request({
        url: app.globalData.url + 'notes/notes/saveNotes',
        method: 'post',
        header:{
          'Authorization': jwt
        },
        data: {
          token: jwt,
          title: title,
          content: content,
          src: this.data.tempImg.join(),
          place:app.globalData.place
        },
        success: (res) => {
          console.log('保存日记接口')
          console.log(res.data);
          if (JSON.parse(res.data).result){
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
    if(msg!=''){
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1000
      })
    }
  },
  getNotesDetail(id) {
    wx.request({
      url: app.globalData.url + 'notes/notes/getNotesDetail',
      method: 'post',
      data: {
        id: id
      },
      success: (res) => {
        res.data[0]['date'] = utils.formatTime(new Date(res.data[0].created_at));
        let src = res.data[0].note_picture === null ? [] : res.data[0].note_picture.split(',')
        this.setData({
          detailData: res.data[0],
          imageList: src,
          todayDate: res.data[0]['date'],
          title: res.data[0].note_title+'',
          content: res.data[0].note_content+''
        })
      }
    })
  },
  

})