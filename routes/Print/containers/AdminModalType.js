import React from 'react'
import { Form, Input, Modal } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
const createForm = Form.create
const FormItem = Form.Item
// function noop() {
//   return false
// }

const DEFAULT_TITLE = '创建新类型'
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
        ZGet({
          uri: 'print/tpl/sysestype',
          success: (s, d, m) => {
            // this.setState({
            //
            // })
          }
        })
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
      const data = {
        id: doge > 0 ? doge : 0,
        name: values.name,
        presets: typeof values.presets === 'undefined' ? '' : values.presets,
        emu_data: typeof values.emu_data === 'undefined' ? '' : values.emu_data,
        setting: typeof values.setting === 'undefined' ? '' : values.setting
      }
      ZPost('print/tpl/savesysestype', data, (s, d, m) => {
        console.log(d)
        this.props.dispatch({type: 'SYSTYPES_UPDATE', update: {
          $push: [{
            id: d.id,
            name: d.name,
            type: d.type
          }]
        }})
        this.hideModal()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },

  hideModal() {
    this.props.dispatch({ type: 'PRINT_TYPE_DOGE_HIDE' })
    this.props.form.resetFields()
  },
  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form
    if (value) {
      validateFields(['reNewPwd'], { force: true })
    }
    callback()
  },
  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form
    if (value && value !== getFieldValue('newPwd')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  },
  render() {
    const { getFieldProps } = this.props.form
    const {visible, title} = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const propsName = getFieldProps('name', {
      rules: [
        { required: true, message: '名称必填' }
      ]
    })
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={this.state.confirmLoading} width={780} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          {this.props.doge > 0 && (
            <FormItem {...formItemLayout} label='模板编号'>
              <p className='ant-form-text'>自动生成</p>
            </FormItem>
          )}
          <FormItem {...formItemLayout} label='类型名称'>
            <Input {...propsName} type='text' />
          </FormItem>
          <FormItem {...formItemLayout} label='预设元素'>
            <Input {...getFieldProps('presets')} type='textarea' autosize={{minRows: 2, maxRows: 8}} />
          </FormItem>
          <FormItem {...formItemLayout} label='预演数据'>
            <Input {...getFieldProps('emu_data')} type='textarea' autosize={{minRows: 2, maxRows: 8}} />
          </FormItem>
          <FormItem {...formItemLayout} label='模板设置'>
            <Input {...getFieldProps('setting')} type='textarea' autosize={{minRows: 1, maxRows: 3}} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.print_type_doge
}))(createForm()(WangWangWang))
