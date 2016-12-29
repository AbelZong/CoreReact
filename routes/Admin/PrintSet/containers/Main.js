/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-12-27 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Popconfirm, Checkbox,
Icon} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import ModifyModal from './ModifyModal'
import {
  Icon as Iconfa
} from 'components/Icon'
import Wrapper from 'components/MainWrapper'
import {startLoading, endLoading} from 'utils'
//import ModifyModal from './ModifyModal'
import EE from 'utils/EE'
import {
  reactCellRendererFactory
} from 'ag-grid-react'
const gridOptions = {
}
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.handleEdit(this.props.data.ID)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.handleDelete([this.props.data.ID])
  },
  render() {
    return (
      <div className='operators'>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑' />
        <Popconfirm title='确定要删除吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' title='删除' />
        </Popconfirm>
      </div>
    )
  }
})
const AbledRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('printer/enabledPrinter', {
      IDLst: [this.props.data.ID],
      Enabled: checked
    }, () => {
      this.props.data.Enabled = checked
      this.props.refreshCell()
    })
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Enabled} />
  }
})
const DefRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    ZPost('printer/defPrinter', {
      ID: this.props.data.ID
    }, () => {
      Yyah.grid.refreshDataCallback()
    })
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.IsDefault} />
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
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 60
  }, {
    headerName: '打印机名',
    field: 'Name',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '打印类型',
    field: 'PrintName',
    width: 120
  }, {
    headerName: 'IP地址',
    field: 'IPAddress',
    width: 120
  }, {
    headerName: '打印端口',
    field: 'PrinterPort',
    width: 120
  }, {
    headerName: '启用',
    field: 'Enabled',
    width: 60,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(AbledRender)
  }, {
    headerName: '默认',
    field: 'IsDefault',
    cellStyle: {textAlign: 'center'},
    width: 60,
    cellRenderer: reactCellRendererFactory(DefRender)
  }, {
    headerName: '操作',
    width: 200,
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
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_conditions) {
    startLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'printer/list'
    const data = Object.assign({
      pageSize: this.grid.getPageSize(),
      pageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      endLoading()
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.total,
        rowData: d.lst,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              pageSize: params.pageSize,
              pageIndex: params.pageIndex
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.lst)
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
  handleEdit(id) {
    this.props.dispatch({type: 'PRINTER_EDIT_VIS_SET', payload: id})
  },
  handleDelete(ids) {
    ZPost({
      uri: 'printer/delPrinter',
      data: {IDLst: ids},
      success: ({d}) => {
        this.refreshDataCallback()
      }
    })
  },
  handleDeletes() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.handleDelete(ids)
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'printer_set' }} columnDefs={columnDefs} grid={this} paged>
        批量：
          <Popconfirm title='确定要删除吗？' onConfirm={this.handleDeletes}>
            <Icon type='delete' className='cur' />
          </Popconfirm>
        </ZGrid>
        <ModifyModal />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.printer_conditions
}))(Wrapper(Main))
