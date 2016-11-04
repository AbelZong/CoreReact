/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-21 11:16:19
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
import styles from './Users.scss'
import Wrapper from 'components/MainWrapper'
import {
  Icon,
  Popconfirm,
  Checkbox
} from 'antd'
import {
  Icon as Iconfa
} from 'components/Icon'
import {
  reactCellRendererFactory
} from 'ag-grid-react'

const Main = React.createClass({
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
  modifyRowByID(id) {
    this.props.dispatch({type: 'ADMIN_USERS_MODAL_VIS_SET', payload: id})
  },
  deleteRowByIDs(ids) {
    const data = {IDLst: ids}
    this.grid.showLoading()
    ZPost('XyUser/User/DeleteUser', data, () => {
      this.refreshDataCallback()
    }, () => {
      this.grid.hideLoading()
    })
  },
  modifyPwdByID(id) {
    this.props.dispatch({type: 'ADMIN_USERS_PWDMOD_VIS_SET', payload: id})
  },
  handleGridReady(grid) {
    this.grid = grid
    //this.grid.api.setSortModel([{field: 'Account', sort: 'asc'}])
    //this.refreshDataCallback()
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  _firstBlood(_conditions) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyUser/User/UserLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.UserLst,
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
              params.success(d.UserLst)
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
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'admin_users' }} columnDefs={columnDefs} paged grid={this}>
          批量：
          <Popconfirm title='确定要删除吗？' onConfirm={this.handleDelete}>
            <Icon type='delete' className='cur' />
          </Popconfirm>
        </ZGrid>
      </div>
    )
  }
})

export default connect(state => ({
  conditions: state.admin_users_filter_conditions
}))(Wrapper(Main))

const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.ID)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.ID])
  },
  handlePwdClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyPwdByID(this.props.data.ID)
  },
  render() {
    return (
      <div className='operators'>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑用户' />
        <Iconfa type='key' onClick={this.handlePwdClick} title='修改密码' />
        <Popconfirm title='确定要删除吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})

const AbledRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('XyUser/User/UserEnable', {
      IDLst: [this.props.data.ID],
      Enable: checked
    }, () => {
      this.props.data.Enable = checked
      this.props.refreshCell()
    })
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Enable} />
  }
})
const columnDefs = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    suppressSorting: true
  }, {
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    enableSorting: true,
    width: 60,
    pinned: 'left'
  }, {
    headerName: '账号',
    field: 'Account',
    cellStyle: {textAlign: 'center'},
    width: 130,
    pinned: 'left'
  }, {
    headerName: '用户名',
    field: 'Name',
    cellStyle: {textAlign: 'center'},
    width: 160,
    pinned: 'left'
  }, {
    headerName: '启用',
    field: 'Enable',
    width: 60,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    cellRenderer: reactCellRendererFactory(AbledRender),
    suppressSorting: true
  }, {
    headerName: '性别',
    field: 'Gender',
    cellStyle: {textAlign: 'center'},
    width: 70
  }, {
    headerName: '角色',
    field: 'RoleName',
    cellStyle: {textAlign: 'center'},
    width: 130
  }, {
    headerName: '手机',
    field: 'Mobile',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: 'QQ',
    field: 'QQ',
    width: 100
  }, {
    headerName: 'Email',
    field: 'Email',
    width: 120
  }, {
    headerName: '创建时间',
    field: 'CreateDate',
    width: 130
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender,
    pinned: 'left',
    suppressSorting: true
  }]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  onBeforeSortChanged: function(params) {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? {
      SortField: sorter.colId,
      SortDirection: sorter.sort.toUpperCase()
    } : {
      SortField: null,
      SortDirection: null
    }
    this.grid.props.dispatch({
      type: 'ADMIN_USERS_FILTER_CONDITIONS_UPDATE',
      update: {
        $merge: conditions
      }
    })
  }
}
