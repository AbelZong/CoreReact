/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-26 11:11:55
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  endLoading
} from 'utils'
import styles from 'components/App.scss'
import Scrollbar from 'components/Scrollbars/index'
import Main from './Main'
export default React.createClass({
  componentDidMount() {
    endLoading()
  },
  render() {
    return (
      <div className={styles.content}>
        <Scrollbar autoHide>
          <div className={styles.zHint}>
            <Main />
          </div>
        </Scrollbar>
      </div>
    )
  }
})
