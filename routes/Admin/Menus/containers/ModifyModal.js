/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 10:57:32
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { InputNumber, Form, Input, Modal, Col } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
const InputGroup = Input.Group
import ModifyMenusTree from './ModifyMenusTree'

const DEFAULT_TITLE = '创建新菜单'
const WangWangWang = React.createClass({
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
      } else if (nextProps.doge === 0) {
        this.setState({
          visible: true,
          title: DEFAULT_TITLE,
          confirmLoading: false
        })
      } else {
        startLoading()
        ZGet({
          uri: 'admin/onemenu',
          data: {
            id: nextProps.doge
          },
          success: ({d}) => {
            this.props.form.setFieldsValue({
              id: d.id,
              iconName: d.icon[0],
              iconPrefix: d.icon[1],
              name: d.name,
              order: d.order,
              pid: d.parentid > 0 ? d.parentid + '' : undefined,
              remark: d.remark,
              router: d.router,
              access: d.access
            })
            this.setState({
              title: `修改 [${d.id}]: ${d.name}`,
              visible: true,
              confirmLoading: false
            })
          },
          error: () => {
            this.props.dispatch({type: 'ADMIN_MENUS_MODAL_VIS_SET', payload: -1})
          }
        }).then(endLoading)
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
        uri = 'admin/createmenus'
      } else {
        uri = 'admin/modifymenus'
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
    this.props.dispatch({ type: 'ADMIN_MENUS_MODAL_VIS_SET', payload: -1 })
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
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={780} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='上级菜单'>
            {getFieldDecorator('pid')(
              <ModifyMenusTree />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='菜单名称'>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '名称必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='前端路由'>
            {getFieldDecorator('router', {
              rules: [
                { required: true, message: '路由必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='显示图标'>
            <InputGroup>
              <Col span='5'>
                <FormItem>
                  {getFieldDecorator('iconName')(
                    <Input type='text' />
                  )}
                </FormItem>
              </Col>
              <Col span='5'>
                <FormItem>
                  {getFieldDecorator('iconPrefix')(
                    <Input addonBefore='前缀' type='text' />
                  )}
                </FormItem>
              </Col>
            </InputGroup>
          </FormItem>
          <FormItem {...formItemLayout} label='访问权限'>
            null
          </FormItem>
          <FormItem {...formItemLayout} label='排序'>
            {getFieldDecorator('order', {
              initialValue: 0
            })(
              <InputNumber min={1} size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='备注'>
            {getFieldDecorator('remark')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.admin_menus_modal_vis
}))(createForm()(WangWangWang))
