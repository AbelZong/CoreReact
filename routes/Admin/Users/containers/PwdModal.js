import React from 'react'
import { Form, Input, Modal } from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
const createForm = Form.create
const FormItem = Form.Item

const Huaer = React.createClass({
  getInitialState() {
    return {
      confirmLoading: false
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      ZPost('XyUser/User/ModifyPassWord', {
        ID: this.props.doge,
        newPwd: values.newPwd
      }, (s, d, m) => {
        this.hideModal()
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  checkPwd(rule, value, callback) {
    if (value) {
      if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return callback('必须包含数字和字母')
      }
    }
    callback()
  },
  hideModal() {
    this.props.dispatch({ type: 'ADMIN_USERS_PWDMOD_VIS_SET', payload: false })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {doge} = this.props
    const visible = doge > 0
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return (
      <Modal title='修改密码' visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={this.state.confirmLoading}>
        <Form horizontal>
          <FormItem {...formItemLayout} label='新密码'>
            {getFieldDecorator('newPwd', {
              rules: [
                { required: true, whitespace: true, message: '必填' },
                { validator: this.checkPwd }
              ]
            })(
              <Input type='password' autoComplete='off' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.admin_users_pwdmod_vis
}))(createForm()(Huaer))
