import React from 'react'
//import classNames from 'classnames'
import {connect} from 'react-redux'
import {Row, Col, Button} from 'antd'
import styles from './DB.scss'
import Wrapper from 'components/MainWrapper'
import {COMPANY, VERSION} from 'constants/config'
import {startLoading, endLoading} from 'utils'

import echarts from 'echarts'
import echartsChinaMap from 'echarts/map/json/china'
echarts.registerMap('china', echartsChinaMap)
import 'echarts/theme/shine'
  // <Scrollbar style={{ height: '80%', overflow: 'hidden' }}>
  // </Scrollbar>
  // <div style={{height: '20%', overflow: 'hidden'}}>
  //   <h1>封装方法：切换路由/本地缓存数据结构/</h1>
  // </div>
  //todo cache last data, able to change router with no refresh fetching again
class Main extends React.Component {
  state = {
    data: null
  }
  componentWillMount() {
    this.refreshDataCallback()
  }
  componentWillUnmount() {
    if (this.inited) {
      window.removeEventListener('resize', this.resize, false)
    }
    ['1', '2', '3'].forEach((v) => {
      echarts.dispose(this.refs[`EC${v}`])
    })
  }

  refreshDataCallback = () => {
    startLoading()
    //ZGet('router', params, () => { ...
    setTimeout(() => { //模拟 ZGet，对接时替换
      //const {data, sysLogs, divFS, divSS, divAreas} = d
      //region when api <-> connected, remove all code below until endregion
      const data = {} //normal data object, like money...blablabla..
      const divFS = {
        'date': '160904,160905,160906,160907,160908,160909,160910,160911,160912,160913,160914,160915,160916,160917,160918',
        'data': [
          { 'dt': '160904', 'amount': '8305.0', 'qty': '12' },
          { 'dt': '160905', 'amount': '6096.0', 'qty': '11' },
          { 'dt': '160906', 'amount': '6718.0', 'qty': '10' },
          { 'dt': '160907', 'amount': '6161.0', 'qty': '10' },
          { 'dt': '160908', 'amount': '8271.0', 'qty': '15' },
          { 'dt': '160909', 'amount': '5861.0', 'qty': '10' },
          { 'dt': '160910', 'amount': '31848.0', 'qty': '38' },
          { 'dt': '160911', 'amount': '8355.0', 'qty': '12' },
          { 'dt': '160912', 'amount': '0', 'qty': '0' },
          { 'dt': '160913', 'amount': '0', 'qty': '0' },
          { 'dt': '160914', 'amount': '0', 'qty': '0' },
          { 'dt': '160915', 'amount': '0', 'qty': '0' },
          { 'dt': '160916', 'amount': '0', 'qty': '0' },
          { 'dt': '160917', 'amount': '0', 'qty': '0' },
          { 'dt': '160918', 'amount': '0', 'qty': '0' }
        ]
      }
      const divAreas = {
        data: [
        { name: '江苏', value: '3160.0' },
        { name: '广东', value: '2533.0' },
        { name: '重庆', value: '2208.1' },
        { name: '北京', value: '1961.0' },
        { name: '安徽', value: '1098.0' },
        { name: '河南', value: '1007.0' },
        { name: '四川', value: '938.0' },
        { name: '浙江', value: '807.0' },
        { name: '西藏', value: '715.0' },
        { name: '湖南', value: '564.0' },
        { name: '上海', value: '525.0' },
        { name: '福建', value: '516.1' },
        { name: '新疆', value: '464.0' },
        { name: '河北', value: '454.0' },
        { name: '山东', value: '438.0' },
        { name: '湖北', value: '435.0' },
        { name: '内蒙古', value: '396.0' },
        { name: '广西', value: '356.0' },
        { name: '陕西', value: '238.0' },
        { name: '云南', value: '237.0' },
        { name: '辽宁', value: '207.0' },
        { name: '天津', value: '109.0' },
        { name: '山西', value: '89.0' },
        { name: '江西', value: '79.0' },
        { name: '黑龙江', value: '0.0' }
        ]
      }
      const divSS = {
        legend: [
          '10268952804',
          '10268946679',
          '10268952827',
          '10268946678',
          '其它'
        ],
        data: [
          {
            value: '14',
            name: '10268952804'
          },
          {
            value: '13',
            name: '10268946679'
          },
          {
            value: '12',
            name: '10268952827'
          },
          {
            value: '10',
            name: '10268946678'
          },
          {
            value: '223',
            name: '其它'
          }
        ]
      }
      const sysLogs = [
        {
          id: 8,
          title: '【20160919】静默升级，我就默默的等着你看',
          date: '2016/8/19 13:36:22'
        },
        {
          id: 7,
          title: '【20160819】全面来袭！小金刚变形',
          date: '2016/8/19 13:36:22'
        }
      ]
      //endregion remove all above!
      this.setState({
        sysLogs,
        data
      }, () => {
        //this.handleZhangTabIn(1)
        //const {divFS} = d
        if (divAreas && divAreas.data && divAreas.data.length) {
          (() => {
            const data = divAreas.data
            let max = 0
            data.forEach((chun) => {
              max = Math.max(max, chun.value)
            })
            if (this.inited) {
              this.EC2.setOption({
                visualMap: { max },
                series: [{ data }]
              })
            } else {
              this.EC2 = echarts.init(this.refs.EC2, 'shine')
              this.EC2.setOption({
                title: {
                  text: '近七天地域销售分布',
                  subtext: '累计销售金额，单位（元）',
                  left: 'center',
                  textStyle: {
                    color: '#666',
                    fontWeight: 'normal',
                    fontSize: 16
                  }
                },
                tooltip: {
                  trigger: 'item',
                  extraCssText: 'pointer-events: none;'
                },
                visualMap: {
                  min: 0,
                  max: max,
                  left: 'left',
                  top: 'bottom',
                  text: ['高', '低'],
                  calculable: true
                },
                toolbox: {
                  feature: {
                    saveAsImage: {}
                  }
                },
                series: [{
                  type: 'map',
                  mapType: 'china',
                  label: false,
                  data: data
                }]
              })
            }
          })()
        }
        if (divFS) {
          (() => {
            const qtyData = []
            const amountData = []
            const date = []
            const dateArr = divFS.date.split(',')
            const sd = divFS.data
            dateArr.forEach((t) => {
              let b = false
              date.push(t.substring(4, 6))
              for (let n = 0; n < sd.length; n++) {
                const dt = sd[n].dt
                const amount = sd[n].amount
                const qty = sd[n].qty
                if (t === dt) {
                  amountData.push(parseFloat(amount))
                  qtyData.push(parseFloat(qty))
                  b = true
                  break
                }
              }
              if (b === false) {
                amountData.push(0)
                qtyData.push(0)
              }
            })
            const dateTotal = dateArr.length
            if (this.inited) {
              this.EC1.setOption({
                title: {
                  text: '近' + dateTotal + '天销售',
                  subtext: dateTotal > 0 ? '20' + dateArr[0] + '至' + '20' + dateArr[dateTotal - 1] : ''
                },
                xAxis: [{data: date}],
                series: [{data: amountData}, {data: qtyData}]
              })
            } else {
              this.EC1 = echarts.init(this.refs.EC1, 'shine')
              this.EC1.setOption({
                title: {
                  text: '近' + dateTotal + '天销售',
                  subtext: dateTotal > 0 ? '20' + dateArr[0] + '至' + '20' + dateArr[dateTotal - 1] : '',
                  x: 'center',
                  textStyle: {
                    color: '#666',
                    fontWeight: 'normal',
                    fontSize: 16
                  }
                },
                tooltip: {
                  trigger: 'axis',
                  extraCssText: 'pointer-events: none;',
                  axisPointer: {
                    type: false
                  }
                },
                legend: {
                  data: ['金额', '订单量'],
                  x: 'left'
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: date,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    name: '金额(元)',
                    nameLocation: 'middle',
                    type: 'value',
                    nameGap: -20,
                    nameTextStyle: {
                      color: '#058DC7',
                      fontSize: 14
                    },
                    splitLine: {
                      lineStyle: {
                        color: '#058DC7',
                        opacity: 0.38
                      }
                    }
                  },
                  {
                    name: '订单量(个)',
                    nameLocation: 'middle',
                    type: 'value',
                    nameGap: -20,
                    nameTextStyle: {
                      color: '#50B432',
                      fontSize: 14
                    },
                    splitLine: {
                      lineStyle: {
                        color: '#50B432',
                        type: 'dashed',
                        opacity: 0.38
                      }
                    }
                  }
                ],
                toolbox: {
                  feature: {
                    saveAsImage: {}
                  }
                },
                series: [
                  {
                    name: '金额',
                    type: 'bar',
                    barWidth: '25%',
                    yAxisIndex: 0,
                    silent: true,
                    itemStyle: {
                      normal: {
                        color: '#058DC7'
                      }
                    },
                    data: amountData
                  },
                  {
                    name: '订单量',
                    type: 'line',
                    yAxisIndex: 1,
                    symbol: 'circle',
                    symbolSize: 10,
                    showAllSymbol: true,
                    smooth: true,
                    silent: true,
                    z: 3,
                    itemStyle: {
                      normal: {
                        color: '#50B432'
                      }
                    },
                    lineStyle: {
                      normal: {
                        type: 'dashed',
                        width: 1
                      }
                    },
                    data: qtyData
                  }
                ]
              })
            }
          })()
        }
        if (divSS) {
          (() => {
            this.EC3 = echarts.init(this.refs.EC3, 'shine')
            this.EC3.setOption({
              title: {
                text: '最近七天商品销量',
                x: 'center',
                textStyle: {
                  color: '#666',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
                extraCssText: 'pointer-events: none;'
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: divSS.legend
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              series: [{
                type: 'pie',
                radius: '75%',
                center: ['50%', '52%'],
                data: divSS.data,
                selectedMode: 'multiple',
                selectedOffset: 10,
                clockwise: true,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: true
                  }
                },
                labelLine: {
                  normal: {
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }]
            })
          })()
        }
        if (!this.inited) {
          this.inited = true
          window.addEventListener('resize', this.resize, false)
        }
        endLoading()
      })
    }, 250)
  }
  resize = () => {
    ['1', '2', '3'].forEach((v) => {
      this[`EC${v}`].resize()
    })
  }
  handleZhangTabIn = (v) => {
    const cl = styles[`hi-${v}`]
    this.refs.zhang.className = `${styles.hi} ${cl}`
  }
  handleReadNotice = () => {
    this.props.dispatch({ type: 'ZHMODUNQ_SET', payload: {
      mod: 'test', query: null, visible: true
    } })
  }
  openLogById = (id) => {
    this.props.dispatch({ type: 'ZHMODUNQ_SET', payload: {
      mod: 'sys/log', query: {id}, visible: true
    } })
  }
  _renderLogs = () => {
    const {sysLogs} = this.state
    if (sysLogs) {
      return sysLogs.map((_v) => {
        return (
          <li key={_v.id}><a className='cur' onClick={() => this.openLogById(_v.id)}><span className={styles.c}>{_v.title}</span></a></li>
        )
      })
    }
  }

  render() {
    return (
      <div className={styles.main}>
        <Row className={styles.maxW}>
          <Col span='8'>
            <div className={`${styles['col-a']} ${styles['col-primary']}`}>
              <div className={styles.box}>
                <div>
                  <label>可用抵价券:</label><span className={styles.import}>6888.00</span>
                </div>
                <div>
                  <label>可用单量:</label><span className={styles.import}>1615828</span>
                  <Button size='small'>充值</Button>
                </div>
              </div>
              <footer>
                <Button className={styles.btn}>查看菜鸟剩量</Button>系统用量
              </footer>
            </div>
          </Col>
          <Col span='8'>
            <div className={`${styles['col-a']} ${styles['col-success']}`}>
              <div className={styles.box}>
                <div className={styles['btn-helps']}>
                  <a>文档下载</a>
                  <a>打印控件</a>
                  <a>系统教学</a>
                </div>
                <div className={styles['service-time']}>服务时间：周一至周六(8:30~22:00)</div>
              </div>
              <footer>
                <a href='http://wpa.qq.com/msgrd?v=3&amp;uin=1404074347&amp;site=qq&amp;menu=yes' target='_blank' className={styles['btn-qq']}>
                  企业QQ
                </a>技术支持
              </footer>
            </div>
          </Col>
          <Col span='8'>
            <div className={`${styles['col-a']} ${styles['col-danger']}`}>
              <div className={styles.box}>
                <div className='cur' onClick={this.handleReadNotice}>
                  【CCAI大咖秀】崔鹏：物理模型结合大数据建模，弃用深度学习
                </div>
              </div>
              <footer>
                重要通知
              </footer>
            </div>
          </Col>
        </Row>
        <div className={styles.msg1}>
          <div className={styles.inner}>
            <div className={styles.r}>
              <label>今日入库:</label><span className={styles.price}>12764.00</span>&emsp;
              <span className={styles.gray}>SKU数:</span><span className={styles.price}>41</span>&emsp;
              <span className={styles.gray}>商品数:</span><span className={styles.price}>382</span>&emsp;
            </div>
            <label>今日已付款:</label><span className={styles.price}>14387.20</span>&emsp;
          </div>
          <div className='clearfix' />
        </div>
        <div className={styles.hi} ref='zhang'>
          <div className={styles['col-l']}>
            <div className={`${styles['tab']} ${styles['tab-1']}`} onMouseEnter={() => this.handleZhangTabIn(1)}>
              <div className={styles.title}>
                待发货
              </div>
              <div className={styles.rr}>
                <div className={styles.r1}>
                  <em className={styles.number}>999999</em>
                </div>
                <div className={styles.r2}>
                  <div className={styles.gray}>
                    <span className={styles.qq} title='已付款待审核'>待审核：<em className={styles.number}>10240</em></span>&emsp;
                    <span className={styles.qq} title='已审核待配快递'>待发：<em className={styles.number}>2046</em></span><br />
                    <span className={styles.qq} title='含打单拣货'>发货中：<em className={styles.number}>10258</em></span>&emsp;
                    <span className={styles.qq} title='已付款但异常订单'>异常：<em className={styles.number}>99999</em></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles['tab']} ${styles['tab-2']}`} onMouseEnter={() => this.handleZhangTabIn(2)}>
              <div className={styles.title}>
                待付款
              </div>
              <div className={styles.rr}>
                <div className={styles.r1}>
                  <em className={styles.number}>20480</em>
                </div>
                <div className={styles.r2}>
                  <div className={styles.gray}>
                    <span className={styles.qq} title=''>待付款：<em className={styles.number}>10240</em></span>&emsp;
                    <span className={styles.qq} title='异常(未付款)'>异常：<em className={styles.number}>10240</em></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles['tab']} ${styles['tab-3']}`} onMouseEnter={() => this.handleZhangTabIn(3)}>
              <div className={styles.title}>
                今日订单
              </div>
              <div className={styles.rr}>
                <div className={styles.r1}>
                  <em className={styles.number}>9999</em>
                </div>
                <div className={styles.r2}>
                  <div className={styles.gray}>
                    <span className={styles.qq} title=''>已发货：<em className={styles.number}>10240</em></span>&emsp;
                    <span className={styles.qq} title=''>退货：<em className={styles.number}>20480</em></span><br />
                    <span className={styles.qq} title=''>已付款：<em className={styles.number}>10240</em></span>&emsp;
                    <span className={styles.qq} title=''>取消：<em className={styles.number}>256</em></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['col-r']}>
            <div className={styles.cc}>
              <div className={styles.flex}>
                <div className={styles.welcome}>
                  <h2>WELCOME</h2>
                  <div className={styles.dd}>硕鼠科技·正创新</div>
                </div>
                <div className={styles.load}>
                  <div className={styles.text}>后端获取数据渲染这里<br />或者直接广告Banner图吧<br />加载中<span className={styles.dotting} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.echarts}>
          <Row>
            <Col span={12}>
              <div ref='EC3' style={{width: '100%', height: 380}}>
                loading<span className='dotting' />
              </div>
            </Col>
            <Col span={12}>
              <div ref='EC2' style={{width: '100%', height: 380}}>
                loading<span className='dotting' />
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.echarts}>
          <div ref='EC1' style={{maxWidth: 1000, minWidth: 500, height: 380}}>
            loading<span className='dotting' />
          </div>
        </div>
        <div className={styles.system}>
          <div className={styles['col-1']}>
            <div className={styles.qrcode}>
              <div className='mb10'><img src='/i/app_download_qrcode.png' /></div>
              <p>APP下载二维码<br />自动识别跳转</p>
            </div>
          </div>
          <div className={styles['col-2']}>
            <h3>系统最近更新</h3>
            <ul className={styles.logs}>
              {this._renderLogs()}
            </ul>
          </div>
          <div className='clearfix' />
        </div>
        <div className={styles.helps}>
          <div className={styles.row}>
            <label>系统软件推荐：</label>
            <a className='ant-btn ant-btn-dashed' target='_blank' href='https://www.baidu.com/s?wd=%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8'>谷歌Chrome浏览器【推荐】</a>
            <a className='ant-btn ant-btn-dashed hide' target='_blank' href='https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads'>最新版IE浏览器</a>
          </div>
          <div className={styles.row}>
            <label>系统使用基础：</label>
            <Button type='ghost' size='small'>设置用户</Button>
            <Button type='ghost' size='small'>设置店铺</Button>
            <Button type='ghost' size='small'>设置仓库及仓位</Button>
            <Button type='ghost' size='small'>绑定快递公司</Button>
            <Button type='ghost' size='small'>添加供应商信息</Button>
            <Button type='ghost' size='small'>设定业务参数</Button>
          </div>
          <div className={styles.row}>
            <label>销售订单准备：</label>
            <Button type='ghost' size='small'>订单批量审批规则设置</Button>
            <Button type='ghost' size='small'>订单商品自动赠品规则设置</Button>
          </div>
          <div className={styles.row}>
            <label>库存及发货准备：</label>
            <Button type='ghost' size='small'>库存初始化-添加期初库存</Button>
          </div>
        </div>
        <div className={styles.cp}>
          &copy; 2016 {COMPANY}, ver.{VERSION}
        </div>
      </div>
    )
  }
}

export default connect()(Wrapper(Main))
