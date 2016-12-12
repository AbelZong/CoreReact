/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-30 AM
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
  Checkbox,
  Input,
  Button,
  Radio,
  Row,
  Col,
  DatePicker
} from 'antd'
import appStyles from 'components/App.scss'
import classNames from 'classnames'
import {
  ZGet
} from 'utils/Xfetch'

import Scrollbar from 'components/Scrollbars/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
const RadioGroup = Radio.Group
//const CheckboxGroup = Checkbox.Group
export default connect()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      _conditions: {},
      btnLoading: false,
      shops: null
    }
  },
  componentWillMount() {
    this.getInitialData()
  },
  getInitialData() {
    this.setState({
      btnLoading: true
    })
    ZGet('Gift/GetShopInitData', ({d}) => {
      //console.log(d)
      this.setState({
        shops: d
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
      const cds = Object.assign({}, this.state._conditions || {})
      if (cds.DateFrom) {
        cds.DateFrom = cds.DateFrom ? cds.DateFrom.format() : ''
      }
      if (cds.DateTo) {
        cds.DateTo = cds.DateTo ? cds.DateTo.format() : ''
      }
      if (cds.CreateDateStart) {
        cds.CreateDateStart = cds.CreateDateStart ? cds.CreateDateStart.format() : ''
      }
      if (cds.CreateDateEnd) {
        cds.CreateDateEnd = cds.CreateDateEnd ? cds.CreateDateEnd.format() : ''
      }
      console.log(cds)
      this.runS(cds)
    })
  },
  runS(cds) {
    this.props.dispatch({type: 'ORDER_GIFTRULE_CONDITIONS_SET', payload: cds})
  },
  mergeConditions(k, v) {
    //console.log(typeof k === 'object' ? k : {[`${k}`]: v})
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
    const cd = this.state._conditions || {}
    const radioBlock = {
      display: 'block'
    }
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <div className={appStyles.header}>
            <div className='mb10 clearfix tc'>
              <Button size='small' onClick={() => {
                this.setState({
                  _conditions: {}
                })
              }} loading={this.state.btnLoading}>清空</Button>
              <Button size='small' type='primary' className='ml10 mr10' onClick={this.runSearching} loading={this.state.btnLoading}>组合查询</Button>
            </div>
          </div>
          <Scrollbar autoHide className='hua--zhang flex-grow flex-column mt5'>
            <div className={styles.aside}>
              <div className={styles.nor}>
                <div><Input addonAfter='规则号' size='small' placeholder='规则号' value={cd.ID} onChange={(e) => {
                  this.mergeConditions('ID', e.target.value)
                }} /></div>
                <div className={styles.mt}><Input addonAfter='赠&emsp;品' size='small' placeholder='赠品' value={cd.GiftNo} onChange={(e) => {
                  this.mergeConditions('GiftNo', e.target.value)
                }} /></div>
                <div className={styles.mt}><Input addonAfter='名&emsp;称' size='small' placeholder='名称' value={cd.GiftName} onChange={(e) => {
                  this.mergeConditions('GiftName', e.target.value)
                }} /></div>
                <div className={styles.mt}>
                  <DatePicker placeholder='规则开始时间' value={cd.DateFrom} onChange={(e) => {
                    this.mergeConditions('DateFrom', e)
                  }} />
                </div>
                <div className={styles.mt}>
                  <DatePicker placeholder='规则结束时间' value={cd.DateTo} onChange={(e) => {
                    this.mergeConditions('DateTo', e)
                  }} />
                </div>
                <div className={styles.mt}>
                  <Input size='small' placeholder='包含其中任何一个商品' title='包含其中任何一个商品' value={cd.AppointSkuID} onChange={(e) => {
                    this.mergeConditions('AppointSkuID', e.target.value)
                  }} />
                </div>
                <div className={styles.mt}>
                  <Input size='small' placeholder='不包含其中任何一个商品' title='不包含其中任何一个商品' value={cd.ExcludeSkuID} onChange={(e) => {
                    this.mergeConditions('ExcludeSkuID', e.target.value)
                  }} />
                </div>
                <Row className={styles.mt}>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最小金额 >=' title='最小金额大于等于' value={cd.AmtMinStart} onChange={(e) => {
                      this.mergeConditions('AmtMinStart', e.target.value)
                    }} />
                  </Col>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最小金额 <=' title='最小金额小于等于' value={cd.AmtMinEnd} onChange={(e) => {
                      this.mergeConditions('AmtMinEnd', e.target.value)
                    }} />
                  </Col>
                </Row>
                <Row className={styles.mt}>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最大金额 >=' title='最大金额大于等于' value={cd.AmtMaxStart} onChange={(e) => {
                      this.mergeConditions('AmtMaxStart', e.target.value)
                    }} />
                  </Col>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最大金额 <=' title='最大金额小于等于' value={cd.AmtMaxEnd} onChange={(e) => {
                      this.mergeConditions('AmtMaxEnd', e.target.value)
                    }} />
                  </Col>
                </Row>
                <Row className={styles.mt}>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最小数量 >=' title='最小数量大于等于' value={cd.QtyMinStart} onChange={(e) => {
                      this.mergeConditions('QtyMinStart', e.target.value)
                    }} />
                  </Col>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最小数量 <=' title='最小数量小于等于' value={cd.QtyMinEnd} onChange={(e) => {
                      this.mergeConditions('QtyMinEnd', e.target.value)
                    }} />
                  </Col>
                </Row>
                <Row className={styles.mt}>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最小数量 >=' title='最大数量大于等于' value={cd.QtyMaxStart} onChange={(e) => {
                      this.mergeConditions('QtyMaxStart', e.target.value)
                    }} />
                  </Col>
                  <Col span={12}>
                    <Input type='number' size='small' placeholder='最大数量 <=' title='最大数量小于等于' value={cd.QtyMaxEnd} onChange={(e) => {
                      this.mergeConditions('QtyMaxEnd', e.target.value)
                    }} />
                  </Col>
                </Row>
                <div className={styles.mt}>
                  <div className='mt5'>
                    <div className={styles.wCBG} onDoubleClick={() => {
                      this.runS({
                        IsEnable: true
                      })
                    }} title='双击直接单项查询'>
                      <Checkbox onChange={(e) => {
                        this.mergeConditions('IsEnable', e.target.checked)
                      }} checked={cd.IsEnable}>启用</Checkbox>
                    </div>
                    <div className={styles.wCBG} onDoubleClick={() => {
                      this.runS({
                        IsDisable: true
                      })
                    }} title='双击直接单项查询'>
                      <Checkbox onChange={(e) => {
                        this.mergeConditions('IsDisable', e.target.checked)
                      }} checked={cd.IsDisable}>禁用</Checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <Panel header='每多少数量送1组'>
                <div>
                  <Input type='number' size='small' placeholder='>=' title='大于等于' value={cd.QtyEachStart} onChange={(e) => {
                    this.mergeConditions('QtyEachStart', e.target.value)
                  }} />
                </div>
                <div className={styles.mt}>
                  <Input type='number' size='small' placeholder='<=' title='小于等于' value={cd.QtyEachEnd} onChange={(e) => {
                    this.mergeConditions('QtyEachEnd', e.target.value)
                  }} />
                </div>
              </Panel>
              <Panel header='每多少金额送1组'>
                <div>
                  <Input type='number' size='small' placeholder='>=' title='大于等于' value={cd.AmtEachStart} onChange={(e) => {
                    this.mergeConditions('AmtEachStart', e.target.value)
                  }} />
                </div>
                <div className={styles.mt}>
                  <Input type='number' size='small' placeholder='<=' title='小于等于' value={cd.AmtEachEnd} onChange={(e) => {
                    this.mergeConditions('AmtEachEnd', e.target.value)
                  }} />
                </div>
              </Panel>
              <Panel header='登记时间'>
                <div>
                  <DatePicker placeholder='开始时间' value={cd.CreateDateStart} onChange={(e) => {
                    this.mergeConditions('CreateDateStart', e)
                  }} />
                </div>
                <div className={styles.mt}>
                  <DatePicker placeholder='结束时间' value={cd.CreateDateEnd} onChange={(e) => {
                    this.mergeConditions('CreateDateEnd', e)
                  }} />
                </div>
              </Panel>
              <Panel header='店铺'>
                {this.state.shops && this.state.shops.length ? (
                  <RadioGroup onChange={(e) => {
                    this.mergeConditions('AppointShop', e.target.value)
                  }} value={cd.AppointShop}>
                    {this.state.shops.map(x => <Radio style={radioBlock} key={x.value} value={x.value}><span title='双击直接单项查询' onDoubleClick={() => {
                      const cds = {'AppointShop': x.value}
                      this.runS(cds)
                    }}>{x.label}</span></Radio>)}
                  </RadioGroup>
                ) : null}
              </Panel>
            </div>
          </Scrollbar>
        </div>
      </aside>
    )
  }
})))
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
