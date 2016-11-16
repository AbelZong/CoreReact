/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-13 15:58:09
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
    return {
      visible: '0',
      value: null,
      name: '',
      type: '1'
    }
  },
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value === 'undefined') {
      if (this.state.value !== nextProps.value) {
        //this._setValue(null, '')
        this.setState({
          value: null,
          name: ''
        })
      }
    } else {
      if (this.state.value !== nextProps.value.id) {
        //this._setValue(nextProps.value.id, nextProps.value.name)
        this.setState({
          value: nextProps.value.id,
          name: nextProps.value.name
        })
      }
    }
  },
  handleSelect() {
    this.setState({
      visible: this.state.type
    })
  },
  handleModalCancel() {
    this.setState({
      visible: '0'
    })
  },
  handleModalOk(data) {
    if (data) {
      //sbc
      const name = this.props.nameField ? data[this.props.nameField] : data.SkuName
      const value = this.props.valueField ? data[this.props.valueField] : data.ID
      //console.log(data, name, value)
      this._setValue(value, name, '0', data)
    } else {
      this._setValue(null, '', '0', data)
    }
  },
  _setValue(value, name, visible, data) {
    const states = { value, name }
    if (typeof visible !== 'undefined') {
      states.visible = visible
    }
    this.setState(states, () => {
      this.props.onChange && this.props.onChange({id: value, name, data})
    })
  },
  handleRemove(e) {
    e.stopPropagation()
    this._setValue(null, '')
  },
  handleSelect1(type) {
    this.setState({
      type
    })
  },
  render() {
    const {style, className, size} = this.props
    let CN = className ? `${styles.zhang} ${className}` : styles.zhang
    switch (size) {
      case 'small': {
        CN = `${CN} ${styles.zhangs}`
        break
      }
      default: {}
    }
    const w = 126 //200
    const styler = style ? {width: this.props.width || w, ...style} : {width: this.props.width || w}
    // const selectBefore = (
    //   <Select value={this.state.type} style={{ width: 80 }} onSelect={this.handleSelect1}>
    //     <Option value='1'>包含商品</Option>
    //     <Option value='2'>包含款式</Option>
    //   </Select>
    // )
    return (
      <div className={CN} style={styler}>
        <div className={styles.inputArea}>
          <Input onClick={this.handleSelect} value={this.state.name} placeholder={this.props.placeholder || '包含商品'} size={this.props.size || 'default'} className={styles.input} title={this.state.name || '点击选择商品'} />
          <span className={styles.operator}>
            {this.state.name !== '' ? <Icon type='minus' onClick={this.handleRemove} title='点击移除' /> : <Icon type='ellipsis-h' title='点击选择' />}
          </span>
        </div>
        <Modal doge={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel} value={this.state.value} />
      </div>
    )
  }
})
