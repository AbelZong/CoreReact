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
import { Form, Input, Modal } from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
import AppendProduct from 'components/SkuPicker/append'
const DEFAULT_TITLE = '生成'

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
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      ZPost('XyCore/Inventory/UptInvMainLstVirtualQty', vs, () => {
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
    this.props.dispatch({ type: 'STOCK_VIRTUAL_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  handleAppend(lst) {
    if (lst && lst instanceof Array && lst.length) {
      const SkuIDLst = lst.map(x => x.ID)
      this.props.form.setFieldsValue({IDLst: SkuIDLst})
    }
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
          <FormItem {...formItemLayout} label='商品编码'>
            {getFieldDecorator('IDLst')(
              <Input type='textarea' rows={1} />
            )}
            <AppendProduct onChange={this.handleAppend} />
          </FormItem>
          <FormItem {...formItemLayout} label='虚拟数量'>
            {getFieldDecorator('VirtualQty', {
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
  doge: state.stock_virtual_vis
}))(createForm()(WangWangWang))
