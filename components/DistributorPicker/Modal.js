/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-29 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Spin, Modal, Radio, Button, Input} from 'antd'
import ScrollerBar from 'components/Scrollbars/index'
import styles from './index.scss'
const RadioGroup = Radio.Group
import {ZGet} from 'utils/Xfetch'

export default React.createClass({
  getInitialState: function() {
    return {
      spinning: false,
      value: null,
      fKey: null,
      dataList: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        spinning: true,
        dataList: [],
        fKey: null
      })
      ZGet({
        uri: 'Distributor/getSupEnum',
        success: ({d}) => {
          this.setState({
            spinning: false,
            dataList: d,
            value: nextProps.value,
            fKey: null
          })
        }
      })
    }
  },
  handleOK() {
    const {value} = this.state
    const valueName = value ? this.state.dataList.filter(x => x.value === value)[0].label : ''
    this.props.onOk(value, valueName)
  },
  handleOk() {
    this.setState({
      value: null,
      valueName: ''
    }, () => {
      this.props.onOk(null, '')
    })
  },
  handleok() {
    this.props.onCancel()
  },
  handleFilter(e) {
    const val = e.target.value.trim()
    this.setState({
      fKey: val === '' ? null : val
    })
  },
  renderFooter() {
    return (
      <div className={styles.footer}>
        <div className='clearfix'>
          <Button onClick={this.handleok}>关闭</Button>
          {this.props.hideClear ? null : <Button type='ghost' onClick={this.handleOk}>清除</Button>}
          <Button type='primary' onClick={this.handleOK}>确认</Button>
          <Input className={styles.filterInput} placeholder='搜索，按回车确认' onPressEnter={this.handleFilter} />
        </div>
      </div>
    )
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value,
      valueName: e.target.name
    })
  },
  render() {
    const {fKey} = this.state
    const dataList = fKey === null ? this.state.dataList : this.state.dataList.filter(x => x.label.indexOf(fKey) !== -1)
    return (
      <Modal title='选择供销商' visible={this.props.visible} onCancel={this.props.onCancel} footer={this.renderFooter()} width={495}>
        <div className={styles.hua}>
          <Spin size='large' spinning={this.state.spinning} />
          {dataList.length > 0 ? (
            <div className={styles.dataList}>
              <ScrollerBar autoHide>
                <RadioGroup onChange={this.handleRadio} value={this.state.value}>
                  {dataList.map((x) => <Radio key={x.value} value={x.value}>{x.label}</Radio>)}
                </RadioGroup>
              </ScrollerBar>
            </div>
          ) : null}
        </div>
      </Modal>
    )
  }
})
