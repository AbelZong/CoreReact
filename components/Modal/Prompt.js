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
  children: undefined
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
      confirmLoading: false
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
  render() {
    const {children, ...props} = this.props
    return (
      <Modal maskClosable={false} onOk={this.handleOk} {...props}>
        {children}
        <Input ref='hua' placeholder='please enter' />
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
