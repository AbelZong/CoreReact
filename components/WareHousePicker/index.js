/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-11 14:57:24
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Input} from 'antd'
import Modal from './Modal'
import {Icon} from 'components/Icon'
import styles from './index.scss'

export default React.createClass({
  getInitialState: function() {
    const {initialValue} = this.props
    return {
      visible: false,
      value: initialValue ? initialValue.id : null,
      name: initialValue ? initialValue.name : ''
    }
  },
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value === 'undefined') {
      if (this.state.value !== nextProps.value) {
        this._setValue(null, '')
      }
    } else {
      if (this.state.value !== nextProps.value.id) {
        this._setValue(nextProps.value.id, nextProps.value.name)
      }
    }
  },
  handleSelect() {
    this.setState({
      visible: true
    })
  },
  handleModalCancel() {
    this.setState({
      visible: false
    })
  },
  handleModalOk(value, name) {
    this._setValue(value, name)
  },
  handleRemove(e) {
    e.stopPropagation()
    this._setValue('', null)
  },
  _setValue(value, name) {
    this.setState({
      visible: false,
      value,
      name
    }, () => {
      this.props.onChange && this.props.onChange({id: value, name})
    })
  },
  render() {
    const {style, className, placeholder} = this.props
    const CN = className ? `${styles.zhang} ${className}` : styles.zhang
    const styler = style ? {width: this.props.width || 145, ...style} : {width: this.props.width || 145}
    return (
      <div className={CN} style={styler}>
        <div className={styles.inputArea} onClick={this.handleSelect}>
          <Input value={this.state.name} placeholder={placeholder || '选择本仓位'} size={this.props.size || 'default'} className={styles.input} />
          <span className={styles.operator}>
            {this.state.name !== '' ? <Icon type='minus' onClick={this.handleRemove} title='点击移除' /> : <Icon type='ellipsis-h' title='点击选择' />}
          </span>
        </div>
        <Modal visible={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel} value={this.state.value} />
      </div>
    )
  }
})
