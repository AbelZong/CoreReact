/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-28 17:09:18
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import styles from './AccessPermission.scss'

export default React.createClass({
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.center}>
          <h5>Warning</h5>
          <div>抱歉，无法访问<em>!</em></div>
          <div><a href='/' target='_blank'>去登入</a></div>
        </div>
      </div>
    )
  }
})
