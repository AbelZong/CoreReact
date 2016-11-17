/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-11 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import update from 'react-addons-update'
import {
  Icon,
  Checkbox,
  Input,
  Button,
  Popover,
  Select,
  Radio,
  Row,
  Col
} from 'antd'
import appStyles from 'components/App.scss'
import classNames from 'classnames'
import {
  ZPost,
  ZGet
} from 'utils/Xfetch'
const TB_STATUS = [
  {
    value: 'WAIT_BUYER_PAY',
    label: '等待买家付款'
  },
  {
    value: 'WAIT_SELLER_SEND_GOODS',
    label: '等待卖家发货'
  },
  {
    value: 'SELLER_CONSIGNED_PART',
    label: '卖家部分发货'
  },
  {
    value: 'WAIT_BUYER_CONFIRM_GOODS',
    label: '等待买家确认收货'
  },
  {
    value: 'TRADE_BUYER_SIGNED',
    label: '买家已签收（货到付款专用）'
  },
  {
    value: 'TRADE_FINISHED',
    label: '交易成功'
  },
  {
    value: 'TRADE_CLOSED',
    label: '付款后交易关闭'
  },
  {
    value: 'TRADE_CLOSED_BY_TAOBAO',
    label: '付款前交易关闭'
  },
  {
    value: 'TRADE_NO_CREATE_PAY',
    label: '没有创建支付宝交易'
  },
  {
    value: 'WAIT_PRE_AUTH_CONFIRM',
    label: '余额宝0元购合约中'
  },
  {
    value: 'PAY_PENDING',
    label: '外卡支付付款确认中'
  // },
  // {
  //   value: 'ALL_WAIT_PAY',
  //   label: '所有买家未付款的交易'
  // },
  // {
  //   value: 'ALL_CLOSED',
  //   label: '所有关闭的交易'
  }
]
import SkuPicker from 'components/SkuPicker'
import Scrollbar from 'components/Scrollbars/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
const Option = Select.Option
const RadioGroup = Radio.Group
//const CheckboxGroup = Checkbox.Group
export default connect()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      // conditions: {
      //   //暂无预设值
      // }
      _conditions: {},
      btnLoading: false,
      dt: {}
    }
  },
  componentWillMount() {
    this.getInitialData()
  },
  getInitialData() {
    this.setState({
      btnLoading: true
    })
    ZGet('Order/GetInitData', ({d}) => {
      //console.log(d)
      this.setState({
        dt: d
      }, () => {
        //this._conditions = {} //damnit todo
        this.refreshDataCallback()
      })
    }).then(() => {
      this.setState({
        btnLoading: false
      })
    })
  },
  runPatchCount() {
    this.setState({
      btnLoading: true
    })
    ZGet('Order/GetStatusCount', ({d}) => {
      const {dt} = this.state
      if (Object.keys(dt).length) {
        if (d.OrdStatus) {
          let a = {}
          for (let v of d.OrdStatus) {
            a[v.value] = v.count
          }
          for (let v of dt.OrdStatus) {
            if (typeof a[v.value] !== 'undefined') {
              v.count = a[v.value]
            }
          }
        }
        if (d.OrdAbnormalStatus) {
          let a = {}
          for (let v of d.OrdAbnormalStatus) {
            a[v.value] = v.count
          }
          for (let v of dt.OrdAbnormalStatus) {
            if (typeof a[v.value] !== 'undefined') {
              v.count = a[v.value]
            }
          }
        }
        this.setState({
          dt
        })
      }
    }).then(() => {
      this.setState({
        btnLoading: false
      })
    })
  },
  // componentDidMount() {
  //   this.refreshDataCallback()
  // },
  handleSearch(e) {
    this.runSearching()
  },
  refreshDataCallback() {
    this.runSearching()
  },
  runSearching() {
    requestAnimationFrame(() => {
      //todo conditions patch
      const cds = Object.assign({}, this._conditions)
      if (cds._cv1_) {
        if (cds._ck1_ === '2') {
          cds.PayNbr = cds._cv1_
        } else {
          cds.SoID = cds._cv1_
        }
        delete cds._cv1_
        delete cds._ck1_
      }
      if (cds._cv2_) {
        switch (cds._ck2_) {
          case '2': {
            cds.ExCode = cds._cv2_
            break
          }
          case '3': {
            cds.RecName = cds._cv2_
            break
          }
          case '4': {
            cds.RecPhone = cds._cv2_
            break
          }
          case '5': {
            cds.RecLogistics = cds._cv2_
            break
          }
          case '6': {
            cds.RecCity = cds._cv2_
            break
          }
          case '7': {
            cds.RecDistrict = cds._cv2_
            break
          }
          case '8': {
            cds.RecAddress = cds._cv2_
            break
          }
          default: {
            cds.BuyerShopID = cds._cv2_
            break
          }
        }
        delete cds._cv2_
        delete cds._ck2_
      }
      if (cds.IsRecMsgYN !== 'Y' && cds.RecMessage) {
        delete cds.RecMessage
      }
      console.log(cds)
      this.runS(cds)
    })
  },
  runS(cds) {
    this.props.dispatch({type: 'ORDER_LIST_CONDITIONS_SET', payload: cds})
  },
  _conditions: {},
  mergeConditions(k, v) {
    console.log('-------------------', k, v)
    if (typeof k === 'object') {
      Object.assign(this._conditions, k)
      //this._conditions = update(this._conditions, {$merge: k})
    } else {
      this._conditions[k] = v
    }
    // console.log(typeof k === 'object' ? k : {[`${k}`]: v})
    // this.setState(update(this.state, {
    //   _conditions: {
    //     $merge: typeof k === 'object' ? k : {[`${k}`]: v}
    //   }
    // }))
  },
  removeConditionsKey(k) {
    if (typeof this._conditions[k] !== 'undefined') {
      delete this._conditions[k]
    }
    // if (typeof this.state._conditions[k] !== 'undefined') {
    //   this.setState(update(this.state, {
    //     _conditions: {
    //       $merge: {[`${k}`]: undefined}
    //     }
    //   }))
    // }
  },
  render() {
    const {dt} = this.state
    // checked={cd.Others ? cd.Others.split(',') : []}
    // const cd = this.state._conditions
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <div className={appStyles.header}>
            <div className='mb10 clearfix tc'>
              <Button size='small' onClick={() => {
                this.getInitialData()
              }} loading={this.state.btnLoading} className='hide'>清空</Button>
              <Button size='small' type='primary' className='ml10 mr10' onClick={this.runSearching} loading={this.state.btnLoading}>组合查询</Button>
              <Button size='small' type='dashed' onClick={this.runPatchCount} loading={this.state.btnLoading}>更新统计</Button>
            </div>
          </div>
          <Scrollbar autoHide className='hua--zhang flex-grow flex-column mt5'>
            <div className={styles.aside}>
              <div className={styles.nor}>
                <div><Input addonAfter='内部订单' size='small' placeholder='内部订单号' onChange={(e) => {
                  this.mergeConditions('ID', e.target.value)
                }} /></div>
                <div style={{margin: '2px 0'}}><Input addonAfter={<Select defaultValue='1' size='small' onChange={(v) => {
                  const input = this.refs.ck1.refs.input
                  input.placeholder = v === '2' ? '支付单号' : '线上订单'
                  this.mergeConditions('_ck1_', v)
                }}>
                  <Option value='1'>线上订单</Option>
                  <Option value='2'>支付单号</Option>
                </Select>} ref='ck1' size='small' placeholder='线上订单号' onChange={(e) => {
                  this.mergeConditions('_cv1_', e.target.value)
                }} /></div>
                <div><Input addonAfter={<Select defaultValue='1' size='small' onChange={(v) => {
                  const input = this.refs.ck2.refs.input
                  let ph = ''
                  switch (v) {
                    case '1': {
                      ph = '买家帐号'
                      break
                    }
                    case '2': {
                      ph = '快递单号'
                      break
                    }
                    case '3': {
                      ph = '收货人'
                      break
                    }
                    case '4': {
                      ph = '手机'
                      break
                    }
                    case '5': {
                      ph = '收货人省'
                      break
                    }
                    case '6': {
                      ph = '收货人城市'
                      break
                    }
                    case '7': {
                      ph = '收货区县'
                      break
                    }
                    case '8': {
                      ph = '详细地址'
                      break
                    }
                    default: {
                      ph = '...'
                    }
                  }
                  input.placeholder = ph
                  this.mergeConditions('_ck2_', v)
                }}>
                  <Option value='1'>买家帐号</Option>
                  <Option value='2'>快递单号</Option>
                  <Option value='3'>收货人</Option>
                  <Option value='4'>手机</Option>
                  <Option value='5'>收货人省</Option>
                  <Option value='6'>收货人城市</Option>
                  <Option value='7'>收货区县</Option>
                  <Option value='8'>详细地址</Option>
                </Select>} ref='ck2' size='small' placeholder='买家账号' onChange={(e) => {
                  this.mergeConditions('_cv2_', e.target.value)
                }} /></div>
              </div>
              <Panel header='订单状态'>
                <div className={styles.sColumn}>
                  {dt.OrdStatus && dt.OrdStatus.length ? (
                    <WheatCheckboxGroup options={dt.OrdStatus} onChange={(e) => {
                      if (e.length) {
                        this.mergeConditions('StatusList', e.join(','))
                      } else {
                        this.removeConditionsKey('StatusList')
                      }
                    }} onDoubleClick={(e) => {
                      this.runS({'StatusList': e})
                    }} />
                  ) : null}
                  <div className='hr' />
                  <div className='ml15'>
                    {dt.OrdAbnormalStatus && dt.OrdAbnormalStatus.length ? (
                      <WheatCheckboxGroup options={dt.OrdAbnormalStatus} onChange={(e) => {
                        if (e.length) {
                          this.mergeConditions('AbnormalStatusList', e.join(','))
                        } else {
                          this.removeConditionsKey('AbnormalStatusList')
                        }
                      }} onDoubleClick={(e) => {
                        this.runS({'AbnormalStatusList': e})
                      }} />
                    ) : null}
                  </div>
                </div>
              </Panel>
              <Panel closed header={<div className={styles.bbq}>买家留言<small>只检索未发货单</small></div>}>
                {dt.BuyerRemark && dt.BuyerRemark.length ? (
                  <div className='ml5'>
                    <RadioGroup onChange={(e) => {
                      this.mergeConditions('IsRecMsgYN', e.target.value)
                      if (e.target.value === 'Y') {
                        this.refs.buyer1.refs.input.focus()
                      }
                    }}>
                      {dt.BuyerRemark.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                        const cds = {'IsRecMsgYN': x.value}
                        if (x.value === 'Y') {
                          cds.RecMessage = this.refs.buyer1.refs.input.value
                        }
                        this.runS(cds)
                      }}>{x.label}</span></Radio>)}
                    </RadioGroup>
                    <Input ref='buyer1' placeholder='留言内容，限未发货' size='small' onChange={(e) => {
                      this.mergeConditions('RecMessage', e.target.value)
                    }} />
                  </div>
                ) : null}
              </Panel>
              <Panel closed header={<div className={styles.bbq}>卖家备注<small>只检索未发货单</small></div>}>
                {dt.SellerRemark && dt.SellerRemark.length ? (
                  <div className='ml5'>
                    <RadioGroup onChange={(e) => {
                      this.mergeConditions('IsSendMsgYN', e.target.value)
                      if (e.target.value === 'Y') {
                        this.refs.seller1.refs.input.focus()
                      }
                    }}>
                      {dt.SellerRemark.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                        const cds = {'IsSendMsgYN': x.value}
                        if (x.value === 'Y') {
                          cds.SendMessage = this.refs.seller1.refs.input.value
                        }
                        this.runS(cds)
                      }}>{x.label}</span></Radio>)}
                    </RadioGroup>
                    <Input ref='seller1' placeholder='备注内容,限未发货' size='small' onChange={(e) => {
                      this.mergeConditions('SendMessage', e.target.value)
                    }} />
                  </div>
                ) : null}
              </Panel>
              <Panel closed header='商品信息'>
                <div className='flex-row'>
                  <div className='mr5'>
                    <Select defaultValue='1' size='small' onChange={(e) => {
                      this.setState({
                        SkuPicker_field: e === '2' ? 'GoodsCode' : 'SkuID'
                      }, () => {
                        this.refs.sp1.handleModalOk(null)
                        this.removeConditionsKey('SkuID')
                        this.removeConditionsKey('GoodsCode')
                      })
                    }}>
                      <Option value='1'>包含商品</Option>
                      <Option value='2'>包含款式</Option>
                    </Select>
                  </div>
                  <div className='flex-grow'>
                    <SkuPicker ref='sp1' size='small' placeholder='请选择' valueField={this.state.SkuPicker_field || 'SkuID'} nameField={this.state.SkuPicker_field || 'SkuID'} onChange={({data}) => {
                      if (this.state.SkuPicker_field === 'GoodsCode') {
                        this.mergeConditions('GoodsCode', data.GoodsCode)
                        this.removeConditionsKey('SkuID')
                      } else {
                        this.mergeConditions('SkuID', data.SkuID)
                        this.removeConditionsKey('GoodsCode')
                      }
                    }} />
                  </div>
                </div>
                <Row className='mt5'>
                  <Col span={12}>
                    <Popover content={<div>订单数量（包含赠品）<br />仅限待发货订单<br />性能较慢</div>} trigger='focus'>
                      <Input type='number' size='small' placeholder='数量 >=' title='数量大于等于' onBlur={e => {
                        this.mergeConditions('Ordqtystart', e.target.value)
                      }} />
                    </Popover>
                  </Col>
                  <Col span={12}>
                    <Popover content={<div>仅限<br />待发货订单</div>} trigger='focus'>
                      <Input type='number' size='small' placeholder='数量 <=' title='数量小于等于' className='ml5' onBlur={e => {
                        this.mergeConditions('Ordqtyend', e.target.value)
                      }} />
                    </Popover>
                  </Col>
                </Row>
                <Row className='mt5'>
                  <Col span={12}>
                    <Popover content={<div>订单金额（应付金额）<br />仅限待发货订单<br />性能较慢</div>} trigger='focus'>
                      <Input type='number' size='small' placeholder='金额 >=' title='金额大于等于' onBlur={e => {
                        this.mergeConditions('Ordamtstart', e.target.value)
                      }} />
                    </Popover>
                  </Col>
                  <Col span={12}>
                    <Popover content={<div>仅限<br />待发货订单</div>} trigger='focus'>
                      <Input type='number' size='small' placeholder='金额 <=' title='金额小于等于' className='ml5' onBlur={e => {
                        this.mergeConditions('Ordamtend', e.target.value)
                      }} />
                    </Popover>
                  </Col>
                </Row>
                <div className='mt5'>
                  <Popover content={<div>仅限<br />待发货订单</div>} trigger='focus'>
                    <Input size='small' placeholder='商品名称包含关键字词' onBlur={e => {
                      this.mergeConditions('Skuname', e.target.value)
                    }} />
                  </Popover>
                </div>
                <div className='mt5'>
                  <Popover content={<div>仅限<br />待发货订单</div>} trigger='focus'>
                    <Input size='small' placeholder='颜色规格包含关键字词' onBlur={e => {
                      this.mergeConditions('Norm', e.target.value)
                    }} />
                  </Popover>
                </div>
              </Panel>
              <Panel header='淘宝订单状态'>
                <WheatCheckboxGroup options={TB_STATUS} onChange={(e) => {
                  if (e.length) {
                    this.mergeConditions('ShopStatus', e.join(','))
                  } else {
                    this.removeConditionsKey('ShopStatus')
                  }
                }} onDoubleClick={(e) => {
                  this.runS({'ShopStatus': e})
                }} />
              </Panel>
              <Panel header='便签' style={{display: 'none'}}>
                //todo 便签 mixed
              </Panel>
              <Panel header='订单来源'>
                <div className={styles.sColumn}>
                  {dt.OSource && dt.OSource.length ? (
                    <div className='ml5'>
                      <RadioGroup onChange={(e) => {
                        this.mergeConditions('Osource', e.target.value)
                      }}>
                        {dt.OSource.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'Osource': x.Value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='预发货' style={{display: 'none'}}>
                //todo 预发货 radio
              </Panel>
              <Panel header='订单类型'>
                {dt.OType && dt.OType.length ? (
                  <WheatCheckboxGroup options={dt.OType} onChange={(e) => {
                    if (e.length) {
                      this.mergeConditions('Type', e.join(','))
                    } else {
                      this.removeConditionsKey('Type')
                    }
                  }} onDoubleClick={(e) => {
                    this.runS({'Type': e})
                  }} />
                ) : null}
              </Panel>
              <Panel closed header='贷款方式'>
                {dt.LoanType && dt.LoanType.length ? (
                  <RadioGroup onChange={(e) => {
                    this.mergeConditions('LoanType', e.target.value)
                  }}>
                    {dt.LoanType.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                      const cds = {'LoanType': x.Value}
                      this.runS(cds)
                    }}>{x.label}</span></Radio>)}
                  </RadioGroup>
                ) : null}
              </Panel>
              <Panel header='是否付款'>
                {dt.IsPaid && dt.IsPaid.length ? (
                  <RadioGroup onChange={(e) => {
                    this.mergeConditions('LoanType', e.target.value)
                  }}>
                    {dt.IsPaid.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                      const cds = {'LoanType': x.Value}
                      this.runS(cds)
                    }}>{x.label}</span></Radio>)}
                  </RadioGroup>
                ) : null}
              </Panel>
              <Panel header='店铺'>
                <div className={styles.sColumn}>
                  {dt.Shop && dt.Shop.length ? (
                    <WheatCheckboxGroup options={dt.Shop} onChange={(e) => {
                      if (e.length) {
                        this.mergeConditions('Shop', e.join(','))
                      } else {
                        this.removeConditionsKey('Shop')
                      }
                    }} onDoubleClick={(e) => {
                      this.runS({'Shop': e})
                    }} />
                  ) : null}
                </div>
              </Panel>
              <Panel closed header='分销商'>
                <div className={styles.sColumn}>
                  {dt.Distributor && dt.Distributor.length ? (
                    <WheatCheckboxGroup options={dt.Distributor} onChange={(e) => {
                      if (e.length) {
                        this.mergeConditions('Distributor', e.join(','))
                      } else {
                        this.removeConditionsKey('Distributor')
                      }
                    }} onDoubleClick={(e) => {
                      this.runS({'Distributor': e})
                    }} />
                  ) : null}
                </div>
              </Panel>
              <Panel closed header='快递公司'>
                <div className={styles.sColumn}>
                  {dt.Express && dt.Express.length ? (
                    <WheatCheckboxGroup options={dt.Express} onChange={(e) => {
                      if (e.length) {
                        this.mergeConditions('ExID', e.join(','))
                      } else {
                        this.removeConditionsKey('ExID')
                      }
                    }} onDoubleClick={(e) => {
                      this.runS({'ExID': e})
                    }} />
                  ) : null}
                </div>
              </Panel>
              <Panel header='省份' style={{display: 'none'}}>
                //todo neighbor like
              </Panel>
              <Panel header='发货仓库'>
                <div className={styles.sColumn}>
                  {dt.Warehouse && dt.Warehouse.length ? (
                    <WheatCheckboxGroup options={dt.Warehouse} onChange={(e) => {
                      if (e.length) {
                        this.mergeConditions('SendWarehouse', e.join(','))
                      } else {
                        this.removeConditionsKey('SendWarehouse')
                      }
                    }} onDoubleClick={(e) => {
                      this.runS({'SendWarehouse': e})
                    }} />
                  ) : null}
                </div>
              </Panel>
              <Panel header='其它'>
                <div className={styles.sColumn}>
                  {dt.Others && dt.Others.length ? (
                    <WheatCheckboxGroup options={dt.Others} onChange={(e) => {
                      if (e.length) {
                        this.mergeConditions('Others', e.join(','))
                      } else {
                        this.removeConditionsKey('Others')
                      }
                    }} onDoubleClick={(e) => {
                      this.runS({'Others': e})
                    }} />
                  ) : null}
                </div>
              </Panel>
            </div>
          </Scrollbar>
        </div>
      </aside>
    )
  }
})))
// const Buyer4 = React.createClass({
//   getInitialState() {
//     console.log(this.props)
//     return {
//       checked: false
//     }
//   },
//   render() {
//     return (
//       <Radio key={this.props.key} value={this.props.Value}>{this.props.children}</Radio>
//     )
//   }
// })
//damn Antd
// <Panel header={<div className={styles.bbq}>
//   <Checkbox className={styles.pen}>订单状态</Checkbox>
// </div>}>
//   <Popover content={<div>todo</div>} trigger='focus'>
//     <Input />
//   </Popover>
// </Panel>
const WheatCheckboxGroup = React.createClass({
  getInitialState() {
    return {
      checks: []
    }
  },
  componentDidMount() {
    this.inited = true
  },
  handleChange(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this._runChange(e)
    }, 250)
  },
  _runChange(e) {
    const {checks} = this.state
    const target = e.target
    const index = checks.indexOf(target.value)
    if (target.checked) {
      if (index === -1) {
        this.setState(update(this.state, {
          checks: {
            $push: [target.value]
          }
        }), () => {
          this.props.onChange && this.props.onChange(this.state.checks)
        })
      }
    } else {
      if (index !== -1) {
        this.setState(update(this.state, {
          checks: {
            $splice: [[index, 1]]
          }
        }), () => {
          this.props.onChange && this.props.onChange(this.state.checks)
        })
      }
    }
  },
  handleDBClick(e) {
    clearTimeout(this.timer)
    this._runDBClick(e)
    //this.timer = setTimeout(() => this._runDBClick(e), 300)
  },
  _runDBClick(e) {
    this.props.onDoubleClick && this.props.onDoubleClick(e)
    const {checks} = this.state
    const index = checks.indexOf(e)
    if (index === -1) {
      this.setState(update(this.state, {
        checks: {
          $push: [e]
        }
      }))
    }
  },
  _renderOption(x) {
    const checked = this.inited ? (this.state.checks ? this.state.checks.indexOf(x.value) !== -1 : false) : (this.props.defaultValue ? this.props.defaultValue.indexOf(x.value) !== -1 : false)
    return (
      <div key={x.value} className={styles.wCBG} onDoubleClick={() => this.handleDBClick(x.value)} title='双击直接单项查询'>
        <Checkbox value={x.value} onChange={this.handleChange} checked={checked}>{x.label}</Checkbox>
        {x.count ? <em>{x.count}</em> : null}
      </div>
    )
  },
  render() {
    const {options} = this.props
    return (
      <div className='ant-checkbox-group'>
        {options && options.length ? options.map(x => this._renderOption(x)) : null}
      </div>
    )
  }
})
const Panel = React.createClass({
  getInitialState() {
    return {
      closed: !!this.props.closed
    }
  },
  handleCollege() {
    this.setState({
      closed: !this.state.closed
    })
  },
  render() {
    const CN = classNames(styles.box, {
      [`${styles.closed}`]: this.state.closed
    })
    const style = this.props.style || {}
    return (
      <div className={CN} style={style}>
        <div className={styles.tt}>
          <div className={styles.arrow} onClick={this.handleCollege} />
          {this.props.header}
        </div>
        <div className={styles.dd}>
          {this.props.children}
        </div>
      </div>
    )
  }
})
