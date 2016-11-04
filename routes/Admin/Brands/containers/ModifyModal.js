/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 14:29:47
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Form, Input, Modal, Switch } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
const DEFAULT_TITLE = '创建新品牌'
export default connect(state => ({
  doge: state.admin_brand_vis
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
            uri: 'XyComm/Brand/BrandEdit',
            data: {
              id: nextProps.doge
            },
            success: ({d}) => {
              this.props.form.setFieldsValue({
                id: d.ID,
                Name: d.Name,
                Enable: d.Enable,
                Intro: d.Intro,
                Link: d.Link
              })
              this.setState({
                title: `修改品牌 ID: ${d.ID}`,
                visible: true,
                confirmLoading: false
              })
            },
            error: () => {
              this.props.dispatch({type: 'ADMIN_BRAND_VIS_SET', payload: -1})
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
    this.props.dispatch({ type: 'ADMIN_BRAND_VIS_SET', payload: -1 })
    this.props.form.resetFields()
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
          <FormItem {...formItemLayout} label='品牌名称'>
            {getFieldDecorator('Name', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='简介'>
            {getFieldDecorator('Intro')(
              <Input type='textarea' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='官网地址'>
            {getFieldDecorator('Link')(
              <Input type='url' />
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
        </Form>
      </Modal>
    )
  }
})))
