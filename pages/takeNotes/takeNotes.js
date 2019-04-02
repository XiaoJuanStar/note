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
    noteId:null,
    isSuccess:false
  },
  onLoad: function (options) {
    console.log(options.id)
    if (options.id){
      this.setData({
        noteId:options.id
      })
      this.getNotesDetail(options.id);
    }else{
      this.setData({
        todayDate: utils.formatTime(new Date)
      })
    }
  },
  chioceText(){
    let that = this;
    uploadImg(function (data) {
      let url = data.src;
      const jwt = wx.getStorageSync('jwt');
      wx.request({
        url: app.globalData.url + 'ocr/distinguish',
        method: 'post',
        header: {
          'Authorization': jwt
        },
        data: {
          src:url
        },
        success: (res) => {
          console.log('识别文字接口')
          let data = res.data;
          console.log(data);
          let textLength = data.words_result_num;
          if (textLength>0){
            let text = data.words_result;
            let str = that.data.content + '\n';
            text.forEach(item =>{
              str += item.words +  '\n';
            })
            that.setData({
              content: str
            })
          }else{
            wx.showToast({
              title: '识别失败',
              image: '../../images/error.png',
              duration: 2000
            })
          }
 
      
        }
      })
    });
  },
  chioceImage(){
    let that = this;
    uploadImg(function(data){
      that.data.tempImg.push(data.src);
      that.setData({
        imageList: that.data.tempImg
      })
      console.log('已上传的图片')
      console.log(that.data.tempImg);
    })
  },
  saveNotes(e){
    let that = this;
    const {tempImg} = this.data;
    let title = encodeURIComponent(e.detail.value.title);
    let content = encodeURIComponent(e.detail.value.content);
    const jwt = wx.getStorageSync('jwt');
    let msg = '';
    if (title == ''){
      msg = '请填写标题'
    }else if(content == ''){
      msg = '请填写正文'
    }else{
      wx.showLoading({
        title: '保存中',
      })
      let src = this.data.noteId ? this.data.imageList:this.data.tempImg;
      wx.request({
        url: app.globalData.url + 'notes/notes/saveNotes',
        method: 'post',
        header:{
          'Authorization': jwt
        },
        data: {
          id: this.data.noteId ? this.data.noteId:undefined,
          token: jwt,
          title: title,
          content: content,
          src: src[0] == "../../images/cameraImg.jpg" ? "" : src.join(),
          place:app.globalData.place
        },
        success: (res) => {
         
          console.log('保存日记接口')
          console.log(res.data);
          let data = res.data;
          if (data.result){
            wx.hideLoading();
            that.setData({
              isSuccess:true
            })
            wx.navigateBack({
              delta: 999
            })
          }
        },
        fail:(err)=>{
          msg = err;
          console.log(err);
        },
        complete:res=>{
          if (!that.data.isSuccess){
            msg = '保存失败！'
          }
        }
      })
    }
    if(msg!=''){
      wx.hideLoading();
      wx.showToast({
        title: msg,
        image: '../../images/error.png',
        duration: 2000
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
        let content = decodeURIComponent(res.data[0].note_content);
        let title = decodeURIComponent(res.data[0].note_title);
        this.setData({
          todayDate: res.data[0]['date'],
          title: title,
          content: content,
          imageList: src[0] == '' ? ['../../images/cameraImg.jpg']:src
        })
      }
    })
  },

})

function uploadImg(callback){
  wx.chooseImage({
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      wx.showLoading({
        title: '加载中',
      })
      const tempFilePaths = res.tempFilePaths[0]
      wx.uploadFile({
        url: app.globalData.url + 'upload/uploadImg',
        header:{
          'content-type':'multipart/form-data'
        },
        filePath: tempFilePaths,
        name: 'upload',
        success(res) {
          wx.hideLoading();
          const data = JSON.parse(res.data);
          return callback(data);
        }
      })

    }
  })
}