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
