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
  Input,
  Button,
  Popover
} from 'antd'
import appStyles from 'components/App.scss'
import classNames from 'classnames'
import {
  ZPost
} from 'utils/Xfetch'
import {
  startLoading,
  endLoading
} from 'utils'
import Scrollbar from 'components/Scrollbars/index'
import styles from './index.scss'
export default connect()(React.createClass({
  getInitialState: function() {
    return {
      activeID: -1
    }
  },
  handleOpCp(e, {type, id}) {
    this.setState({
      activeID: id * 1
    }, () => {
      this.props.dispatch({type: 'PRINT_ADMIN_TYPE_ACTIVE_SET', payload: type})
    })
  },
  handleOpEdit(e, id) {
    e.stopPropagation()
    this.props.dispatch({type: 'PRINT_TYPE_DOGE_SET', payload: id})
  },
  handleOpDelete(id) {
    const {systypes} = this.props
    startLoading()
    ZPost({
      uri: 'print/tpl/deleteSysesType',
      data: {
        id
      },
      success: () => {
        const item = systypes.filter((x) => x.id === id)[0]
        if (item) {
          const index = systypes.indexOf(item)
          this.props.dispatch({type: 'SYSTYPES_UPDATE', update: {
            $splice: [[index, 1]]
          }})
        }
      }
    }).then(endLoading)
  },
  _handleHold(e) {
    e.stopPropagation()
  },
  handleCreateNew() {
    this.props.dispatch({type: 'PRINT_TYPE_DOGE_CREATE'})
  },
  render() {
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <div className={appStyles.header}>
            <div className='mb10 clearfix tc'>
              <Button size='small'>清空</Button>
              <Button size='small' type='primary' className='ml10 mr10'>组合查询</Button>
              <Button size='small' type='ghost'>更新统计</Button>
            </div>
          </div>
          <Scrollbar autoHide className='hua--zhang flex-grow flex-column mt5'>
            <div className={styles.aside}>
              <div className={styles.sBox}>
                <Popover content={<div>test</div>} trigger='click'>
                  <Input />
                </Popover>
                sdf
              </div>
            </div>
          </Scrollbar>
        </div>
      </aside>
    )
  }
}))
