/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-09 AM
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
    headerName: '内部支付号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '支付时间',
    cellStyle: {textAlign: 'center'},
    field: 'PayDate',
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
    width: 160,
    cellRendererFramework: React.createClass({
      _handleOp1() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Pay/ComfirmPay', {
          ID: this.props.data.ID
        }, () => {
          this.props.data.Status = 1
          this.props.api.refreshRows([this.props.node])
        }))
      },
      _handleOp0() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Pay/CancleComfirmPay', {
          ID: this.props.data.ID
        }, () => {
          this.props.data.Status = 0
          this.props.api.refreshRows([this.props.node])
        }))
      },
      _handleOp2() {
        const grid = this.props.api.gridOptionsWrapper.gridOptions.grid.grid
        grid.x0pCall(ZPost('Pay/CanclePay', {
          ID: this.props.data.ID
        }, () => {
          this.props.data.Status = 2
          this.props.api.refreshRows([this.props.node])
        }))
      },
      render() {
        const Status = this.props.data.Status
        if (Status === 1) {
          return (
            <Button type='ghost' size='small' onClick={this._handleOp0}>取消审核</Button>
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
    headerName: '线上订单号',
    field: 'SoID',
    width: 100
  }, {
    headerName: '支付单号',
    field: 'PayNbr',
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
    field: 'PayAmount',
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
    headerName: '支付方式',
    field: 'Payment',
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
  // }, {
  //   headerName: '售后单号',
  //   field: 'Remark',
  //   cellStyle: {textAlign: 'center'},
  //   width: 130
  }]
const gridOptions = {
  editType: 'fullRow',
  onRowValueChanged: function(e) {
    const data = {
      ID: e.data.ID,
      Paydate: e.data.Paydate,
      PayAmount: e.data.PayAmount,
      PayNbr: e.data.PayNbr,
      Payment: e.data.Payment,
      PayAccount: e.data.PayAccount
    }
    this.grid.grid.x0pCall(ZPost('Pay/UpdatePay', data, ({d}) => {
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
    const uri = 'Pay/GetPayinfoList'
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
        rowData: d.Pay,
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
              params.success(d.Pay)
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
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanghua_02394' }} columnDefs={defColumns} paged grid={this} />
        <OrderDetail />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.sale_out_conditions
}))(Main)
