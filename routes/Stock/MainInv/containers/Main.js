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
  Button,
  Dropdown,
  Menu,
  message,
  Input,
Icon} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  Icon as Iconfa
} from 'components/Icon'
import {findDOMNode} from 'react-dom'
import Wrapper from 'components/MainWrapper'
import ModifyModal from './ModifyModal'
import InvDetailQuery from './InvDetailQuery'
import InvLock from './InvLock'
import SafeModal from './SafeModal'
import EE from 'utils/EE'
const gridOptions = {
}
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.handleInvDetail(this.props.data.Skuautoid)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs(this.props.data.ID)
  },
  render() {
    return (
      <div className='operators'>
        <a href='javascript:void(0)' onClick={this.handleEditClick} >主仓明细账</a>
      </div>
    )
  }
})
const SafeMaxEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    ZPost('XyCore/Inventory/UptInvMainSafeQty', {
      ID: this.props.node.data.ID,
      UpSafeQty: this.state.value,
      Type: 2
    }, () => {
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
    this.setState({ value })
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const SafeMinEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    ZPost('XyCore/Inventory/UptInvMainSafeQty', {
      ID: this.props.node.data.ID,
      SafeQty: this.state.value,
      Type: 1
    }, () => {
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
    this.setState({ value })
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const columnDefs = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    suppressSorting: true,
    enableSorting: true
  }, {
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 60
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
    headerName: '款式编码',
    field: 'GoodsCode',
    width: 120
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    width: 120
  }, {
    headerName: '商品名',
    field: 'Name',
    width: 130
  }, {
    headerName: '颜色及规格',
    field: 'Norm',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '主仓实际库存',
    cellStyle: {textAlign: 'right'},
    field: 'StockQty',
    width: 120
  }, {
    headerName: '锁定库存数',
    cellStyle: {textAlign: 'right'},
    field: 'InvLockQty',
    width: 100
  }, {
    headerName: '订单锁定数',
    cellStyle: {textAlign: 'right'},
    field: 'LockQty',
    width: 100
  }, {
    headerName: '安全库存下限',
    cellStyle: {textAlign: 'right'},
    field: 'SafeQty',
    width: 120,
    editable: true,
    cellClass: 'editable',
    cellEditorFramework: SafeMinEditor
  }, {
    headerName: '安全库存上限',
    cellStyle: {textAlign: 'right'},
    field: 'UpSafeQty',
    width: 120,
    editable: true,
    cellClass: 'editable',
    cellEditorFramework: SafeMaxEditor
  }, {
    headerName: '库存待发数',
    cellStyle: {textAlign: 'right'},
    field: 'PickQty',
    width: 100
  }, {
    headerName: '销退仓库存',
    cellStyle: {textAlign: 'right'},
    field: 'SaleRetuQty',
    width: 100
  }, {
    headerName: '进货仓库存',
    cellStyle: {textAlign: 'right'},
    field: 'WaitInQty',
    width: 100
  }, {
    headerName: '次品仓数量',
    cellStyle: {textAlign: 'right'},
    field: 'DefectiveQty',
    width: 100
  }, {
    headerName: '采购在途数',
    cellStyle: {textAlign: 'right'},
    field: 'PurchaseQty',
    width: 100
  }, {
    headerName: '虚拟库存数',
    cellStyle: {textAlign: 'right'},
    field: 'VirtualQty',
    width: 100
  }, {
    headerName: '可用数',
    cellStyle: {textAlign: 'right'},
    field: 'Available',
    width: 80,
    pinned: 'right',
    cellRenderer: function(params) {
      const stockqty = Number(params.data.StockQty)
      const lockqty = Number(params.data.LockQty)
      const virtualqty = Number(params.data.VirtualQty)
      return stockqty - lockqty + virtualqty
    }
  }, {
    headerName: '主仓库存明细账',
    width: 150,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true,
    pinned: 'right'
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
  handleInvDetail(id) {
    this.props.dispatch({type: 'STOCK_INV_DETAIL_VIS_SET', payload: id})
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
    const uri = 'XyCore/Inventory/InventQuery'
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
        rowData: d.InvMainLst,
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
              params.success(d.InvMainLst)
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
  handleVirtual(e) {
    switch (e.key) {
      case '1': {
        this.props.dispatch({type: 'STOCK_VIRTUAL_VIS_SET', payload: 0})
        break
      }
      case '3': {
        message.info('not supported yet')
        break
      }
      default: {
        message.info('not supported yet')
        break
      }
    }
  },
  handleSafeClick(e) {
    switch (e.key) {
      case '1': {
        const IDLst = this.grid.api.getSelectedRows().map(x => x.ID)
        if (IDLst.length === 0) {
          message.info('请先选择栏位')
        } else {
          this.props.dispatch({ type: 'STOCK_SAFEINV_VIS_SET', payload: IDLst })
        }
        break
      }
      case '2': {
        ZPost('XyCore/Inventory/ClearInvMainSafeQty', null, ({s, m}) => {
          if (s === 1) {
            message.success('清除安全库存成功')
          } else {
            message.error(m)
          }
          EE.triggerRefreshMain()
        })
        break
      }
      default: {
        message.info('not supported yet')
        break
      }
    }
  },
  handleCleanClick(e) {
    switch (e.key) {
      case '1': {
        ZPost('XyCore/Inventory/DeleteZeroSkuM', {}, ({s, m}) => {
          if (s !== 1) {
            message.error(m)
          }
          EE.triggerRefreshMain()
        })
        break
      }
      case '2': {
        const IDLst = this.grid.api.getSelectedRows().map(x => x.ID)
        if (IDLst.length > 0) {
          ZPost('XyCore/Inventory/DeleteZeroSkuM', {IDLst: IDLst}, ({s, m}) => {
            if (s !== 1) {
              message.error(m)
            }
            EE.triggerRefreshMain()
          })
        } else {
          message.info('请先选中栏目')
        }
        break
      }
      default: {
        message.info('not supported yet')
        break
      }
    }
  },
  handleInvClick() {
    this.props.dispatch({ type: 'STOCK_INVLOCK_VIS_SET', payload: 1 })
  },
  render() {
    const virtualmenu = (
      <Menu onClick={this.handleVirtual}>
        <Menu.Item key='1'>添加新的虚拟库存</Menu.Item>
        <Menu.Item key='2'><Iconfa type='file-excel-o' style={{color: '#32cd32'}} />&nbsp;导入虚拟库存</Menu.Item>
      </Menu>
    )
    const safemenu = (
      <Menu onClick={this.handleSafeClick}>
        <Menu.Item key='1'>批量设置安全库存</Menu.Item>
        <Menu.Item key='2'>清除所有商品安全库存</Menu.Item>
        <Menu.Item key='3'>导入安全库存</Menu.Item>
        <Menu.Item key='4'>设置安全库存天数</Menu.Item>
      </Menu>
    )
    const exportmenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key='1'>导出（竖向）</Menu.Item>
        <Menu.Item key='2'>导出(横向且小于1万条)</Menu.Item>
      </Menu>
    )
    const cleanmenu = (
      <Menu onClick={this.handleCleanClick}>
        <Menu.Item key='1'>清除所有0库存资料</Menu.Item>
        <Menu.Item key='2'>清除选中0库存资料</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Dropdown overlay={virtualmenu}>
            <Button type='ghost'>
              <Iconfa type='plus' style={{color: 'red'}} />&nbsp;添加虚拟库存
            </Button>
          </Dropdown>
          <Dropdown overlay={safemenu} >
            <Button type='ghost' style={{marginLeft: 15}}>
              <Iconfa type='shield' style={{color: '#32cd32'}} />&nbsp;设置安全库存
            </Button>
          </Dropdown>
          <Button type='ghost' style={{marginLeft: 15}} onClick={this.handleInvClick}>
            <Iconfa type='lock' style={{color: '#32cd32'}} />&nbsp;商品库存锁定
          </Button>
          <Dropdown overlay={exportmenu} >
            <Button type='ghost' style={{marginLeft: 15}}>
              <Iconfa type='sign-out' style={{color: '#32cd32'}} />&nbsp;导出所有符合条件的单据
            </Button>
          </Dropdown>
          <Button type='ghost' style={{marginLeft: 15}}>
            <Iconfa type='cloud-upload' style={{color: '#32cd32'}} />&nbsp;同步库存
          </Button>
          <Dropdown overlay={cleanmenu} >
            <Button type='ghost' style={{marginLeft: 15}}>
              <Iconfa type='eraser' style={{color: '#32cd32'}} />&nbsp;清除0库存资料
            </Button>
          </Dropdown>
          <div className={styles.searchTip}>
            <Icon type='edit' /> 图标的栏位，双击可修改
          </div>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_maininv' }} columnDefs={columnDefs} grid={this} paged />
        <ModifyModal />
        <InvLock />
        <InvDetailQuery />
        <SafeModal />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.stock_maininv_conditions
}))(Wrapper(Main))
