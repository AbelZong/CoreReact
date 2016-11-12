/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-11 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import {
  Icon,
  Checkbox,
  Input,
  Button,
  Popover,
  Select
} from 'antd'
import appStyles from 'components/App.scss'
import classNames from 'classnames'
import {
  ZPost
} from 'utils/Xfetch'
import Scrollbar from 'components/Scrollbars/index'
import styles from './index.scss'
const Option = Select.Option
export default connect()(React.createClass({
  getInitialState: function() {
    return {
      conditions: {
        //暂无预设值
      }
    }
  },
  componentDidMount() {
    this.refreshDataCallback()
  },
  handleSearch(e) {
    this.runSearching()
  },
  refreshDataCallback() {
    this.runSearching()
  },
  runSearching(x) {
    requestAnimationFrame(() => {
      //todo conditions patch
      const conditions = this.state.conditions
      this.props.dispatch({type: 'ORDER_LIST_CONDITIONS_SET', payload: conditions})
    })
  },
  render() {
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <div className={appStyles.header}>
            <div className='mb10 clearfix tc'>
              <Button size='small'>清空</Button>
              <Button size='small' type='primary' className='ml10 mr10'>组合查询</Button>
              <Button size='small' type='dashed'>更新统计</Button>
            </div>
          </div>
          <Scrollbar autoHide className='hua--zhang flex-grow flex-column mt5'>
            <div className={styles.aside}>
              <div className={styles.nor}>
                <div><Input addonAfter='内部订单' size='small' placeholder='内部订单号' value={this.state.order} onChange={(e) => {
                  this.setState({
                    order: e.target.value
                  })
                }} /></div>
                <div style={{margin: '2px 0'}}><Input addonAfter={<Select value='1' style={{ width: 80 }} size='small'>
                  <Option value='1'>线上订单</Option>
                  <Option value='2'>支付单号</Option>
                </Select>} size='small' placeholder='线上订单号' /></div>
                <div><Input addonAfter='内部订单' size='small' placeholder='买家账号' /></div>
              </div>
              <Panel header={<div className={styles.bbq}>
                <Checkbox className={styles.pen}>订单状态</Checkbox>
              </div>}>
                <Popover content={<div>test</div>} trigger='focus'>
                  <Input />
                </Popover>
              </Panel>
              <Panel closed header={<div className={styles.bbq}>
                <Checkbox className={styles.pen}>订单状态</Checkbox>
              </div>}>
                <Popover content={<div>test</div>} trigger='focus'>
                  <Input />
                </Popover>
              </Panel>
            </div>
          </Scrollbar>
        </div>
      </aside>
    )
  }
}))
//damn Antd
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
    return (
      <div className={CN}>
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
