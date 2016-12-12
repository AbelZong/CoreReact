/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-03 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, {
  createClass
} from 'react'
import update from 'react-addons-update'
import Areas from 'json/AreaCascader'
import classNames from 'classnames'
import SkuAppendPicker from 'components/SkuPicker/append'
import {
  Table,
  Select,
  Popconfirm,
  Button,
  message,
  Cascader,
  Modal,
  Input,
  Form,
  notification,
  Icon,
  Col,
  DatePicker,
  Steps,
  Radio,
  Collapse,
  Row,
  Alert
} from 'antd'
import {
  connect
} from 'react-redux'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  startLoading,
  endLoading
} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
import styles from './index.scss'
import ModalPrompt from 'components/Modal/Prompt'
const ButtonGroup = Button.Group
const Step = Steps.Step
const RadioGroup = Radio.Group
const Panel = Collapse.Panel
const Option = Select.Option
//import {injectReducers} from 'store/reducers'
// import { handleActions } from 'redux-actions'
// const sale_out_conditions = handleActions({
//   SALE_OUT_CONDITIONS_SET: (state, action) => (action.payload)
// }, {})
// injectReducers(store, {
//  sale_out_conditions
// })

//const PAYMENT_WAYS = ['支付宝']
const ManualOrderPay = connect(state => ({
  doge: state.order_list_do_pay_1
}))(createForm()(createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_DO_PAY_1_SET', payload: null })
    this.props.form.resetFields()
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      const data = Object.assign({}, values, {
        PayDate: values.PayDate.format(),
        OID: this.props.doge
      })
      this.setState({ loading: true })
      ZPost('Order/InsertManualPay', data, ({d}) => {
        this.hideModal()
        this.props.updateStates(d)
      }).then(() => {
        this.setState({ loading: false })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title='添加新的支付' confirmLoading={this.state.loading} visible={this.props.doge !== null} onOk={this.handleOK} onCancel={this.hideModal} width={478}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='支付方式'>
            <FormItem>
              {getFieldDecorator('Payment', {
                initialValue: '支付宝',
                rules: [
                  {required: true, whitespace: true, message: '必选'}
                ]
              })(
                <Select>
                  <Option value='支付宝'>支付宝</Option>
                  <Option value='快钱'>快钱</Option>
                  <Option value='招行直连'>招行直连</Option>
                  <Option value='财付通'>财付通</Option>
                  <Option value='现金支付'>现金支付</Option>
                  <Option value='银行转帐'>银行转帐</Option>
                  <Option value='其它'>其它</Option>
                  <Option value='供销支付'>供销支付</Option>
                  <Option value='快速支付'>快速支付</Option>
                  <Option value='微信支付'>微信支付</Option>
                  <Option value='授信'>授信</Option>
                  <Option value='预支付'>预支付</Option>
                </Select>
              )}
            </FormItem>
          </FormItem>
          <FormItem {...formItemLayout} label='支付日期'>
            {getFieldDecorator('PayDate', {
              rules: [
                {required: true, whitespace: true, message: '必填', type: 'object'}
              ]
            })(
              <DatePicker showTime placeholder='点击设置' format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='支付单号'>
            {getFieldDecorator('PayNbr', {
              rules: [
                {required: this.props.form.getFieldValue('Payment') !== '现金支付', whitespace: true, message: '必填'}
              ]
            })(
              <Input placeholder='除现金支付外必填' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='支付金额'>
            {getFieldDecorator('PayAmount', {
              rules: [
                {required: true, whitespace: true, message: '必填'}
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='买家帐号'>
            {getFieldDecorator('PayAccount')(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
const _ComDetailForm1 = createForm()(createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  componentDidMount() {
    this._refresh(this.props.data)
  },
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this._refresh(nextProps.data)
    }
  },
  _refresh(data) {
    this.props.form.setFieldsValue({
      s1: data.freight,
      s2: data.sendMessage,
      s3: data.invoiceTitle,
      s6: data.areas.length ? data.areas : undefined,
      s7: data.address,
      s8: data.name,
      s9: data.tel,
      s10: data.phone
    })
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      this.setState({ loading: true })
      const p1 = Areas.filter(x => x.value === values.s6[0])[0]
      const p2 = values.s6[1] ? p1.children.filter(x => x.value === values.s6[1])[0] : null
      const p3 = values.s6[2] && p2 ? p2.children.filter(x => x.value === values.s6[2])[0] : null
      const data = {
        OID: this.props.data.oid,
        ExAmount: values.s1,
        SendMessage: values.s2,
        InvoiceTitle: values.s3,
        RecName: values.s8 || '',
        RecLogistics: p1 ? p1.label : '',
        RecCity: p2 ? p2.label : '',
        RecDistrict: p3 ? p3.label : '',
        RecAddress: values.s7 || '',
        RecPhone: values.s10 || '',
        RecTel: values.s9 || ''
      }
      ZPost('Order/UpdateOrder', data, ({d}) => {
        this.props.updateStates(d)
      }).then(() => {
        this.setState({ loading: false })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 }
    }
    const disabledAll = [0, 1, 7].indexOf(this.props.data.status) === -1
    return (
      <div className={styles.noMBForm}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='运费'>
            {getFieldDecorator('s1')(
              <Input size='small' disabled={disabledAll} style={{width: 100}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='卖家备注'>
            {getFieldDecorator('s2')(
              <Input size='small' type='textarea' disabled={disabledAll} autosize={{minRows: 2, maxRows: 5}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='发票抬头'>
            {getFieldDecorator('s3')(
              <Input size='small' disabled={disabledAll} />
            )}
          </FormItem>
          <h3>收货地址信息</h3>
          <FormItem {...formItemLayout} label='收货地址'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s6', {
                  rules: [
                    {required: true, whitespace: true, message: '必填', type: 'array'}
                  ]
                })(
                  <Cascader size='small' options={Areas} disabled={disabledAll} placeholder='选择省/市/区' />
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem>
                {getFieldDecorator('s7', {
                  rules: [
                    {required: true, whitespace: true, message: '必填'}
                  ]
                })(
                  <Input size='small' disabled={disabledAll} placeholder='详细地址：街区/门牌号' className='ml10' />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='收货人名'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s8', {
                  rules: [
                    {required: true, whitespace: true, message: '必填'}
                  ]
                })(
                  <Input size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='联系电话'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s9')(
                  <Input size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='手机号码'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s10', {
                  rules: [
                    {required: true, whitespace: true, message: '必填'}
                  ]
                })(
                  <Input size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <div className='hr' />
          <div className='clearfix'>
            <Button size='small' loading={this.state.loading} type='primary' className='pull-right' onClick={this.handleOK} disabled={disabledAll}>保存订单基本信息</Button>
          </div>
        </Form>
      </div>
    )
  }
}))
const parseArea = function(l, c, d) {
  const s6 = []
  if (l) {
    let index = Areas.findIndex(x => x.label === l)
    if (index !== -1) {
      let p1 = Areas[index]
      s6.push(p1.value)
      if (c) {
        let index = p1.children.findIndex(x => x.label === c)
        if (index !== -1) {
          let p2 = p1.children[index]
          s6.push(p2.value)
          if (d) {
            let index = p2.children.findIndex(x => x.label === d)
            if (index !== -1) {
              s6.push(p2.children[index].value)
            }
          }
        }
      }
    }
  }
  return s6
}
const ComDetail1 = connect(state => ({
  doge: state.order_list_detail_1
}))(createForm()(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false,
      order: {},
      logs: [],
      payments: [],
      items: [],
      expr_vis: false,
      toe_vis: false,
      tca_vis: false
    }
  },
  // componentDidMount() {
  //   this.setState({
  //     visible: true
  //   }, () => {
  //     this.componentWillReceiveProps({doge: 10873})
  //   })
  // },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        this.loadDetail(nextProps.doge)
      }
    }
  },
  loadDetail(OID) {
    startLoading()
    ZGet('Order/GetOrderSingle', {OID}, ({d}) => {
      this.setState({
        visible: true,
        order: d.Order,
        logs: d.Log,
        payments: d.Pay,
        items: d.OrderItem
      })
    }).then(endLoading)
  },
  hideModal() {
    if (this.__dirtied && this.props.zch) {
      this.props.zch.refreshRow(this.props.doge)
    }
    this.props.dispatch({ type: 'ORDER_LIST_DETAIL_1_SET', payload: null })
  },
  _noticeFails(failIDs) {
    if (failIDs && failIDs.length) {
      const description = (<div>
        {failIDs.map(x => {
          return (
            <div key={x.id}>
              {x.id}: {x.reason || '已存在'}
            </div>
          )
        })}
      </div>)
      notification.error({
        message: '订单商品附加错误',
        description,
        icon: <Icon type='meh-o' />
      })
    }
  },
  _updateStates(d) {
    const states = {}
    if (typeof d.Order !== 'undefined') {
      states.order = d.Order
    }
    if (typeof d.OrderItem !== 'undefined') {
      states.items = d.OrderItem
    }
    if (typeof d.Log !== 'undefined') {
      states.logs = d.Log
    }
    if (typeof d.Pay !== 'undefined') {
      states.payments = d.Pay
    }
    this.__dirtied = true
    this.setState(states)
  },
  handleAppendSKU(skus) {
    const ids = skus.map(x => x.ID)
    if (ids.length) {
      startLoading()
      ZPost('Order/InsertOrderDetail', {OID: this.state.order.ID, SkuIDList: ids, isQuick: false}, ({d}) => {
        this._updateStates(d.Order)
        this._noticeFails(d.failIDs)
      }).then(endLoading)
    }
  },
  handleUpdateQty(ID, {target}) {
    this._handleUpdateItem({
      ID,
      Qty: target.value
    })
  },
  handleUpdatePrice(ID, {target}) {
    this._handleUpdateItem({
      ID,
      Price: target.value
    })
  },
  _handleUpdateItem(data) {
    startLoading()
    ZPost('Order/UpdateOrderDetail', {
      OID: this.state.order.ID,
      isQuick: false,
      ...data
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  handleRemove(ID) {
    startLoading()
    ZPost('Order/DeleteOrderDetail', {
      OID: this.state.order.ID,
      ID,
      isQuick: false
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __payOP0(PayID) {
    startLoading()
    ZPost('Order/CancleConfirmPay', {
      OID: this.state.order.ID,
      PayID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __payOP1(PayID) {
    startLoading()
    ZPost('Order/ConfirmPay', {
      OID: this.state.order.ID,
      PayID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __payOP2(PayID) {
    startLoading()
    ZPost('Order/CanclePay', {
      OID: this.state.order.ID,
      PayID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __renderPayOp(x) {
    switch (x.Status) {
      case 0: {
        return (
          <ButtonGroup>
            <Button type='primary' size='small' onClick={() => this.__payOP1(x.ID)}>审核通过</Button>
            <Popconfirm title='确定将该笔支付作废吗？' onConfirm={() => this.__payOP2(x.ID)}>
              <Button size='small'>作废</Button>
            </Popconfirm>
          </ButtonGroup>
        )
      }
      case 1: {
        return (
          <Button type='primary' size='small' onClick={() => this.__payOP0(x.ID)}>重新审核</Button>
        )
      }
    }
  },
  _renderPays() {
    const {order, payments} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div className={styles.pays}>
          <h3>订单支付情况</h3>
          <div className='mt10 tc'>(无)</div>
        </div>
      )
    }
    if ([0, 1, 7].indexOf(order.Status) !== -1) {
      return (
        <div className={styles.pays}>
          <h3>订单支付情况 &emsp;&emsp;&emsp;&emsp;<Button type='primary' size='small' onClick={() => {
            this.props.dispatch({type: 'ORDER_LIST_DO_PAY_1_SET', payload: this.state.order.ID})
          }}>添加手工支付</Button>&emsp;<Button type='dashed' size='small' onClick={() => {
            startLoading()
            ZPost('Order/QuickPay', {OID: this.state.order.ID}, ({d}) => {
              this._updateStates(d)
            }).then(endLoading)
          }}>快速支付</Button></h3>
          {payments && payments.length ? payments.map(x => (
            <Row key={x.ID} className='mt5'>
              <Col span={4}><div className={styles.ppap0}>{x.Payment}</div></Col>
              <Col span={5}><div className={styles.ppap1}>{x.PayNbr}</div></Col>
              <Col span={4}><div className={styles.ppap2}>&yen;&nbsp;{x.PayAmount}</div></Col>
              <Col span={6}><div className={styles.ppap3}>{x.PayDate}</div></Col>
              <Col span={5}><div className={styles.ppap4}>{this.__renderPayOp(x)}</div></Col>
            </Row>
          )) : <div className='tc mt5'>(无)</div>}
          <ManualOrderPay updateStates={this._updateStates} />
        </div>
      )
    }
    return (
      <div className={styles.pays}>
        <h3>订单支付情况</h3>
        {payments && payments.length ? payments.map(x => (
          <Row key={x.ID} className='mt10'>
            <Col span={4}><div className={styles.ppap0}>{x.Payment}</div></Col>
            <Col span={5}><div className={styles.ppap1}>{x.PayNbr}</div></Col>
            <Col span={4}><div className={styles.ppap2}>&yen;&nbsp;{x.PayAmount}</div></Col>
            <Col span={6}><div className={styles.ppap3}>{x.PayDate}</div></Col>
          </Row>
        )) : <div className='tc mt5'>(无)</div>}
      </div>
    )
  },
  _renderItems() {
    const {order, items} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div className={styles.items}>
          <h3>订单商品</h3>
          <div className='mt10 tc'>(无)</div>
        </div>
      )
    }
    const itemQty = items.reduce(function(a, b) {
      return a + b.Qty
    }, 0)
    if ([0, 1, 7].indexOf(order.Status) !== -1) {
      return (
        <div className={styles.items}>
          <h3>订单商品 &emsp;&emsp;&emsp;&emsp;<SkuAppendPicker onChange={this.handleAppendSKU} size='small' type='primary' />&emsp;<Button className='hide' type='dashed' size='small'>导入商品</Button></h3>
          <Table columns={[{
            title: '图片',
            width: 68,
            className: 'tc',
            dataIndex: 'img',
            render: function(img, record, index) {
              return (
                <div className={styles._poster} style={{backgroundImage: img ? `url(${img})` : 'none'}} />
              )
            }
          }, {
            title: '名称',
            width: 280,
            dataIndex: 'SkuID',
            render: function(text, row, index) {
              const ZPCN = classNames({
                [`${styles._zp}`]: row.IsGift
              })
              return (
                <div className={styles._info}>
                  <div>({row.ID})<a>{row.SkuName}</a></div>
                  <div className='mt5'>
                    <span className='gray mr5'>{row.GoodsCode}</span>
                    <strong className={ZPCN}>{row.SkuID}</strong>
                    <span className='gray ml5'>{row.Norm}</span>
                  </div>
                </div>
              )
            }
          }, {
            title: '数量(回车保存)',
            width: 98,
            dataIndex: 'Qty',
            render: (value, record, index) => {
              return <Input min={0} type='number' defaultValue={value} placeholder={`原设：${value}`} onPressEnter={(e) => this.handleUpdateQty(record.ID, e)} />
            }
          }, {
            title: '单价(回车保存)',
            width: 98,
            dataIndex: 'RealPrice',
            render: (value, record, index) => {
              return <Input min={0} type='number' defaultValue={value} placeholder={`原设：${value}`} onPressEnter={(e) => this.handleUpdatePrice(record.ID, e)} />
            }
          }, {
            title: '原价',
            width: 62,
            className: 'tc',
            dataIndex: 'SalePrice'
          }, {
            title: '成交金额',
            width: 88,
            className: 'tc',
            render: function(text, row, index) {
              const price = row.RealPrice * row.Qty
              return <span>{price}</span>
            }
          }, {
            title: '可配库存',
            width: 85,
            className: 'tc',
            dataIndex: 'InvQty'
          }, {
            title: '操作',
            dataIndex: '',
            render: (text, row, index) => {
              return (
                <Popconfirm title='确定要删除吗' onConfirm={() => this.handleRemove(row.ID)}>
                  <Button size='small' type='ghost'>删除</Button>
                </Popconfirm>
              )
            }
          }]} dataSource={items} pagination={false} rowKey='ID' />
          <Row className={styles.items_c}>
            <Col span={14}>
              <div className='tr'>
                <span className={styles._ppap}>商品总数量:</span><span className={styles.tQty}>{itemQty}</span>
              </div>
            </Col>
            <Col span={10}>
              <div className='tr'>
                <div><span className={styles._ppap}>商品总金额:</span><span className={styles.bPrice}>{order.SkuAmount}</span></div>
                <div className='hide'><span className={styles._ppap}>-优惠及抵扣金额:</span><span className={styles.bPrice}>0</span></div>
                <div className='hide'><span className={styles._ppap}>取消商品总金额:</span><span className={styles.bPrice}>0</span></div>
                <div><span className={styles._ppap}>+运费:</span><span className={styles.bPrice}>{order.ExAmount}</span></div>
                <div className={styles.hr}>
                  <div><span className={styles._ppap}>应付总金额:</span><span className={styles.rPrice}>{order.Amount}</span></div>
                  <div><span className={styles._ppap}>实际已付（支付已审核）:</span><span className={styles.rPrice}>{order.PaidAmount}</span></div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )
    }
    return (
      <div className={styles.items}>
        <h3>订单商品</h3>
        <Table columns={[{
          title: '图片',
          width: 68,
          className: 'tc',
          dataIndex: 'img',
          render: function(img, record, index) {
            return (
              <div className={styles._poster} style={{backgroundImage: img ? `url(${img})` : 'none'}} />
            )
          }
        }, {
          title: '名称',
          width: 280,
          dataIndex: 'SkuID',
          render: function(text, row, index) {
            const ZPCN = classNames({
              [`${styles._zp}`]: row.IsGift
            })
            return (
              <div className={styles._info}>
                <div>({row.ID})<a>{row.SkuName}</a></div>
                <div className='mt5'>
                  <span className='gray mr5'>{row.GoodsCode}</span>
                  <strong className={ZPCN}>{row.SkuID}</strong>
                  <span className='gray ml5'>{row.Norm}</span>
                </div>
              </div>
            )
          }
        }, {
          title: '数量',
          width: 98,
          dataIndex: 'Qty'
        }, {
          title: '单价',
          width: 98,
          dataIndex: 'RealPrice'
        }, {
          title: '原价',
          width: 62,
          className: 'tc',
          dataIndex: 'SalePrice'
        }, {
          title: '成交金额',
          width: 88,
          className: 'tc',
          render: function(text, row, index) {
            const price = row.RealPrice * row.Qty
            return <span>{price}</span>
          }
        }, {
          title: '可配库存',
          width: 85,
          className: 'tc',
          dataIndex: 'InvQty'
        }, {
          title: '操作',
          dataIndex: '',
          render: () => {
            return <div className='gray'>不可修改</div>
          }
        }]} dataSource={items} pagination={false} rowKey='ID' />
        <Row className={styles.items_c}>
          <Col span={14}>
            <div className='tr'>
              <span className={styles._ppap}>商品总数量:</span><span className={styles.tQty}>{itemQty}</span>
            </div>
          </Col>
          <Col span={10}>
            <div className='tr'>
              <div><span className={styles._ppap}>商品总金额:</span><span className={styles.bPrice}>{order.SkuAmount}</span></div>
              <div className='hide'><span className={styles._ppap}>-优惠及抵扣金额:</span><span className={styles.bPrice}>0</span></div>
              <div className='hide'><span className={styles._ppap}>取消商品总金额:</span><span className={styles.bPrice}>0</span></div>
              <div><span className={styles._ppap}>+运费:</span><span className={styles.bPrice}>{order.ExAmount}</span></div>
              <div className={styles.hr}>
                <div><span className={styles._ppap}>应付总金额:</span><span className={styles.rPrice}>{order.Amount}</span></div>
                <div><span className={styles._ppap}>实际已付（支付已审核）:</span><span className={styles.rPrice}>{order.PaidAmount}</span></div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  },
  _handleExceptionOrder() {
    // this.setState({
    //   toe_vis: true
    // })
    this.props.dispatch({type: 'ORDER_LIST_TO_2_SET', payload: this.state.order.ID})
  },
  _handleCancelOrder() {
    // this.setState({
    //   tca_vis: true
    // })
    this.props.dispatch({type: 'ORDER_LIST_TO_1_SET', payload: this.state.order.ID})
  },
  _handleConfirmOrder() {
    startLoading()
    ZPost('Order/ConfirmOrder', {OID: [this.state.order.ID]}, () => {
      this.loadDetail(this.state.order.ID)
    }, endLoading)
  },
  _handleExpressOrder() {
    this.props.dispatch({type: 'ORDER_LIST_TO_3_SET', payload: this.state.order.ID})
  },
  _handleCancelException() {
    startLoading()
    ZPost('Order/TransferNormal', {OID: [this.state.order.ID]}, ({d}) => {
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.setState(update(this.state, {
          order: {
            $merge: {
              Status: obj.Status,
              StatusDec: obj.StatusDec
            }
          }
        }), () => {
          this._dirtied = true
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(endLoading)
  },
  _handleReOrder() {
    startLoading()
    ZPost('Order/RestoreCancleOrder', {OID: [this.state.order.ID]}, ({d}) => {
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.setState(update(this.state, {
          order: {
            $merge: {
              Status: obj.Status,
              StatusDec: obj.StatusDec
            }
          }
        }), () => {
          this._dirtied = true
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(endLoading)
  },
  _handleSendOrder() {
    const value = this.refs.senderIpt.refs.input.value
    if (!value) {
      return message.warn('请输入快递单号')
    }
    startLoading()
    ZPost('Order/DirectShip', {OID: this.state.order.ID, ExCode: value}, ({d}) => {
      this.setState(update(this.state, {
        order: {
          $merge: d
        }
      }), () => {
        this._dirtied = true
      })
    }).then(endLoading)
  },
  _handleUnAuditOrder() {
    startLoading()
    ZPost('Order/CancleConfirmOrder', {OID: [this.state.order.ID]}, ({d}) => {
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.setState(update(this.state, {
          order: {
            $merge: {
              Status: obj.Status,
              StatusDec: obj.StatusDec
            }
          }
        }), () => {
          this._dirtied = true
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(endLoading)
  },
  _handleReSendOrder() {
    startLoading()
    ZPost('Order/', {OID: [this.state.order.ID]}, ({d}) => {
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.setState(update(this.state, {
          order: {
            $merge: {
              Status: obj.Status,
              StatusDec: obj.StatusDec
            }
          }
        }), () => {
          this._dirtied = true
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(endLoading)
  },
  _handleCancelSendOrder() {
    startLoading()
    ZPost('Order/CancleShip', {OID: this.state.order.ID}, ({d}) => {
      this.setState(update(this.state, {
        order: {
          $merge: d
        }
      }), () => {
        this._dirtied = true
      })
    }).then(endLoading)
  },
  _renderOps() {
    const {order} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div>
          &nbsp;
        </div>
      )
    }
    const status = order.Status
    switch (status) {
      case 1: {
        return (
          <div>
            <div><Button type='primary' onClick={this._handleConfirmOrder}>审核确认</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExpressOrder}>设定快递公司</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExceptionOrder}>标记异常</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleCancelOrder}>取消订单</Button></div>
            <div className='mt25 hide'>todo print order</div>
          </div>
        )
      }
      case 2: {
        return (
          <div>
            <div className='gray'>当前订单已审核，如需要修改订单，请先取消确认状态</div>
            <div className='mt10'><Button type='primary' size='small' onClick={this._handleExpressOrder}>设定快递公司</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleUnAuditOrder}>取消审核</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExceptionOrder}>标记异常</Button></div>
            <div className='mt15'><Button type='ghost' size='small' onClick={this._handleCancelOrder}>取消订单</Button></div>
            <div className='mt25'>
              <div className='gray'>输入快递单号，直接发货</div>
              <div><Input placeholder='输入快递单号' ref='senderIpt' /></div>
              <div className='tr'><Button type='primary' size='small' onClick={this._handleSendOrder}>直接发货</Button></div>
            </div>
          </div>
        )
      }
      case 3: {
        return (
          <div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExceptionOrder}>标记异常</Button></div>
            <div className='mt25'>
              <div className='gray'>输入快递单号，直接发货</div>
              <div><Input placeholder='输入快递单号' ref='senderIpt' /></div>
              <div className='tr'><Button type='primary' size='small' onClick={this._handleSendOrder}>直接发货</Button></div>
            </div>
          </div>
        )
      }
      case 4: {
        return (
          <div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleReSendOrder}>重新发货</Button></div>
            <div className='mt10'><Button type='dashed' size='small' onClick={this._handleCancelSendOrder}>撤销已发货</Button></div>
          </div>
        )
      }
      case 0: {
        return (
          <div>
            <div><Button type='ghost' size='small' onClick={this._handleExceptionOrder}>标记异常</Button></div>
            <div className='mt20'><Button type='ghost' size='small' onClick={this._handleCancelOrder}>取消订单</Button></div>
          </div>
        )
      }
      case 6: {
        return (
          <div>
            <div className='mt10 clearfix'><Button type='dashed' className='pull-right' size='small' onClick={this._handleReOrder}>反取消订单</Button></div>
          </div>
        )
      }
      case 7: {
        return (
          <div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExpressOrder}>设定快递公司</Button></div>
            <div className='mt25'>
              (当前异常:{order.AbnormalStatusDec})
            </div>
            <div className='mt5'><Button type='primary' size='small' onClick={this._handleCancelException}>取消异常标记</Button></div>
          </div>
        )
      }
    }
  },
  _renderProcesses() {
    const {order} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div className={styles.process}>
          <div className='mt10 tc'>...</div>
        </div>
      )
    }
    const status = order.Status
    switch (status) {
      case 7: {
        return (
          <div className={styles.process}>
            <div className={styles.exception}>
              {order.AbnormalStatusDec}
            </div>
          </div>
        )
      }
      case 6: {
        return (
          <div className={styles.process}>
            <div className={styles.exception}>
              {order.StatusDec}
            </div>
          </div>
        )
      }
      default: {
        return (
          <Steps current={order.Status}>
            <Step title='待付款' />
            <Step title='已付款待审核' />
            <Step title='已审核待配快递' />
            <Step title='发货中' />
            <Step title='已发货' />
          </Steps>
        )
      }
    }
  },
  render() {
    const {order} = this.state
    const formData = {
      areas: parseArea(order.RecLogistics, order.RecCity, order.RecDistrict),
      address: order.RecAddress,
      tel: order.RecTel,
      phone: order.RecPhone,
      name: order.RecName,
      sendMessage: order.SendMessage,
      invoiceTitle: order.InvoiceTitle,
      freight: order.ExAmount,
      oid: order.ID,
      status: order.Status
    }
    const expr3Address = {
      RecAddress: this.state.order.RecAddress,
      RecCity: this.state.order.RecCity,
      RecDistrict: this.state.order.RecDistrict,
      RecLogistics: this.state.order.RecLogistics,
      ExID: this.state.order.ExID
    }
    //todo 异常单
    return (
      <Modal title='查看或编辑备注' confirmLoading={this.state.loading} visible={this.state.visible} onCancel={this.hideModal} width={980} footer=''>
        {this._renderProcesses()}
        <div className='flex-row mt25'>
          <div className='flex-grow'>
            <h3>订单基本信息</h3>
            <div className={styles.formD}>
              <Row>
                <Col span={3}><div className={styles.label}>订单编号</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.ID}</div></Col>
                <Col span={3}><div className={styles.label}>店铺</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.ShopName}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>下单时间</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.ODate}</div></Col>
                <Col span={3}><div className={styles.label}>订单来源</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.OSource}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>线上单号</div></Col>
                <Col span={21}><div className={styles.inpt}>{order.SoID}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>买家帐号</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.BuyerShopID}</div></Col>
                <Col span={3}><div className={styles.label}>付款时间</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.PayDate}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>买家留言</div></Col>
                <Col span={21}><div className={styles.inpt}>{order.RecMessage || '(无)'}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>快递公司</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.Express}</div></Col>
                <Col span={3}><div className={styles.label}>快递单号</div></Col>
                <Col span={12}><div className={styles.inpt}><a onClick={() => {
                  this.props.dispatch({type: 'ORDER_LIST_EXPR_S_1_SET', payload: {
                    pp: order.ExpNamePinyin,
                    ap: order.ExCode
                  }})
                }}>{order.ExCode}</a></div></Col>
              </Row>
            </div>
            <_ComDetailForm1 data={formData} updateStates={this._updateStates} />
          </div>
          <div className={styles.opsArea}>
            {this._renderOps()}
          </div>
        </div>
        {this._renderPays()}
        {this._renderItems()}
        <div className={styles.logs}>
          <h3>订单操作进程及日志</h3>
          {this.state.logs && this.state.logs.length ? this.state.logs.map(x => (
            <Row key={x.ID} className='mb5'>
              <Col span={4}><div><time>{x.LogDate}</time></div></Col>
              <Col span={3}><div>{x.UserName}</div></Col>
              <Col span={3}><div>{x.Title}</div></Col>
              <Col span={12}><div>{x.Remark}</div></Col>
            </Row>
          )) : <div className='mt10 gray tc'>(无)</div>}
        </div>
        <ComExpr3 address={expr3Address} onChange={(d) => {
          this.setState(update(this.state, {
            order: {
              $merge: d
            }
          }), () => {
            this.__dirtied = true
          })
        }} />
        <ToExceptions3 AbnormalStatus={this.state.order.AbnormalStatus} onChange={(d) => {
          this.setState(update(this.state, {
            order: {
              $merge: d
            }
          }), () => {
            this.__dirtied = true
          })
        }} />
        <ToCancel3 visible={this.state.tca_vis} OID={this.state.order.ID} onChange={(d) => {
          this.setState(update(this.state, {
            order: {
              $merge: d
            },
            tca_vis: {
              $set: false
            }
          }), () => {
            this.__dirtied = true
          })
        }} onCancel={() => {
          this.setState({
            tca_vis: false
          })
        }} />
      </Modal>
    )
  }
})))
const ComExpr3 = connect(state => ({
  doge: state.order_list_to_3
}))(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false,
      address: '',
      value: '',
      exps: [],
      expers: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      startLoading()
      const u = nextProps.address
      ZGet('Order/GetExp', {
        Logistics: u.RecLogistics,
        City: u.RecCity,
        District: u.RecDistrict,
        IsQuick: false
      }, ({d}) => {
        const address = `${u.RecLogistics} ${u.RecCity} ${u.RecDistrict} ${u.RecAddress}`
        if (d.LogisticsNetwork && d.LogisticsNetwork.length) {
          const expers = {}
          for (let er of d.LogisticsNetwork) {
            if (!expers[er.kd_name]) {
              expers[er.kd_name] = {
                count: 0,
                name: er.kd_name,
                children: []
              }
            }
            expers[er.kd_name].count ++
            expers[er.kd_name].children.push({
              cp_name: er.cp_name_raw,
              cp_loc: er.cp_location,
              delivery_area_1: er.delivery_area_1,
              delivery_area_0: er.delivery_area_0,
              delivery_contact: er.delivery_contact
            })
          }
          this.setState({ visible: true, value: u.ExID, exps: d.Express, expers: Object.values(expers), address })
        } else {
          this.setState({ visible: true, value: u.ExID, exps: d.Express, expers: null, address })
        }
      }).then(endLoading)
    } else {
      this.setState({
        visible: false,
        address: '',
        value: '',
        exps: [],
        expers: []
      })
    }
  },
  hideModal() {
    // this.setState({
    //   visible: false,
    //   address: '',
    //   value: '',
    //   exps: [],
    //   expers: []
    // }, () => {
    //   this.props.onCancel()
    // })
    this.props.dispatch({type: 'ORDER_LIST_TO_3_SET', payload: null})
  },
  handleOK() {
    const value = this.state.value
    if (!value) {
      return message.error('请选择快递方式')
    }
    let ExpName = ''
    if (Object.keys(DATA_EXPR_TYPE_EDNTEDS).indexOf(value) === -1) {
      const index = this.state.exps.findIndex(x => x.ID === value)
      if (index === -1) {
        return message.error('不存在的快递方式')
      }
      ExpName = this.state.exps[index].Name
    } else {
      ExpName = DATA_EXPR_TYPE_EDNTEDS[value][0]
    }
    const data = {
      OID: [this.props.doge],
      ExpID: value,
      ExpName
    }
    ZPost('Order/SetExp', data, ({d}) => {
      this.hideModal()
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.props.onChange({
          ExID: obj.ExID,
          ExpNamePinyin: obj.ExpNamePinyin,
          Express: obj.Express
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    })
  },
  render() {
    return (
      <Modal title='请选择需要设定的物流(快递)公司' confirmLoading={this.state.loading} visible={this.state.visible} onOk={this.handleOK} onCancel={this.hideModal} width={820}>
        <div className={styles.experWrapper}>
          <div className={styles.exps}>
            <Alert message={this.state.address} type='warning' />
            <Collapse>
              {this.state.expers && this.state.expers.length ? this.state.expers.map((x, i) => (
                <Panel header={`${x.name} (${x.count})`} key={i}>
                  <div className={styles.pch}>
                    {x.children && x.children.length ? x.children.map((y, j) => (
                      <div className={styles.row} key={j}>
                        <Row>
                          <Col span={4} className='tr'>网店名：</Col>
                          <Col span={20}><strong>{y.cp_name}</strong></Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>地址：</Col>
                          <Col span={20}>{y.cp_loc}</Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>联系：</Col>
                          <Col span={20}>{y.delivery_contact}</Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>到达区域：</Col>
                          <Col span={20}><span className='green'>{y.delivery_area_1}</span></Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>不达区域：</Col>
                          <Col span={20}>{y.delivery_area_0}</Col>
                        </Row>
                      </div>
                    )) : null}
                  </div>
                </Panel>
              )) : null}
            </Collapse>
          </div>
          <div className={styles.radios}>
            <RadioGroup onChange={(e) => {
              this.setState({
                value: e.target.value
              })
            }} value={`${this.state.value}`}>
              {this.state.exps.length ? this.state.exps.map(x => <Radio key={x.ID} value={x.ID}>{x.Name}</Radio>) : null}
              <div className='hr' />
              {Object.keys(DATA_EXPR_TYPE_EDNTEDS).map(k => <Radio key={k} value={k}><span className={DATA_EXPR_TYPE_EDNTEDS[k][1]}>{DATA_EXPR_TYPE_EDNTEDS[k][0]}</span></Radio>)}
            </RadioGroup>
          </div>
        </div>
      </Modal>
    )
  }
}))
const DATA_EXPR_TYPE_EDNTEDS = {
  'A': ['{清空已设快递}', 'red'],
  'B': ['{让系统自动计算}', 'green'],
  'C': ['{菜鸟智选物流}', 'green']
}
const ToExceptions3 = connect(state => ({
  doge: state.order_list_to_2
}))(createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: this.props.AbnormalStatus,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      startLoading()
      ZGet({
        uri: 'Order/GetAbnormalList',
        success: ({d}) => {
          const lst = d && d instanceof Array ? d : []
          this.setState({
            visible: true,
            dataList: lst,
            value: nextProps.AbnormalStatus
          })
        }
      }).then(endLoading)
    } else {
      this.setState({
        visible: false,
        value: null,
        dataList: [],
        confirmLoading: false
      })
    }
  },
  handleOK() {
    const {value} = this.state
    if (!value) {
      return message.warning('请选择异常状态')
    }
    this.setState({
      confirmLoading: true
    })
    const AbnormalStatusDec = this.refs.zch.refs.input.value
    ZPost('Order/TransferAbnormal', {OID: [this.props.doge], AbnormalStatus: value, AbnormalStatusDec}, ({d}) => {
      this.handleok()
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.props.onChange({
          Status: obj.Status,
          StatusDec: obj.StatusDec,
          AbnormalStatus: obj.AbnormalStatus,
          AbnormalStatusDec: obj.AbnormalStatusDec
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_TO_2_SET', payload: null})
    // this.setState({
    //   visible: false,
    //   value: null,
    //   dataList: [],
    //   confirmLoading: false
    // }, () => {
    //   this.props.onCancel()
    // })
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value
    })
  },
  handleModify() {
    ModalPrompt({
      onPrompt: ({value}) => {
        const OrderAbnormal = value !== '' ? value.split(/,|，/).join(',') : ''
        return new Promise((resolve, reject) => {
          startLoading()
          ZPost('Order/InsertOrderAbnormal', {
            OrderAbnormal
          }, ({d}) => {
            resolve()
            this.setState({
              dataList: d
            })
          }, reject).then(endLoading)
        })
      },
      children: (
        <div className='mb10'>
          请输入自定义异常，逗号分隔多个异常。<br />请不要输入特殊字符，单个异常长度不能超过20。<br />灰色带下划线为自定义异常。
        </div>
      ),
      value: this.state.dataList.length ? this.state.dataList.reduce(function(a, b) {
        if (b.iscustom) {
          a.push(b.label)
        }
        return a
      }, []).join(',') : ''
    })
  },
  rendFooter() {
    return (
      <div className='clearfix tl'>
        <Button type='primary' className='pull-right' onClick={this.handleOK} loading={this.state.confirmLoading}>确认</Button>
        <Button type='ghost' size='small' onClick={this.handleModify}>维护自定义异常</Button>
      </div>
    )
  },
  render() {
    return (
      <Modal title='请输入标记异常的类型,输入相关说明' footer={this.rendFooter()} visible={this.state.visible} onCancel={this.handleok} width={666}>
        <div className={styles.hua1}>
          <div className='flex-grow'>
            <RadioGroup onChange={this.handleRadio} value={this.state.value}>
              {this.state.dataList.map(x => {
                if (x.iscustom) {
                  return <Radio key={x.value} value={x.value} className={styles.customExcecption}>{x.label}</Radio>
                }
                return <Radio key={x.value} value={x.value}>{x.label}</Radio>
              })}
            </RadioGroup>
          </div>
          <div className='flex-row' style={{height: 30}}>
            <div style={{ lineHeight: '28px' }}><span>异常描述：</span></div>
            <div className='flex-grow'><Input ref='zch' /></div>
          </div>
        </div>
      </Modal>
    )
  }
}))
const ToCancel3 = connect(state => ({
  doge: state.order_list_to_1
}))(createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: null,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      startLoading()
      ZGet({
        uri: 'Order/GetCancleList',
        success: ({d}) => {
          const lst = d && d instanceof Array ? d : []
          this.setState({
            visible: true,
            dataList: lst
          })
        }
      }).then(endLoading)
    } else {
      this.setState({
        visible: false,
        value: null,
        dataList: [],
        confirmLoading: false
      })
    }
  },
  handleOK() {
    const {value} = this.state
    if (!value) {
      return message.warning('请选择取消原因')
    }
    this.setState({
      confirmLoading: true
    })
    const Remark = this.refs.zch.refs.input.value
    ZPost('Order/CancleOrder', {OID: [this.props.OID], CancleReason: value, Remark}, ({d}) => {
      this.handleok()
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.props.onChange({
          Status: obj.Status,
          StatusDec: obj.StatusDec,
          AbnormalStatus: obj.AbnormalStatus,
          AbnormalStatusDec: obj.AbnormalStatusDec
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_TO_1_SET', payload: null})
    // this.setState({
    //   visible: false,
    //   value: null,
    //   dataList: [],
    //   confirmLoading: false
    // }, () => {
    //   this.props.onCancel()
    // })
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value
    })
  },
  render() {
    return (
      <Modal title='取消描述' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={676}>
        <Alert message='您正在取消订单,注意订单一旦取消将会同步到线上,请仔细考虑操作' type='warning' />
        <div className={styles.hua1}>
          <div className='flex-grow'>
            <RadioGroup onChange={this.handleRadio} value={this.state.value}>
              {this.state.dataList.map(x => <Radio key={x.value} value={x.value}>{x.label}</Radio>)}
            </RadioGroup>
          </div>
          <div className='flex-row' style={{height: 30}}>
            <div style={{ lineHeight: '28px' }}><span>取消原因：</span></div>
            <div className='flex-grow'><Input ref='zch' /></div>
          </div>
        </div>
      </Modal>
    )
  }
}))
export default ComDetail1
