/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-27 17:01:54
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Modal } from 'antd'
//import styles from './Modal.scss'
//import {findDOMNode} from 'react-dom'
//https://github.com/react-component/dialog/issues/37 sob
export default React.createClass({
  getInitialState() {
    this.inited = false
    return { left: '', top: '', dragging: false }
  },
  componentDidUpdate(nextProps) {
    console.log(this.refs.zh)
  },
  render() {
    const {children, ...modalProps} = this.props
    return (
      <Modal {...modalProps} ref='zh'>
        {children}
      </Modal>
    )
  }
})
