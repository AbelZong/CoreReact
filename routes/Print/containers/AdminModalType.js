import React from 'react'
import { Form, Input, Modal } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
const createForm = Form.create
const FormItem = Form.Item
function noop() {
  return false
}

const DEFAULT_TITLE = '创建新类型'
const WangWangWang = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge < 0) {
      this.setState({
        visible: false
      })
    } else if (nextProps.doge === 0) {
      this.setState({
        visible: true,
        title: DEFAULT_TITLE
      })
    } else {
      ZGet({
        uri: '',
        success: (s, d, m) => {
          //
        }
      })
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors || typeof errors === 'object' && Object.keys(errors).length > 0) {
        return
      }
      this.setState({
        confirmLoading: true
      })
      ZPost('account/password', values, (s, d, m) => {
        this.hideModal()
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },

  hideModal() {
    this.props.dispatch({ type: 'PRINT_TYPE_DOGE_HIDE' })
    this.props.form.resetFields()
  },
  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form
    if (value) {
      validateFields(['reNewPwd'], { force: true })
    }
    callback()
  },
  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form
    if (value && value !== getFieldValue('newPwd')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  },
  render() {
    const { getFieldProps } = this.props.form
    const {visible, title} = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const oldPwdProps = getFieldProps('oldPwd', {
      rules: [
        { required: true, whitespace: true, message: '请填写旧密码' }
      ]
    })
    const newPwdProps = getFieldProps('newPwd', {
      rules: [
        { required: true, whitespace: true, min: 6, message: '请填写六位新密码' },
        { validator: this.checkPass }
      ]
    })
    const reNewPwdProps = getFieldProps('reNewPwd', {
      rules: [
        { required: true, whitespace: true, min: 6, message: '请再一次填写新密码' },
        { validator: this.checkPass2 }
      ]
    })
    return (
      <div>
        <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={this.state.confirmLoading} maskClosable={false} closable={false}>
          <Form horizontal>
            <FormItem {...formItemLayout} label='旧&nbsp;密码'>
              <Input {...oldPwdProps} type='password' autoComplete='off' onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
            </FormItem>
            <FormItem {...formItemLayout} label='新&nbsp;密码'>
              <Input {...newPwdProps} type='password' autoComplete='off' onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
            </FormItem>
            <FormItem {...formItemLayout} label='重输新密码'>
              <Input {...reNewPwdProps} type='password' placeholder='两次输入密码保持一致' autoComplete='off' onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
})

export default connect(state => ({
  doge: state.print_type_doge
}))(createForm()(WangWangWang))
