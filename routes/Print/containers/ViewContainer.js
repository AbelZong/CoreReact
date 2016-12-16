/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-09 14:25:55
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component } from 'react'
import { connect as Connect } from 'react-redux'
import {ZGet} from 'utils/Xfetch'
import { initRender } from '../modules/actionsModify'
import View from './View'
import styles from './View.scss'
import PageEntering from 'components/ToolPages/Entering'
import {endLoading, getUriParam} from 'utils/index'

class Layout extends Component {
  componentWillMount() {
    const my_id = getUriParam('my_id')
    const sys_id = getUriParam('sys_id')
    const type = getUriParam('type')
    window.ZCH = {
      my_id, sys_id, type
    }
    let uri = ''
    let params = null
    switch (true) {
      case my_id > 0: { //加载个人模板
        uri = 'print/tpl/my'
        params = {my_id, type}
        break
      }
      case sys_id > 0: { //加载系统模板，以及模块数据
        uri = 'print/tpl/sys'
        params = { sys_id, type }
        break
      }
      default: { //只加载模块数据
        uri = 'print/tpl/type'
        params = { type }
      }
    }
    this.props.dispatch({type: 'ENTERING_STOP'})
    endLoading()
    // if (my_id === null) {
    //   this.props.dispatch({type: 'PM_ROLELV_SET', payload: 1})
    // }
    // ZGet(uri, params, ({d}) => {
    //   this.props.dispatch(initRender(d, window.ZCH))
    //   //dispatch({type: 'ACCESSLEVEL_ALLOW'})
    // }, () => {
    //   this.props.dispatch({type: 'ACCESSLEVEL_FORBID'})
    // }).then(() => {
    //   this.props.dispatch({type: 'ENTERING_STOP'})
    //   endLoading()
    // })
  }

  render() {
    return (
      <View />
    )
  }
}

export default Connect(state => ({
  currentTplID: state.pm_currentTplID,
  print_msg: state.pm_print_msg
}))(Layout)
