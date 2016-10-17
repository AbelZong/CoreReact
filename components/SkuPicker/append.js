import React from 'react'
import {Button} from 'antd'
import Modal from './AppendModal'
import {Icon} from 'components/Icon'
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
  handleModalOk(lst) {
    this._setValues(lst)
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
    const {style, className, size, text} = this.props
    let CN = className ? `${styles.zhang} ${className}` : styles.zhang
    switch (size) {
      case 'small': {
        CN = `${CN} ${styles.zhangs}`
        break
      }
      default: {}
    }
    return (
      <div className={CN} style={{width: this.props.width, ...style}}>
        <Button size={size} type='ghost' onClick={this.handleSelect}><Icon type='plus' style={{color: 'red'}} /> {text || '添加新的商品'}</Button>
        <Modal doge={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel} />
      </div>
    )
  }
})
