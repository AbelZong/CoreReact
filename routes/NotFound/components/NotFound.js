/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-08-31 11:33:06
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import styles from './NotFound.scss'
import {endLoading} from 'utils'

export const NotFound = () => {
  endLoading()
  return (
    <div className={styles.normal}>
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.desc}>~页面内容不存在~</p>
      </div>
    </div>
  )
}

export default NotFound
