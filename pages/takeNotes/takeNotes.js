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
  onUnload() {
    // wx.showModal({
    //   title: '提示',
    //   content: '你要狠心舍弃已编辑的日记吗？',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       wx.navigateBack({
    //         delta: 999
    //       })
    //     } else if (res.cancel) {
          
    //     }
    //   }
    // })
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
    const {tempImg} = this.data;
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    console.log('===')
    console.log(content.indexOf('\n'));
    // content = content.split('\n').join('&ntt|&')
    const jwt = wx.getStorageSync('jwt');
    let msg = '';
    if (title == ''){
      msg = '请填写标题'
    }else if(content == ''){
      msg = '请填写正文'
    }else{
      let src = this.data.noteId ? this.data.imageList:this.data.tempImg.join();
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
          src: src[0] == "../../images/cameraImg.jpg" ? "" : src,
          place:app.globalData.place
        },
        success: (res) => {
          console.log('保存日记接口')
          console.log(res.data);
          let data = res.data;
          if (data.result){
            wx.navigateBack({
              delta: 999
            })
          }
        },
        error:(err)=>{
          msg = err;
          console.log(err);
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
          todayDate: res.data[0]['date'],
          title: res.data[0].note_title+'',
          content: res.data[0].note_content+'',
          imageList: src[0] == '' ? ['../../images/cameraImg.jpg']:src
        })
      }
    })
  },
  textareaInput(e){
    this.setData({
      content: e.detail.value
    })
  },
  

})

function uploadImg(callback){
  wx.chooseImage({
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths[0]
      wx.uploadFile({
        url: app.globalData.url + 'upload/uploadImg',
        // header:{
        //   'contentType':'multipart/form-data'
        // },
        filePath: tempFilePaths,
        name: 'upload',
        formData: {
          upload: 'upload',
          header: {
            'contentType': 'multipart/form-data'
          },
        },
        success(res) {
          const data = JSON.parse(res.data);
          return callback(data);
        }
      })

    }
  })
}