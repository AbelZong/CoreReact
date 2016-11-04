/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-06 10:34:41
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Icon} from 'antd'
import styles from './Header.scss'
import {connect} from 'react-redux'

const NoticeBtn = React.createClass({

  getInitialState() {
    return {
      msgCount: 0
    }
  },
  componentDidMount() {
  },
  componentWillUnmount() {
  },
  openMsgWindow() {
    this.props.dispatch({ type: 'NOTICE_VISIBEL_REVER' })
  },
  render() {
    const {msgCount} = this.state
    return (
      <div className={styles.menuB} onClick={this.openMsgWindow}>
        <div className={styles.msger}>
          <Icon type='notification' />
          {msgCount > 0 && (
            <div className={styles.msgCount}>
              <span>{msgCount}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
})

export default connect()(NoticeBtn)
