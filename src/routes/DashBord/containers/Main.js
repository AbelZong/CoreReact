import React from 'react'
//import classNames from 'classnames'
import {connect} from 'react-redux'
import {Row, Col, Icon, Button} from 'antd'
import styles from './DB.scss'
import Wrapper from 'components/MainWrapper'

//import { animationEnd } from 'utils'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import echartsChinaMap from 'echarts/map/json/china'
echarts.registerMap('china', echartsChinaMap)
//import echarts from 'echarts'
//import Scrollbar from 'components/Scrollbars/index'
  // <Scrollbar style={{ height: '80%', overflow: 'hidden' }}>
  // </Scrollbar>
  // <div style={{height: '20%', overflow: 'hidden'}}>
  //   <h1>封装方法：切换路由/本地缓存数据结构/</h1>
  // </div>
class Main extends React.Component {

  componentDidUpdate = () => {
    console.log(1)
  }
  componentDidMount = () => {
    this.handleZhangTabIn(1)
    this.props.dispatch({ type: 'ZHMODUNQ_SET', payload: {
      mod: 'test', query: null, visible: true
    } })
  }
  componentWillUnmount = () => {
  }

  refreshDataCallback = () => {
    console.log('qq')
  }

  handleZhangTabIn = (v) => {
    const cl = styles[`hi-${v}`]
    this.refs.zhang.className = `${styles.hi} ${cl}`
  }
  handleZhangTabOut = (e) => {
    //if (e.relatedTarget.classList.contains(styles.tab)) {
      //e.target.classList.remove(styles.)
    //}
  }

  render() {
    console.log(' -- component {Main} render...')

    //{tableFlag && this.cache.table}
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
              <div className={styles.box} onClick={this.handleReadNotice}>
                <div className='cur'>
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
            <div className={`${styles['tab']} ${styles['tab-1']}`} onMouseEnter={() => this.handleZhangTabIn(1)} onMouseLeave={this.handleZhangTabOut}>
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
            <div className={`${styles['tab']} ${styles['tab-2']}`} onMouseEnter={() => this.handleZhangTabIn(2)} onMouseLeave={this.handleZhangTabOut}>
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
            <div className={`${styles['tab']} ${styles['tab-3']}`} onMouseEnter={() => this.handleZhangTabIn(3)} onMouseLeave={this.handleZhangTabOut}>
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
              <div id='ZH-echart-sevenSkuSales' style={{width: '100%', height: 380}}>
                loading<span className='dotting' />
              </div>
            </Col>
            <Col span={12}>
              <div id='ZH-echart-sevenAreaSales' style={{width: '100%', height: 380}}>
                loading<span className='dotting' />
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.echarts}>
          <div id='ZH-echart-FSales' style={{maxWidth: 1000, minWidth: 500, height: 380}}>
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
            <h3>系统更新记录</h3>
            <ul id='ZH-logs' className={styles.logs}>
              todo
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
      </div>
    )
  }
}

//export default Wrapper(Main)
export default connect(state => ({
}))(Main)
