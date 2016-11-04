/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 14:30:26
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Form, Input, Modal, Row, Col, Radio, Switch, Select } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

const DEFAULT_TITLE = '创建新用户'
const WangWangWang = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      roles: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else {
        ZGet({
          uri: 'role/rolelist',
          success: ({d}) => {
            this.setState({
              roles: d
            })
          }
        })
        if (nextProps.doge === 0) {
          this.setState({
            visible: true,
            title: DEFAULT_TITLE,
            confirmLoading: false
          })
        } else {
          startLoading()
          ZGet({
            uri: 'XyUser/User/UserEdit',
            data: {
              id: nextProps.doge
            },
            success: ({d}) => {
              this.props.form.setFieldsValue({
                id: d.ID,
                Account: d.Account,
                Name: d.Name,
                Enable: d.Enable,
                Email: d.Email,
                Gender: d.Gender,
                Mobile: d.Mobile,
                QQ: d.QQ,
                RoleID: d.RoleID + ''
              })
              this.setState({
                title: `修改用户 ID: ${d.ID}`,
                visible: true,
                confirmLoading: false
              })
            },
            error: () => {
              this.props.dispatch({type: 'ADMIN_USERS_MODAL_VIS_SET', payload: -1})
            }
          }).then(endLoading)
        }
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const {doge} = this.props
      const data = values
      let uri = ''
      if (doge === 0) {
        uri = 'XyUser/User/InsertUser'
      } else {
        uri = 'XyUser/User/UpdateUser'
        data.id = doge
      }
      ZPost(uri, data, () => {
        this.hideModal()
        EE.triggerRefreshMain()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  checkPwd(rule, value, callback) {
    const { getFieldValue } = this.props.form
    if (value) {
      if (value === getFieldValue('Account') || value === getFieldValue('Name')) {
        return callback('不能与账号或用户名相同')
      } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return callback('必须包含数字和字母')
      }
    }
    callback()
  },
  hideModal() {
    this.props.dispatch({ type: 'ADMIN_USERS_MODAL_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading, roles} = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={780} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='账号'>
                {getFieldDecorator('Account', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='用户名'>
                {getFieldDecorator('Name', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {this.props.doge === 0 && (
              <Col sm={12}>
                <FormItem {...formItemLayout} label='密码'>
                  {getFieldDecorator('Password', {
                    rules: [
                      { required: true, min: 6, message: '至少6位' },
                      { validator: this.checkPwd }
                    ]
                  })(
                    <Input type='password' />
                  )}
                </FormItem>
              </Col>
            )}
            <Col sm={12}>
              <FormItem {...formItemLayout} label='所属角色'>
                {getFieldDecorator('RoleID', {
                  rules: [
                    { required: true, message: '所属角色必填' }
                  ]
                })(
                  <Select placeholder='所属角色' style={{ width: '100%' }}>
                    {roles.length && roles.map((x) => {
                      return <Option value={`${x.id}`} key={x.id}>{x.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='性别'>
                {getFieldDecorator('Gender', {
                  initialValue: '男'
                })(
                  <RadioGroup>
                    <Radio value='男'>男</Radio>
                    <Radio value='女'>女</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='是否启用'>
                {getFieldDecorator('Enable', {
                  valuePropName: 'checked',
                  initialValue: true
                })(
                  <Switch disabled={this.props.doge > 0} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='邮箱'>
                {getFieldDecorator('Email')(
                  <Input type='email' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='QQ'>
                {getFieldDecorator('QQ')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='手机号'>
                {getFieldDecorator('Mobile', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='mobile' />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.admin_users_modal_vis
}))(createForm()(WangWangWang))
