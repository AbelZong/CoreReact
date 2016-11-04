/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-17 13:15:12
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Form, Input, Modal, Switch, Row, Col } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
export default connect(state => ({
  doge: state.company_client_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
    }
  },
  componentWillReceiveProps(nextProps) {
    ZPost('ScoCompany/GetScoCompanyAll')
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
            uri: 'ScoCompany/ScoCompanySingle',
            data: {
              id: nextProps.doge
            },
            success: ({d}) => {
              d.typelist = d.typelist ? d.typelist.split(',') : ''
              this.props.form.setFieldsValue(d)
              this.setState({
                title: `修改客户 ID: ${d.id}`,
                visible: true,
                confirmLoading: false
              })
            },
            error: () => {
              this.props.dispatch({type: 'COMPANY_CLIENT_VIS_SET', payload: -1})
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
        uri = 'XyComm/Brand/InsertBrand'
      } else {
        uri = 'XyComm/Brand/UpdateBrand'
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
  hideModal() {
    this.props.dispatch({ type: 'COMPANY_CLIENT_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    const formItemLayout2 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={780} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='公司简称'>
                {getFieldDecorator('scosimple', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='全称'>
                {getFieldDecorator('sconame', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' placeholder='填写公司完整名称' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='是否启用'>
                {getFieldDecorator('enable', {
                  valuePropName: 'checked',
                  initialValue: true
                })(
                  <Switch />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='公司编号'>
                {getFieldDecorator('scocode')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className='hr' />
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='所属国家'>
                {getFieldDecorator('country', {
                  initialValue: '中国'
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='公司地址'>
                {getFieldDecorator('address')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='联系人'>
                {getFieldDecorator('contactor')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='固定电话'>
                {getFieldDecorator('tel')(
                  <Input type='tel' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='手机号码'>
                {getFieldDecorator('phone')(
                  <Input type='mobile' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='传真'>
                {getFieldDecorator('fax')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='邮箱'>
                {getFieldDecorator('email')(
                  <Input type='email' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='官网地址'>
                {getFieldDecorator('url')(
                  <Input type='url' placeholder='http://****.*** 或 https://****.***' />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className='hr' />
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='税号'>
                {getFieldDecorator('taxid')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='公司类别'>
                {getFieldDecorator('typelist')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem {...formItemLayout2} label='开户银行'>
                {getFieldDecorator('bank')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem {...formItemLayout} label='开户账号'>
                {getFieldDecorator('bankid')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout1} label='备注'>
            {getFieldDecorator('remark')(
              <Input type='textarea' autosize={{ minRows: 2, maxRows: 5 }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
const DEFAULT_TITLE = '创建新客户'
