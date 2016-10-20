import React from 'react'
import { Form, Input, Modal, Switch, Row, Col, Radio } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
const DEFAULT_TITLE = '创建新公司'
const RadioGroup = Radio.Group
export default connect(state => ({
  doge: state.admin_company_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
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
        if (nextProps.doge === 0) {
          this.setState({
            visible: true,
            title: DEFAULT_TITLE,
            confirmLoading: false
          })
        } else {
          startLoading()
          ZGet({
            uri: 'Company/GetCompanySingle',
            data: {
              id: nextProps.doge
            },
            success: ({d}) => {
              const dd = {}
              for (let i in d) {
                dd[`Com.${i}`] = d[i]
              }
              this.props.form.setFieldsValue(dd)
              this.setState({
                title: `修改公司 ID: ${d.ID}`,
                visible: true,
                confirmLoading: false
              })
            },
            error: () => {
              this.props.dispatch({type: 'ADMIN_COMPANY_VIS_SET', payload: -1})
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
      data.Company = ''
      let uri = ''
      if (doge === 0) {
        uri = 'Company/InsertCompany'
      } else {
        uri = 'Company/UpdateCompany'
        data.Com.id = doge
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
  hideModal() {
    this.props.dispatch({ type: 'ADMIN_COMPANY_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  renderUserForm() {
    if (this.props.doge === 0) {
      const {getFieldDecorator} = this.props.form
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
      return (
        <div>
          <div className='hr' />
          <h3 className='mb10'>主账号设置</h3>
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
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='邮箱'>
                {getFieldDecorator('Email', {
                  initialValue: ''
                })(
                  <Input type='email' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='QQ'>
                {getFieldDecorator('QQ', {
                  initialValue: ''
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='手机号'>
                {getFieldDecorator('Mobile', {
                  initialValue: '',
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='mobile' />
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      )
    }
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='公司名称'>
            {getFieldDecorator('Com.name', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ],
              initialValue: ''
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='公司地址'>
            {getFieldDecorator('Com.address', {
              initialValue: ''
            })(
              <Input type='url' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='公司邮箱'>
            {getFieldDecorator('Com.email', {
              initialValue: ''
            })(
              <Input type='email' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='联系人'>
            {getFieldDecorator('Com.contacts', {
              initialValue: ''
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='公司座机'>
            {getFieldDecorator('Com.telphone', {
              initialValue: ''
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='联系手机'>
            {getFieldDecorator('Com.mobile', {
              initialValue: ''
            })(
              <Input type='email' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='简介'>
            {getFieldDecorator('Com.remark', {
              initialValue: ''
            })(
              <Input type='textarea' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='是否启用'>
            {getFieldDecorator('Enable', {
              valuePropName: 'checked',
              initialValue: true
            })(
              <Switch />
            )}
          </FormItem>
          {this.renderUserForm()}
        </Form>
      </Modal>
    )
  }
})))
