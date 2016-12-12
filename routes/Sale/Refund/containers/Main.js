/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-10 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
import {
  Select,
  Input,
  DatePicker,
  Button
} from 'antd'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import OrderDetail from 'components/OrderDetail'
import AfterSaleDetail from 'components/AfterSaleDetail'
import moment from 'moment'
const Option = Select.Option
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
const defColumns = [
  {
    headerName: '店铺',
    field: 'ShopName',
    width: 160
  }, {
    headerName: '内部退款单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '退款时间',
    cellStyle: {textAlign: 'center'},
    field: 'RefundDate',
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
          value: moment(this.props.value)
        }
      },
      getValue() {
        return this.state.value.format()
      },
      handleChange(e) {
        this.setState({ value: e })
      },
      render() { return <DatePicker format='YYYY-MM-DD HH:mm:ss' showTime value={this.state.value} onChange={this.handleChange} /> }
    })
  }, {
    headerName: '操作',
    width: 200,
    cellRendererFramework: React.createClass({
      _handleOp1() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Refund/ComfirmRefund', {
          ID: this.props.data.ID
        }, ({d}) => {
          this.props.node.setData(Object.assign(this.props.data, d))
          this.props.api.refreshRows([this.props.node])
        }))
      },
      _handleOp0() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Refund/CancleComfirmRefund', {
          ID: this.props.data.ID
        }, ({d}) => {
          this.props.node.setData(Object.assign(this.props.data, d))
          this.props.api.refreshRows([this.props.node])
        }))
      },
      _handleOp2() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Refund/CancleRefund', {
          ID: this.props.data.ID
        }, ({d}) => {
          this.props.node.setData(Object.assign(this.props.data, d))
          this.props.api.refreshRows([this.props.node])
        }))
      },
      _handleOp3() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Refund/CompleteRefund', {
          ID: this.props.data.ID
        }, ({d}) => {
          this.props.node.setData(Object.assign(this.props.data, d))
          this.props.api.refreshRows([this.props.node])
        }))
      },
      render() {
        const Status = this.props.data.Status
        if (Status === 1) {
          return (
            <div>
              <Button type='ghost' size='small' onClick={this._handleOp0}>取消审核</Button>
              <Button type='ghost' size='small' onClick={this._handleOp3}>完成</Button>
            </div>
          )
        }
        if (Status === 0) {
          return (
            <div>
              <Button type='primary' size='small' onClick={this._handleOp1}>审核通过</Button>
              &nbsp;
              <Button type='dashed' size='small' onClick={this._handleOp2}>作废</Button>
            </div>
          )
        }
        return null
      }
    })
  }, {
    headerName: '内部订单号',
    field: 'OID',
    cellStyle: {textAlign: 'center'},
    width: 100,
    cellRendererFramework: ({data, value, api}) => {
      return (
        <a onClick={() => {
          api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_DETAIL_1_SET', payload: value})
        }}>{value}</a>
      )
    }
  }, {
    headerName: '审核时间',
    field: 'ConfirmDate',
    width: 120
  }, {
    headerName: '修改时间',
    field: 'ModifyDate',
    width: 120
  }, {
    headerName: '线上订单号',
    field: 'SoID',
    width: 110
  }, {
    headerName: '退款单号',
    field: 'RefundNbr',
    width: 130,
    cellClass: function(params) {
      return params.data.Status === 0 ? 'editable' : ''
    },
    editable: function(params) {
      return params.node.data.Status === 0
    },
    cellEditorFramework: InputEditor
  }, {
    headerName: '金额',
    field: 'Amount',
    width: 80,
    cellClass: function(params) {
      return params.data.Status === 0 ? 'editable' : ''
    },
    editable: function(params) {
      return params.node.data.Status === 0
    },
    cellEditorFramework: NumberEditor
  }, {
    headerName: '状态',
    field: 'StatusString',
    width: 90,
    cellClass: function(params) {
      return styles[`status${params.data.Status}`]
    }
  }, {
    headerName: '退款方式',
    field: 'Refundment',
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
          value: this.props.node.data.Payment
        }
      },
      getValue() {
        return this.state.value
      },
      handleChange(e) {
        this.setState({ value: e })
      },
      render() {
        const types = this.props.api.gridOptionsWrapper.gridOptions.grid._pres.Payment
        return (
          <Select value={this.state.value} onChange={this.handleChange} ref='zhang'>
            {types && types.length ? types.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
          </Select>
        )
      }
    })
  }, {
    headerName: '买家支付账号',
    field: 'PayAccount',
    width: 130,
    cellClass: function(params) {
      return params.data.Status === 0 ? 'editable' : ''
    },
    editable: function(params) {
      return params.node.data.Status === 0
    },
    cellEditorFramework: InputEditor
  }, {
    headerName: '买家店铺账号',
    field: 'BuyerShopID',
    width: 130
  }, {
    headerName: '售后单号',
    field: 'RID',
    cellStyle: {textAlign: 'center'},
    width: 100,
    cellRendererFramework: ({data, value, api}) => {
      return (
        <a onClick={() => {
          api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_AFTER_DETAIL_VIS_SET', payload: {rowIndex: 0, ID: value}})
        }}>{value}</a>
      )
    }
  }, {
    headerName: '售后分类',
    field: 'RTypeString',
    width: 100
  }, {
    headerName: '售后问题类型',
    field: 'IssueTypeString',
    width: 130
  }, {
    headerName: '售后备注',
    field: 'RRmark',
    width: 200
  }]
const gridOptions = {
  editType: 'fullRow',
  onRowValueChanged: function(e) {
    const data = {
      ID: e.data.ID,
      RefundDate: e.data.RefundDate,
      Amount: e.data.Amount,
      RefundNbr: e.data.RefundNbr,
      Refundment: e.data.Refundment,
      PayAccount: e.data.PayAccount
    }
    this.grid.grid.x0pCall(ZPost('Refund/UpdateRefund', data, ({d}) => {
      e.node.setData(d)
      this.grid.grid.api.refreshRows([e.node])
    }))
  }
}
const Main = React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  _pres: {},
  _firstBlood(_data) {
    const conditions = _data || this.props.conditions || {}
    this.grid.showLoading()
    const uri = 'Refund/GetRefundinfoList'
    const data = Object.assign({
      PageIndex: 1,
      NumPerPage: this.grid.getPageSize()
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this._pres = {
        Payment: d.Payment
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Refund,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageIndex: params.page,
              NumPerPage: params.pageSize
            }, this.props.conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Refund)
            }, ({m}) => {
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
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanghua_023958' }} columnDefs={defColumns} paged grid={this} />
        <OrderDetail />
        <AfterSaleDetail />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.sale_refund_conditions
}))(Main)
