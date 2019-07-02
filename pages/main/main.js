// pages/main/main.js
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
    grade: 'grey', //污染等级来显示颜色低于
    aqi: '0',
    zhiliang: '优',
    pm: '0',
  },

  onLoad: function(options) {
    //获取pm数据
    this.getLastTime() //pm数据最后更新时间
    this.formSubmit() //定位
  },

  getData() {
    const that = this
    wx.request({
      url: 'https://admin.renrendao.com.cn/weixinpl/common_shop/jiushop/dome/data/data2.cfg',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        //console.log(res.data)

        that.workStr(res.data)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getLastTime() {
    const that = this
    wx.request({
      url: 'https://admin.renrendao.com.cn/weixinpl/common_shop/jiushop/dome/data/data3.cfg',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        res.data = res.data.replace('{', '').replace('}', '')
        that.setData({
          time: res.data
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  formSubmit(e) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: '',
      success: function(res) { //成功后的回调
        //console.log(res);
        that.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          city: res.result.address_component.city,
          bool: 'fill'
        });
        //that.getColor(22)
        that.getData()
      },
      fail: function(error) {
        console.error(error);
        that.setData({
          city: "定位失败"
        });
      },
    })
  },
  getColor(num) {
    /**
  优：0~35μg/m³
  良：35~75μg/m³
  轻度污染：75~115μg/m³
  中度污染：115~150μg/m³
  重度污染：150~250μg/m³
  严重污染大于：250μg/m³及以上
   */
    let res = ''
    if (num >= 0 && num <= 35) {
      res = 'green'
    } else if (num > 35 && num <= 75) {
      res = 'olive'
    } else if (num > 75 && num <= 150) {
      res = 'yellow'
    } else if (num > 150 && num <= 250) {
      res = 'orange'
    } else if (num > 250) {
      res = 'red'
    } else {
      res = 'grey'
    }
    // console.log(res)
    this.setData({
      grade: res
    })
  },
  workStr(data) {
    const that = this
    let tmp = data
    // console.log(tmp)
    let x = tmp.split("\n")
    let resData = []
    for (let index in x) {
      if (x[index] != '') { // 最后一行数据为空
        console.log(index, x[index].split("|"));
        let tmp = x[index].split("|")
        resData.push({
          city: tmp[0],
          province: tmp[1],
          pm: tmp[2],
          aqi: tmp[3],
          zhiliang: tmp[4]
        })
        if (that.data.city.match(tmp[0]) != null) {
          //console.log(that.data.city, tmp)
          that.setData({
            pm:tmp[2],
            zhiliang: tmp[4],
          })
          that.getColor(tmp[3])
          let n1 = new NumberAnimate({
            from: tmp[3], //开始时的数字
            speed: 500, // 总时间
            refreshTime: 50, //  刷新一次的时间
            decimals: 0, //小数点后的位数
            onUpdate: () => { //更新回调函数
              this.setData({
                aqi: n1.tempValue
              });
            },
            onComplete: () => { //完成回调函数

            }
          });
          
          //数字动画
        }
      } else {
        break;
      }
    };
    that.setData({
      data: resData
    })
    // let y = x.split("|")
    // console.log(y)
  }
})