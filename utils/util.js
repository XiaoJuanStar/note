const formatTime = (date,t) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' +  (t == 'hms'? ([hour, minute, second].map(formatNumber).join(':')):'')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDay = n =>{
  const dayArray = ['日', '一', '二', '三', '四', '五', '六'];
  return dayArray[n];
}

module.exports = {
  formatTime: formatTime,
  formatDay: formatDay
}
