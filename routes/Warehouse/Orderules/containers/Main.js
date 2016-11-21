/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-05 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import WareHousePicker from 'components/WareHouse2Picker'
import EE from 'utils/EE'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import {
  Form,
  Select,
  Input,
  Col,
  Button,
  InputNumber,
  Radio,
  Row
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
export default connect(
  state => ({
    id: state.wher_ploys_vis
  })
)(createForm()(React.createClass({
  getInitialState: function() {
    return {
      s2_enabled: true,
      s4_enabled: true,
      confirmLoading: false,
      title: '',
      provinces: [],
      shops: [],
      distributors: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({
        title: nextProps.id > 0 ? `修改分仓策略` : '创建分仓策略',
        confirmLoading: false
      })
      if (nextProps.id > 0) {
        startLoading()
        this.setState({
          confirmLoading: true
        })
        ZGet('Warehouse/editploy', {id: nextProps.id}, ({d}) => {
          const {ploy, province, shop, distributor} = d
          this.setState({
            provinces: province,
            shops: shop,
            distributors: distributor
          })
          ploy.Payment = ploy.Payment + ''
          ploy.WareHouse = ploy.Wid >= 0 ? {
            id: ploy.Wid,
            name: ploy.Wname
          } : null
          this.props.form.setFieldsValue(ploy)
        }).then(() => {
          endLoading()
          this.setState({
            confirmLoading: false
          })
        })
      } else if (nextProps.id === 0) {
        this.props.form.resetFields()
        startLoading()
        ZGet('Warehouse/getPloySetting', ({d}) => {
          const {province, shop} = d
          this.setState({
            provinces: province,
            shops: shop,
            confirmLoading: false
          })
        }).then(endLoading)
      }
    }
  },
  componentWillUnmount() {
    this.ignore = true
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
      //console.log(values)
      if (errors) {
        return
      }
      const data = {
        Name: values.Name,
        Level: values.Level,
        Wid: values.WareHouse.id,
        Province: values.Province || [],
        Shopid: values.Shopid || [],
        ContainSkus: values.ContainSkus ? values.ContainSkus.split(/,|，/) : [],
        RemoveSkus: values.RemoveSkus ? values.RemoveSkus.split(/,|，/) : [],
        ContainGoods: values.ContainGoods ? values.ContainGoods.split(/,|，/) : [],
        RemoveGoods: values.RemoveGoods ? values.RemoveGoods.split(/,|，/) : [],
        Did: values.Did || [],
        MinNum: values.MinNum,
        MaxNum: values.MaxNum,
        Payment: values.Payment
      }
      let uri = 'Warehouse/createploy'
      if (this.props.id > 0) {
        data.ID = this.props.id
        uri = 'Warehouse/modifyploy'
      }
      startLoading()
      this.setState({
        confirmLoading: true
      })
      ZPost(uri, data, ({d}) => {
        EE.triggerRefreshMain()
        if (this.props.id === 0) {
          this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: d.ID})
        }
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
  _renderNull() {
    return <div />
  },
  // ckMinNum(rule, value, callback) {
  //
  // },
  // ckMaxNum(rule, value, callback) {
  //   const form = this.props.form
  //   console.log(value)
  //   if (value) {
  //     const min = form.getFieldValue('MinNum')
  //     form.validateFields(['confirm'], { force: true })
  //   }
  //   callback()
  // },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const radioStyle = {display: 'block'}
    const {title} = this.state
    return (
      <div className={`${styles.main} h-scroller`} style={{display: this.props.id === -1 ? 'none' : 'block'}}>
        <h3 className='mb15 tr mr25'>
          {title}
        </h3>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='策略名称'>
            {getFieldDecorator('Name', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' style={{maxWidth: 300}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='优先级'>
            {getFieldDecorator('Level', {
              initialValue: 1,
              rules: [
                {type: 'number', required: true}
              ]
            })(
              <InputNumber min={0} max={10} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='指定仓库'>
            {getFieldDecorator('WareHouse', {
              rules: [
                { required: true, type: 'object', message: '必选' }
              ]
            })(
              <WareHousePicker placeholder='仓库选择' withLocal />
            )}
          </FormItem>
          <div className='hr' />
          <FormItem {...formItemLayout} label='限定省份'>
            {getFieldDecorator('Province')(
              <Select multiple placeholder='请选择'>
                {this.state.provinces.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='限定店铺'>
            {getFieldDecorator('Shopid')(
              <Select multiple placeholder='请选择'>
                {this.state.shops.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='限定分销商'>
            {getFieldDecorator('Did')(
              <Select multiple placeholder='请选择'>
                {this.state.distributors.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='指定货款方式'>
            {getFieldDecorator('Payment', {
              initialValue: '1',
              rules: [
                { required: true, message: '必选' }
              ]
            })(
              <RadioGroup>
                <Radio style={radioStyle} key='1' value='1'>--不限定--</Radio>
                <Radio style={radioStyle} key='2' value='2'>限定货到付款</Radio>
                <Radio style={radioStyle} key='3' value='3'>排除货到付款（即限定在线支付或线下打款）</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <fieldset>
            <legend>限定商品</legend>
            <Row>
              <Col span={20} offset={4}>
                <div className='gray'>注意：逗号分隔，均不包含赠品</div>
              </Col>
            </Row>
            <FormItem {...formItemLayout} label='包含商品编码'>
              {getFieldDecorator('ContainSkus')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='排除商品编码'>
              {getFieldDecorator('RemoveSkus')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='包含商品货号'>
              {getFieldDecorator('ContainGoods')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='排除商品货号'>
              {getFieldDecorator('RemoveGoods')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='限定订单商品数量'>
              <Col span={5}>
                {getFieldDecorator('MinNum')(
                  <InputNumber placeholder='最少数量' min={0} />
                )}
              </Col>
              <Col span={1}>
                <div className='tc'>-</div>
              </Col>
              <Col span={5}>
                {getFieldDecorator('MaxNum')(
                  <InputNumber placeholder='最多数量' min={0} />
                )}
              </Col>
            </FormItem>
          </fieldset>
          <div style={{marginBottom: '1em'}} className='clearfix' />
          <FormItem>
            <Col span='7' offset='6'>
              <Button type='primary' onClick={this.handleSubmit} loading={this.state.confirmLoading}>保存设置</Button>
            </Col>
          </FormItem>
        </Form>
      </div>
    )
  }
})))
