/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-12-08 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Dropdown,
  Button,
  Menu,
  Tooltip,
  message
} from 'antd'
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
import {sTypes} from 'constants/Stock'
const gridOptions = {
}
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
    cellStyle: {textAlign: 'center'},
    cellRenderer: function(params) {
      const k = params.data.Status + ''
      return sTypes[k] || k
    },
    cellClass: function(params) {
      return styles.Status + ' ' + (styles[`Status${params.data.Status}`] || '')
    },
    width: 70
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
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    // const uri = 'XyCore/StockTake/StockTakeMainLst'
    // const data = Object.assign({
    //   PageSize: this.grid.getPageSize(),
    //   PageIndex: 1
    // }, conditions)
    // this.grid.x0pCall(ZGet(uri, data, ({d}) => {
    //   if (this.ignore) {
    //     return
    //   }
    //   this.grid.setDatasource({
    //     total: d.DataCount,
    //     rowData: d.MainLst,
    //     page: 1,
    //     getRows: (params) => {
    //       if (params.page === 1) {
    //         this._firstBlood()
    //       } else {
    //         const qData = Object.assign({
    //           PageSize: params.pageSize,
    //           PageIndex: params.page
    //         }, conditions)
    //         ZGet(uri, qData, ({d}) => {
    //           if (this.ignore) {
    //             return
    //           }
    //           params.success(d.MainLst)
    //         }, ({m}) => {
    //           if (this.ignore) {
    //             return
    //           }
    //           params.fail(m)
    //         })
    //       }
    //     }
    //   })
    // }))
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleNewEvent() {
    
  },
  render() {
    const pickmenu = (
      <Menu onClick={this.handlePickSort}>
        <Menu.Item key='1'>
          <Iconfa type='play' style={{color: '#32cd32', display: 'inner-block'}} />&nbsp;
          <Tooltip placement='right' title='每个订单只有一个数量单品（排除不含赠品），后面数字为待生成拣货任务的订单数'><a style={{display: 'inline-block'}} href='javascript:void'>生成单件: 10</a></Tooltip>
        </Menu.Item>
        <Menu.Item key='2'><Iconfa type='forward' style={{color: '#32cd32'}} />&nbsp;
          <Tooltip placement='right' title='每个订单包含2个及以上数量单品（排除不含赠品），后面数字为待生成拣货任务的订单数'><a style={{display: 'inline-block'}} href='javascript:void'>生成单件: 250</a></Tooltip>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='3'>生成单件（自定义设置条件）</Menu.Item>
        <Menu.Item key='4'>生成多件（自定义设置条件）</Menu.Item>
        <Menu.Item key='5'>选择订单生成任务</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='6'>
          <Tooltip placement='right' title='现场取货：
快递公司=[现场取货]，每订单一个批次，拣货完成直接发货

大订单：
商品总数量等于或超过指定数量，每订单一个批次，拣货完成后打印快递单发货'><a style={{display: 'inline-block'}} href='javascript:void'>生成现场取货或大订单: 250</a></Tooltip>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Dropdown overlay={pickmenu}>
            <Button type='ghost'>
              <Iconfa type='play' style={{color: '#32cd32'}} />&nbsp;生成拣货批次
            </Button>
          </Dropdown>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_take' }} columnDefs={columnDefs} grid={this} paged />
      </div>
      )
  }
})
export default connect(state => ({
  conditions: state.stock_take_conditions
}))(Wrapper(Main))
