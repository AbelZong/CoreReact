/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 08:57:42
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {Button, Popconfirm, Input, message} from 'antd'
import {findDOMNode} from 'react-dom'
import {Icon as Iconfa} from 'components/Icon'
import AppendProduct from 'components/SkuPicker/append'

const OperatorsRender = React.createClass({
  handleDeleteClick() {
    const noder = this.props.node
    if (noder) {
      if (noder.data.ID <= 0) {
        return this.props.api.removeItems([noder])
      }
      ZPost({
        uri: 'XyCore/StockTake/DelTakeItem',
        data: {IDLst: [noder.data.ID]},
        success: () => {
          this.props.api.removeItems([noder])
        }
      })
    }
  },
  //  <Iconfa type='wrench' onClick={this.handleEditClick} title='更新' />
  render() {
    return (
      <div className='operators'>
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})

const InvQtyEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    ZPost('XyCore/StockTake/SaveTakeQty', {
      ID: this.props.node.data.ID,
      InvQty: this.state.value
    }, ({s, m}) => {
      if (s !== 1) {
        message.error(m)
      }
      const Yyah = this.props.api.gridOptionsWrapper.gridOptions
      Yyah.grid.refreshDataCallback()
    })
    return this.state.value
  },
  afterGuiAttached() {
    const input = findDOMNode(this.refs.zhang)
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
  },
  handleChange(e) {
    const value = Math.max(e.target.value, 0)
    if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
      this.setState({ value })
    } else {
      this.setState({ value: this.props.value })
    }
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const columnDefs = [{
  headerName: 'ID',
  field: 'ID',
  width: 65,
  pinned: true
}, {
  headerName: '图片',
  field: 'img',
  width: 80,
  cellStyle: {textAlign: 'center'},
  cellRenderer: function(params) {
    const k = params.data.img
    return k ? '<img src="' + k + '" width=40 height=40>' : '-'
  }
}, {
  headerName: '商品编码',
  field: 'SkuID',
  width: 120
}, {
  headerName: '商品名称',
  field: 'SkuName',
  width: 180
}, {
  headerName: '规格',
  field: 'Norm',
  width: 100
}, {
  headerName: '实点数量',
  field: 'InvQty',
  width: 100,
  cellEditorFramework: InvQtyEditor,
  editable: true
}, {
  headerName: '盈亏数量',
  field: 'Qty',
  width: 120
}, {
  headerName: '操作',
  pinned: 'right',
  width: 60,
  cellRendererFramework: OperatorsRender
}]
const gridOptions = {
}
const Test = React.createClass({
  getInitialState() {
    this._version = 0
    return {
      ParentID: 0,
      display: 'none'
    }
  },
  componentWillReceiveProps(nextProps) {
    if (!(Object.keys(nextProps.conditions).length === 1 && Object.keys(this.props.conditions).length === 1 && this.props.conditions.ParentID === nextProps.conditions.ParentID)) {
      if (nextProps.conditions.ParentID > 0) {
        this._version ++
        this._firstBlood(nextProps.conditions, this._version)
      } else {
        this.setState({
          ParentID: 0
        })
        this.grid.showNoRows()
      }
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    this._firstBlood(null, this._version)
  },
  refreshRowData() {
    this._firstBlood(null, this._version)
  },
  _firstBlood(_conditions, _version) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/StockTake/StockTakeItemLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (_version !== this._version || this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.ItemLst,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood(null, _version)
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (_version !== this._version || this.ignore) {
                return
              }
              params.success(d.ItemLst)
            }, (m) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
      this.setState({
        ParentID: Number(conditions.ParentID),
        display: conditions.Status === 0 ? 'block' : 'none'
      })
    }, this.grid.showNoRows)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleAppend(lst) {
    if (lst && lst instanceof Array && lst.length) {
      const SkuIDLst = lst.map(x => x.ID)
      this.grid.x0pCall(ZPost('XyCore/StockTake/InsertTakeItem', {SkuIDLst, ParentID: this.state.ParentID}, ({s, m}) => {
        if (s === 1) {
          // const newRows = []
          // lst.forEach(x => {
          //   newRows.push({
          //     ID: x.ID,
          //     Img: x.Img,
          //     SkuID: x.SkuID,
          //     SkuName: x.SkuName,
          //     Norm: x.Norm,
          //     InvQty: x.InvQty === null ? 0 : x.InvQty,
          //     Price: x.Qty === null ? 0 : x.Qty
          //   })
          // })
          // this.grid.appendRows(newRows)
          this.refreshDataCallback()
        } else {
          message.error(m)
        }
      }))
    }
  },
  deleteRowByIDs() {
    // const ids = this.grid.api.getSelectedRows().map(x => x.id)
    // if (ids.length) {
    //   return ids
    // }
    // this.grid.x0pCall(ZPost('XyCore/StockInit/UnCheckInit', {ID: id}, () => {
    //   this.refreshDataCallback()
    // }))
  },
  render() {
    return (
      <div className={styles.detailTable}>
        <div className={styles.topOperators} style={{display: this.state.display}}>
          <AppendProduct onChange={this.handleAppend} />
          <Button type='ghost' style={{marginLeft: '15px'}} onClick={this.handleSearch}> <Iconfa type='print' style={{color: '#32cd32'}} />&nbsp;打印盘点表</Button>
          <Button type='ghost' style={{marginLeft: '15px'}} onClick={this.handleSearch}> <Iconfa type='sign-out' style={{color: '#32cd32'}} />&nbsp;导出盘点单模板</Button>
          <Button type='ghost' style={{marginLeft: '15px'}} onClick={this.handleSearch}> <Iconfa type='sign-in' style={{color: '#32cd32'}} />&nbsp;导入盘点后库存</Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_take_item' }} columnDefs={columnDefs} paged grid={this} />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.stock_take_item_conditions
}))(Test)
