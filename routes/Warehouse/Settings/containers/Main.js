/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-01 08:43:34
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import Areas from 'json/AreaCascader'
import {
  Form,
  Switch,
  Input,
  Cascader,
  Col,
  Button
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
const createForm = Form.create
const FormItem = Form.Item
export default createForm()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      s2_enabled: true,
      s4_enabled: true,
      confirmLoading: false
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
    startLoading()
    this.setState({
      confirmLoading: true
    })
    ZGet('Warehouse/GetWarehouseList', ({d}) => {
      // const dd = d[0]
      // const p1 = Areas.filter(x => x.label === dd.logistics)[0]
      // const p2 = dd.city && p1 ? p1.children.filter(x => x.label === dd.city)[0] : null
      // const p3 = dd.district && p2 ? p2.children.filter(x => x.label === dd.district)[0] : null
      // const s8 = []
      // if (p1) {
      //   s8.push(p1.value)
      // }
      // if (p2) {
      //   s8.push(p2.value)
      // }
      // if (p3) {
      //   s8.push(p3.value)
      // }
      this.props.form.setFieldsValue({
        s1: d.name1,
        s2: d.name3,
        s4: d.name4,
        s6: d.name5,
        s7: d.contract,
        s8: d.phone,
        s9: d.area,
        s10: d.address
      })
    }).then(() => {
      endLoading()
      this.setState({
        confirmLoading: false
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
        return
      }
      startLoading()
      this.setState({
        confirmLoading: true
      })
      ZPost('Warehouse/UpdateWarehouse', {
        name1: values.s1,
        name3: values.s2,
        name4: values.s4,
        name5: values.s6,
        contract: values.s7,
        phone: values.s8,
        area: values.s9,
        address: values.s10
      }).then(() => {
        endLoading()
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    return (
      <div className={styles.main}>
        <div style={{marginTop: '2em'}} />
        <Form horizontal className='pos-form'>
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
          <div className='hr' />
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
            <Col span='12'>
              <div className='ml10'>
                <FormItem>
                  {getFieldDecorator('s10')(
                    <Input type='text' placeholder='详细地址' />
                  )}
                </FormItem>
              </div>
            </Col>
            <Col span='5'>
              <span className='ml10 hide'>设置菜鸟发货地址</span>
            </Col>
          </FormItem>
          <div style={{marginBottom: '1em'}} className='clearfix' />
          <FormItem>
            <Col span='7' offset='6'>
              <Button onClick={this.handleReset}>重置</Button>
              &nbsp;&nbsp;&nbsp;
              <Button type='primary' onClick={this.handleSubmit} loading={this.state.confirmLoading}>保存设定</Button>
            </Col>
          </FormItem>
        </Form>
      </div>
    )
  }
})))
