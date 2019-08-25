//index.js
//获取应用实例
const app = getApp()
import NumberAnimate from "../../utils/NumberAnimate";
var QQMapWX = require('../../qqmap.js');
var qqmapsdk = new QQMapWX({
  key: 'TPNBZ-4KQLP-FKKD5-VVENU-EJXP6-I7FU5' // 必填
});
Page({

  data: {
    time: '',
    data: '',
    city: '定位中',
    bool: '', //定位成功为fill
    grade: '', //污染等级来显示颜色低于
    aqi: '0',
    zhiliang: null,
    pm: '0',
    list: [],
    color: [

    ],
    modalName: '',
    // region: ['广东省', '广州市'],
    wxts: ''
  },
  //事件处理函数

  onLoad: function() {

    this.getData()
    this.getColor('1')
  },
  onShow: function() {
    if (app.globalData.city != this.data.city && app.globalData.city != null) {
      this.workStr(app.globalData.city + '市')
    }
  },
  getData() {
    const that = this
    wx.request({
      url: 'https://admin.renrendao.com.cn/weixinpl/common_shop/jiushop/dome/python-log/foo.txt',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          list: res.data
        })
        //console.log(that.data.list)
        that.formSubmit()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  formSubmit(e) { // 定位函数
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: '',
      success: function(res) { //成功后的回调
        // console.log(res);
        let city = res.result.address_component.city
        console.log(city)

        that.workStr(city) //判断城市
      },
      fail: function(error) {
        console.error(error);
        that.setData({
          city: "定位失败"
        });
        that.showModal()
      },
      complete: function(res) {}
    })
  },
  workStr(city) {
    const that = this
    let tmp = that.data.list.data
    tmp.forEach(item => {
      if (item.city + "市" == city) {
        that.setData({
          time: that.data.list.time,
          pm: item.pm25,
          zhiliang: item.content,
          grade: that.getColor(item.pm25),
          city: city,
          bool: 'fill'
        })
        let wxts = ''
        if (item.content == '优') {
          wxts = '空气很好，可以外出活动，呼吸新鲜空气，但请注意花粉、柳絮。'
        } else if (item.content == '良') {
          wxts = '可以正常在户外活动，易敏感人群应减少外出，外出请佩戴3M隐形口罩，阻挡过敏原！'
        } else if (item.content == '轻度污染') {
          wxts = '敏感人群症状易加剧，应避免高强度户外锻炼，外出时做好防护措施，佩戴3M隐形口罩，防雾霾、阻挡过敏原！'
        } else if (item.content == '中度污染') {
          wxts = '应减少户外活动，敏感人群尽量不要外出，外出时做好防护措施，佩戴3M隐形口罩，防雾霾、阻挡过敏原！'
        } else if (item.content == '重度污染') {
          wxts = '尽量不要外出，，敏感人群应留在室内，外出请做好防护措施，佩戴3M隐形口罩！'
        } else if (item.content == '严重污染') {
          wxts = '尽量不要外出，外出请做好全方位的防护措施，佩戴3M隐形口罩，对自身健康负责！'
        }
        that.setData({
          wxts: wxts
        })
        let aqi = item.AQI
        let n1 = new NumberAnimate({
          from: aqi, //开始时的数字
          speed: 500, // 总时间
          refreshTime: 40, //  刷新一次的时间
          decimals: 0, //小数点后的位数
          onUpdate: () => { //更新回调函数       
            this.setData({
              aqi: n1.tempValue
            });
          },
          onComplete: () => { //完成回调函数         
            this.setData({
              num1Complete: " 完成了"
            });
          }
        });
      }

    })



  },
  getColor(num) {

    let res = ''
    if (num >= 0 && num <= 35) {
      res = '#1d953f'
    } else if (num > 35 && num <= 75) {
      res = '#78a355'
    } else if (num > 75 && num <= 150) {
      res = '#faa755'
    } else if (num > 150 && num <= 250) {
      res = '#dea32c'
    } else if (num > 250) {
      res = '#f15a22'
    } else {
      res = '#a03939'
    }
    // console.log(res)
    this.setData({
      grade: res
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: res
    // });
    return res
    /**
  优：0~35μg/m³
  良：35~75μg/m³
  轻度污染：75~115μg/m³
  中度污染：115~150μg/m³
  重度污染：150~250μg/m³
  严重污染大于：250μg/m³及以上
   */
  },

  top() {
    const that = this
    var app = getApp()
    app.globalData.list = that.data.list.data
    wx.navigateTo({
      url: '../top/top',
    })
  },
  showModal(e) {
    this.setData({
      modalName: 'bottomModal'
    })
  },
  hideModal(e) {
    let type = e.target.dataset.type
    // console.log(e.target.dataset.type)
    this.setData({
      modalName: null
    })
    if (type == '1') {
      wx.navigateTo({
        url: '../city/city',
      })
    }

  },
  test() {
    wx.navigateTo({
      url: '../new/new',
    })
  },
  show(e) {
    wx.showModal({
      title: '提示',
      content: '内容正在审核中',
      showCancel: false,
      confirmText: '确定'
    })
  }
  // RegionChange: function (e) {
  //   console.log(e)
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },
})