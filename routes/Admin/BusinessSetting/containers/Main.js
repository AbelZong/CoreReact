import React from 'react'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {startLoading, endLoading} from 'utils'
import {
  Form,
  Checkbox,
  Button,
  Radio,
  InputNumber,
  message,
  Tooltip
} from 'antd'
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group
export default createForm()(Wrapper(React.createClass({
  getInitialState() {
    return {
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
    ZGet('Business/GetBusiness', ({d}) => {
      if (!this.ignore) {
        this.props.form.setFieldsValue(d.businessData)
        this.businessInitData = d.businessInitData
        this.setState({
          confirmLoading: false
        })
      }
    })
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true
      })
      ZPost('Business/UpdateBusiness', {Business: values}, () => {
        if (this.ignore) {
          return
        }
        message.success('更新成功')
        this.setState({
          confirmLoading: false
        })
      }, () => {
        if (this.ignore) {
          return
        }
        this.refreshDataCallback()
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    if (!this.businessInitData) {
      return message.error('获取默认数据故障，请刷新页面重试')
    }
    this.props.form.setFieldsValue(this.businessInitData)
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    const important = {color: 'red'}
    return (
      <div className={styles.main}>
        <Form horizontal className={`pos-form ${styles.compact}`}>
          <fieldset>
            <legend>订单属性</legend>
            <FormItem>
              {getFieldDecorator('ismergeorder', { valuePropName: 'checked' })(
                <Checkbox>下载订单时自动检测是否待合并订单并标记异常【等待订单合并】</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isautosetexpress', { valuePropName: 'checked' })(
                <Checkbox>审核确定订单时自动计算设置快递公司</Checkbox>
              )}
            </FormItem>
          </fieldset>
          <fieldset>
            <legend>库存属性</legend>
            <FormItem>
              {getFieldDecorator('isignoresku', { valuePropName: 'checked' })(
                <Checkbox>不限制库存就可以发货（在审核订单时订单不会因为缺货而拦截发货）</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isautogoodsreviewed', { valuePropName: 'checked' })(
                <Checkbox>系统审核判断缺货的订单在到货（或转正常单时）自动审核。<small className='gray'>（手工转缺货异常的订单不会自动审核）</small></Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isupdateskuall', { valuePropName: 'checked' })(
                <Checkbox>上传库存包括采购在途的商品</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isupdatepresalesku', { valuePropName: 'checked' })(
                <Checkbox>允许上传预售商品的库存(只对商品编码中使用预售字样的预售商品有效)</Checkbox>
              )}
            </FormItem>
            <div className='hr' />
            <FormItem {...formItemLayout} label='库存锁'>
              {getFieldDecorator('isskulock')(
                <RadioGroup>
                  <Radio value={1}>下单锁库存</Radio>
                  <Radio value={0}>付款锁库存</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <div className='hr' />
            <FormItem>
              {getFieldDecorator('ispresaleskulock', { valuePropName: 'checked' })(
                <Checkbox>预售锁定库存： 预售商品对应的订单当处于【<span style={important}>异常</span>】状态且异常类型为【<span style={important}>预售</span>】时，锁定库存</Checkbox>
              )}
            </FormItem>
          </fieldset>
          <fieldset>
            <legend>售后属性</legend>
            <FormItem>
              {getFieldDecorator('isautoremarks', { valuePropName: 'checked' })(
                <Checkbox>售后收到货自动上传备注</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isexceptions', { valuePropName: 'checked' })(
                <Checkbox>售后换货订单,确认时生成异常订单，异常类型【<span style={important}>等待售后收货</span>】</Checkbox>
              )}
            </FormItem>
          </fieldset>
          <fieldset>
            <legend>验货发货</legend>
            <FormItem>
              {getFieldDecorator('ischeckfirst', { valuePropName: 'checked' })(
                <Checkbox>必须先验货才能发货，勾选中该项【<span style={important}>打单拣货</span>】模块【<span style={important}>直接发货</span>】功能无效</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isjustcheckex', { valuePropName: 'checked' })(
                <Checkbox>验货出库只检验快递单号</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isautosendafftercheck', { valuePropName: 'checked' })(
                <Checkbox>验货完成时自动发货</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('isneedkg', { valuePropName: 'checked' })(
                <Checkbox>发货前必须称重</Checkbox>
              )}
            </FormItem>
          </fieldset>
          <fieldset>
            <legend>仓库属性</legend>
            <FormItem {...formItemLayout} label='分拣柜层高'>
              {getFieldDecorator('cabinetheight', {
                initialValue: '0'
              })(
                <InputNumber min={0} style={{ width: 100 }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='分拣柜总格数'>
              {getFieldDecorator('cabinetnumber', {
                initialValue: '0'
              })(
                <InputNumber min={0} style={{ width: 100 }} />
              )}
            </FormItem>
            <div className='hr' />
            <FormItem>
              {getFieldDecorator('ispositionaccurate', { valuePropName: 'checked' })(
                <Checkbox>仓位精确库存<small className='gray ml5'>(库存精确到具体仓位，以及存货箱，开通仓位精确库存后，必须通过手执枪进行仓库相关业务操作，否则库存将不准确)</small></Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('goodsuniquecode', { valuePropName: 'checked' })(
                <Checkbox>商品唯一码<small className='gray ml5'>(选中此项，仓位精确库存 强制开通)</small></Checkbox>
              )}
            </FormItem>
            <div className='hr' />
            <FormItem {...formItemLayout} label='仓位货物置放规则'>
              {getFieldDecorator('isgoodsrule')(
                <RadioGroup>
                  <Radio value={1}>一仓多货</Radio>
                  <Radio value={0}>一仓一货</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <div className='hr' />
            <FormItem {...formItemLayout} label='采购入库超入处理'>
              {getFieldDecorator('isbeyondcount')(
                <RadioGroup>
                  <Radio value={1}>超出数量允许入库</Radio>
                  <Radio value={0}>超出数量不允许入库</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <div className='hr' />
            <FormItem {...formItemLayout} label='拣货方式'>
              {getFieldDecorator('pickingmethod')(
                <RadioGroup>
                  <Radio value={1}><b>手执拣货</b>：通过手执提示一步一步拣货，拣好的货物库存放到拣货暂存位<small className='gray'>（自动屏蔽纸质拣货单打印功能）</small></Radio>
                  <Radio value={0}><b>纸质拣货</b>：按纸质进行拣货，库存不动。实际发货从仓位减去库存，如果一个商品存在多个仓位，可能仓位扣减不准确。拣货过程中可以直接分拣。</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <div className='hr' />
            <FormItem>
              {getFieldDecorator('tempnominus', { valuePropName: 'checked' })(
                <Checkbox>拣货暂存位禁止负库存<small className='gray ml5'>(当发货时，如果拣货位系统没有库存，即便实物存在，也不允许发货，必须再拣货才允许发货。 库存校验不分批次，也不区分单件与多件。 开通该选项，可能影响发货效率。)</small></Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('mixedpicking', { valuePropName: 'checked' })(
                <Checkbox>混合拣货<small className='gray ml5'>(拣货同时可以从存货区拣货按箱拣货，同时从货架位拣货。逻辑为：假如商品单件数量超过一箱，可以按箱拣货。请设置好【<span style={important}>仓位找货优先级</span>】确保优先按箱拣货)</small></Checkbox>
              )}
            </FormItem>
          </fieldset>
          <div className='tc'>
            <Tooltip title='点击【恢复默认设置】后需要【保存修改】'>
              <Button type='ghost' loading={this.state.confirmLoading} onClick={this.handleReset}>恢复默认设置</Button>
            </Tooltip>
            &nbsp;&nbsp;&nbsp;
            <Button type='primary' loading={this.state.confirmLoading} onClick={this.handleSubmit}>保存修改</Button>
          </div>
        </Form>
      </div>
    )
  }
})))
