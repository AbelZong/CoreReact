/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959.com>
* Date  : 2016-12-08 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import {Button, Form, Select, DatePicker, Input, Row, Col} from 'antd'
const RangePicker = DatePicker.RangePicker
const createForm = Form.create
const Option = Select.Option
const FormItem = Form.Item
import moment from 'moment'
import Wrapper from 'components/MainWrapper'
import SkuPicker from 'components/SkuPicker'
import ExpressPicker from 'components/ExpressPicker'
import ShopPicker from 'components/ShopPicker'
import {ZGet} from 'utils/Xfetch'
const OptGroup = Select.OptGroup

const outStatus = [{
  'value': '1',
  'label': '待出库'
}, {
  'value': '2',
  'label': '已出库(生效)'
}, {
  'value': '3',
  'label': '已出库待发货'
}, {
  'value': '4',
  'label': '已出库并且已发货'
}, {
  'value': '5',
  'label': '归档'
}, {
  'value': '6',
  'label': '出库后作废'
}, {
  'value': '7',
  'label': '出库前作废'
}, {
  'value': '8',
  'label': '外部发货中'
}]

export default connect()(createForm()(Wrapper(React.createClass({
  getInitialState() {
    return {
      type: '1'
    }
  },
  componentDidMount() {
    ZGet('Batch/GetBatchInit', null, ({d}) => {
      this.setState({
        BatchStatus: d.BatchStatus,
        Pickor: d.Pickor,
        Task: d.Task,
        BatchType: d.BatchType
      })
    })
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
        this.props.dispatch({type: 'PB_LIAT_CONSITION_SET', payload: {
          ID: v.ID ? v.ID : '',
          Remark: v.Remark ? v.Remark : '',
          PickorID: v.PickorID && v.PickorID.length ? v.PickorID.join(',') : '',
          Task: v.Task && v.Task.length ? v.Task.join(',') : '',
          Type: v.Type && v.Type.length ? v.Type.join(',') : '',
          DateStart: v.Time && v.Time.length ? v.Time[0].format() : '',
          Dateend: v.Time && v.Time.length ? v.Time[1].format() : '',
          Status: v.Status && v.Status.length ? v.Status.join(',') : ''
        }})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
  },
  onStatusChange() {

  },
  selectChange() {},
  timeSet(e, flag) {
    if (flag === 1) {
      this.props.form.setFieldsValue({Time: [moment().startOf('day'), moment().endOf('day')]})
    } else {
      this.props.form.setFieldsValue({Time: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]})
    }
  },
  searchByPrintTask() {
    this.props.dispatch({ type: 'PB_SALE_OUT_PRINT_TASK_VIS_SET', payload: 1 })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const selectBefore = (
      <Select value={this.state.type} style={{ width: 100 }} onSelect={this.handleSelect1}>
        <Option value='1'>内部订单号</Option>
        <Option value='2'>线上订单号</Option>
        <Option value='3'>出库单号</Option>
        <Option value='4'>快递单号</Option>
      </Select>
    )
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <Row>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('ID')(
                  <Input addonBefore={selectBefore} style={{width: 164}} placeholder='单号' onPressEnter={this.handleSearch} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('Time')(
                  <RangePicker allowClear startPlaceholder='单据开始日期' endPlaceholder='单据结束日期' format='YYYY-MM-DD' style={{width: 274}} />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('Status')(
                  <Select style={{ width: 120 }} placeholder='--出库订单状态--' onChange={this.selectChange}>
                    {outStatus.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('Weight')(
                  <Select style={{ width: 133 }} placeholder='--称重--' onChange={this.selectChange}>
                    <Option key={1} value='0'>未称重</Option>
                    <Option key={2} value='1'>已称重</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                <Select value={this.state.type} style={{ width: 116 }} onSelect={this.handleSelect1}>
                  <Option value='1'>商品编码</Option>
                  <Option value='2'>款式编码</Option>
                </Select>
                {getFieldDecorator('SkuPicker')(
                  <SkuPicker />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginTop: 5}}>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('Tag')(
                  <Select style={{ width: 120 }} placeholder='--挑选标签--' onChange={this.selectChange}>
                    <OptGroup label='包含标签'>
                      <Option key={1} value='1'>Jack</Option>
                      <Option key={2} style={{background: 'red', 'color': '#fff'}} value='2'>Lucy</Option>
                    </OptGroup>
                    <OptGroup label='排除标签'>
                      <Option key={3} style={{background: 'green', 'color': '#fff'}} value='3'>yiminghe</Option>
                    </OptGroup>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('Flag')(
                  <Select style={{ width: 120 }} placeholder='--挑选小旗--' onChange={this.selectChange}>
                    <OptGroup label='包含标签'>
                      <Option key={1} value='1'>Jack</Option>
                      <Option key={2} style={{background: 'red', 'color': '#fff'}} value='2'>Lucy</Option>
                    </OptGroup>
                    <OptGroup label='排除标签'>
                      <Option key={3} style={{background: 'green', 'color': '#fff'}} value='3'>yiminghe</Option>
                    </OptGroup>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('Express')(
                  <ExpressPicker />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('ExPrint')(
                  <Select style={{ width: 130 }} placeholder='--快递单打印状态--' onChange={this.selectChange}>
                    <Option key={1} value='0'>未打印</Option>
                    <Option key={2} value='1'>已打印</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('ShopPicker')(
                  <ShopPicker />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('receiver')(
                  <Input placeholder='收货人' />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('PrintCount')(
                  <Select style={{ width: 120 }} placeholder='--打印次数--' onChange={this.selectChange}>
                    <Option key={1} value='0'>所有</Option>
                    <Option key={2} value='1'>小于2次</Option>
                    <Option key={3} value='2'>2次及以上</Option>
                    <Option key={4} value='3'>3次及以上</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <Button type='primary' style={{margin: '5px 0 0 2px'}} onClick={this.handleSearch}>搜索</Button>
              <Button style={{margin: '5px 0 0 2px'}} onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
          <Row style={{marginTop: 5}}>
            <a href='javascript:void(0)' style={{marginLeft: 5}} >已打印未出库</a>
            <a href='javascript:void(0)' style={{margin: '0 15px 0 5px'}} >已出库未打印</a>
            <a href='javascript:void(0)' style={{margin: '0 15px 0 5px'}} >已出库未发货</a>
            <a href='javascript:void(0)' style={{margin: '0 15px 0 5px'}} onClick={this.searchByPrintTask}>按打印任务查询</a>
          </Row>
        </Form>
      </div>
    )
  }
}))))
