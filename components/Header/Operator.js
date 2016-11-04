/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-06 13:10:39
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Icon} from 'antd'
import styles from './Header.scss'
import {connect} from 'react-redux'
import EE from 'utils/EE'

const Operator = React.createClass({
  getInitialState() {
    return {
      refreshing: false
    }
  },
  componentDidMount() {
  },
  componentWillUnmount() {
  },
  handleWinScreen() {
    this.props.dispatch({ type: 'MAINFIXED_REVER' })
  },
  handleWinReload() {
    EE.triggerRefreshMain()
  },
  render() {
    return (
      <div className={styles.operatorBts}>
        <div className={styles.but} onClick={this.handleWinReload}>
          <Icon type='reload' />
        </div>
        <div className={styles.but} onClick={this.handleWinScreen}>
          <Icon type='retweet' />
        </div>
      </div>
    )
  }
})

export default connect()(Operator)
