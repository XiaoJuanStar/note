// components/calendar/calendar.js

const nowTime = new Date();
const year = nowTime.getFullYear();
const numMonth = nowTime.getMonth() + 1;//数字月数
const month = getMonth(numMonth - 1);//汉字月数
const day = nowTime.getDate();//号数
let flag = numMonth;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    month: '',
    year:  '',
    day: '',
    calendarShow: true,
    numMonth: '',
    toggle:'../../images/toggle.png',
    calendarList: []
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      let xinqi = new Date().getDay();
      let calendarList = getCalendarList(numMonth, year, xinqi);
      this.setData({
        year: year,
        month: month,
        numMonth: numMonth,
        day: day,
        calendarList: calendarList
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDateList: function () {
      let that = this;
      if (that.data.calendarShow) {
        that.setData({
          calendarShow: false,
          toggle: '../../images/toggleOpen.png'
        })
      } else {
        that.setData({
          calendarShow: true,
          toggle: '../../images/toggle.png'
        })
      }
    },
    pageLeft: function () {
      let result = page('left', this.data.numMonth, this.data.year);
      let calendarList = getCalendarList(result.month, result.year);
      this.setData({
        year: result.year,
        month: getMonth(result.month - 1),
        numMonth: result.month,
        calendarList: calendarList
      });
    },
    pageRight: function () {
      let result = page('right', this.data.numMonth, this.data.year);
      let calendarList = getCalendarList(result.month, result.year);
      this.setData({
        year: result.year,
        month: getMonth(result.month - 1),
        numMonth: result.month,
        calendarList: calendarList
      });

    }

  }
})
function getMonth(month) {
  let timeArray = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return timeArray[month];
}

function getCalendarList(nowMonth, year) {
  let dataList = [];
  let tempArray = ['日', '一', '二', '三', '四', '五', '六'];
  tempArray.forEach(function (item, index) {
    dataList.push({ 'date': item, 'class': 'on' })
  })

  let dayCount = 0;
  let xinqi = new Date(year + '-' + nowMonth + '-' + 1).getDay();//星期
  //显示星期
  if (xinqi !== 0) {
    for (let i = 0; i < xinqi; i++) {
      dataList.push({ date: ' ' });
    }
  }

  if (nowMonth !== 2) {
    if (nowMonth === 4 || nowMonth === 6 || nowMonth === 9 || nowMonth === 11) {
      dayCount = 30;
    } else {
      dayCount = 31;
    }
  } else {
    //判断是否是闰年
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
      dayCount = 29;
    else
      dayCount = 28;
  }

  for (let j = 1; j <= dayCount; j++) {
    var item = { date: j };
    if (j == day && flag == nowMonth) {
      item['class'] = 'on';
    }
    dataList.push(item);
  }
  return dataList;

}


function page(type, pageMonth, year) {
  if (type == 'left') {
    if (pageMonth === 1) {
      pageMonth = 12;
      year = year - 1;
    } else if (pageMonth > 1) {
      pageMonth = pageMonth - 1;
    }


  } else {
    if (pageMonth === 12) {
      pageMonth = 1;
      year = year + 1;
    } else if (pageMonth < 12) {
      pageMonth = pageMonth + 1;
    }

  }
  return { month: pageMonth, year: year };
}