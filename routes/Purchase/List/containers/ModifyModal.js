import React from 'react'
import { InputNumber, Form, Input, Modal, Cascader, DatePicker, Radio, Alert } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
import WareHousePicker from 'components/WareHousePicker'
import SupplierPicker from 'components/SupplierPicker'
const RadioGroup = Radio.Group
import Areas from 'json/AreaCascader'
const DEFAULT_TITLE = '创建新采购单'
import moment from 'moment'
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
          uri: 'Purchase/PurchaseSingle',
          data: {
            ID: nextProps.doge
          },
          success: ({d}) => {
            const p1 = Areas.filter(x => x.label === d.shplogistics)[0]
            const p2 = d.shpcity && p1 ? p1.children.filter(x => x.label === d.shpcity)[0] : null
            const p3 = d.shpdistrict && p2 ? p2.children.filter(x => x.label === d.shpdistrict)[0] : null
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
            this.props.form.setFieldsValue({s1: moment(d.purchasedate), s2: d.purtype + '', s3: {id: d.scoid, name: d.sconame}, s4: d.taxrate, s5: {id: d.warehouseid, name: d.warehousename}, s6: d.contract, s7: d.remark, s9: d.shpaddress, s8})
            this.setState({
              title: `修改采购单：[${d.id}]`,
              visible: true,
              confirmLoading: false
            })
          },
          error: () => {
            this.props.dispatch({type: 'PUR_NEW_VIS_SET', payload: -1})
          }
        }).then(endLoading)
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const {doge} = this.props
      const p1 = Areas.filter(x => x.value === vs.s8[0])[0]
      const p2 = vs.s8[1] ? p1.children.filter(x => x.value === vs.s8[1])[0] : null
      const p3 = vs.s8[2] && p2 ? p2.children.filter(x => x.value === vs.s8[2])[0] : null
      const data = {purchasedate: vs.s1 ? vs.s1.format() : '', purtype: vs.s2 || '0', scoid: vs.s3 && vs.s3.id ? vs.s3.id : '0', sconame: vs.s3 && vs.s3.name ? vs.s3.name : '', taxrate: vs.s4 || '', warehouseid: vs.s5 && vs.s5.id ? vs.s5.id : '0', warehousename: vs.s5 && vs.s5.name ? vs.s5.name : '', shpaddress: vs.s9 || '', shplogistics: p1.label, shpcity: p2 ? p2.label : '', shpdistrict: p3 ? p3.label : '', contract: vs.s6 || '', remark: vs.s7 || '', status: 0, buyyer: ''}
      let uri = ''
      if (doge === 0) {
        uri = 'Purchase/InsertPur'
        data.id = 0
      } else {
        uri = 'Purchase/UpdatePur'
        data.id = doge
      }
      ZPost(uri, {
        Pur: data
      }, () => {
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
    this.props.dispatch({ type: 'PUR_NEW_VIS_SET', payload: -1 })
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
          <FormItem {...formItemLayout} label='采购日期'>
            {getFieldDecorator('s1', {
              rules: [
                { required: true, type: 'object', message: '必填' }
              ]
            })(
              <DatePicker />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='商品类型'>
            {getFieldDecorator('s2', {
              initialValue: '0'
            })(
              <RadioGroup>
                <Radio key='0' value='0'>成品</Radio>
                <Radio key='1' value='1'>组合商品</Radio>
                <Radio key='3' value='3'>非成品</Radio>
                <Radio key='2' value='2'>原物料</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='供应商'>
            {getFieldDecorator('s3', {
              rules: [
                { required: true, type: 'object', message: '必选' }
              ]
            })(
              <SupplierPicker size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='税率'>
            {getFieldDecorator('s4')(
              <InputNumber min={0} max={100} size='small' />
            )}
            <div style={{display: 'inline-block'}}>
              <Alert message='百分几就填几，如：12% 就填写 12' type='info' banner />
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label='存储方'>
            {getFieldDecorator('s5')(
              <WareHousePicker size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='合同条款'>
            {getFieldDecorator('s6')(
              <Input type='textarea' autosize={{minRows: 3, maxRows: 6}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='备注'>
            {getFieldDecorator('s7')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='收货地址'>
            {getFieldDecorator('s8', {
              rules: [{ required: true, type: 'array', message: '必填' }]
            })(
              <Cascader style={{width: '50%'}} options={Areas} placeholder='选择省/市/区' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='详细地址'>
            {getFieldDecorator('s9', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input placeholder='小区、街道、楼门牌号等' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.pur_new_vis
}))(createForm()(WangWangWang))
