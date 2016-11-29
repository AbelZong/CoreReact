/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-11-24 PM
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
import Wrapper from 'components/MainWrapper'
import ModifyModal from './ModifyModal'
import WareChoose from './WareChoose'
import {sTypes} from 'constants/Stock'

const gridOptions = {
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
    headerName: '期初单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '单据日期',
    field: 'CreateDate',
    width: 130
  }, {
    headerName: '仓库名称',
    field: 'WhName',
    width: 200
  }, {
    headerName: '状态',
    field: 'Status',
    cellStyle: {textAlign: 'center'},
    cellRenderer: function(params) {
      const k = params.data.Status + ''
      return sTypes[k] || k
    },
    cellClass: function(params) {
      return styles.Status + ' ' + (styles[`Status${params.data.Status}`] || '')
    },
    width: 60
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
    const uri = 'XyCore/StockInit/StockInitMainLst'
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
  handleNewEvent() {
    this.props.dispatch({type: 'STOCK_INIT_WARE_VIS_SET', payload: 1})
  },
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Button type='ghost' onClick={this.handleNewEvent} size='small'>
            <Iconfa type='plus' style={{color: 'red'}} />&nbsp;添加新的期初库存
          </Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_init' }} columnDefs={columnDefs} grid={this} paged />
        <ModifyModal />
        <WareChoose />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.stock_init_conditions
}))(Wrapper(Main))
