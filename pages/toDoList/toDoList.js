      // pages/toDoList/toDoList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: new Date().toLocaleString(),
    timestamp1: Date.parse(new Date()),
    // 将记录存在数组中，从sessionStorage中存取
    inputList: [],
    checkList: [],
    checkDoneList:[],
    isAll:1,
    info: {
      todoList: '',
      time: ''
    },
    inputInfo: ''


  },
  changeModel(e) {
    // console.log(e);

    this.setData({
      inputInfo: e.detail.value
    })

  },
  getData() {
    var that = this;
    // console.log(that.data.inputList);
    // return that.data.todolist;
    return that.data.inputList;
  },

  addList() {
    // console.log(this.data.inputInfo);
    if (this.data.inputInfo == "" || this.data.inputInfo == null){
      console.log("请输入内容");
      return false;
    }else{
      this.data.info.todoList = this.data.inputInfo,
        this.data.info.time = Date.parse(new Date())
      this.data.inputList.push(this.data.info);
      // console.log(this.data.inputList);
      this.setData({
        inputList: this.data.inputList
      })
      wx.setStorage({
        key: 'inputList',
        data: this.data.inputList
      });
      // 清空input中的数据
      this.setData({
        inputInfo: '',
        info: {
          todoList: '',
          time: ''
        }
      })
      this.data.inputInfo = '';
      return false;

    }
  },
  delete(){
    // var that = this;
    // console.log(333);
    this.data.checkList.forEach((item,ind) => {
      var index = Number(item);
      if(ind==0){
          this.data.inputList.splice(index,1);
          this.setData({
            inputList: this.data.inputList
          })
        }else{
          for(var j=0;j<ind;j++){
            index--;
          }
          this.data.inputList.splice(index,1);
          this.setData({
            inputList: this.data.inputList
          })
        }
        
      this.setData({
        inputList: this.data.inputList
      })
      
    });
    console.log(this.data.inputList);
    wx.setStorage({
      key: 'inputList',
      data: this.data.inputList
    });
  },
  doneBtn(e){
    // console.log(e);
      this.data.checkList.forEach((item,i) => {
      var index = Number(item);
      // console.log(index);
      this.data.inputList[index].checked = true;
      var doneList = [];
        doneList.push(this.data.inputList[index]);
        this.setData({
          inputList: this.data.inputList,
          // checkDoneList: doneList
        })

        console.log(this.data.inputList)
      })
      wx.setStorage({
        key: 'inputList',
        data: this.data.inputList
      });

      

  },
  checkboxChange(e){
    console.log(e);
    this.setData({
      checkList: e.detail.value
    })
  },
  clickAll(e){
    // console.log(e);
    var that = this;
    if (e.currentTarget.dataset.id=="all"){
      // that.data.isAll = true;
      this.setData({
        isAll: 1
      })
    }
   

  },
  clickFinished(e){
    // console.log(this.data.checkDoneList);
    var that = this;
    if (e.currentTarget.dataset.id == "done") {
      this.setData({
        isAll: 2
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   isAll: 1
    // })
    if (wx.getStorageSync('inputList')) {
      // this.data.todoList = wx.getStorageSync('todoList')
      this.data.inputList = wx.getStorageSync('inputList')
    } else {
      // var todoList = this.getData();
      this.data.inputList = this.getData();
      // console.log(this.data.inputList);

    }
    // this.setData({
    //   todoList : todoList
    // })
    this.setData({
      inputList: this.data.inputList
    })

    // wx.setStorage({
    //   key: 'todoList',
    //   data: todoList
    // });

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