/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-28 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, {
  createClass
} from 'react'
import {
  connect
} from 'react-redux'
import styles from 'components/App.scss'
import classNames from 'classnames'
import Side from './Side'
import Main from './Main'
import {
  endLoading
} from 'utils/index'
export default connect(state => ({
  collapse: state.order_giftrule_collapse
}))(createClass({
  componentDidMount() {
    endLoading()
  },
  render() {
    const collapse = this.props.collapse
    const CN = classNames(styles.content, 'flex-row', {
      [`${styles.collapse}`]: collapse
    })
    return (
      <div className={CN}>
        <Side />
        <Main />
      </div>
    )
  }
}))
