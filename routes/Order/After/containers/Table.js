/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-02 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
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
import {
  message,
  Button,
  Modal,
  Form,
  Col,
  Input,
  InputNumber,
  Select,
  Row,
  Icon,
  Popconfirm,
  Radio,
  notification
} from 'antd'
import DetailModal from 'components/AfterSaleDetail'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
import DistributorModal from 'components/DistributorPicker/Modal'
import {
  ButtonModal,
  BindModal
} from './Test'
const FormItem = Form.Item
const createForm = Form.create
const RadioGroup = Radio.Group
const Option = Select.Option
const ButtonGroup = Button.Group
export default connect(state => ({
  conditions: state.order_after_conditions
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
  _pres: {},
  _firstBlood(_conditions) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'AfterSale/GetAsList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      console.log(d)
      if (this.ignore) {
        return
      }
      this._pres = {
        Result: d.Result,
        Type: d.Type,
        Warehouse: d.Warehouse
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.AfterSale,
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
              params.success(d.AfterSale)
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
  updateRowByIndex(rowIndex, data) {
    const nodes = this.grid.api.getSelectedNodes()
    const index = nodes.findIndex(x => x.rowIndex === rowIndex)
    if (index !== -1) {
      Object.assign(nodes[index].data, data)
      this.grid.api.refreshRows([nodes[index]])
    }
  },
  refreshRowByIndex(index) {
    const nodes = this.grid.api.getSelectedNodes()
    const node = nodes[index]
    if (node) {
      startLoading()
      ZGet('AfterSale/RefreshAS', {RID: node.data.ID}, ({d}) => {
        node.setData(d.AfterSale)
        this.grid.api.refreshRows([node])
      }).then(endLoading)
    } else {
      this.refreshRowData()
    }
  },
  _batchPlayer(uri) {
    const nodes = this.grid.api.getSelectedNodes()
    const ids = nodes.map(x => x.data.ID)
    if (!ids.length) {
      message.info('请先选择')
      return
    }
    this.grid.x0pCall(ZPost(`AfterSale/${uri}`, {RID: ids}, ({d}) => {
      console.log(d)
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        Object.assign(x.data, qq)
      }, null, nodes, this.grid)
    }))
  },
  handleBatchConfirm() {
    this._batchPlayer('ConfirmAfterSale')
  },
  handleBatchConfirmProduct() {
    this._batchPlayer('ConfirmGoods')
  },
  handleBatchCancelProduct() {
    this._batchPlayer('CancleGoods')
  },
  handleBatchObs() {
    this._batchPlayer('CancleAfterSale')
  },
  handleBatchConfirmToDis() {
    Modal.warn({
      title: '需第三方接口'
    })
  },
  handleBatchToDis() {
    const ids = this.getSelectIDs()
    if (ids) {
      this.props.dispatch({type: 'ORDER_AFTER_DISTRIBUTOR_VIS_1_SET', payload: ids})
    }
  },
  handleBatchAgree1() {
    this._batchPlayer('AgressReturn')
  },
  handleBatchRefuse1() {
    this._batchPlayer('DisagressReturn')
  },
  render() {
    return (
      <div className='flex-column flex-grow'>
        <ZGrid gridOptions={gridOptions} className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'order_aftersale' }} columnDefs={defColumns} paged grid={this}>
          批量：
          <ButtonGroup>
            <Popconfirm title='操作？' onConfirm={this.handleBatchAgree1}>
              <Button type='primary' size='small'>同意退货</Button>
            </Popconfirm>
            <Popconfirm title='操作？' onConfirm={this.handleBatchRefuse1}>
              <Button type='ghost' size='small'>拒绝退货</Button>
            </Popconfirm>
          </ButtonGroup>
          &emsp;
          <ButtonGroup>
            <Popconfirm title='确认操作？' onConfirm={this.handleBatchConfirm}>
              <Button type='primary' size='small' icon='check'>确认</Button>
            </Popconfirm>
            <Popconfirm title='作废操作？' onConfirm={this.handleBatchObs}>
              <Button type='ghost' size='small'>作废</Button>
            </Popconfirm>
          </ButtonGroup>
          &emsp;
          <ButtonGroup>
            <Button type='ghost' size='small' onClick={this.handleBatchConfirmProduct}>确认收货</Button>
            <Button type='ghost' size='small' onClick={this.handleBatchCancelProduct}>取消收货</Button>
          </ButtonGroup>
          &emsp;
          <ButtonGroup>
            <Button type='primary' size='small' onClick={this.handleBatchConfirmToDis} icon='check'>确认给供货商</Button>
            <Button type='ghost' size='small' onClick={this.handleBatchToDis}>提交给分销商</Button>
          </ButtonGroup>
        </ZGrid>
        <CreateModal zch={this} /><DetailModal zch={this} />
        <BindModal zch={this} /><BatchDistributor1 zch={this} />
      </div>
    )
  }
}))
const BatchDistributor1 = connect(state => ({
  doge: state.order_after_distributor_vis_1
}))(React.createClass({
  handleModalOk(value) {
    if (typeof value === 'undefined') {
      return message.error('请选择供销商')
    }
    Modal.warn({
      title: '需第三方接口',
      onOk: () => this.handleModalCancel()
    })
    //const nodes = this.props.zch.grid.api.getSelectedNodes()
    // this.props.zch.grid.x0pCall(ZPost('Order/SetSupDistributor', {OID: this.props.doge, SupDistributor: value}, ({d}) => {
    //   this.handleModalCancel()
    //   parseBatchOperatorResult.call(this, d, function(x, qq) {
    //     Object.assign(x.data, qq)
    //   }, ['Status', 'SupDistributor'], nodes, this.props.zch.grid)
    // }))
  },
  handleModalCancel() {
    this.props.dispatch({type: 'ORDER_AFTER_DISTRIBUTOR_VIS_1_SET', payload: null})
  },
  render() {
    return (
      <DistributorModal hideClear visible={this.props.doge !== null} onOk={this.handleModalOk} onCancel={this.handleModalCancel} />
    )
  }
}))
const gridOptions = {
  editType: 'fullRow',
  onRowValueChanged: function(e) {
    const Status = e.data.Status
    if ([0, 1].indexOf(Status) !== -1) {
      const data = {
        RID: e.data.ID,
        WarehouseID: e.data.WarehouseID,
        Remark: e.data.Remark,
        Express: e.data.Express,
        ExCode: e.data.ExCode
      }
      if (Status === 0) {
        data.Type = e.data.Type
        data.SalerReturnAmt = e.data.SalerReturnAmt
        data.BuyerUpAmt = e.data.BuyerUpAmt
        data.ReturnAccount = e.data.ReturnAccount
        data.Result = e.data.Result
      }
      this.grid.grid.x0pCall(ZPost('AfterSale/UpdateAfterSale', data, ({d}) => {
        e.node.setData(d)
        this.grid.gird.refreshRows([e.node])
      }, ({d}) => {
        e.node.setData(d)
        this.grid.gird.refreshRows([e.node])
      }))
    }
  },
  onRowSelected: function(e) {
    if (e.node.selected) {
      this.grid.props.dispatch({type: 'ORDER_AFTER_ORDER_DETAIL_VIS_2_SET', payload: {
        RID: e.node.data.ID
      }})
    }
  }
}
const NumberEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    return this.state.value
  },
  afterGuiAttached() {
    const input = this.refs.zhang.refs.input
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
  },
  handleChange(e) {
    this.setState({ value: Math.max(e.target.value, 0) })
  },
  render() { return <Input type='number' ref='zhang' min={0} value={this.state.value} onChange={this.handleChange} /> }
})
const InputEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || ''
    }
  },
  getValue() {
    return this.state.value
  },
  afterGuiAttached() {
    const input = this.refs.zhang.refs.input
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
  },
  handleChange(e) {
    this.setState({ value: e.target.value })
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const defColumns = [{
  headerName: '#',
  width: 30,
  checkboxSelection: true,
  pinned: true
}, {
  headerName: '售后单号',
  field: 'ID',
  width: 100,
  cellStyle: {textAlign: 'center'}
}, {
  headerName: '订单号',
  field: 'OID',
  width: 100
}, {
  headerName: '登记日期',
  field: 'RegisterDate',
  cellStyle: {textAlign: 'center'},
  width: 120
}, {
  headerName: '',
  width: 120,
  suppressMenu: true,
  cellRendererFramework: React.createClass({
    render() {
      const {data, api, rowIndex} = this.props
      const dispatch = api.gridOptionsWrapper.gridOptions.grid.props.dispatch
      return (
        <div>
          <Button size='small' type='primary' onClick={() => {
            dispatch({type: 'ORDER_AFTER_DETAIL_VIS_SET', payload: {rowIndex, ID: data.ID}})
          }}>详情</Button>
          &nbsp;
          {data.OID === -1 && data.Status === 0 ? (
            <Button size='small' type='ghost' onClick={() => {
              dispatch({type: 'ORDER_AFTER_BIND_ORDER_VIS_1_SET', payload: {rowIndex, ID: data.ID}})
            }}>绑定</Button>
          ) : null}
        </div>
      )
    }
  })
}, {
  headerName: '买家账号',
  field: 'BuyerShopID',
  width: 100
}, {
  headerName: '收货人',
  field: 'RecName',
  width: 100
}, {
  headerName: '售后分类',
  field: 'TypeString', //Type
  width: 100,
  cellClass: function(params) {
    const editable = params.data.Status === 0 ? ' editable' : ''
    return styles[`type${params.data.Type}`] + editable
  },
  editable: function(params) {
    return params.node.data.Status === 0
  },
  cellEditorFramework: React.createClass({
    getInitialState() {
      return {
        value: this.props.node.data.Type + ''
      }
    },
    getValue() {
      this.props.node.data.Type = this.state.value
      const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Type
      const index = types.findIndex(x => x.value === this.state.value)
      return types[index].label
    },
    handleChange(e) {
      this.setState({ value: e })
    },
    render() {
      const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Type
      return (
        <Select value={this.state.value} onChange={this.handleChange} ref='zhang'>
          {types && types.length ? types.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
        </Select>
      )
    }
  })
}, {
  headerName: '手机',
  field: 'RecPhone',
  width: 100
}, {
  headerName: '卖家应退款',
  field: 'SalerReturnAmt',
  width: 100,
  cellClass: function(params) {
    return params.data.Status === 0 ? 'editable' : ''
  },
  editable: function(params) {
    return params.node.data.Status === 0
  },
  cellEditorFramework: NumberEditor
}, {
  headerName: '买家应偿款',
  field: 'BuyerUpAmt',
  width: 100,
  cellClass: function(params) {
    return params.data.Status === 0 ? 'editable' : ''
  },
  editable: function(params) {
    return params.node.data.Status === 0
  },
  cellEditorFramework: NumberEditor
}, {
  headerName: '实际应退款',
  field: 'RealReturnAmt',
  width: 100
}, {
  headerName: '退款账号',
  field: 'ReturnAccount',
  width: 100,
  cellClass: function(params) {
    return params.data.Status === 0 ? 'editable' : ''
  },
  editable: function(params) {
    return params.node.data.Status === 0
  },
  cellEditorFramework: InputEditor
}, {
  headerName: '店铺',
  field: 'ShopName',
  width: 180
}, {
  headerName: '仓库',
  field: 'RecWarehouse',
  width: 180,
  cellClass: function(params) {
    return [0, 1].indexOf(params.data.Status) !== -1 ? 'editable' : ''
  },
  editable: function(params) {
    return [0, 1].indexOf(params.node.data.Status) !== -1
  },
  cellEditorFramework: React.createClass({
    getInitialState() {
      return {
        value: this.props.node.data.WarehouseID + ''
      }
    },
    getValue() {
      this.props.node.data.WarehouseID = this.state.value
      const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Warehouse
      const index = types.findIndex(x => x.value === this.state.value)
      return types[index].label
    },
    handleChange(e) {
      this.setState({ value: e })
    },
    render() {
      const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Warehouse
      return (
        <Select value={this.state.value} onChange={this.handleChange} ref='zhang'>
          {types && types.length ? types.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
        </Select>
      )
    }
  })
}, {
  headerName: '线上订单号',
  field: 'SoID',
  width: 120
}, {
  headerName: '问题类型',
  field: 'IssueTypeString', //IssueType
  width: 120
}, {
  headerName: '原订单类型',
  field: 'OrdTypeString', //OrdType
  width: 100
}, {
  headerName: '备注',
  field: 'Remark',
  width: 200,
  cellClass: function(params) {
    return [0, 1].indexOf(params.data.Status) !== -1 ? 'editable' : ''
  },
  editable: function(params) {
    return [0, 1].indexOf(params.node.data.Status) !== -1
  },
  cellEditorFramework: InputEditor
}, {
  headerName: '状态',
  field: 'StatusString', //StatusString Status
  width: 60,
  cellClass: function(params) {
    return styles[`status${params.data.Status}`]
  }
}, {
  headerName: '线上状态',
  field: 'ShopStatus',
  width: 150
}, {
  headerName: '处理结果',
  field: 'ResultString', //Result
  width: 120,
  cellClass: function(params) {
    return params.data.Status === 0 ? 'editable' : ''
  },
  editable: function(params) {
    return params.node.data.Status === 0
  },
  cellEditorFramework: React.createClass({
    getInitialState() {
      return {
        value: this.props.node.data.Result + ''
      }
    },
    getValue() {
      this.props.node.data.Result = this.state.value
      const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Result
      const index = types.findIndex(x => x.value === this.state.value)
      return types[index].label
    },
    handleChange(e) {
      this.setState({ value: e })
    },
    render() {
      const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Result
      return (
        <Select value={this.state.value} onChange={this.handleChange} ref='zhang'>
          {types && types.length ? types.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
        </Select>
      )
    }
  })
}, {
  headerName: '货物状态',
  field: 'GoodsStatus',
  width: 120
}, {
  headerName: '最后修改日期',
  field: 'ModifyDate',
  width: 120
}, {
  headerName: '修改人',
  field: 'Modifier',
  width: 100
}, {
  headerName: '创建人',
  field: 'Creator',
  width: 100
}, {
  headerName: '退款状态',
  field: 'RefundStatus',
  width: 120
}, {
  headerName: '快递公司',
  field: 'Express',
  width: 100,
  cellClass: function(params) {
    return [0, 1].indexOf(params.data.Status) !== -1 ? 'editable' : ''
  },
  editable: function(params) {
    return [0, 1].indexOf(params.node.data.Status) !== -1
  },
  cellEditorFramework: InputEditor
}, {
  headerName: '快递单号',
  field: 'ExCode',
  width: 100,
  cellClass: function(params) {
    return [0, 1].indexOf(params.data.Status) !== -1 ? 'editable' : ''
  },
  editable: function(params) {
    return [0, 1].indexOf(params.node.data.Status) !== -1
  },
  cellEditorFramework: InputEditor
}, {
  headerName: '已提交供销商',
  field: 'IsSubmit',
  width: 80,
  cellStyle: {textAlign: 'center'},
  cellRenderer: function(params) {
    return params.value ? '是' : '否'
  }
}, {
  headerName: '最后确认日期',
  field: 'ConfirmDate',
  width: 120
}]
const CreateModal = connect(state => ({
  doge: state.order_after_create_vis_1
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      confirmLoading: false,
      visible: false,
      data: {}
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge !== this.props.doge) {
      if (nextProps.doge === 0) {
        return this.setState({
          visible: false,
          data: {}
        })
      }
      startLoading()
      ZGet('AfterSale/InsertASInit', ({d}) => {
        this.setState({
          visible: true,
          data: d
          //title: nextProps.doge === 2 ? '创建新的售后单' : '创建无信息件售后单',
          //width: nextProps.doge === 2 ? 900 : 700
        })
      }).then(endLoading)
    }
  },
  handleHide() {
    this.props.dispatch({type: 'ORDER_AFTER_CREATE_VIS_1_SET', payload: 0})
    this.props.form.resetFields()
  },
  handleOk() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return
      }
      const data = Object.assign({}, values)
      if (data.OID && data.OID.id) {
        data.DocumentType = 'A'
        data.OID = data.OID.id
      } else {
        delete data.OID
        data.DocumentType = 'B'
      }
      this.setState({
        confirmLoading: true
      })
      ZPost('AfterSale/InsertAfterSale', data, ({d}) => {
        this.props.zch.refreshRowData()
        this.handleHide()
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const {data} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal width={699} title='创建售后单' visible={this.state.visible} onCancel={this.handleHide} onOk={this.handleOk}>
        <Form horizontal className='pos-form form-sm'>
          <FormItem {...formItemLayout} label='指定信息件'>
            {getFieldDecorator('OID')(
              <ButtonModal />
            )}
            <span className='ant-form-text'>如果不指定信息件，该笔售后单将默认为[<strong>无信息件售后单</strong>]</span>
          </FormItem>
          <div className='hr' />
          <FormItem {...formItemLayout} label='选择退货仓库'>
            {getFieldDecorator('WarehouseID', {
              initialValue: data.DefaultWare ? data.DefaultWare + '' : undefined,
              rules: [
                {required: true, message: '必选'}
              ]
            })(
              <Select style={{width: 180}} size='small' placeholder='请选择退货仓'>
                {data.Warehouse && data.Warehouse.length ? data.Warehouse.map(x => <Option value={x.value} key={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <Row>
            <Col span={4}>
              <div className='tr'>
                <div className='ant-form-item-label'>
                  <label>买家退回快递</label>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className='ant-form-item-control'>
                <FormItem>
                  {getFieldDecorator('Express')(
                    <Input size='small' />
                  )}
                </FormItem>
              </div>
            </Col>
            <Col span={5}>
              <div className='tr'>
                <div className='ant-form-item-label'>
                  <label>买家退回快递单号</label>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='ant-form-item-control'>
                <FormItem>
                  {getFieldDecorator('ExCode')(
                    <Input size='small' />
                  )}
                </FormItem>
              </div>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label='售后问题分类'>
            {getFieldDecorator('IssueType', {
              rules: [
                {required: true, message: '必选'}
              ]
            })(
              <Select style={{width: 180}} size='small' placeholder='请选择售后问题分类'>
                {data.IssueType && data.IssueType.length ? data.IssueType.map(x => <Option value={x.value} key={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='售后类型'>
            {getFieldDecorator('Type', {
              rules: [
                {required: true, message: '必选'}
              ]
            })(
              <RadioGroup size='small'>
                {data.Type && data.Type.length ? data.Type.map(x => <Radio key={x.value} value={x.value}>{x.label}</Radio>) : null}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='问题描述'>
            {getFieldDecorator('Remark')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='卖家应退金额'>
            {getFieldDecorator('SalerReturnAmt')(
              <InputNumber step={0.01} size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='买家补偿金额'>
            {getFieldDecorator('BuyerUpAmt')(
              <InputNumber step={0.01} size='small' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))

const parseFailds = function(FailIDs, errmsg) {
  if (FailIDs && FailIDs instanceof Array && FailIDs.length) {
    const description = (<div className={styles.processDiv}>
      <ul>
        {FailIDs.map(x => {
          return (
            <li key={x.ID}>
              售后单(<strong>{x.ID}</strong>)<span>{x.Reason}</span>
            </li>
          )
        })}
      </ul>
      <div className='hr' />
      <div className='mt5 tr'><small className='gray'>请检查相关售后单或刷新</small></div>
    </div>)
    Modal.warning({
      title: errmsg || '处理结果问题反馈',
      content: description,
      width: 480,
      onOk: function() {
        notification.error({
          message: '异常售后单操作',
          description: <div className='break'>{FailIDs.map(x => x.ID).join(',')}</div>,
          icon: <Icon type='meh-o' />,
          duration: null
        })
      }
    })
  }
}
const parseBatchOperatorResult = function(d, cb, fields, nodes, grid, errmsg) {
  if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
    const successIDs = {}
    const IDs = []
    for (let v of d.SuccessIDs) {
      successIDs[`${v.ID}`] = v
      IDs.push(v.ID)
    }
    const _nodes = nodes || (grid ? grid.api.getSelectedNodes() : this.props.zch.grid.api.getSelectedNodes())
    _nodes.forEach(x => {
      if (IDs.indexOf(x.data.ID) !== -1) {
        cb(x, successIDs[`${x.data.ID}`])
      }
    })
    if (fields === null) {
      if (grid) {
        grid.api.refreshRows(_nodes)
      } else {
        this.props.zch.grid.api.refreshRows(_nodes)
      }
    } else {
      if (grid) {
        grid.api.refreshCells(_nodes, fields)
      } else {
        this.props.zch.grid.api.refreshCells(_nodes, fields)
      }
    }
  }
  parseFailds(d.FailIDs, errmsg)
}
