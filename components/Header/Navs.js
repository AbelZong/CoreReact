/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-03 09:49:28
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import styles from './Header.scss'
import Bookmark from './Bookmark'
import Operator from './Operator'

const Navs = React.createClass({
  render() {
    return (
      <div className={styles.navs}>
        <div className={styles.bookmarker}>
          <Bookmark />
        </div>
        <div className={styles.operator}>
          <Operator />
        </div>
      </div>
    )
  }
})

export default Navs
