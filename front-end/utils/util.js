const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


import wxbarcode from './wxbarcode'

function toBarcode (canvasId, code, width, height) {
  wxbarcode.code128(wx.createCanvasContext(canvasId), code, width, height);
}


module.exports = {
  formatTime,
  toBarcode,
}

