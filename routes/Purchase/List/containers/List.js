/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-14 15:57:51
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
import {sTypes} from 'constants/Purchase'
import {types} from 'constants/Item'
import {Input, Popconfirm, Menu, Dropdown, Button, message} from 'antd'
import {Icon as Iconfa} from 'components/Icon'
//let id = 1
const ButtonGroup = Button.Group
const PinuoCao = React.createClass({
  // componentDidMount() {
  //   this.props.dispatch({type: 'PUR_CI_VIS_SET', payload: ++id})
  // },
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  componentWillUnmount() {
    this.ignore = true
  },
  modifyRowByID(id) {
    this.props.dispatch({type: 'PUR_NEW_VIS_SET', payload: id})
  },
  deleteRowByIDs(ids) {
    this.grid.x0pCall(ZPost('Purchase/CanclePur', {PurIdList: ids}, () => {
      this.grid.refreshRowData()
    }))
  },
  _firstBlood(_conditions) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Purchase/PurchaseList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Pur,
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
    })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  getSelectIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.id)
    if (ids.length) {
      return ids
    }
    message.info('请先选择')
    return false
  },
  handleChangeStatus1() {
    const ids = this.getSelectIDs()
    if (ids === false) {
      return
    }
    this.grid.x0pCall(ZPost('Purchase/ConfirmPur', {PurIdList: ids}, () => {
      this.grid.refreshRowData()
    }))
  },
  handleChangeStatus4() {
    const ids = this.getSelectIDs()
    if (ids === false) {
      return
    }
    this.grid.x0pCall(ZPost('Purchase/RestorePur', {PurIdList: ids}, () => {
      this.grid.refreshRowData()
    }))
  },
  handleChangeStatus2() {
    const ids = this.getSelectIDs()
    if (ids === false) {
      return
    }
    this.grid.x0pCall(ZPost('Purchase/CanclePur', {PurIdList: ids}, () => {
      this.grid.refreshRowData()
    }))
  },
  handleChangeStatus3() {
    const ids = this.getSelectIDs()
    if (ids === false) {
      return
    }
    this.grid.x0pCall(ZPost('Purchase/CompletePur', {PurIdList: ids}, () => {
      this.grid.refreshRowData()
    }))
  },
  handleNewEvent(e) {
    switch (e.key) {
      case '2': {
        message.info('not supported yet')
        break
      }
      case '3': {
        message.info('not supported yet')
        break
      }
      default: {
        this.props.dispatch({type: 'PUR_NEW_VIS_SET', payload: 0})
      }
    }
  },
  CheckinByID(id) {
    this.props.dispatch({type: 'PUR_CI_VIS_SET', payload: id})
  },
  render() {
    const menu = (
      <Menu onClick={this.handleNewEvent}>
        <Menu.Item key='1'><Iconfa type='plus' style={{color: 'red'}} />&nbsp;&nbsp;手工下普通采购单</Menu.Item>
        <Menu.Item key='2'><Iconfa type='upload' />&nbsp;&nbsp;导入采购</Menu.Item>
        <Menu.Item key='3'><Iconfa type='plus' style={{color: 'red'}} />&nbsp;&nbsp;预约入库</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.listWrapper}>
        <div className={styles.topOperators}>
          <div className={styles.Hleft}>
            <Dropdown overlay={menu}>
              <Button type='ghost' onClick={this.handleNewEvent} size='small'>
                <Iconfa type='plus' style={{color: 'red'}} />&nbsp;新增采购&nbsp;&nbsp;<Iconfa type='caret-down' />
              </Button>
            </Dropdown><span className='hide'> | 进程及跟踪</span>
          </div>
          <div className={styles.Hright}>
            <span className='hide'>批量打印 导出</span>
          </div>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'purchase1' }} columnDefs={columnDefs} grid={this} paged>
          <Iconfa type='long-arrow-up' /> 批量：
          <ButtonGroup style={{marginLeft: 5}}>
            <Button type='ghost' size='small' title='转【已确认】状态' onClick={this.handleChangeStatus1}>生效</Button>
            <Button type='ghost' size='small' title='转【待审核】状态' onClick={this.handleChangeStatus4}>待审</Button>
          </ButtonGroup>
          <Button size='small' title='转【已作废】状态' onClick={this.handleChangeStatus2} style={{marginLeft: 5}}>作废</Button>
          <ButtonGroup style={{marginLeft: 5}}>
            <Button type='ghost' size='small' title='转【已完成】状态' onClick={this.handleChangeStatus3}>完成</Button>
          </ButtonGroup>
        </ZGrid>
      </div>
    )
  }
})
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    this.props.api.gridOptionsWrapper.gridOptions.grid.modifyRowByID(this.props.data.id)
  },
  handleDeleteClick() {
    this.props.api.gridOptionsWrapper.gridOptions.grid.deleteRowByIDs([this.props.data.id])
  },
  handleCheckin() {
    this.props.api.gridOptionsWrapper.gridOptions.grid.CheckinByID(this.props.data.id)
  },
  render() {
    return (
      <div className='operators'>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑' />
        <Iconfa type='file-text-o' onClick={this.handleCheckin} title='质检验货' />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.pur_conditions1
}))(PinuoCao)
const CellEditor = React.createClass({
  getInitialState() {
    let value = this.props.value
    if (this.props.keyPress === 8 || this.props.keyPress === 46) {
      value = ''
    } else if (this.props.charPress) {
      value = value + '' + this.props.charPress
    }
    return {
      value
    }
  },
  getValue() {
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(this.state.value)
    //     resolve(this.props.value)
    //   }, 1000)
    // })
    if (this.props.value !== this.state.value) {
      ZPost('Purchase/UpdatePurRemark', {
        ID: this.props.node.data.id,
        Remark: this.state.value
      })
    }
    return this.state.value
  },
  afterGuiAttached() {
    const input = this.refs.zhang.refs.input
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
    input.focus()
  },
  handleChange(e) {
    const value = e.target.value
    this.setState({
      value
    })
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const columnDefs = [{
  headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true
}, {
  headerName: '采购单号',
  field: 'id',
  width: 100,
  pinned: true
}, {
  headerName: '采购日期',
  field: 'purchasedate',
  cellStyle: {textAlign: 'center'},
  width: 120
}, {
  headerName: '供应商',
  field: 'sconame',
  width: 150
}, {
  headerName: '状态',
  field: 'status',
  cellRenderer: function(params) {
    const k = params.data.status + ''
    return sTypes[k] || k
  },
  cellClass: function(params) {
    return styles.status + ' ' + (styles[`status${params.data.status}`] || '')
  },
  width: 80
}, {
  headerName: '商品类型',
  cellStyle: {textAlign: 'center'},
  field: 'purtype',
  cellRenderer: function(params) {
    const k = params.data.purtype + ''
    return types[k] || k
  },
  width: 100
}, {
  headerName: '税率',
  field: 'taxrate',
  width: 80
}, {
  headerName: '采购员',
  field: 'buyyer',
  width: 100
}, {
  headerName: '备注',
  field: 'remark',
  cellEditorFramework: CellEditor,
  editable: true,
  width: 200,
  cellClass: 'editable'
}, {
  headerName: '送货地址',
  width: 300,
  cellRenderer: function(params) {
    const {data} = params
    return data.shplogistics + ' ' + data.shpcity + ' ' + data.shpdistrict + ' ' + data.shpaddress
  }
}, {
  headerName: '合同条款',
  field: 'contract',
  width: 300
}, {
  headerName: '操作',
  width: 120,
  cellRendererFramework: OperatorsRender,
  pinned: 'right',
  suppressSorting: true
}]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  onRowClicked: function(params) {
    this.grid.props.dispatch({type: 'PUR_CONDITIONS2_SET', payload: {
      Purid: params.node.data.id
    }})
  },
  //enableSorting: true,
  // enableServerSideSorting: false,
  // onRowSelected: function(params) {
  //   this.grid.props.dispatch({type: 'PUR_CONDITIONS2_SET', payload: {
  //     Purid: params.node.data.id
  //   }})
  // },
  // onBeforeSortChanged: function() {
  //   const sorter = this.api.getSortModel()[0]
  //   const conditions = sorter ? {
  //     SortField: sorter.colId,
  //     SortDirection: sorter.sort.toUpperCase()
  //   } : {
  //     SortField: null,
  //     SortDirection: null
  //   }
  //   this.grid.props.dispatch({type: 'PUR_CONDITIONS1_UPDATE', update: {
  //     $merge: conditions
  //   }})
  // }
  onBeforeSortChanged: function() {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? {
      SortField: sorter.colId,
      SortDirection: sorter.sort.toUpperCase()
    } : {
      SortField: '',
      SortDirection: ''
    }
    this.grid.props.dispatch({type: 'PUR_CONDITIONS1_UPDATE', update: {
      $merge: conditions
    }})
  }
}
