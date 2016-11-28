/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-11-28 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Popconfirm,
  Button} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  Icon as Iconfa
} from 'components/Icon'
import {
  reactCellRendererFactory
} from 'ag-grid-react'
import Wrapper from 'components/MainWrapper'
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  onRowClicked: function(params) {
    this.grid.props.dispatch({type: 'STOCK_TAKE_ITEM_CONDITIONS_SET', payload: {
      ParentID: params.node.data.ID
    }})
  }
}
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID([this.props.data.ID, this.props.data.Status])
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs(this.props.data.ID)
  },
  render() {
    return (
      <div className='operators'>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑' />
        <Popconfirm title='确定要作废吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' title='作废' />
        </Popconfirm>
      </div>
    )
  }
})
const StateRender = React.createClass({
  render() {
    switch (this.props.data.Status) {
      case 0:
        return <div>待确认</div>
      case 1:
        return <div>生效</div>
      case 2:
        return <div>作废</div>
      default:
        return <div>作废</div>
    }
  }
})
const columnDefs = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    suppressSorting: true,
    enableSorting: true
  }, {
    headerName: '盘点单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '单据日期',
    field: 'CreateDate',
    width: 130
  }, {
    headerName: '状态',
    field: 'Status',
    width: 80,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(StateRender)
  }, {
    headerName: '仓库',
    field: 'WhName',
    width: 200
  }, {
    headerName: '创建人',
    field: 'Creator',
    width: 200
  }, {
    headerName: '备注',
    field: 'Remark',
    width: 200
  }, {
    headerName: '操作',
    width: 100,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true
    //pinned: 'right'
  }]
const Main = React.createClass({

  componentDidMount() {
    this._firstBlood()
  },
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  modifyRowByID(arr) {
    this.props.dispatch({type: 'STOCK_INIT_MODIFY_VIS_SET', payload: arr})
  },
  deleteRowByIDs(id) {
    this.grid.x0pCall(ZPost('XyCore/StockInit/UnCheckInit', {ID: id}, () => {
      this.refreshDataCallback()
    }))
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/StockTake/StockTakeMainLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.MainLst,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.MainLst)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    }))
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Button type='ghost' onClick={this.handleNewEvent} size='small'>
            <Iconfa type='plus' style={{color: 'red'}} />&nbsp;添加新的盘点
          </Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_take' }} columnDefs={columnDefs} grid={this} paged />
      </div>
      )
  }
})
export default connect(state => ({
  conditions: state.stock_take_conditions
}))(Wrapper(Main))
