/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-17 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Button} from 'antd'
import Modal from './ReplaceModal'
import styles from './index.scss'

export default React.createClass({
  getInitialState() {
    return {
      visible: false
    }
  },
  handleModalCancel() {
    this.setState({
      visible: false
    })
  },
  handleModalOk(sku) {
    this._setValues(sku)
  },
  _setValues(lst) {
    this.setState({
      visible: false
    }, () => {
      this.props.onChange && this.props.onChange(lst)
    })
  },
  handleSelect() {
    this.setState({
      visible: true
    })
  },
  render() {
    const {style, size, children, type, initialValues} = this.props
    return (
      <Button size={size} type={type || 'ghost'} onClick={this.handleSelect} style={style}>
        {children || '换货'}
        <Modal doge={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel} initialValues={initialValues} />
      </Button>
    )
  }
})
