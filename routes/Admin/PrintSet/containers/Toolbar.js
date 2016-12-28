/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-20 16:43:32
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './index.scss'
import {Button, Input, Select} from 'antd'
const Option = Select.Option

const Toolbar = React.createClass({
  getInitialState: function() {
    return {
      enabled: 'true',
      printType: ''
    }
  },
  componentDidMount() {
    setTimeout(() => {
      this.handleSearch()
    }, 200)
  },
  handleCreateNew() {
    this.props.dispatch({type: 'PRINTER_EDIT_VIS_SET', payload: 0})
  },
  handleSelect(value) {
    this.setState({
      printType: value
    })
  },
  handleSelect2(value) {
    this.setState({
      enabled: value
    })
  },
  handleSearch() {
    this.props.dispatch({type: 'PRINTER_CONDITIONS_SET', payload: {
      filter: this.refs.keyword.refs.input.value,
      enabled: this.state.enabled,
      type: this.state.printType
    }})
  },
  render() {
    return (
      <div className={styles.toolbars}>
        <div className='pull-right'>
          <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增打印机</Button>
        </div>
        <div className={styles.conditionsForm}>
          <div className={styles.s1}>
            <Input placeholder='IP地址' ref='keyword' onPressEnter={this.handleSearch} />
          </div>
          <Select
            className={styles.s4}
            onChange={this.handleSelect} placeholder='打印机类型'>
            <Option value='0'>--全部--</Option>
            <Option value='1'>箱码打印</Option>
            <Option value='2'>快递单打印</Option>
            <Option value='3'>件码打印</Option>
          </Select>
          <Select
            className={styles.s2}
            value={this.state.enabled}
            onChange={this.handleSelect2}>
            <Option value='all'>全部状态</Option>
            <Option value='true'>启用</Option>
            <Option value='false'>禁用</Option>
          </Select>
          <Button type='primary' icon='search' className={styles.s3} onClick={this.handleSearch}>搜索</Button>
        </div>
      </div>
    )
  }
})
export default connect()(Toolbar)
