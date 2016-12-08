/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-11-29 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Main from './Main'
import Toolbar from './Toolbar'

export default React.createClass({
  componentDidMount() {
    endLoading()
  },
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Toolbar />
        <Main />
      </div>
    )
  }
})
