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
import { Form, Select, Modal, Checkbox } from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'

const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
const DEFAULT_TITLE = '限定生成任务的店铺'

const LimitShopModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      dataList: [],
      title: DEFAULT_TITLE,
      shopDefault: true,
      exDefault: true,
      limitM: 1,
      orderDefault: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else if (nextProps.doge === 1) {
        ZGet('Batch/GetConfigure', {
          Type: 'F'
        }, (r) => {
          ZGet({
            uri: 'Common/GetExpressList',
            success: ({d}) => {
              const lst = d && d instanceof Array ? d : []
              this.props.form.setFieldsValue({Exid: r.d === 'A' ? [] : r.d.split(',')})
              this.setState({
                dataList: lst,
                visible: true,
                title: DEFAULT_TITLE,
                confirmLoading: false,
                limitM: nextProps.doge,
                exDefault: r.d === 'A'
              })
            }
          })
        })
      } else if (nextProps.doge === 2) {
        ZGet('Batch/GetConfigure', {
          Type: 'G'
        }, (r) => {
          ZGet({
            uri: 'Shop/getShopEnum',
            success: ({d}) => {
              const lst = d && d instanceof Array ? d : []
              this.props.form.setFieldsValue({Shopid: r.d === 'A' ? [] : r.d.split(',')})
              this.setState({
                dataList: lst,
                visible: true,
                title: DEFAULT_TITLE,
                confirmLoading: false,
                limitM: nextProps.doge,
                shopDefault: r.d === 'A'
              })
            }
          })
        })
      } else if (nextProps.doge === 3) {
        ZGet('Batch/GetConfigure', {
          Type: 'H'
        }, ({d}) => {
          this.setState({
            visible: true,
            title: DEFAULT_TITLE,
            confirmLoading: false,
            limitM: nextProps.doge,
            orderDefault: d
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
      let uri = ''
      let data = {}
      switch (this.state.limitM) {
        case 1:
          {
            uri = 'Batch/SetConfigure'
            data = {Type: 'F', TypeValue: this.state.exDefault ? 'A' : vs.Exid.join(',')}
            break
          }
        case 2:
          {
            uri = 'Batch/SetConfigure'
            data = {Type: 'G', TypeValue: this.state.exDefault ? 'A' : vs.Shopid.join(',')}
            break
          }
        case 3:
          {
            uri = 'Batch/SetConfigure'
            data = {Type: 'H', TypeValue: this.state.orderDefault}
            break
          }
        default:
          break
      }
      ZPost(uri, data, () => {
        this.hideModal()
      })
    })
  },
  handleChange(e) {
    switch (this.state.limitM) {
      case 1:
        {
          const flag = e.target.value === undefined ? this.state.exDefault : e.target.value
          this.setState({
            exDefault: !flag
          })
          break
        }
      case 2:
        {
          const flag = e.target.value === undefined ? this.state.shopDefault : e.target.value
          this.setState({
            shopDefault: !flag
          })
          break
        }
      case 3:
        {
          const flag = e.target.value === undefined ? this.state.orderDefault : e.target.value
          this.setState({
            orderDefault: !flag
          })
          break
        }
      default:
        break
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_LIMIT_SET_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const {visible, title, confirmLoading, dataList, limitM} = this.state
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={480} maskClosable>
        <Form horizontal className={`pos-form`}>
          <FormItem {...formItemLayout} label='' style={{display: limitM === 1 ? 'block' : 'none'}}>
            {getFieldDecorator('DefaultShop')(
              <Checkbox checked={this.state.exDefault} onChange={this.handleChange} >全部快递公司（如果选择该项，以下选择无效））</Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='' style={{display: limitM === 1 ? 'block' : 'none'}}>
            {getFieldDecorator('Exid')(
              <Select multiple placeholder='请选择' disabled={this.state.exDefault}>
                {dataList.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='' style={{display: limitM === 2 ? 'block' : 'none'}}>
            {getFieldDecorator('DefaultShop')(
              <Checkbox checked={this.state.shopDefault} onChange={this.handleChange} >所有店铺，即不限定店铺（选定该项，以下选择无效）</Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='' style={{display: limitM === 2 ? 'block' : 'none'}}>
            {getFieldDecorator('Shopid')(
              <Select multiple placeholder='请选择' disabled={this.state.shopDefault}>
                {dataList.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='' style={{display: limitM === 3 ? 'block' : 'none'}}>
            {getFieldDecorator('DefaultShop')(
              <Checkbox checked={this.state.orderDefault} onChange={this.handleChange} >排除有特殊单标识的订单</Checkbox>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.pb_limit_set_vis
}))(createForm()(LimitShopModal))
