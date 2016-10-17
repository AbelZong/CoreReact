import React from 'react'
import {Modal, Checkbox, Radio, Form, Input, Button} from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
import store from 'utils/store'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create

const SELECT_LV = 'msg.selectlv'
const SEL_ROLE = 'msg.roletype'
const roletype = [
  { label: '系统管理员', value: '1' },
  { label: '公司管理员', value: '3' },
  { label: '测试角色', value: '4' },
  { label: '仓库管理员', value: '7' }
]

let defaultlv = store.get(SELECT_LV, '0')
let defaultRole = store.get(SEL_ROLE, [])

let NoticeAdd = React.createClass({

  getInitialState() {
    return {
      loading: false,
      NoticeAddVisible: false
    }
  },
  componentDidMount() {
  },
  componentWillUnmount() {
  },
  handleLevels(e) {
    defaultlv = e.target.value
    store.set(SELECT_LV, defaultlv)
  },
  handleRole(checkedValues) {
    store.set(SEL_ROLE, checkedValues)
  },
  handleOk() {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false })
      this.props.dispatch({ type: 'NOTICE_ADD_REVER' }, false)
    }, 3000)
  },
  handleCancel() {
    this.setState({ loading: false })
    this.props.dispatch({ type: 'NOTICE_ADD_REVER' }, false)
  },
  handleSubmit(e) {
    e.preventDefault()
    this.setState({ loading: true })
    ZPost('profile/msgadd', this.props.form.getFieldsValue(), ({s}) => {
      if (s === 1) {
        this.setState({ loading: false })
        this.props.dispatch({ type: 'NOTICE_ADD_REVER' }, false)
        this.props.research()
      }
    })
  },
  render() {
    const {NoticeAddVisible} = this.props
    const {getFieldProps} = this.props.form
    return (
      <Modal wrapClassName='modalMiddle' title='新消息' visible={NoticeAddVisible} onCancel={this.handleCancel} footer={[
        <Button key='back' type='ghost' size='large' onClick={this.handleCancel}>返 回</Button>,
        <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleSubmit} > 提 交 </Button>
      ]}
      >
        <Form horizontal >
          <FormItem
            id='control-textarea'
            label='文本域'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Input type='textarea' id='control-textarea' rows='3' {...getFieldProps('content', { })} />
          </FormItem>
          <FormItem label='优先级' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
            <RadioGroup onChange={this.handleLevels} defaultValue={defaultlv} {...getFieldProps('level', { })}>
              <Radio key='0' value={0}>不重要</Radio>
              <Radio key='1' value={1}>普通</Radio>
              <Radio key='2' value={2}>重要</Radio>
              <Radio key='3' value={3}>严重</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label='接受者' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <CheckboxGroup options={roletype} defaultValue={defaultRole} onChange={this.handleRole} {...getFieldProps('roletype', { })} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
})
NoticeAdd = createForm()(NoticeAdd)

export default connect(state => ({
  NoticeAddVisible: state.notice_add
}))(NoticeAdd)
