/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-05 AM
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
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  Button,
  Input,
  message,
  Popover,
  Popconfirm,
  Icon
} from 'antd'
import {
  Icon as Iconfa
} from 'components/Icon'
import SkuPicker from 'components/SkuPicker/append'
import MM from './MM'
const Test = React.createClass({
  getInitialState() {
    this._version = 0
    return {
      RID: 0
    }
  },
  componentWillReceiveProps(nextProps) {
    if (!(Object.keys(nextProps.conditions).length === 1 && Object.keys(this.props.conditions).length === 1 && this.props.conditions.RID === nextProps.conditions.RID)) {
      if (nextProps.conditions.RID > 0) {
        this._version ++
        this._firstBlood(nextProps.conditions, this._version)
      } else {
        this.setState({
          RID: 0
        })
        this.grid.showNoRows()
      }
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshRowData() {
    this._firstBlood(null, this._version)
  },
  _firstBlood(_conditions, _version) {
    this.grid.showLoading()
    const data = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'AfterSale/GetAfterSaleItem'
    ZGet(uri, data, ({d}) => {
      if (_version !== this._version || this.ignore) {
        return
      }
      this.setState({
        RID: Number(data.RID),
        Status: Number(d.Status),
        Type: Number(d.Type),
        OID: Number(d.OID) //- 无信息件
      }, () => {
        if (this.ignore || [4, 5].indexOf(this.state.Type) !== -1) {
          return
        }
        this.grid.setDatasource({
          total: d.Datacnt,
          rowData: d.AfterSaleItem,
          getRows: (params) => {
            ZGet(uri, data, ({d}) => {
              if (this.ignore) {
                return
              }
              this.setState({
                Status: Number(d.Status),
                Type: Number(d.Type),
                OID: Number(d.OID)
              }, () => {
                params.success(d.AfterSaleItem)
              })
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        })
      })
    }, this.grid.showNoRows)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  renderOps() {
    const {Status, Type} = this.state
    if (Status === 0) {
      return (
        <div className='flex-row mt5 mb10'>
          <Button onClick={() => {
            this.setState({
              showMM: true
            })
          }} type='ghost' size='small' disabled={this.state.OID === -1 || [0, 2].indexOf(Type) === -1}><Icon type='plus' style={{color: 'red'}} />从订单添加退回来的商品</Button>
          {this.state.OID !== -1 ? (<MM doge={this.state.showMM} onCancel={() => {
            this.setState({
              showMM: false
            })
          }} onChange={(e) => {
            this.setState({
              showMM: false
            }, () => {
              this.grid.x0pCall(ZPost('AfterSale/InsertASItemOrder', {
                RID: this.state.RID,
                DetailID: e.map(x => x.ID)
              }, ({d}) => {
                if (d.SuccessIDs && d.SuccessIDs.length) {
                  this.grid.api.addItems(d.SuccessIDs)
                }
                if (d.FailIDs && d.FailIDs.length) {
                  console.log(d.FailIDs)
                }
              }))
            })
          }} RID={this.state.RID} />) : null}
          &nbsp;
          <SkuPicker disabled={[0, 2, 3].indexOf(Type) === -1} onChange={(e) => {
            this.grid.x0pCall(ZPost('AfterSale/InsertASItemSku', {
              RID: this.state.RID,
              SkuID: e.map(x => x.ID),
              ReturnType: 0
            }, ({d}) => {
              if (d.SuccessIDs && d.SuccessIDs.length) {
                this.grid.api.addItems(d.SuccessIDs)
              }
              if (d.FailIDs && d.FailIDs.length) {
                console.log(d.FailIDs)
              }
            }))
          }}>从商品库添加退回来的商品</SkuPicker>
          &nbsp;
          <Popconfirm title='确定要删除选中吗' onConfirm={() => {
            const ids = this.grid.api.getSelectedRows().map(x => x.ID)
            if (!ids.length) {
              return message.info('请选择商品')
            }
            this.grid.x0pCall(ZPost('AfterSale/DeleteASItem', {RID: this.state.RID, RDetailID: ids}, () => {
              this.refreshRowData()
            }))
          }}>
            <Button type='ghost' size='small' icon='delete'>删除选择行</Button>
          </Popconfirm>
          {Type === 2 ? (
            <span>
              &nbsp;
              <SkuPicker onChange={(e) => {
                this.grid.x0pCall(ZPost('AfterSale/InsertASItemSku', {
                  RID: this.state.RID,
                  SkuID: e.map(x => x.ID),
                  ReturnType: 1
                }, ({d}) => {
                  if (d.SuccessIDs && d.SuccessIDs.length) {
                    this.grid.api.addItems(d.SuccessIDs)
                  }
                  if (d.FailIDs && d.FailIDs.length) {
                    console.log(d.FailIDs)
                  }
                }))
              }}>添加换货商品</SkuPicker>
            </span>
          ) : null}
          {Type === 3 ? (
            <span>
              &nbsp;
              <SkuPicker onChange={(e) => {
                this.grid.x0pCall(ZPost('AfterSale/InsertASItemSku', {
                  RID: this.state.RID,
                  SkuID: e.map(x => x.ID),
                  ReturnType: 2
                }, ({d}) => {
                  if (d.SuccessIDs && d.SuccessIDs.length) {
                    this.grid.api.addItems(d.SuccessIDs)
                  }
                  if (d.FailIDs && d.FailIDs.length) {
                    console.log(d.FailIDs)
                  }
                }))
              }}>添加补发商品</SkuPicker>
            </span>
          ) : null}
          &nbsp;
          <Button type='ghost' size='small' className='hide'>导入退回商品</Button>
        </div>
      )
    }
    return null
  },
  render() {
    const {Type} = this.state
    if ([4, 5].indexOf(Type) !== -1) {
      return (
        <div className='mt10'>
          该类型不允许进行商品操作
        </div>
      )
    }
    return (
      <div className={styles.detailTable}>
        {this.renderOps()}
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'order_after_sale2' }} columnDefs={columnDefs} grid={this} setPleaseTip='请选择售后单'>
          <Popover content='双击明细行 编辑单元格，按回车键确认'><Iconfa type='question-circle' style={{fontSize: 14, position: 'relative'}} /></Popover>
        </ZGrid>
      </div>
    )
  }
})
const PriceEditor = React.createClass({
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
const QtyEditor = React.createClass({
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
const columnDefs = [{
  headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true
}, {
  headerName: '图片',
  field: 'img',
  width: 60,
  cellStyle: {textAlign: 'center'},
  cellRenderer: function(params) {
    const k = params.data.img
    return k ? '<img src="' + k + '" width=30 height=30>' : '-'
  }
}, {
  headerName: '商品编码',
  field: 'GoodsCode',
  width: 130
}, {
  headerName: '款式编码',
  field: 'SkuID',
  width: 130
}, {
  headerName: '商品名称',
  field: 'SkuName',
  width: 220
}, {
  headerName: '颜色规格',
  field: 'Norm',
  width: 120
}, {
  headerName: '数量',
  field: 'RegisterQty',
  width: 80,
  cellStyle: {textAlign: 'center'},
  cellEditorFramework: QtyEditor,
  cellClass: 'editable',
  editable: function(params) {
    const Status = params.api.gridOptionsWrapper.gridOptions.grid.state.Status
    return Status === 0
  }
}, {
  headerName: '实退数量',
  field: 'ReturnQty',
  cellStyle: {textAlign: 'center'},
  width: 90
}, {
  headerName: '实退金额',
  field: 'Amount',
  cellStyle: {textAlign: 'center'},
  width: 90,
  cellEditorFramework: PriceEditor,
  cellClass: 'editable',
  editable: function(params) {
    const Status = params.api.gridOptionsWrapper.gridOptions.grid.state.Status
    return Status === 0
  }
}, {
  headerName: '类型',
  field: 'ReturnTypeString',
  width: 80,
  cellClass: function(params) {
    return styles[`returnType${params.data.ReturnType}`]
  }
}, {
  headerName: '创建人',
  field: 'Creator',
  width: 130
}]
const gridOptions = {
  editType: 'fullRow',
  onRowValueChanged: function(e) {
    const RID = this.grid.state.RID
    if (RID) {
      this.grid.grid.x0pCall(ZPost('AfterSale/UpdateASItem', {
        RID,
        RDetailID: e.data.ID,
        Qty: e.data.RegisterQty,
        Amount: e.data.Amount
      }, () => {}, () => {
        this.grid.refreshRowData()
      }))
    } else {
      message.info('请先选中售后单')
    }
  },
  rowSelection: 'multiple'
}
export default connect(state => ({
  conditions: state.order_after_order_detail_vis_2
}))(Test)
