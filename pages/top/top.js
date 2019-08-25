// pages/top/top.js
Page({

  data: {
    dataList: []
  },

  onLoad: function(options) {

    var app = getApp()
    let temp = app.globalData.list
    if (!app.globalData.isList) {
      temp = temp.reverse()
      app.globalData.isList = true
    }
    this.setData({
      dataList: temp
    })

  },

})