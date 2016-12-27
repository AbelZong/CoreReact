/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.2
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-03 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
/**
 * useage:
 import DateRangePicker from 'components/DateRangePicker'
 <DateRangePicker types={{
   modifyDT: '修改时间',
   createDT: '创建时间'
 }} preWidth={86} size='small' onChange={console.log} onRangePreset={预设范围值设置事件} date_start={moment()} date_end={moment()} date_type='createDT' />
 or
 <Form.Item>
   {getFieldDecorator('dateRange', {
     rules: [{ type: 'object', required: true, message: 'Please select time!' }],
     initialValue: {
       date_type: 'modifyDT'
     }
   })(
     <DateRangePicker types={{
       modifyDT: '修改时间',
       createDT: '创建时间'
     }} />
   )}
 </Form.Item>
*/
import React, { Component } from 'react'
import {
  DatePicker,
  Menu,
  Dropdown,
  Icon
} from 'antd'
import moment from 'utils/moment'
import styles from './comdrp.scss'
class DateRangePicker extends Component {
  constructor(props) {
    super(props)
    const _data = props.value && props.value instanceof Object ? props.value : props
    this.state = {
      //data: {
      date_type: _data.date_type || (props.types ? Object.keys(props.types)[0] : null),
      date_start: _data.date_start || null,
      date_end: _data.date_end || null
      //}
    }
  }
  componentWillReceiveProps = (nextProps) => {
    const props = nextProps.value && nextProps.value instanceof Object ? nextProps.value : nextProps
    if (props.date_type !== this.props.date_type || notEqualMoment(props.date_start, this.props.date_start) || notEqualMoment(props.date_end, this.props.date_end)) {
      this.setState({
        date_type: props.date_type,
        date_start: props.date_start,
        date_end: props.date_end
      })
    }
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    // const props = nextProps.value && nextProps.value instanceof Object ? nextProps.value : nextProps
    // if (props.date_type !== this.props.date_type || notEqualMoment(props.date_start, this.props.date_start) || notEqualMoment(props.date_end, this.props.date_end)) {
    //   return true
    // }
    if (nextState.date_type !== this.state.date_type || notEqualMoment(nextState.date_start, this.state.date_start) || notEqualMoment(nextState.date_end, this.state.date_end)) {
      return true
    }
    return false
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.date_end
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.date_start
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }
  __onChange(changeFields) {
    this.props.onChange && this.props.onChange(this.state, changeFields)
  }
  onStartChange = (value) => {
    this.setState({
      date_start: value
    }, () => this.__onChange(['date_start']))
  }
  onEndChange = (value) => {
    this.setState({
      date_end: value
    }, () => this.__onChange(['date_end']))
  }
  __updateDate = (startValue, endValue) => {
    this.setState({
      date_start: startValue,
      date_end: endValue
    }, () => {
      this.__onChange(['date_start', 'date_end'])
      this.props.onRangePreset && this.props.onRangePreset() // todo test
    })
  }
  handleMenuClick = (e) => {
    const { key } = e
    if (this.props.types) {
      let types = Object.keys(this.props.types)
      if (types.indexOf(key) !== -1) {
        this.setState({
          date_type: key
        }, () => this.__onChange(['date_type']))
        return
      }
    }
    switch (key) {
      case 'zh-wheat-1': {
        return this.__updateDate(moment().startOf('day'), moment().endOf('day'))
      }
      case 'zh-wheat-2': {
        return this.__updateDate(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'))
      }
      case 'zh-wheat-3': {
        return this.__updateDate(moment().startOf('week'), moment().endOf('week'))
      }
      case 'zh-wheat-4': {
        return this.__updateDate(moment().startOf('month'), moment().endOf('month'))
      }
      case 'zh-wheat-5': {
        return this.__updateDate(moment().subtract(30, 'days').startOf('day'), moment().endOf('day'))
      }
      case 'zh-wheat-6': {
        return this.__updateDate(moment().subtract(60, 'days').startOf('day'), moment().endOf('day'))
      }
    }
  }
  render() {
    const { date_start, date_end, date_type } = this.state
    const size = this.props.size || 'default'
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {this.props.types ? Object.keys(this.props.types).map(key => <Menu.Item key={key}>搜{this.props.types[key]}</Menu.Item>) : null }
        {this.props.types ? <Menu.Divider /> : null}
        <Menu.Item key='zh-wheat-1'>今天</Menu.Item>
        <Menu.Item key='zh-wheat-2'>昨天</Menu.Item>
        <Menu.Item key='zh-wheat-3'>本周</Menu.Item>
        <Menu.Item key='zh-wheat-4'>本月</Menu.Item>
        <Menu.Item key='zh-wheat-5'>最近30天</Menu.Item>
        <Menu.Item key='zh-wheat-6'>最近60天</Menu.Item>
      </Menu>
    )
    return (
      <div className={`${styles.box} ${styles[size]}`}>
        {this.props.types ? (<div className={styles['pselecter']}>
          <Dropdown overlay={menu}>
            <a className='ant-dropdown-link' style={{ display: 'block', width: this.props.preWidth || 85 }}>
              按{this.props.types[date_type]} <Icon type='down' />
            </a>
          </Dropdown>
        </div>) : null}
        <div className={styles.start}>
          <DatePicker
            disabledDate={this.disabledStartDate}
            showTime
            format='YYYY-MM-DD HH:mm:ss'
            value={date_start}
            placeholder='开始时间'
            onChange={this.onStartChange}
            size={size}
          />
        </div>
        <span className={styles.separator}>~</span>
        <div className={styles.end}>
          <DatePicker
            disabledDate={this.disabledEndDate}
            showTime
            format='YYYY-MM-DD HH:mm:ss'
            value={date_end}
            placeholder='结束时间'
            onChange={this.onEndChange}
            size={size}
          />
        </div>
      </div>
    )
  }
}
function notEqualMoment(prev, next) {
  return (prev && next && !next.isSame(prev)) || prev !== next
}
export default DateRangePicker
