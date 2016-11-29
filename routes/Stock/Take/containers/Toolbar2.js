/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-14 11:10:43
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './index.scss'

export default connect()((React.createClass({
  render() {
    return (
      <span className={styles.detailName}>盘点明细信息</span>
    )
  }
})))
