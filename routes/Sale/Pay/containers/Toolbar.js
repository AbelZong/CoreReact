/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-09 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {
  Button,
  Form,
  Select,
  Input
} from 'antd'
import {ZGet} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils/index'
import styles from './index.scss'
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
import Wrapper from 'components/MainWrapper'
import DateRange from 'components/DateStartEnd'
const DEFAULT_CONF_1 = {
  'PayNbr': '支付单号',
  'SoID ': '线上订单号',
  'OID': '内部订单号',
  'ID': '内部支付单号'
}
const DEFAULT_CONDITIONS = {
  _ck1_: 'PayNbr'
}
export default connect()(createForm()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      states: null,
      payments: null,
      _conditions: DEFAULT_CONDITIONS
    }
  },
  componentWillMount() {
    startLoading()
    ZGet('Pay/GetPayStatusInit', ({d}) => {
      this.setState({
        states: d.Status,
        payments: d.Payment
      })
    }).then(endLoading)
  },
  componentDidMount() {
    this.refreshDataCallback()
  },
  handleSearch(e) {
    e.preventDefault()
    this.runSearching()
  },
  refreshDataCallback() {
    this.runSearching()
  },
  runSearching(x) {
    setTimeout(() => {
      this.props.form.validateFieldsAndScroll((errors, v) => {
        if (errors) {
          console.error('search Error: ', errors)
          return
        }
        const data = {
          Status: v.a3,
          Payment: v.a5,
          BuyerShopID: v.a4
        }
        if (v.a1) {
          data[this.state._conditions._ck1_] = v.a1
        }
        if (v.a2) {
          if (v.a2.date_start) {
            data.DateStart = v.a2.date_start.format()
          }
          if (v.a2.date_end) {
            data.Dateend = v.a2.date_end.format()
          }
        }
        this.props.dispatch({type: 'SALE_OUT_CONDITIONS_SET', payload: data})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.setState({
      _conditions: DEFAULT_CONDITIONS
    }, () => {
      this.runSearching()
    })
  },
  mergeConditions(k, v) {
    this.setState(update(this.state, {
      _conditions: {
        $merge: typeof k === 'object' ? k : {[`${k}`]: v}
      }
    }))
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const cd = this.state._conditions
    const {states, payments} = this.state
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <FormItem style={{ width: 170 }}>
            {getFieldDecorator('a1')(
              <Input addonBefore={<Select style={{ width: 90 }} value={cd._ck1_} size='small' onChange={(v) => {
                this.mergeConditions('_ck1_', v)
              }}>
                {Object.keys(DEFAULT_CONF_1).map((key, idx) => <Option key={idx} value={key}>{DEFAULT_CONF_1[key]}</Option>)}
              </Select>} style={{ width: 80 }} size='small' placeholder={DEFAULT_CONF_1[cd._ck1_]} />
            )}
          </FormItem>
          <FormItem label='支付时间'>
            {getFieldDecorator('a2')(
              <DateRange format='YYYY-MM-DD HH:mm:ss' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a3')(
              <Select placeholder='支付状态' style={{ width: 90 }} size='small'>
                <Option value=''>全部支付状态</Option>
                {states && states.length ? states.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a5')(
              <Select placeholder='支付方式' style={{ width: 90 }} size='small'>
                <Option value=''>全部支付方式</Option>
                {payments && payments.length ? payments.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <FormItem label='买家账号'>
            {getFieldDecorator('a4')(
              <Input size='small' style={{width: 80}} />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
