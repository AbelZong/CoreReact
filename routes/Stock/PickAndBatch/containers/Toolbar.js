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
import {Button, Form, Select, Input, Checkbox, Row} from 'antd'
const createForm = Form.create
const Option = Select.Option
const FormItem = Form.Item

import Wrapper from 'components/MainWrapper'
import DateRange from 'components/DateStartEnd'
import {ZGet} from 'utils/Xfetch'
const CheckboxGroup = Checkbox.Group
const DEFAULT_CONDITIONS = {
  _ch_: 'ChooseDate'
}
export default connect()(createForm()(Wrapper(React.createClass({
  getInitialState() {
    return {
      BatchStatus: [],
      Pickor: [],
      Task: [],
      BatchType: [],
      _conditions: DEFAULT_CONDITIONS
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
    console.log('Crf')
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
          DateStart: v.Time && v.Time.date_start ? v.Time.date_start.format() : '',
          Dateend: v.Time && v.Time.date_end ? v.Time.date_end.format() : '',
          Status: v.Status && v.Status.length ? v.Status.join(',') : ''
        }})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
    this.setState({
      _conditions: DEFAULT_CONDITIONS
    }, () => {
      this.runSearching()
    })
  },
  onStatusChange() {

  },
  selectChange() {},
  timeSet(e, flag) {
    // if (flag === 1) {
    //   this.props.form.setFieldsValue({Time: [moment().startOf('day'), moment().endOf('day')]})
    // } else {
    //   this.props.form.setFieldsValue({Time: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]})
    // }
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
        DateStart: v.Time && v.Time.date_start ? v.Time.date_start.format() : '',
        Dateend: v.Time && v.Time.date_end ? v.Time.date_end.format() : '',
        Status: v.Status && v.Status.length ? v.Status.join(',') : ''
      }})
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const cd = this.state._conditions
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <Row>
            <FormItem>
              {getFieldDecorator('Status')(
                <CheckboxGroup options={this.state.BatchStatus} onChange={this.onStatusChange} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('ID')(
                <Input placeholder='批次号' size='small' style={{ width: 120 }} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Remark')(
                <Input placeholder='标志' size='small' style={{ width: 120 }} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('PickorID')(
                <Select multiple style={{ width: 250 }} size='small' placeholder='操作人' onChange={this.selectChange}>
                  {this.state.Pickor.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>)}
                </Select>
              )}
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              {getFieldDecorator('Task')(
                <CheckboxGroup options={this.state.Task} onChange={this.onStatusChange} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Type')(
                <CheckboxGroup options={this.state.BatchType} onChange={this.onStatusChange} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Time')(
                //<RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                <DateRange format='YYYY-MM-DD HH:mm:ss' size='small' dateType={cd._ch_} types={{ChooseDate: '指定时间'}} onRangePreset={this.timeSet} />
              )}
            </FormItem>
            <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
            <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
          </Row>
        </Form>
      </div>
    )
  }
}))))
