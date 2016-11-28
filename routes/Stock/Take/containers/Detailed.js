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
import {Button, Popconfirm, InputNumber, DatePicker, message, Popover, notification} from 'antd'
import moment from 'moment'
import {findDOMNode} from 'react-dom'
import {Icon as Iconfa} from 'components/Icon'
import SkuPicker from 'components/SkuPicker/append'

const OperatorsRender = React.createClass({
  handleDeleteClick() {
    // const noder = this.props.node
    // if (noder) {
    //   if (noder.data.id <= 0) {
    //     return this.props.api.removeItems([noder])
    //   }
    //   ZPost({
    //     uri: 'Purchase/DelPurDetail',
    //     data: {ID: this.props.api.gridOptionsWrapper.gridOptions.grid.props.conditions.Purid, DetailID: [noder.data.id]},
    //     success: () => {
    //       this.props.api.removeItems([noder])
    //     }
    //   })
    // }
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
    const input = findDOMNode(this.refs.zhang)
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
  },
  handleChange(e) {
    const value = Math.max(e, 0)
    this.setState({ value })
  },
  render() { return <InputNumber ref='zhang' min={0} step={0.01} value={this.state.value} onChange={this.handleChange} /> }
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
  cellEditorFramework: PriceEditor,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst === 0
  }
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
      Purid: 0,
      Purst: -1
    }
  },
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.conditions)
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
              params.success(d.Pur)
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
        Purid: Number(conditions.Purid),
        Purst: Number(d.status)
      })
    }, this.grid.showNoRows)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleSkusChange(lst) {
    // if (lst && lst instanceof Array && lst.length) {
    //   const ids = lst.map(x => x.ID)
    //   this.grid.x0pCall(ZPost('Purchase/InsertPurDetail', {ids, purchaseid: this.props.conditions.Purid}, ({d}) => {
    //     const {successIDs, failIDs} = d
    //     if (successIDs && successIDs instanceof Array && successIDs.length) {
    //       const newRows = []
    //       lst.forEach(x => {
    //         if (successIDs.indexOf(x.ID) >= 0) {
    //           newRows.push({
    //             id: x.ID,
    //             img: x.Img,
    //             skuid: x.SkuID,
    //             skuname: x.SkuName,
    //             norm: x.Norm,
    //             goodscode: x.GoodsCode
    //           })
    //         }
    //       })
    //       this.grid.appendRows(newRows)
    //     }
    //     if (failIDs && failIDs instanceof Array && failIDs.length) {
    //       const des = []
    //       failIDs.forEach(x => {
    //         const dd = lst.filter(y => y.ID === x.id)[0]
    //         des.push(dd.SkuName + ': ' + x.reason)
    //       })
    //       notification.info({
    //         message: '新增明细商品有错',
    //         description: des.join(';')
    //       })
    //     }
    //   }))
    // }
  },
  renderOps() {
    if (this.state.Purid > 0) {
      if (this.state.Purst === 0) {
        return <SkuPicker onChange={this.handleSkusChange} size='small' />
      }
    }
    return null
  },
  render() {
    return (
      <div className={styles.detailTable}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_take_item' }} columnDefs={columnDefs} paged grid={this} />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.stock_take_item_conditions
}))(Test)
