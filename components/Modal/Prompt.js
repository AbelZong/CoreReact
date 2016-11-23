/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-31 14:39:02
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Modal, Input } from 'antd'
//import styles from './Modal.scss'
import ReactDOM from 'react-dom'
const defProps = {
  // onPrompt: (e) => {
  //   const p = new Promise((resolve, reject) => {
  //     resolve('s')
  //     reject('s1')
  //   })
  //   return p
  // }，
  title: '请输入内容',
  children: undefined,
  placeholder: 'please enter',
  value: ''
}
// const Promiser = function() {
//   const p = new Promise((resolve, reject) => {
//     resolve('s')
//     reject('s1')
//   })
//   return p
// }
const PP = React.createClass({
  getInitialState() {
    return {
      confirmLoading: false,
      value: this.props.value
    }
  },
  handleOk() {
    const {onPrompt, onCancel} = this.props
    const input = this.refs.hua.refs.input
    const value = input.value
    switch (typeof onPrompt) {
      case 'function': {
        let data = {
          value,
          target: input,
          goodgods: this
        }
        let _data = onPrompt(data)
        if (typeof _data === 'object' && _data instanceof Promise) {
          _data.then(onCancel).then((msg) => {
            //todo this.props.onError
          })
        } else {
          if (_data) {
            onCancel()
          }
        }
        break
      }
      default: {
        onCancel()
      }
    }
  },
  handleChange(e) {
    const value = e.target.value
    this.setState({
      value
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(value)
      }
    })
  },
  render() {
    const {children, placeholder, ...props} = this.props
    const {value} = this.state
    return (
      <Modal maskClosable={false} onOk={this.handleOk} {...props}>
        {children}
        <Input ref='hua' placeholder={placeholder} value={value} onChange={this.handleChange} onPressEnter={this.handleOk} />
      </Modal>
    )
  }
})
export default function prompt(config) {
  const props = Object.assign({}, defProps, config)
  let div = document.createElement('div')
  document.body.appendChild(div)
  function close() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult) {
      div.parentNode.removeChild(div)
    }
  }
  props.onCancel = close
  props.visible = true
  ReactDOM.render(<PP {...props} />, div)
  return {
    destroy: close
  }
}
