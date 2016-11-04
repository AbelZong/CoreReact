/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-09 14:24:59
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, {createClass} from 'react'
import {connect} from 'react-redux'
import styles from 'components/App.scss'
import classNames from 'classnames'
import AdminSide from './AdminSide'
import AdminMain from './AdminMain'
import Wrapper from 'components/MainWrapper'
import {ZGet} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'

export default connect(state => ({
  collapse: state.print_admin_collapse
}))(Wrapper(createClass({
  componentWillMount() {
    this.refreshDataCallback()
  },
  refreshDataCallback() {
    startLoading()
    ZGet({
      uri: 'print/tpl/getallsystypes',
      success: ({d}) => {
        this.props.dispatch({type: 'SYSTYPES_SET', payload: d || []})
      }
    }).then(endLoading)
  },
  render() {
    const collapse = this.props.collapse
    const CN = classNames(styles.content, 'flex-row', {
      [`${styles.collapse}`]: collapse
    })
    return (
      <div className={CN}>
        <AdminSide />
        <AdminMain />
      </div>
    )
  }
})))
