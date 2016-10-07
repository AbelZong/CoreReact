import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './Users.scss'
import Wrapper from 'components/MainWrapper'
import {Icon, Popconfirm, Checkbox} from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import {reactCellRendererFactory} from 'ag-grid-react'

const Main = React.createClass({
  componentWillReceiveProps(nextProps) {
    this.refreshDataCallback()
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
    ZPost('XyUser/User/DeleteUser', data, (s, d, m) => {
      this.refreshDataCallback()
    }, () => {
      this.grid.hideLoading()
    })
  },
  handleGridReady(grid) {
    this.grid = grid
    //this.refreshDataCallback()
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  _firstBlood() {
    this.grid.showLoading()
    const uri = 'XyUser/User/UserLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, this.props.conditions)
    ZGet(uri, data, (s, d, m) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.UserLst,
        page: d.pageSize,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, this.props.conditions)
            ZGet(uri, qData, (s, d, m) => {
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
          <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDelete}>
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
    Yyah.grid.modifyRowByID(this.props.data.id)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.id])
  },
  render() {
    return (
      <div className='operators'>
        <Icon type='edit' onClick={this.handleEditClick} />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})

const AbledRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    ZPost('XyUser/User/UserEnable', {
      IDLst: [this.props.data.ID],
      Enable: e.target.checked
    }, (s, d, m) => {
      this.props.data.Enable = d
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
    pinned: 'left'
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
    width: 50,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    cellRenderer: reactCellRendererFactory(AbledRender)
  }, {
    headerName: '性别',
    field: 'Gender',
    cellStyle: {textAlign: 'center'},
    width: 50
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
    headerName: '公司',
    field: 'CompanyName',
    width: 180
  }, {
    headerName: '角色',
    field: 'RoleName',
    cellStyle: {textAlign: 'center'},
    width: 130
  }, {
    headerName: '创建时间',
    field: 'CreateDate',
    width: 130
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender,
    pinned: 'right'
  }]
const gridOptions = {}
