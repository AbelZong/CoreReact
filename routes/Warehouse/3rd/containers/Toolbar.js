import React from 'react'
import {connect} from 'react-redux'
import styles from './index.scss'
import {Button, Menu, Dropdown, Popconfirm, Checkbox, Form, Modal, Input} from 'antd'
import {ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
const DB = Dropdown.Button
const Toolbar = React.createClass({
  getInitialState: function() {
    return {
      contains: ['1', '2'],
      status: ['1', '2']
    }
  },
  componentDidMount() {
    requestAnimationFrame(this.handleSearch)
  },
  handleCreate() {
    this.props.dispatch({type: 'WAREHOUSE_CREATE_VIS_SET', payload: 1})
  },
  handleCreate1(e) {
    console.log(e.key)
  },
  handleSelect2(value) {
    this.setState({
      enabled: value
    })
  },
  handleSearch() {
    this.props.dispatch({type: 'WAREHOUSE_FILTER_CONDITIONS_SET', payload: this.state})
  },
  handleSearch1(e) {
    this.setState({
      contains: e
    }, this.handleSearch)
  },
  handleSearch2(e) {
    this.setState({
      status: e
    }, this.handleSearch)
  },
  render() {
    const {ssNO} = this.props
    const confirm = () => {}
    return (
      <div className={styles.toolbars}>
        <div className={styles.conditionsForm}>
          <div className='pull-right'>
            <Button.Group>
              <Popconfirm placement='left' title={<div>
                我的服务号是：<span style={{color: 'red', border: '1px dashed #f5f5f5', padding: '2px 5px'}}>{ssNO}</span>
              </div>} onConfirm={confirm} okText='重新生成' cancelText='关闭'>
                <Button type='dashed' size='small'>生成服务号</Button>
              </Popconfirm>
              <DB onClick={this.handleCreate} overlay={(<Menu onClick={this.handleCreate1}>
                <Menu.Item key='2'>申请加入仓储服务</Menu.Item>
                <Menu.Item key='1'>第三仓储服务设置</Menu.Item>
                <Menu.Item key='3'>订单分配策略</Menu.Item>
              </Menu>)} type='ghost' size='small'>
                开通分仓
              </DB>
            </Button.Group>
          </div>
          <div className={styles.searchZhang}>
            <Checkbox.Group options={[
                { label: '我的分仓', value: '1' },
                { label: '我是分仓', value: '2' }
            ]} defaultValue={this.state.contains} onChange={this.handleSearch1} />
            <Checkbox.Group options={[
                { label: '申请中', value: '1' },
                { label: '生效', value: '2' },
                { label: '已终止', value: '3' }
            ]} defaultValue={this.state.status} onChange={this.handleSearch2} />
          </div>
        </div>
        <Modal1 />
      </div>
    )
  }
})
export default connect(state => ({
  ssNO: state.warehouse_ssNO_vis
}))(Toolbar)
const Modal1 = connect(state => ({
  vis: state.warehouse_create_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.vis !== nextProps.vis) {
      if (nextProps.vis < 1) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else {
        this.setState({
          visible: true,
          confirmLoading: false
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
      ZPost('Warehouse/openOtherWare', values, () => {
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
    this.props.dispatch({ type: 'WAREHOUSE_CREATE_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title='开通分仓' visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={480} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='仓库名称'>
            {getFieldDecorator('warename', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='仓库管理员昵称'>
            {getFieldDecorator('wareadmin', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='创建登陆账号'>
            {getFieldDecorator('username', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='登陆密码'>
            {getFieldDecorator('pwd', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='password' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
