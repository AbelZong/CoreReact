import React from 'react'
import { Form, Input, Modal, Row, Col, Radio } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group

const DEFAULT_TITLE = '新建权限'
const shopmodify = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  //componentDidMount() {
    // ZGet('common/shopsite', (s, d, m) => {
    //   if (!this.ignore) {
    //     this.props.dispatch({type: 'SHOP_SITE_SET', payload: d})
    //   }
    // })
  //},
  componentWillReceiveProps(nextProps) {
    if (this.props.code !== nextProps.code) {
      this.props.form.setFieldsValue({
        token: nextProps.code
      })
    }
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          title: DEFAULT_TITLE,
          confirmLoading: false
        })
      } else if (nextProps.doge === 0) {
        this.setState({
          visible: true,
          confirmLoading: false
        })
      } else {
        this.setState({
          disable: true
        })
        startLoading()
        ZGet({
          uri: 'admin/powerQuery',
          data: {
            aid: nextProps.doge
          },
          success: ({d}) => {
            //console.log(d.Type, typeof d.Type)
            this.props.form.setFieldsValue({
              ID: d.ID,
              Name: d.Name,
              GroupName: d.GroupName,
              Title: d.Title,
              Remark: d.Remark,
              Type: `${d.Type}`
            })
            this.setState({
              title: `修改权限 ID: ${d.ID}`,
              visible: true,
              confirmLoading: false
            })
          },
          error: () => {
            this.props.dispatch({type: 'ACCESS_MODIFY_VISIABLE', payload: -1})
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
        uri = 'admin/createaccess'
      } else {
        uri = 'admin/modifyaccess'
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
  enableChange(checked) {
    if (checked) {
      this.setState({
        apienable: false
      })
    } else {
      this.setState({
        apienable: true
      })
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ACCESS_MODIFY_VISIABLE', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={780}>
        <Form horizontal className='pos-form'>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label='分组名称' >
                {getFieldDecorator('GroupName', {
                  rules: [
                    { required: true, message: '分组名称必填' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label='权限名称' >
                {getFieldDecorator('Name', {})(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label='标题' >
                {getFieldDecorator('Title', {
                  rules: [
                    { required: true, message: '标题不能为空' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label='权限类型' >
                {getFieldDecorator('Type', {
                  initialValue: '0'
                })(
                  <RadioGroup>
                    <Radio value='0'>A</Radio>
                    <Radio value='1'>B</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label='备注' >
                {getFieldDecorator('Remark', {})(
                  <Input type='text' placeholder='' />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.access_modify_visiable
}))(createForm()(shopmodify))
