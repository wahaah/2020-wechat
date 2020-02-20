// pages/news/news.js

//引入本地json数据，这里引入的就是第一步定义的json数据
var jsonData = require('../../assets/nav-data.js');
var jsonData1 = require('../../assets/provinces.js');
/* 
引入echarts.js两种方式：
1.在js文件中
import * as echarts from '../../ec-canvas/echarts';
2.在.json文件中配置
"ec-canvas": "../../ec-canvas/ec-canvas"
 */
//  echarts-for-weixin-master\ec-canvas\echarts.js
import * as echarts from '../../echarts-for-weixin-master/ec-canvas/echarts'
const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

//  function getOption(xData,conData,deadData,cureData){
    var option = {
      title: {
        text: '疫情趋势',
        left: 'left'
      },
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      legend: {
        data: ['确诊', '死亡', '治愈'],
        //  data: ['A', 'B', 'C'],
        top: 30,
        left: 'center',
        backgroundColor: '#eee',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // data: ['', '周二', '周三', '周四', '周五', '周六', '周日'],
        data: wx.getStorageSync('dateArr')||[],
        // data: ,
        // show: false
      },
      //  y为value会自动调整
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '确诊',
        type: 'line',
        smooth: true,
        // data: [18, 36, 65, 30, 78, 140, 33]
        data: wx.getStorageSync('confirmedCountArr')||[]
      }, {
        name: '死亡',
        type: 'line',
        smooth: true,
          // data: [12, 50, 51, 35, 70, 30, 20]
        data: wx.getStorageSync('deadCountArr')||[]
      }, {
        name: '治愈',
        type: 'line',
        smooth: true,
          // data: [10, 30, 31, 50, 40, 20, 10]
        data: wx.getStorageSync('curedCountArr')||[]
      }]
    };

    chart.setOption(option);
    return chart;
  // }
}
Page({


  /**
   * 页面的初始数据
   */
  data: {
    // 被点击菜单的导航索引
    currentIndex: 0,
    // test
    time: new Date().toLocaleString(),
    timestamp1: Date.parse(new Date()),
    // 当前时间
    nowtime:null,
    // 导航
    navList: [],
    // 请求到的全国数据
    resList: [],
    // 全国的四项数据
    newResList: [],
    // 全国图标数据
    dateArr:[],
    confirmedCountArr:[],
    curedCountArr:[],
    deadCountArr:[],
    infoAll:{
      date:'',
      confirmedCount:'',
      curedCount:'',
      deadCount:''
    },
    infoAllList:[],
    // 选择的本省的数据
    localList:[],
    province:'陕西省',
    // 本地省份
    provinceList:[],
    // 选择的省
    cityName: '' ||'陕西省',
    // 新闻数据
    newsList:[],

    ec: {
      onInit: initChart
    }
  },
 getTime(date){
  //  var time = new Date(date) || new Date();
  if(date){
    var time = new Date(date);
    var year = time.getFullYear();
    var month = (time.getMonth() + 1).toString().padStart(2, '0');
    var day = time.getDate().toString().padStart(2, '0');
    var hh = time.getHours().toString().padStart(2, '0');
    var mm = time.getMinutes().toString().padStart(2, '0');
    var ss = time.getSeconds().toString().padStart(2, '0');
    // return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
    return month + "-" + day;
  }else{
    var time = new Date();
    var year = time.getFullYear();
    var month = (time.getMonth() + 1).toString().padStart(2, '0');
    var day = time.getDate().toString().padStart(2, '0');
    var hh = time.getHours().toString().padStart(2, '0');
    var mm = time.getMinutes().toString().padStart(2, '0');
    var ss = time.getSeconds().toString().padStart(2, '0');
    // return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
    return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
  }
   
   
 },
  /* 回去全国信息 */
  getOverall() {
    var that = this;
    var arr = [0,100,200,300,400,500,600,700];
    wx.request({
      url: 'https://lab.isaaclin.cn/nCoV/api/overall',
      data: {
        latest: 0
      },
      // latest:0 时间序列数据返回
      // 默认 latest:1 返回最新数据
      method: 'GET', 
      success: function (res) {
        // success
        // console.log(res);
        if (res.statusCode == 200) {

          var dateAr = [];
          var confirmedCountAr = [];
          var curedCountAr = [];
          var deadCountAr = [];
          that.data.resList = res.data.results;
          res.data.results.forEach(function (item, i) {
            // var dataItem = item;
           arr.forEach((ite,index) =>{
            var index = Number(ite);
            if (index==i){
              dateAr.unshift(that.getTime(item.updateTime));
              confirmedCountAr.unshift(item.confirmedCount);
              curedCountAr.unshift(item.curedCount);
              deadCountAr.unshift(item.deadCount);

                // console.log(index);
                that.data.infoAll = {
                  date: that.getTime(item.updateTime),
                  confirmedCount: item.confirmedCount,
                  curedCount: item.curedCount,
                  deadCount: item.deadCount
                }
                that.data.infoAllList.push(that.data.infoAll);
                that.setData({
                  infoAll: {
                    date: '',
                    confirmedCount: '',
                    curedCount: '',
                    deadCount: ''
                  },
                  infoAllList: that.data.infoAllList,
                  dateArr: dateAr,
                  confirmedCountArr:confirmedCountAr,
                  curedCountArr: curedCountAr,
                  deadCountArr: deadCountAr
                })

              }else{

              }

            })
            
          })
          // console.log(that.data.infoAllList);
          // console.log(that.data.dateArr);
          // console.log(that.data.confirmedCountArr);
          // console.log(that.data.curedCountArr);
          // console.log(that.data.deadCountArr);
          wx.setStorage({
              key: 'dateArr',
              data: that.data.dateArr
          });
          wx.setStorage({
              key: 'confirmedCountArr',
              data: that.data.confirmedCountArr
          });
           wx.setStorage({
              key: 'curedCountArr',
              data: that.data.curedCountArr
          });
           wx.setStorage({
              key: 'deadCountArr',
              data: that.data.deadCountArr
          });


        }
        // console.log(that.data.resList)

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  getOverallList() {
    let that = this;
    // console.log(this.time('5568998989'));
    wx.request({
      url: 'https://lab.isaaclin.cn/nCoV/api/overall',
      // latest:0 时间序列数据返回
      // 默认 latest:1 返回最新数据
      method: 'GET', 
      success: function (res) {
        // console.log(res);
        // success
        if (res.statusCode == 200) {
          var confirmedCount = res.data.results[0].confirmedCount;
          var suspectedCount = res.data.results[0].suspectedCount;
          var deadCount = res.data.results[0].deadCount;
          var curedCount = res.data.results[0].curedCount;
          var arr = [confirmedCount, suspectedCount, deadCount, curedCount];
          // console.log(arr);
          that.setData({
            resList: res.data.results,
            newResList: arr
          })

          console.log(that.data.resList);
        }
      },
    })
  },
  /* 获取陕西本地数据 */
  getLocalData(){
    var that = this;
    wx.request({
      url: 'https://lab.isaaclin.cn/nCoV/api/area?latest=0&province=' + that.data.province,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        // console.log(res);
        that.setData({
          localList: res.data.results[0],
        })
      }
    })
  },
  getSelectData(localName) {
    var that = this;
    wx.request({
      url: 'https://lab.isaaclin.cn/nCoV/api/area?latest=0&province=' + localName,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET', 
      success: function (res) {
        console.log(res);
        that.setData({
          localList: res.data.results[0],
        })
      }
    })
  },
  /* 获取最近新闻 */
  getRecentNews(){
    var that = this;
    wx.request({
      url: 'https://lab.isaaclin.cn/nCoV/api/news?num=all&province=' + that.data.cityName,
      data: {},
      method: 'GET', 
      success: function(res){
        // success
        // console.log(res);
        that.setData({
          newsList: res.data.results,
        })
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dd = this.getTime();
    // 发送请求一般放在onload中
    this.getOverall()
    this.getOverallList()
    // 获取到本地的json数据====================================
    this.setData({
      //jsonData.navList获取nav-data.js里定义的json数据，并赋值给navList
      navList: jsonData.navList,
       provinceList: jsonData1.provinceList,
       nowtime: dd
    });
  },
  /* 点击当前导航页 */
  currentNav(e) {
    if(e.currentTarget.dataset.index==1){
      this.getLocalData();
    }else if(e.currentTarget.dataset.index==2){
      // this.getRecentNews();
    }else if(e.currentTarget.dataset.index==3){
      this.getRecentNews();
    }
    this.setData({
      // currentIndex: e.target.dataset.index,
      currentIndex: e.currentTarget.dataset.index,
    })
  },
  selectPorvince(e){
    // console.log(222);
    // console.log(e);
    this.setData({
      // currentIndex: e.target.dataset.index,
      cityName: e.currentTarget.dataset.name,
    })
    this.getSelectData(this.data.cityName);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})