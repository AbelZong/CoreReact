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
import {startLoading, endLoading, getUriParam} from 'utils/index'
import styles from './index.scss'
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const ButtonGroup = Button.Group
import Wrapper from 'components/MainWrapper'
import DateRange from 'components/DateStartEnd'
import SkuPicker from 'components/SkuPicker'
import ExpressPicker from 'components/ExpressPicker'
import ShopPicker from 'components/ShopPicker'
const DEFAULT_CONF_1 = {
  'PayNbr': '内部订单号',
  'SoID ': '线上订单号',
  'OID': '出库单号',
  'ID': '快递单号'
}
const DEFAULT_CONDITIONS = {
  _ck1_: 'PayNbr',
  skuType: 'SkuID'
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
    ZGet('SaleOut/GetStatusInitData', ({d}) => {
      this.setState({
        states: d
      })
    }).then(endLoading)
  },
  componentDidMount() {
    const BatchID = getUriParam('BatchID')
    if (BatchID !== null) {
      this.props.form.setFieldsValue({
        a16: BatchID
      })
    }
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
          return
        }
        const data = {
          Status: v.a3,
          IsWeightYN: v.a5,
          ExID: v.a12 && v.a12.id ? v.a12.id : '',
          IsExpPrint: v.a13,
          ShopID: v.a14 && v.a14.id ? v.a14.id : '',
          RecName: v.a15,
          BatchID: v.a16
        }
        const cds = this.state._conditions
        if (v.a1) {
          data[cds._ck1_] = v.a1
        }
        if (v.a2) {
          if (v.a2.date_start) {
            data.DateStart = v.a2.date_start.format()
          }
          if (v.a2.date_end) {
            data.Dateend = v.a2.date_end.format()
          }
        }
        if (v.a11 && v.a11.id) {
          data[cds.skuType] = v.a11.id
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
    const {states} = this.state
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
          <FormItem label='单据时间'>
            {getFieldDecorator('a2')(
              <DateRange format='YYYY-MM-DD HH:mm:ss' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a3')(
              <Select placeholder='出库订单状态' style={{ width: 105 }} size='small'>
                <Option value=''>全部出库订单</Option>
                {states && states.length ? states.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a5')(
              <Select placeholder='-称重-' style={{ width: 80 }} size='small'>
                <Option value=''>全部称重</Option>
                <Option value='Y'>已称重</Option>
                <Option value='N'>未称重</Option>
              </Select>
            )}
          </FormItem>
          <Select value={cd.skuType} style={{ width: 80, verticalAlign: 'text-bottom' }} onSelect={(v) => {
            this.mergeConditions('skuType', v)
            this.props.form.setFieldsValue({a11: undefined})
          }} size='small'>
            <Option value='SkuID'>包含商品</Option>
            <Option value='GoodsCode'>包含款式</Option>
          </Select>
          <FormItem>
            {getFieldDecorator('a11')(
              <SkuPicker placeholder='请选择' size='small' valueField={cd.skuType} nameField={cd.skuType} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a12')(
              <ExpressPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a13')(
              <Select placeholder='-快递打印-' style={{ width: 100 }} size='small'>
                <Option value=''>全部打印状态</Option>
                <Option value='Y'>已打印</Option>
                <Option value='N'>未打印</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a14')(
              <ShopPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a15')(
              <Input placeholder='收货人' size='small' style={{width: 80}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a16')(
              <Input size='small' placeholder='批次号' style={{width: 80}} />
            )}
          </FormItem>
          <ButtonGroup>
            <Button type='ghost' size='small' onClick={() => {
              this.props.form.setFieldsValue({
                a3: '0',
                a13: 'Y'
              })
              this.runSearching()
            }}>已打印未出库</Button>
            <Button type='ghost' size='small' onClick={() => {
              this.props.form.setFieldsValue({
                a3: '1',
                a13: 'N'
              })
              this.runSearching()
            }}>已出库未打印</Button>
            <Button type='ghost' size='small' onClick={() => {
              this.props.form.setFieldsValue({
                a3: '2'
              })
              this.runSearching()
            }}>已出库未发货</Button>
            <Button className='hide' type='ghost' size='small'>按打印任务查询</Button>
          </ButtonGroup>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
