import React from 'react'
import {connect} from 'react-redux'
import {ZGet} from 'utils/Xfetch'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import Areas from 'json/AreaCascader'
import {Form, Switch, Input, Cascader, Col, Button} from 'antd'
const createForm = Form.create
const FormItem = Form.Item
const Main = React.createClass({
  getInitialState: function() {
    return {
      s2_enabled: true,
      s4_enabled: true
    }
  },
  componentDidMount() {
    this.refreshDataCallback()
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    ZGet('Warehouse/GetWarehouseList', ({d}) => {
      const dd = d[0]
      const p1 = Areas.filter(x => x.label === dd.logistics)[0]
      const p2 = dd.city && p1 ? p1.children.filter(x => x.label === dd.city)[0] : null
      const p3 = dd.district && p2 ? p2.children.filter(x => x.label === dd.district)[0] : null
      const s8 = []
      if (p1) {
        s8.push(p1.value)
      }
      if (p2) {
        s8.push(p2.value)
      }
      if (p3) {
        s8.push(p3.value)
      }
      this.props.form.setFieldsValue({
        //s1:
      })
    })
  },
  handleSwitch3(e) {
    this.setState({
      s2_enabled: e
    })
  },
  handleSwitch5(e) {
    this.setState({
      s4_enabled: e
    })
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!')
        return
      }
      console.log(values)
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    return (
      <div className={styles.main}>
        <Form horizontal>
          <FormItem {...formItemLayout} label='销售主仓库名称'>
            <Col span='6'>
              <FormItem>
                {getFieldDecorator('s1', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col span='18'>
              <span className='ml10 hide'>设定主仓仓位</span>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='销售退货仓库名称'>
            <Col span='6'>
              <FormItem>
                {getFieldDecorator('s2', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' disabled={!this.state.s2_enabled} />
                )}
              </FormItem>
            </Col>
            <Col span='18'>
              <div className='ml10 hide'>
                <FormItem>
                  {getFieldDecorator('s3', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(
                    <Switch size='small' onChange={this.handleSwitch3} />
                  )}
                  <span className='ml10 hide'>设定销退仓仓位</span>
                </FormItem>
              </div>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='进货仓库名称'>
            <Col span='6'>
              <FormItem>
                {getFieldDecorator('s4', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' disabled={!this.state.s4_enabled} />
                )}
              </FormItem>
            </Col>
            <Col span='18'>
              <div className='ml10 hide'>
                <FormItem>
                  {getFieldDecorator('s5', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(
                    <Switch size='small' onChange={this.handleSwitch5} />
                  )}
                  <span className='ml10 hide'>设定进货仓仓位</span>
                </FormItem>
              </div>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='次品仓库名称'>
            <Col span='6'>
              <FormItem>
                {getFieldDecorator('s6', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col span='18'>
              <span className='ml10 hide'>设定次品仓仓位</span>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='仓库联系人'>
            <Col span='6'>
              <FormItem>
                {getFieldDecorator('s7')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='联系人电话'>
            <Col span='6'>
              <FormItem>
                {getFieldDecorator('s8')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='仓库地址'>
            <Col span='7'>
              <FormItem>
                {getFieldDecorator('s9')(
                  <Cascader options={Areas} placeholder='选择省/市/区' />
                )}
              </FormItem>
            </Col>
            <Col span='9'>
              <div className='ml10'>
                <FormItem>
                  {getFieldDecorator('s10')(
                    <Input type='text' placeholder='详细地址' />
                  )}
                </FormItem>
              </div>
            </Col>
            <Col span='8'>
              <span className='ml10 hide'>设置菜鸟发货地址</span>
            </Col>
          </FormItem>
          <FormItem>
            <Col span='7' offset='3'>
              <Button type='primary' onClick={this.handleSubmit}>确认</Button>
              &nbsp;&nbsp;&nbsp;
              <Button type='ghost' onClick={this.handleReset}>重置</Button>
            </Col>
          </FormItem>
        </Form>
      </div>
    )
  }
})

export default connect(state => ({
  conditions: state.admin_brands_filter_conditions
}))(createForm()(Wrapper(Main)))
