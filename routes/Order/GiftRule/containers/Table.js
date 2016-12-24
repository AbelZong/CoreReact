import React from 'react'
import {
  connect
} from 'react-redux'
import update from 'react-addons-update'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  startLoading,
  endLoading
} from 'utils'
import {
  Timeline,
  message,
  Checkbox,
  Button,
  Modal,
  Form,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Row,
  Tag
} from 'antd'
import moment from 'moment'
import styles from './index.scss'
import SkuAppend from 'components/SkuPicker/append'
import ZGrid from 'components/Grid/index'
const FormItem = Form.Item
const createForm = Form.create
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
export default connect(state => ({
  conditions: state.order_giftrule_conditions
}), null, null, { withRef: true })(React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  shouldComponentUpdate() {
    return false
  },
  refreshRowData() {
    this._firstBlood()
  },
  _firstBlood(_conditions) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Gift/GetGiftRuleList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      console.log(d)
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Gift,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              NumPerPage: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Gift)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  getSelectIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length) {
      return ids
    }
    message.info('请先选择')
    return false
  },
  render() {
    return (
      <div className='flex-column flex-grow'>
        <ZGrid gridOptions={gridOptions} className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'order_giftrules' }} columnDefs={defColumns} paged grid={this} />
        <CreateModal zch={this} />
        <LogModal />
      </div>
    )
  }
}))
const gridOptions = {}
const defColumns = [{
  headerName: '规则号',
  field: 'ID',
  width: 100,
  cellStyle: {textAlign: 'center'}
}, {
  headerName: '名称',
  field: 'GiftName',
  width: 220
}, {
  headerName: '状态',
  field: 'Status',
  width: 90,
  cellClass: function(params) {
    return params.value === '生效' ? styles.greenBG : styles.grayBG
  }
}, {
  headerName: '操作',
  width: 150,
  cellStyle: {textAlign: 'center'},
  cellRendererFramework: React.createClass({
    handleDisable() {
      const grid = this.props.api.gridOptionsWrapper.gridOptions.grid
      grid.grid.x0pCall(ZPost('Gift/DisableRule', {ID: this.props.data.ID}, () => {
        this.props.data.Enable = false
        this.props.api.refreshRows([this.props.node])
      }))
    },
    handleEnable() {
      const grid = this.props.api.gridOptionsWrapper.gridOptions.grid
      grid.grid.x0pCall(ZPost('Gift/EnableRule', {ID: this.props.data.ID}, () => {
        this.props.data.Enable = true
        this.props.api.refreshRows([this.props.node])
      }))
    },
    handleLog() {
      this.props.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_GIFTRULE_MODAL_2_VIS_SET', payload: this.props.data.ID})
    },
    _renderAbler() {
      if (this.props.data.Enable) {
        return (
          <Button type='ghost' size='small' onClick={this.handleDisable} title='当前状态：启用中，点击禁用'>禁用</Button>
        )
      }
      return (
        <Button type='ghost' size='small' onClick={this.handleEnable} title='当前状态：禁用中，点击启用'>启用</Button>
      )
    },
    handleModify() {
      this.props.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_GIFTRULE_MODAL_1_VIS_SET', payload: this.props.data.ID})
    },
    render() {
      return (
        <div>
          <Button type='ghost' size='small' onClick={this.handleModify}>编辑</Button>
          &nbsp;
          {this._renderAbler()}
          &nbsp;
          <Button type='ghost' size='small' onClick={this.handleLog}>日志</Button>
        </div>
      )
    }
  })
}, {
  headerName: '开始时间',
  field: 'DateFrom',
  width: 120
}, {
  headerName: '结束时间',
  field: 'DateTo',
  width: 120
}, {
  headerName: '店铺',
  field: 'AppointShop',
  width: 300
}, {
  headerName: '赠品',
  field: 'GiftNo',
  width: 260
}, {
  headerName: '包含其中任何一个商品',
  field: 'AppointSkuID',
  width: 280
}, {
  headerName: '不包含其中任何一个商品',
  field: 'ExcludeSkuID',
  width: 280
}, {
  headerName: '最小金额',
  field: 'AmtMin',
  width: 90
}, {
  headerName: '最大金额',
  field: 'AmtMax',
  width: 90
}, {
  headerName: '最小数量',
  field: 'QtyMin',
  width: 90
}, {
  headerName: '最大数量',
  field: 'QtyMax',
  width: 90
}, {
  headerName: '金额数量设定（仅针对包含的商品）',
  field: 'IsSkuIDValid',
  width: 90,
  cellRendererFramework: ({data}) => {
    return <Checkbox disabled checked={data.IsSkuIDValid} />
  }
}, {
  headerName: '折扣率',
  field: 'DiscountRate',
  width: 80
}, {
  headerName: '最多送数量',
  field: 'MaxGiftQty',
  width: 100
}, {
  headerName: '已送数量',
  field: 'GivenQty',
  width: 90
}, {
  headerName: '每数量送1组',
  field: 'QtyEach',
  width: 110
}, {
  headerName: '每金额送1组',
  field: 'AmtEach',
  width: 110
}, {
  headerName: '必须有库存',
  field: 'IsStock',
  width: 100,
  cellRendererFramework: ({data}) => {
    return <Checkbox disabled checked={data.IsStock} />
  }
}, {
  headerName: '叠加赠送',
  field: 'IsAdd',
  width: 90,
  cellRendererFramework: ({data}) => {
    return <Checkbox disabled checked={data.IsAdd} />
  }
}, {
  headerName: '启用',
  field: 'Enable',
  width: 80,
  cellRendererFramework: ({data}) => {
    return <Checkbox disabled checked={data.Enable} />
  }
}, {
  headerName: '创建时间',
  field: 'CreateDate',
  width: 120
}, {
  headerName: '修改时间',
  field: 'ModifyDate',
  width: 120
}]
const DEFAULT_DATA = {
  AppointSkuID: [],
  AppointGoodsCode: [],
  ExcludeSkuID: [],
  ExcludeGoodsCode: [],
  GiftNo: []
}
const LogModal = connect(state => ({
  doge: state.order_giftrule_modal_2_vis
}))(React.createClass({
  getInitialState() {
    return {
      visible: false,
      dataLst: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge <= 0) {
        this.setState({
          visible: false
        })
      } else {
        startLoading()
        ZGet('Gift/GetGiftLog', {ID: nextProps.doge}, ({d}) => {
          this.setState({
            dataLst: d,
            visible: true
          })
        }).then(endLoading)
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_GIFTRULE_MODAL_2_VIS_SET', payload: -1 })
  },
  render() {
    const {dataLst} = this.state
    return (
      <Modal title='查看修改日志' visible={this.state.visible} onCancel={this.hideModal} onOk={this.hideModal} width={770}>
        {!dataLst || !dataLst.length ? <div className='mt20 tc'>没有修改记录</div> : (
          <Timeline className={styles.logs}>
            {dataLst.map(x => <Timeline.Item key={x.ID}>
              <div><small>{x.LogDate}</small> - <strong>{x.Title}</strong> - {x.UserName}</div>
              <div className='mt5'>{x.Remark}</div>
            </Timeline.Item>)}
          </Timeline>
        )}
      </Modal>
    )
  }
}))
const CreateModal = connect(state => ({
  doge: state.order_giftrule_modal_1_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      data: DEFAULT_DATA,
      shops: [],
      types: []
    }
  },
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps)
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        return this.setState({
          visible: false
        })
      }
      if (nextProps.doge === 0) {
        startLoading()
        ZGet('Gift/GetInitData', ({d}) => {
          this.setState({
            visible: true,
            data: DEFAULT_DATA,
            shops: d.Shop,
            types: d.Type
          })
        }).then(endLoading)
      } else {
        startLoading()
        ZGet('Gift/GetRuleEdit', {ID: nextProps.doge}, ({d}) => {
          const {Gift} = d
          this.setState({
            visible: true,
            data: {
              AppointSkuID: Gift.AppointSkuID ? Gift.AppointSkuID.split(',') : [],
              AppointGoodsCode: Gift.AppointGoodsCode ? Gift.AppointGoodsCode.split(',') : [],
              ExcludeSkuID: Gift.ExcludeSkuID ? Gift.ExcludeSkuID.split(',') : [],
              ExcludeGoodsCode: Gift.ExcludeGoodsCode ? Gift.ExcludeGoodsCode.split(',') : [],
              GiftNo: Gift.GiftNo
            },
            shops: d.Shop,
            types: d.Type
          }, () => {
            delete Gift.AppointSkuID
            delete Gift.AppointGoodsCode
            delete Gift.ExcludeSkuID
            delete Gift.ExcludeGoodsCode
            delete Gift.giftNO
            delete Gift.ID
            Gift.OrdType = Gift.OrdType ? Gift.OrdType.split(',') : undefined
            Gift.AppointShop = Gift.AppointShop ? Gift.AppointShop.split(',') : undefined
            Gift._Date = [
              moment(Gift.DateFrom),
              moment(Gift.DateTo)
            ]
            delete Gift.DateFrom
            delete Gift.DateTo
            this.props.form.setFieldsValue(Gift)
          })
        }).then(endLoading)
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      values.DateFrom = values._Date[0].format()
      values.DateTo = values._Date[1].format()
      delete values._Date

      let uri = 'Gift/InsertGiftRule'
      if (this.props.doge > 0) {
        uri = 'Gift/UpdateGiftRule'
        values.ID = this.props.doge
      }
      this.setState({
        confirmLoading: true
      })
      const data = this.state.data
      values.OrdType = typeof values.OrdType === 'object' ? values.OrdType.join(',') : ''
      values.AppointShop = typeof values.AppointShop === 'object' ? values.AppointShop.join(',') : ''
      const cc = {
        ...values,
        AppointSkuID: data.AppointSkuID && data.AppointSkuID.length ? data.AppointSkuID.join(',') : '',
        AppointGoodsCode: data.AppointGoodsCode && data.AppointGoodsCode.length ? data.AppointGoodsCode.join(',') : '',
        ExcludeSkuID: data.ExcludeSkuID && data.ExcludeSkuID.length ? data.ExcludeSkuID.join(',') : '',
        ExcludeGoodsCode: data.ExcludeGoodsCode && data.ExcludeGoodsCode.length ? data.ExcludeGoodsCode.join(',') : '',
        GiftNo: data.GiftNo
      }
      ZPost(uri, cc, () => {
        this.props.zch.refreshRowData()
        this.hideModal()
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_GIFTRULE_MODAL_1_VIS_SET', payload: -1 })
    //this.props.form.resetFields()
  },
  appendSkus(field, ids) {
    let arr = []
    if (this.state.data[field].length) {
      let a = new Set(ids)
      let b = new Set(this.state.data[field])
      let c = new Set([...a, ...b])
      arr = Array.from(c)
    } else {
      arr = ids
    }
    this.setState(update(this.state, {
      data: {
        [`${field}`]: {
          $set: arr
        }
      }
    }))
  },
  appendGift(ids) {
    this.setState(update(this.state, {
      data: {
        GiftNo: {
          $push: [ids.join(',')]
        }
      }
    }))
  },
  handleDeleteSku(field, id, e) {
    //console.log('handleDeleteSku--', field, id, e)
    const ids = this.state.data[field]
    const index = ids.findIndex(x => x === id)
    this.setState(update(this.state, {
      data: {
        [`${field}`]: {
          $splice: [[index, 1]]
        }
      }
    }))
  },
  handleDeleteGift(text, index, e) {
    //console.log('handleDeleteGift--', e)
    //const ids = this.state.data.GiftNo
    //const index = ids.findIndex(x => x === text)
    this.setState(update(this.state, {
      data: {
        GiftNo: {
          $splice: [[index, 1]]
        }
      }
    }))
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 }
    }
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    const {data, shops, types} = this.state
    return (
      <Modal title='赠品规则设置' visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal} width={900} maskClosable={false} okText='保存'>
        <Form horizontal className={`${styles.form} pos-form`}>
          <FormItem {...formItemLayout} label='规则名称'>
            <Col span={18}>
              <FormItem>
                {getFieldDecorator('GiftName', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input size='small' />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='优先级'>
            {getFieldDecorator('Priority', {
              rules: [
                { required: true, whitespace: true, message: '必填', type: 'number' }
              ]
            })(
              <InputNumber size='small' min={0} />
            )}
            <span className='text'> 数字越小优先级越高, 除 [叠加赠送] 外只要满足一条赠品规则,则不会执行另一条规则</span>
          </FormItem>
          <FormItem {...formItemLayout} label='起始时间'>
            {getFieldDecorator('_Date', {
              rules: [
                { required: true, type: 'array', message: '必选' }
              ]
            })(
              <RangePicker size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout1} label='指定商品编码'>
            <div className={styles.custItem}>
              <SkuAppend onChange={(skus) => {
                const SkuIDs = skus.map(x => x.SkuID)
                this.appendSkus('AppointSkuID', SkuIDs)
              }} type='ghost' size='small'>添加</SkuAppend>
              <div className={styles.tags}>
                {data.AppointSkuID.length ? data.AppointSkuID.map((x, index) => <Tag color='#87d068' closable key={x} onClose={(e) => this.handleDeleteSku('AppointSkuID', x, index, e)}>{x}</Tag>) : null}
              </div>
            </div>
            <div className={styles.text}>订单必须包含其中一个商品`请编辑好【商品编码（商品SKU编码）】直接粘贴进去</div>
          </FormItem>
          <FormItem {...formItemLayout1} label='指定款式编码'>
            <div className={styles.custItem}>
              <SkuAppend onChange={(skus) => {
                const SkuIDs = skus.map(x => x.GoodsCode)
                this.appendSkus('AppointGoodsCode', SkuIDs)
              }} type='ghost' size='small'>添加</SkuAppend>
              <div className={styles.tags}>
                {data.AppointGoodsCode.length ? data.AppointGoodsCode.map((x, index) => <Tag color='#87d068' closable key={x} onClose={(e) => this.handleDeleteSku('AppointGoodsCode', x, index, e)}>{x}</Tag>) : null}
              </div>
            </div>
            <div className={styles.text}>订单必须包含其中一个商品`请编辑好【款式编码（货号）】直接粘贴进去</div>
          </FormItem>
          <FormItem {...formItemLayout1} label='排除商品编码'>
            <div className={styles.custItem}>
              <SkuAppend onChange={(skus) => {
                const SkuIDs = skus.map(x => x.SkuID)
                this.appendSkus('ExcludeSkuID', SkuIDs)
              }} type='ghost' size='small'>添加</SkuAppend>
              <div className={styles.tags}>
                {data.ExcludeSkuID.length ? data.ExcludeSkuID.map((x, index) => <Tag color='#f50' closable key={x} onClose={(e) => this.handleDeleteSku('ExcludeSkuID', x, index, e)}>{x}</Tag>) : null}
              </div>
            </div>
            <div className={styles.text}>不能包含其中一个商品`请编辑好【商品编码（商品SKU编码）】直接粘贴进去</div>
          </FormItem>
          <FormItem {...formItemLayout1} label='排除款式编码'>
            <div className={styles.custItem}>
              <SkuAppend onChange={(skus) => {
                const SkuIDs = skus.map(x => x.GoodsCode)
                this.appendSkus('ExcludeGoodsCode', SkuIDs)
              }} type='ghost' size='small'>添加</SkuAppend>
              <div className={styles.tags}>
                {data.ExcludeGoodsCode.length ? data.ExcludeGoodsCode.map((x, index) => <Tag color='#f50' closable key={x} onClose={(e) => this.handleDeleteSku('ExcludeGoodsCode', x, index, e)}>{x}</Tag>) : null}
              </div>
            </div>
            <div className={styles.text}>不能包含其中一个商品`请编辑好或【款式编码（货号）】直接粘贴进去</div>
          </FormItem>
          <div className={styles.innerW}>
            <FormItem {...formItemLayout} label='最小金额'>
              <Col span={6}>
                <FormItem>
                  {getFieldDecorator('AmtMin')(
                    <InputNumber size='small' />
                  )}
                </FormItem>
              </Col>
              <Col span={14}>
                最大金额：
                <FormItem className={styles['form-hack1']}>
                  {getFieldDecorator('AmtMax')(
                    <InputNumber size='small' />
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <FormItem {...formItemLayout} label='最小数量'>
              <Col span={6}>
                <FormItem>
                  {getFieldDecorator('QtyMin')(
                    <InputNumber size='small' />
                  )}
                </FormItem>
              </Col>
              <Col span={14}>
                最大数量：
                <FormItem className={styles['form-hack1']}>
                  {getFieldDecorator('QtyMax')(
                    <InputNumber size='small' />
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <FormItem {...formItemLayout} label='处理规则'>
              {getFieldDecorator('IsSkuIDValid', {
                valuePropName: 'checked'
              })(
                <Checkbox>金额,数量设定计算是否只针对指定包含的商品有效</Checkbox>
              )}
            </FormItem>
          </div>
          <FormItem {...formItemLayout} label='折扣率'>
            {getFieldDecorator('DiscountRate')(
              <InputNumber size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='指定店铺'>
            {getFieldDecorator('AppointShop')(
              <Select size='small' multiple style={{ width: '100%' }} placeholder='不设定则默认全部有效'>
                {shops && shops.length ? shops.map(x => <Option value={x.value} key={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='限定订单类型'>
            {getFieldDecorator('OrdType')(
              <Select size='small' multiple style={{ width: '100%' }} placeholder='不设定则默认全部有效'>
                {types && types.length ? types.map(x => <Option value={x.value} key={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
            <span className='ant-form-text'>补发换货供销+订单送赠品，须强制指定订单类型</span>
          </FormItem>
          <Row className={styles.innerW}>
            <Col span={formItemLayout.labelCol.span}>
              <div className='tr'>
                <div className='ant-form-item-label'>
                  <label>赠送商品</label>
                </div>
              </div>
            </Col>
            <Col span={formItemLayout.wrapperCol.span}>
              <div className='ant-form-item-control'>
                <div><SkuAppend onChange={(skus) => {
                  const SkuIDs = skus.map(x => x.SkuID)
                  this.appendGift(SkuIDs)
                }} type='primary'>添加一组赠品</SkuAppend></div>
                <div className={styles.evc}>
                  {data.GiftNo && data.GiftNo.length ? data.GiftNo.map((x, index) => <Tag closable key={index} onClose={e => this.handleDeleteGift(x, index, e)}>{x}</Tag>) : null}
                </div>
                <div className='clearfix'>
                  <FormItem>
                    {getFieldDecorator('IsStock', {
                      valuePropName: 'checked'
                    })(
                      <Checkbox>赠品必须有库存才送,没库存不送,不勾选则不管有无库存均送，如果赠品为组合商品，请不要勾选</Checkbox>
                    )}
                  </FormItem>
                </div>
                <div className='clearfix'>
                  <FormItem>
                    {getFieldDecorator('IsAdd', {
                      valuePropName: 'checked'
                    })(
                      <Checkbox>叠加赠送,该规则允许与其它赠送规则在同一订单中生效,不勾选有其它赠送则该规则失效</Checkbox>
                    )}
                  </FormItem>
                </div>
                <div className={styles.eve}>
                  <Col span={12}>
                    每多少数量送一组：
                    <FormItem className={styles['form-hack1']}>
                      {getFieldDecorator('QtyEach')(
                        <InputNumber size='small' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    每多少金额送一组：
                    <FormItem className={styles['form-hack1']}>
                      {getFieldDecorator('AmtEach')(
                        <InputNumber size='small' />
                      )}
                    </FormItem>
                  </Col>
                  <div className='clearfix'><span className={styles.text}>没设定,只会送一组,否则会多买多送</span></div>
                </div>
                <div className='clearfix'>
                  <FormItem>
                    {getFieldDecorator('IsMarkGift', {
                      valuePropName: 'checked',
                      initialValue: true
                    })(
                      <Checkbox>在订单商品明细中标记为赠品（否则显示为单价为0的普通商品）</Checkbox>
                    )}
                  </FormItem>
                </div>
              </div>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label='累积最大赠送数'>
            {getFieldDecorator('MaxGiftQty')(
              <InputNumber size='small' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
