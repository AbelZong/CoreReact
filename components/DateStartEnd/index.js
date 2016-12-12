/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-03 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  DatePicker,
  Menu,
  Dropdown,
  Icon
} from 'antd'
import classNames from 'classnames'
import moment from 'moment'
import styles from './index.scss'
class DateRangePanel extends React.Component {
  state = {
    cType: this.props.dateType || '',
    startValue: null,
    endValue: null,
    endOpen: false
  }
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps)
    // if (nextProps.dateStart !== this.state.startValue || nextProps.dateEnd !== this.state.endValue || nextProps.dateType !== this.state.cType) {
    //   this.setState({
    //     startValue: nextProps.dateStart,
    //     endValue: nextProps.dateEnd,
    //     cType: nextProps.dateType
    //   })
    // }
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
  onStartChange = (value) => {
    this.setState({
      startValue: value
    }, () => {
      this.props.onChange({
        DateStart: this.state.startValue,
        DateEnd: this.state.endValue
      })
    })
  }
  onEndChange = (value) => {
    this.setState({
      endValue: value
    }, () => {
      this.props.onChange({
        DateStart: this.state.startValue,
        DateEnd: this.state.endValue
      })
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
        DateStart: this.state.startValue,
        DateEnd: this.state.endValue
      })
    })
  }
  handleMenuClick = (e) => {
    const {key} = e
    if (this.props.types) {
      let types = Object.keys(this.props.types)
      if (types.indexOf(key) !== -1) {
        this.setState({
          cType: key
        }, () => {
          this.props.onTypeChange(key)
        })
        return
      }
    }
    switch (key) {
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
    const { startValue, endValue, cType } = this.state
    const size = this.props.size || 'small'
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {this.props.types ? Object.keys(this.props.types).map(key => <Menu.Item key={key}>搜{this.props.types[key]}</Menu.Item>) : null }
        {this.props.types ? <Menu.Divider /> : null}
        <Menu.Item key='1'>今天</Menu.Item>
        <Menu.Item key='2'>昨天</Menu.Item>
        <Menu.Item key='3'>本周</Menu.Item>
        <Menu.Item key='4'>本月</Menu.Item>
        <Menu.Item key='5'>最近30天</Menu.Item>
        <Menu.Item key='6'>最近60天</Menu.Item>
      </Menu>
    )
    // onOpenChange={this.handleStartOpenChange}
    // onOpenChange={this.handleEndOpenChange}
    //open={endOpen}
    const CN = classNames(styles.box, styles[size])
    return (
      <div className={CN}>
        {this.props.types ? (<div className={styles.tt}>
          <Dropdown overlay={menu}>
            <a className='ant-dropdown-link'>
              按{this.props.types[cType]} <Icon type='down' />
            </a>
          </Dropdown>
        </div>) : null}
        <div className={styles.dd}>
          <div className={styles.start}>
            <DatePicker
              disabledDate={this.disabledStartDate}
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              value={startValue}
              placeholder='开始时间'
              onChange={this.onStartChange}
              size={size}
            />
          </div>
          <span className={styles.gggg}>~</span>
          <div className={styles.end}>
            <DatePicker
              disabledDate={this.disabledEndDate}
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              value={endValue}
              placeholder='结束时间'
              onChange={this.onEndChange}
              size={size}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default DateRangePanel
