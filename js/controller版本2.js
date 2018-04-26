$(document).ready(function () {
  var myChart = echarts.init(document.getElementById('r-canvas'), 'macarons');

  function eChartDemo (arg) {

    this.initStyle = {
      normal: {
        label: {show: true}
      }
    }                            // 全局 - 初始化item样式

    this.clickedStyle = {
      normal: {
        label: {show: true},
        borderColor: 'rgba(255, 215, 0, 0.4)',
        borderWidth: 20,
        borderType: 'solid'
      }
    }                        // 全局 - 选择的item样式

    this.option = {
      tooltip: {
        show: true,
        showContent: true,
        trigger: 'item',
        triggerOn: 'mouseover',
        enterable: true,    //鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
        confine: false,     //是否将 tooltip 框限制在图表的区域内。外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
        transitionDuration: 0.4,//提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
        formatter: '{b0}:{c0}</br>{b1}:{c1}'
      },            // 选项设置 - 提示框
      legend: {
        show: true,
        data: [
          {name: '第一级别', icon: 'rect'},
          {name: '第二级别', icon: 'roundRect'},
          {name: '第三级别', icon: 'triangle'},
        ]
      },                              // 选项设置 - 按钮导航                  译:说明 这个要和categories类型name相同
      series: [{
        type: 'graph',
        name: '图表系列名称',
        legendHoverLink: true,//是否启用图例 hover(悬停) 时的联动高亮。
        layout: 'force',
        roam: true,         //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        nodeScaleRatio: 0.6,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
        draggable: true,    //节点是否可拖拽，只在使用力引导布局的时候有用。
        focusNodeAdjacency: true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
        edgeSymbol: ['none', 'none'],
        force: {
          repulsion: 100,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
          gravity: 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
          edgeLength: 80,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
          layoutAnimation: true
        },       // force类型设置
        itemStyle: {
          normal: {
            label: {show: true},
            opacity: 1
            // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
          }, //默认样式
          emphasis: {}//高亮状态
        },   // 节点样式
        label: {
          normal: {
            show: true,//是否显示标签。
            position: 'inside',
            formatter: '{b}',
            textStyle: { //标签的字体样式
              color: '#cde6c7', //字体颜色
              fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
              fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
              fontFamily: 'sans-serif', //文字的字体系列
              fontSize: 12, //字体大小
            }
          }
        },       // item上的标签样式
        data: [
          {id: 'id1', value: 20, name: '101.133.8.88', category: 0, symbol: 'rect', symbolSize: 80},
          {id: 'id2', value: 20, name: "第二个", category: 1, symbol: 'roundRect', symbolSize: 60},
          {id: 'id3', value: 20, name: '第三个', category: 2, symbol: 'roundRect', symbolSize: 60},
          {id: 'id4', value: 20, name: '第四个', category: 1, symbol: 'roundRect', symbolSize: 60},
        ],        // 选项设置 - 数据
        categories: [
          {name: '第一级别', symbol: 'rect'},
          {name: '第二级别', symbol: 'roundRect'},
          {name: '第三级别', symbol: 'rect'}
        ],  // 选项设置(层级) - 节点分类的类目             译:类别 和series绑定
        links: [
          {source: "id1", target: "id2", /*label: {normal: {show: true}}*/},
          {source: "id2", target: "id3"},
          {source: 'id3', target: 'id4'},
          {source: 'id4', target: 'id1'},
        ],
        lineStyle: {
          normal: {
            color: 'rgba(255,0,255,0.4)',
            width: '3',
            type: 'dotted', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
            curveness: 0.3, //线条的曲线程度，从0到1
            opacity: 1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
          },
        },   // 连接线样式
      }],      //  整体外观样式设置                    译:系列
    }

    this.连接点 = []

    this.init(arg)      // 初始化脚本

    this.initDom()      // 初始化页面

    this.tmpId = this.option.series[0].data.length    // 作为id序列 防止删除再增加时出错
  }

  eChartDemo.prototype = {
    constructor: eChartDemo,

    init (arg) {
      myChart.setOption(this.option)

      this.add()

      $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
        myChart.off('click')
        this.initClickedStyle()
        switch ($.trim(e.target.innerText)) {
          case '删':
            this.deleteItem()
            break
          case '增':
            this.add()
            break
          case '改':
            this.change()
            break
          case '查':
            this.search()
            break
        }
      })

    }, // init结束

    initDom () {

      $('#addNewLayer').hide()

      this.initSelectBox()  // 初始化下拉框

      this.choiceNode()        // 选择节点 <selectBox>
    },

    initSelectBox () {
      var html = ''
      var categories = myChart.getOption().series[0].categories

      for (var i = 0; i < categories.length; i++) {
        html += `<option value="${i + 1}">${categories[i].name}</option>`
      }
      html += `<option value="0">+新建层级+</option>`
      $('#choiceNode').html(html).val('1')
    },  // 初始化<selectBox>

    choiceNode () {
      $('#choiceNode').change((e) => {
        var mNodeType = $('#choiceNode').val()
        if (mNodeType === '0') {
          $('#addNewLayer').show()
        }
      })
    },     // 选择节点 <selectBox>(包括新增

    initClickedStyle () {
      var _option = myChart.getOption()       // 获取实例
      var _itemList = _option.series[0].data

      for (var i = 0; i < _itemList.length; i++) {
        _itemList[i].itemStyle = this.initStyle
      }

      myChart.setOption(_option)
    },

    add () {
      this.addNewNode()        // 新增节点
      this.addNewLayer()       // 新增层级
      this.linkTwoPoint()      // 连接两个点
    },          // 增

    addNewNode () {
      $('#add').off('click').on('click', () => {
        var _option = myChart.getOption()
        var itemList = _option.series[0].data
        var newNodeObj = {id: 0, value: 20, name: '', category: '', symbol: '', symbolSize: 60}

        newNodeObj.name = $('#nodeName').val()
        newNodeObj.category = parseInt($('#choiceNode').val()) - 1
        newNodeObj.symbol = $('#nodeSymbol').val()
        newNodeObj.id = 'id' + (this.tmpId + 1)

        itemList.push(newNodeObj)

        this.tmpId++

        myChart.setOption(_option)
      })
    },

    addNewLayer () {
      $('#addNewLayerBtn').off('click').on('click', (e) => {
        var _option = myChart.getOption()
        var newLayer = {name: '', symbol: ''}
        var newLegendData = {name: '', icon: ''}

        newLayer.name = newLegendData.name = $('#layerName').val()
        newLayer.symbol = newLegendData.icon = $('#layerSymbol').val()

        _option.series[0].categories.push(newLayer)
        _option.legend[0].data.push(newLegendData)

        myChart.setOption(_option)

        $('#addNewLayer').hide()
        this.initSelectBox()
      })
    },      // 新增层级

    linkTwoPoint () {
      myChart.on('click', (e) => {
        var itemName = e.data.name
        var itemId = e.data.id
        var _option = myChart.getOption()
        var _itemList = _option.series[0].data

        if (this.连接点.length === 1) {
          /* var a = _.find(_itemList, ['id', this.连接点[0]])     // 第一个点是否已被删除
                    if (!a) {
                      this.连接点 = []
                    }*/
          _.find(_itemList, ['id', this.连接点[0]]) ? '' : this.连接点 = []
        }

        this.连接点.push(itemId)

        /* var item = _.find(_itemList, ['id', itemId])    // 获取点击的item
                if (item) {
                  item.itemStyle = this.clickedStyle    // 选中改变样式
                }*/
        item = _.find(_itemList, ['id', itemId])
        item ? item.itemStyle = this.clickedStyle : ''

        myChart.setOption(_option)

        if (this.连接点.length === 2) {
          this.linkPoint(this.连接点)
          this.连接点 = []
        }
      })
    },     // 连接两点

    linkPoint (连接点) {
      var newLink = {source: 连接点[0], target: 连接点[1]}
      var _option = myChart.getOption()       // 获取实例
      var _itemList = _option.series[0].data
      var _links = _option.series[0].links

      if (_.find(_links, newLink)) {      // 检测是否已连接
        console.log('已连接')
      } else {
        _links.push(newLink)
      }

      myChart.setOption(_option)

      ;(async () => {
        setTimeout(() => {
          for (var i = 0; i < 连接点.length; i++) {
            /*var item = _.find(_itemList, ['id', 连接点[i]])
                        if (item) {
                          item.itemStyle = this.initStyle
                        }*/
            var item = _.find(_itemList, ['id', 连接点[i]])
            item ? item.itemStyle = this.initStyle : ''
          }
          myChart.setOption(_option)
        }, 1000)
      })()
    },

    deleteItem () {
      myChart.on('click', (e) => {
        var itemIndex = e.dataIndex           // 获取点击的item索引
        var _option = myChart.getOption()
        var _data = _option.series[0].data
        var _links = _option.series[0].links

        _data = _.reject(_data, ['id', e.data.id])       // 删除点
        _links = _.reject(_links, ['source', e.data.id])    // 删除{source:,target:}
        _links = _.reject(_links, ['target', e.data.id])    // 断开连接

        _option.series[0].data = _data
        _option.series[0].links = _links

        myChart.setOption(_option)
      })
    },       // 删

    change () {
      myChart.on('click', (e) => {
        debugger
        var currentItem
        var _option = myChart.getOption()
        var _itemList = _option.series[0].data
        var _links = _option.series[0].links

        $('#changeNodeName').val(e.data.name)
        $('#changeNodeSymbol').val(e.data.symbol)
        var sourceLinkItem = _.find(_links, ['source', e.data.id])
        var targetLinkItem = _.find(_links, ['target', e.data.id])

        currentItem = _.find(_itemList, ['id', e.data.id])

        $('#change').off('click').on('click', () => {
          currentItem.name = $('#changeNodeName').val()
          currentItem.symbol = $('#changeNodeSymbol').val()
          sourceLinkItem && sourceLinkItem.source ? sourceLinkItem.source = e.data.id : ''

          // _itemList.splice(parseInt(e.dataIndex), 1, currentItem)
          myChart.setOption(_option)
        })
      })
    },           // 改

    searchItem () {
      var _option = myChart.getOption()
      var _itemList = _option.series[0].data
      var name

      $('#select').off('click').on('click', (e) => {
        myChart.on('click', (e) => {
          name = e.data.name
        })

        $('#searchNodeName').off('change').on('change', (e) => {
          name = $('#searchNodeName').val()
        })

        var _itemList = this.search(_itemList, name)

        _itemList = _tmpItemList

        myChart.setOption(_option)
      })
    },

    search (_itemList, name) {
      $('#select').off('click').on('click', (e) => {
        var items = _.filter(_itemList, ['name', name])

        for (var i = 0; i < items.length; i++) {
          items[i].itemStyle = this.clickedStyle
        }

        return _itemList

        // myChart.setOption(_option)
      })
    },           // 查

  }

  $(function () {var demo = new eChartDemo('参数')})

})