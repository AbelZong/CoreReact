import React from 'react'
import { Form, Input, Modal } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
const FormItem = Form.Item

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
        startLoading()
        ZGet({
          uri: 'print/tpl/sysesType',
          data: {
            id: nextProps.doge
          },
          success: (s, d, m) => {
            this.props.form.setFieldsValue(d)
            this.setState({
              title: `修改 [${d.id}]: ${d.name}`,
              visible: true,
              confirmLoading: false
            })
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
      const data = {
        name: values.name,
        presets: typeof values.presets === 'undefined' ? '' : values.presets,
        emu_data: typeof values.emu_data === 'undefined' ? '' : values.emu_data,
        setting: typeof values.setting === 'undefined' ? '' : values.setting
      }
      let uri = ''
      let isModify = false
      if (doge === 0) {
        uri = 'print/tpl/createSysesType'
      } else {
        uri = 'print/tpl/modifySysesType'
        data.id = doge
        isModify = true
      }
      ZPost(uri, data, (s, d, m) => {
        const dd = {
          id: d.id,
          name: d.name,
          type: d.type
        }
        if (isModify) {
          this.props.dispatch({type: 'SYSTYPES_MODIFY', modify: dd})
        } else {
          this.props.dispatch({type: 'SYSTYPES_UPDATE', update: {
            $push: [dd]
          }})
        }
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
