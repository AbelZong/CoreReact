/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-12 10:16:04
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Form, Input, Modal, Select } from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
const DEFAULT_TITLE = '添加虚拟库存'

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
      } else {
        ZGet('XyCore/Inventory/InventorySingle', {ID: nextProps.doge}, ({d}) => {
          this.setState({
            visible: true,
            title: DEFAULT_TITLE,
            confirmLoading: false,
            ID: d.ID
          }, () => {
            this.props.form.setFieldsValue({InvQty: d.StockQty})
          })
        })
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      const data = {
        ID: this.state.ID,
        InvQty: vs.InvQty ? vs.InvQty : 0,
        Type: vs.Type ? vs.Type : 1
      }
      ZPost('XyCore/Inventory/UptStockQtySingle', data, () => {
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
    this.props.dispatch({ type: 'STOCK_FENINV_MOD_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  checkNum(rule, value, callback) {
    if (!/^(0|[1-9][0-9]*)$/.test(value) && value !== undefined && value !== '') {
      callback('请填写整数')
    } else {
      callback()
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
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='修改类型'>
            {getFieldDecorator('Type', {
              rules: [
                { required: true, message: '必填' }
              ]
            })(
              <Select style={{ width: 200 }} >
                <Option value='1'>盘点</Option>
                <Option value='2'>采购入库</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='数量'>
            {getFieldDecorator('InvQty', {
              rules: [
                { required: true, message: '必填' },
                { validator: this.checkNum }
              ]
            })(
              <Input style={{ width: 60 }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.stock_feninv_mod_vis
}))(createForm()(WangWangWang))
