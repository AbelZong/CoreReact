/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-21 09:57:12
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  Form,
  Input,
  Modal,
  Switch,
  Select
} from 'antd'
import styles from './index.scss'
import {
  connect
} from 'react-redux'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import EE from 'utils/EE'
import {
  startLoading,
  endLoading
} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option

const DEFAULT_TITLE = '新增打印机'
export default connect(state => ({
  doge: state.printer_edit_vis
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
            uri: 'printer/getPrintQuery',
            data: {
              id: nextProps.doge
            },
            success: ({d}) => {
              const dd = {
                Name: d.Name,
                PrintType: d.PrintType.toString(),
                IPaddress: d.IPaddress,
                PrinterPort: d.PrinterPort,
                Enabled: d.Enabled
              }
              this.props.form.setFieldsValue(dd)
              this.setState({
                title: `修改打印机 ID: ${d.ID}`,
                visible: true,
                confirmLoading: false
              })
            },
            error: () => {
              this.props.dispatch({type: 'PRINTER_EDIT_VIS_SET', payload: -1})
            }
          }).then(endLoading)
        }
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, v) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const {doge} = this.props
      let data = {
        Name: v.Name,
        PrintType: v.PrintType,
        IPaddress: v.IPaddress ? v.IPaddress : '',
        PrinterPort: v.PrinterPort ? v.PrinterPort : 0,
        Enabled: v.Enabled
      }

      let uri = ''
      if (doge === 0) {
        uri = 'printer/createPrinter'
      } else {
        uri = 'printer/modifyPrinter'
        data = Object.assign({}, data, {ID: doge})
        console.log(data)
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
    this.props.dispatch({ type: 'PRINTER_EDIT_VIS_SET', payload: -1 })
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
          <FormItem {...formItemLayout} label='打印机名'>
            {getFieldDecorator('Name', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='打印机类型'>
            {getFieldDecorator('PrintType', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Select className={styles.s4} >
                <Option value='1' key={1}>箱码打印</Option>
                <Option value='2' key={2}>快递单打印</Option>
                <Option value='3' key={3}>件码打印</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='打印机IP'>
            {getFieldDecorator('IPaddress')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='打印机端口'>
            {getFieldDecorator('PrinterPort')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='是否启用'>
            {getFieldDecorator('Enabled', {
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
