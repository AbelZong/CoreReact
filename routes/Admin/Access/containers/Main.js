/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-21 09:29:06
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './Access.scss'
import ZGrid from 'components/Grid/index'
import {Icon, Popconfirm} from 'antd'
import {ZGet, ZPost} from 'utils/Xfetch'
import OperatorsRender from './OperatorsRender'

class AccessTypeRenderer extends React.Component {
  render() {
    let type = this.props.value
    if (type === 1) {
      return <span>编辑权限</span>
    }
    return <span>浏览权限</span>
  }
}
const defColumns = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: true
  }, {
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '分组名称',
    cellStyle: {textAlign: 'center'},
    field: 'GroupName',
    width: 150
  }, {
    headerName: '权限名称',
    field: 'Name',
    cellStyle: {textAlign: 'center'},
    width: 160
  }, {
    headerName: '标题',
    cellStyle: {textAlign: 'center'},
    field: 'Title',
    width: 160
  }, {
    headerName: '权限类型',
    field: 'Type',
    cellStyle: {textAlign: 'center'},
    width: 100,
    cellRendererFramework: AccessTypeRenderer
  }, {
    headerName: '备注',
    field: 'Remark',
    cellStyle: {textAlign: 'center'},
    width: 200
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender
  }]
const gridOptions = {}
const Main = React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_data) {
    const conditions = _data || this.props.conditions || {}
    this.grid.showLoading()
    const uri = 'admin/power'
    const data = Object.assign({
      Page: 1,
      PageSize: this.grid.getPageSize()
    }, conditions)
    ZGet(uri, data, ({d}) => {
      this.grid.setDatasource({
        total: d.total,
        rowData: d.list,
        page: d.page,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              Page: params.page,
              PageSize: params.pageSize
            }, this.props.conditions)
            ZGet(uri, qData, ({d}) => {
              params.success(d.list)
            }, ({m}) => {
              params.fail(m)
            })
          }
        }
      })
    })
  },
  modifyRowByID(id) {
    this.props.dispatch({type: 'ACCESS_MODIFY_VISIABLE', payload: id})
  },
  deleteRowByIDs(ids) {
    const data = {IDLst: ids}
    this.grid.showLoading()
    ZPost('admin/DelAccess', data, () => {
      this.refreshDataCallback()
    }, () => {
      this.grid.hideLoading()
    })
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady}gridOptions={gridOptions} storeConfig={{ prefix: 'admin_access' }} columnDefs={defColumns} paged grid={this}>
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
  conditions: state.access_list
}))(Main)
