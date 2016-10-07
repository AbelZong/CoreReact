import React from 'react'
import {Input} from 'antd'
import Modal from './Modal'
import {Icon} from 'components/Icon'
import styles from './index.scss'

export default React.createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: null,
      name: ''
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
    this.setState({
      visible: false,
      value,
      name
    })
    this.props.onChange && this.props.onChange(value, name)
  },
  handleRemove(e) {
    e.stopPropagation()
    this.setState({
      name: '',
      value: null
    })
    this.props.onChange && this.props.onChange(null, '')
  },
  render() {
    return (
      <div className={styles.zhang} style={{width: this.props.width || 126}}>
        <div className={styles.inputArea} onClick={this.handleSelect}>
          <Input value={this.state.name} placeholder='供货商' size={this.props.size || 'default'} className={styles.input} />
          <span className={styles.operator}>
            {this.state.name !== '' ? <Icon type='minus' onClick={this.handleRemove} title='点击移除' /> : <Icon type='ellipsis-h' title='点击选择' />}
          </span>
        </div>
        <Modal visible={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel} value={this.state.value} />
      </div>
    )
  }
})
