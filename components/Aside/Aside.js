/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-21 10:42:44
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import styles from './Aside.scss'
import Menus2 from './Menus2'
import Menus3 from './Menus3'
import classNames from 'classnames'
import {connect} from 'react-redux'

const Asider = React.createClass({
  render() {
    const {collapse1, collapse2} = this.props
    const CN1 = classNames(styles.zhang, {
      [`${styles.collapse}`]: collapse1
    })
    const CN2 = classNames(styles['sec-menus'], {
      [`${styles.collapse}`]: collapse2
    })
    return (
      <div className={styles.aside}>
        <div className={CN1}>
          <Menus2 />
        </div>
        <div className={CN2}>
          <Menus3 />
        </div>
      </div>
    )
  }
})

export default connect(state => ({
  collapse1: state.asideMenuCollapse1,
  collapse2: state.asideMenuCollapse2
}))(Asider)
