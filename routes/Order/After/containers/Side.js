/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-01 PM
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
  Select,
  Radio,
  Row,
  Col,
  DatePicker,
  Dropdown,
  Menu
} from 'antd'
import appStyles from 'components/App.scss'
import classNames from 'classnames'
import {
  //ZPost,
  ZGet
} from 'utils/Xfetch'
import SkuPicker from 'components/SkuPicker'
import Scrollbar from 'components/Scrollbars/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import moment from 'moment'
const Option = Select.Option
const RadioGroup = Radio.Group
const DEFAULT_CONDITIONS = {
  _ck1_: 'ExCode',
  _ck2_: 'BuyerShopID',
  _sku_k_: 'SkuID',
  DateType: 'ODate'
}
export default connect()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      _conditions: DEFAULT_CONDITIONS,
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
    ZGet('AfterSale/GetInitASData', ({d}) => {
      //console.log(d)
      this.setState({
        dt: d
      }, () => {
        this.refreshDataCallback()
      })
    }).then(() => {
      this.setState({
        btnLoading: false
      })
    })
  },
  handleSearch(e) {
    this.runSearching()
  },
  refreshDataCallback() {
    this.runSearching()
  },
  __notEmpty(k) {
    return typeof k !== 'undefined' && k !== ''
  },
  runSearching() {
    requestAnimationFrame(() => {
      //todo conditions patch
      const cds = Object.assign({}, this.state._conditions)
      if (this.__notEmpty(cds._cv1_)) {
        cds[cds._ck1_] = cds._cv1_
        delete cds._cv1_
      }
      delete cds._ck1_
      if (this.__notEmpty(cds._cv2_)) {
        cds[cds._ck2_] = cds._cv2_
        delete cds._cv2_
      }
      delete cds._ck2_
      cds.DateStart = cds.DateStart ? cds.DateStart.format() : ''
      cds.DateEnd = cds.DateEnd ? cds.DateEnd.format() : ''
      if (cds.hasOwnProperty('_sku_v_')) {
        if (cds._sku_v_ && cds._sku_v_.id) {
          cds[cds._sku_k_] = cds._sku_v_.id
        }
        delete cds._sku_v_
      }
      delete cds._sku_k_
      console.dir(cds)
      this.runS(cds)
    })
  },
  runS(cds) {
    this.props.dispatch({type: 'ORDER_AFTER_CONDITIONS_SET', payload: cds})
  },
  mergeConditions(k, v) {
    //console.log('-------------------', k, v)
    this.setState(update(this.state, {
      _conditions: {
        $merge: typeof k === 'object' ? k : {[`${k}`]: v}
      }
    }))
  },
  removeConditionsKey(k) {
    if (typeof this.state._conditions[k] !== 'undefined') {
      this.setState(update(this.state, {
        _conditions: {
          $merge: {[`${k}`]: undefined}
        }
      }))
    }
  },
  render() {
    const {dt} = this.state
    const cd = this.state._conditions
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <div className={appStyles.header}>
            <div className='mb10 clearfix tc'>
              <Button size='small' onClick={() => {
                this.setState({
                  _conditions: DEFAULT_CONDITIONS
                })
              }} loading={this.state.btnLoading}>清空</Button>
              <Button size='small' type='primary' className='ml10 mr10' onClick={this.runSearching} loading={this.state.btnLoading}>组合查询</Button>
            </div>
          </div>
          <Scrollbar autoHide className='hua--zhang flex-grow flex-column mt5'>
            <div className={styles.aside}>
              <div className={styles.nor}>
                <div style={{margin: '2px 0'}}><Input addonAfter={<Select value={cd._ck1_} size='small' onChange={(v) => {
                  this.mergeConditions('_ck1_', v)
                }}>
                  {Object.keys(DEFAULT_CONF_1).map((key, idx) => <Option key={idx} value={key}>{DEFAULT_CONF_1[key]}</Option>)}
                </Select>} size='small' placeholder={DEFAULT_CONF_1[cd._ck1_]} value={cd._cv1_} onChange={(e) => {
                  this.mergeConditions('_cv1_', e.target.value)
                }} /></div>
                <div style={{margin: '2px 0'}}><Input addonAfter={<Select value={cd._ck2_} size='small' onChange={(v) => {
                  this.mergeConditions('_ck2_', v)
                }}>
                  {Object.keys(DEFAULT_CONF_2).map((key, idx) => <Option key={idx} value={key}>{DEFAULT_CONF_2[key]}</Option>)}
                </Select>} size='small' placeholder={DEFAULT_CONF_2[cd._ck2_]} value={cd._cv2_} onChange={(e) => {
                  this.mergeConditions('_cv2_', e.target.value)
                }} /></div>
              </div>
              <DateRangePanel dateType={cd.DateType} dateStart={cd.DateStart} dateEnd={cd.DateEnd} onTypeChange={(e) => {
                this.mergeConditions('DateType', e)
              }} onStartChange={(e) => {
                this.mergeConditions('DateStart', e)
              }} onEndChange={(e) => {
                this.mergeConditions('DateEnd', e)
              }} onChange={e => {
                console.log(e)
                this.mergeConditions(e)
              }} />
              <Panel header='商品信息'>
                <div className='flex-row'>
                  <div className='mr5'>
                    <Select value={cd._sku_k_} size='small' onChange={(e) => {
                      this.mergeConditions({
                        _sku_k_: e,
                        _sku_v_: undefined
                      })
                    }}>
                      <Option value='SkuID'>包含商品</Option>
                      <Option value='GoodsCode'>包含款式</Option>
                    </Select>
                  </div>
                  <div className='flex-grow'>
                    <SkuPicker value={cd._sku_v_} size='small' placeholder='请选择' valueField={cd._sku_k_} nameField={cd._sku_k_} onChange={({id, name}) => {
                      this.mergeConditions('_sku_v_', {
                        id, name
                      })
                    }} width={85} />
                  </div>
                </div>
                <Row className='mt10'>
                  <Col span={10}>
                    <div className='tr'>
                      无信息件&nbsp;
                    </div>
                  </Col>
                  <Col span={14}>
                    <div className='tc'>
                      <Select size='small' style={{width: '80%'}} value={cd.IsNoOID || ''} onChange={(e) => {
                        this.mergeConditions({
                          IsNoOID: e
                        })
                      }}>
                        {DEFAULT_CONF_3.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>)}
                      </Select>
                    </div>
                  </Col>
                </Row>
                <Row className='mt5'>
                  <Col span={10}>
                    <div className='tr'>
                      接口下载&nbsp;
                    </div>
                  </Col>
                  <Col span={14}>
                    <div className='tc'>
                      <Select size='small' style={{width: '80%'}} value={cd.IsInterfaceLoad || ''} onChange={(e) => {
                        this.mergeConditions({
                          IsInterfaceLoad: e
                        })
                      }}>
                        {DEFAULT_CONF_3.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>)}
                      </Select>
                    </div>
                  </Col>
                </Row>
                <Row className='mt5'>
                  <Col span={10}>
                    <div className='tr'>
                      分销提交&nbsp;
                    </div>
                  </Col>
                  <Col span={14}>
                    <div className='tc'>
                      <Select size='small' style={{width: '80%'}} value={cd.IsSubmitDis || ''} onChange={(e) => {
                        this.mergeConditions({
                          IsSubmitDis: e
                        })
                      }}>
                        {DEFAULT_CONF_3.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>)}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </Panel>
              <Panel header='店铺'>
                <div className={styles.sColumn}>
                  {dt.Shop && dt.Shop.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.ShopID} onChange={(e) => {
                        this.mergeConditions('ShopID', e.target.value)
                      }}>
                        {dt.Shop.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'ShopID': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='售后状态'>
                <div className={styles.sColumn}>
                  {dt.Status && dt.Status.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.Status} onChange={(e) => {
                        this.mergeConditions('Status', e.target.value)
                      }}>
                        {dt.Status.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'Status': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='货物状态'>
                <div className={styles.sColumn}>
                  {dt.GoodsStatus && dt.GoodsStatus.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.GoodsStatus} onChange={(e) => {
                        this.mergeConditions('GoodsStatus', e.target.value)
                      }}>
                        {dt.GoodsStatus.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'GoodsStatus': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='售后分类'>
                <div className={styles.sColumn}>
                  {dt.Type && dt.Type.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.Type} onChange={(e) => {
                        this.mergeConditions('Type', e.target.value)
                      }}>
                        {dt.Type.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'Type': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='原订单类型'>
                <div className={styles.sColumn}>
                  {dt.OrdType && dt.OrdType.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.OrdType} onChange={(e) => {
                        this.mergeConditions('OrdType', e.target.value)
                      }}>
                        {dt.OrdType.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'OrdType': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='线上状态'>
                {dt.ShopStatus && dt.ShopStatus.length ? (
                  <WheatCheckboxGroup value={cd.ShopStatus} options={dt.ShopStatus} onChange={(e) => {
                    if (e.length) {
                      this.mergeConditions('ShopStatus', e)
                    } else {
                      this.removeConditionsKey('ShopStatus')
                    }
                  }} onDoubleClick={(e) => {
                    this.runS({'ShopStatus': e})
                  }} />
                ) : null}
              </Panel>
              <Panel header='退款状态'>
                {dt.RefundStatus && dt.RefundStatus.length ? (
                  <WheatCheckboxGroup value={cd.RefundStatus} options={dt.RefundStatus} onChange={(e) => {
                    if (e.length) {
                      this.mergeConditions('RefundStatus', e)
                    } else {
                      this.removeConditionsKey('RefundStatus')
                    }
                  }} onDoubleClick={(e) => {
                    this.runS({'RefundStatus': e})
                  }} />
                ) : null}
              </Panel>
              <Panel header='分销商'>
                <div className={styles.sColumn}>
                  {dt.Distributor && dt.Distributor.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.Distributor} onChange={(e) => {
                        this.mergeConditions('Distributor', e.target.value)
                      }}>
                        {dt.Distributor.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'Distributor': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='提交给供货商'>
                <div className={styles.sColumn}>
                  <div className='ml5'>
                    <RadioGroup value={cd.IsSubmit} onChange={(e) => {
                      this.mergeConditions('IsSubmit', e.target.value)
                    }}>
                      {IsSubmits.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                        const cds = {'IsSubmit': x.value}
                        this.runS(cds)
                      }}>{x.label}</span></Radio>)}
                    </RadioGroup>
                  </div>
                </div>
              </Panel>
              <Panel header='问题类型'>
                <div className={styles.sColumn}>
                  {dt.IssueType && dt.IssueType.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.IssueType} onChange={(e) => {
                        this.mergeConditions('IssueType', e.target.value)
                      }}>
                        {dt.IssueType.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'IssueType': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
                  ) : null}
                </div>
              </Panel>
              <Panel header='处理结果'>
                <div className={styles.sColumn}>
                  {dt.Result && dt.Result.length ? (
                    <div className='ml5'>
                      <RadioGroup value={cd.Result} onChange={(e) => {
                        this.mergeConditions('Result', e.target.value)
                      }}>
                        {dt.Result.map(x => <Radio key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                          const cds = {'Result': x.value}
                          this.runS(cds)
                        }}>{x.label}</span></Radio>)}
                      </RadioGroup>
                    </div>
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
const IsSubmits = [
  {value: '', label: '-不限-'},
  {value: 'Y', label: '已提交'},
  {value: 'N', label: '未提交'}
]
const DEFAULT_CONF_1 = {
  'ExCode': '快递单号',
  'SoID ': '线上单号',
  'OID': '内部单号',
  'ID': '售后单号'
}
const DEFAULT_CONF_2 = {
  'BuyerShopID': '买家帐号',
  'RecName': '收货人',
  'Modifier': '修改人',
  'RecPhone': '手机',
  'RecTel': '固定电话',
  'Creator': '制单人',
  'Remark': '备注'
}
const DEFAULT_CONF_3 = [
  {value: '', label: '选择条件'},
  {value: 'Y', label: '是'},
  {value: 'N', label: '否'}
]
const WheatCheckboxGroup = React.createClass({
  getInitialState() {
    return {
      checks: this.props.defaultValue || []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value === 'undefined') {
      if (typeof this.state.checks !== 'undefined') {
        this.setState({
          checks: []
        })
      }
    } else {
      if (!this.__chkEqual(nextProps)) {
        this.setState({
          checks: nextProps.value
        })
      }
    }
  },
  __chkEqual(ap) {
    const nextValue = ap.value.slice(0)
    const thisValue = this.state.checks.slice(0)
    return nextValue.sort().toString() === thisValue.sort().toString()
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
    const checked = this.state.checks.indexOf(x.value) !== -1
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
class DateRangePanel extends React.Component {
  state = {
    closed: !!this.props.closed,
    cType: 'ODate',
    startValue: null,
    endValue: null,
    endOpen: false
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dateStart !== this.state.startValue || nextProps.dateEnd !== this.state.endValue || nextProps.dateType !== this.state.cType) {
      this.setState({
        startValue: nextProps.dateStart,
        endValue: nextProps.dateEnd,
        cType: nextProps.dateType
      })
    }
  }
  handleCollege = () => {
    this.setState({
      closed: !this.state.closed
    })
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value
    })
  }
  onStartChange = (value) => {
    this.setState({
      startValue: value
    }, () => {
      this.props.onStartChange(value)
    })
  }
  onEndChange = (value) => {
    this.setState({
      endValue: value
    }, () => {
      this.props.onEndChange(value)
    })
  }
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  __updateDate = (startValue, endValue) => {
    this.setState({startValue, endValue}, () => {
      this.props.onChange({
        DateStart: startValue,
        DateEnd: endValue
      })
    })
  }
  handleMenuClick = (e) => {
    switch (e.key) {
      case 'ODate':
      case 'ModifyDate':
      case 'ConfirmDate': {
        this.setState({
          cType: e.key
        }, () => {
          this.props.onTypeChange(e.key)
        })
        return
      }
      case '1': {
        return this.__updateDate(moment().startOf('day'), moment().endOf('day'))
      }
      case '2': {
        return this.__updateDate(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'))
      }
      case '3': {
        return this.__updateDate(moment().startOf('week'), moment().endOf('week'))
      }
      case '4': {
        return this.__updateDate(moment().startOf('month'), moment().endOf('month'))
      }
      case '5': {
        return this.__updateDate(moment().subtract(30, 'days').startOf('day'), moment().endOf('day'))
      }
      case '6': {
        return this.__updateDate(moment().subtract(60, 'days').startOf('day'), moment().endOf('day'))
      }
    }
  }
  render() {
    const { startValue, endValue, endOpen, cType } = this.state
    const dateTypes = {
      'ODate': '登记时间',
      'ModifyDate': '修改时间',
      'ConfirmDate': '确认时间'
    }
    const CN = classNames(styles.box, {
      [`${styles.closed}`]: this.state.closed
    })
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {Object.keys(dateTypes).map(key => <Menu.Item key={key}>搜{dateTypes[key]}</Menu.Item>)}
        <Menu.Divider />
        <Menu.Item key='1'>今天</Menu.Item>
        <Menu.Item key='2'>昨天</Menu.Item>
        <Menu.Item key='3'>本周</Menu.Item>
        <Menu.Item key='4'>本月</Menu.Item>
        <Menu.Item key='5'>最近30天</Menu.Item>
        <Menu.Item key='6'>最近60天</Menu.Item>
      </Menu>
    )
    return (
      <div className={CN}>
        <div className={styles.tt}>
          <div className={styles.arrow} onClick={this.handleCollege} />
          <Dropdown overlay={menu}>
            <a className='ant-dropdown-link'>
              按{dateTypes[cType]} <Icon type='down' />
            </a>
          </Dropdown>
        </div>
        <div className={styles.dd}>
          <div className='tc'>
            <div>
              <DatePicker
                disabledDate={this.disabledStartDate}
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                value={startValue}
                placeholder='开始时间'
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
                size='small'
              />
            </div>
            <div className='mt5'>
              <DatePicker
                disabledDate={this.disabledEndDate}
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                value={endValue}
                placeholder='结束时间'
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
                size='small'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
