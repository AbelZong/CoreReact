/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-11 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Button, message, Popconfirm } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
const defColumns = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: true
  }, {
    headerName: 'ID',
    field: 'id',
    cellStyle: {textAlign: 'center'},
    width: 60
  }, {
    headerName: '模板名',
    field: 'name',
    width: 500
  }, {
    headerName: '最后更新',
    field: 'mtime',
    width: 130
  }, {
    headerName: '',
    width: 60,
    //cellRendererFramework: AdminOperatorsRender
  }]

const AdminTable = React.createClass({
  componentWillReceiveProps(nextProps) {
    const {activeTypeID} = nextProps
    this._firstBlood(activeTypeID)
  },
  shouldComponentUpdate() {
    return false
  },
  refreshRowData() {
    this._firstBlood()
  },
  deleteRowByIDs(ids) {
    const data = {ids: ids}
    this.grid.showLoading()
    ZPost('print/tpl/delsyses', data, () => {
      this.refreshRowData()
    }, () => {
      this.grid.hideLoading()
    })
  },
  modifyRowByID(id) {
    const win = window.open(`/page/print/modify?sys_id=${id}`)
    const loop = setInterval(() => {
      if (win.closed) {
        clearInterval(loop)
        this.refreshRowData()
      }
    }, 1000)
  },
  handleDoRemove() {
    const nodeArr = this.grid.api.selectionController.selectedNodes
    const keys = Object.keys(nodeArr)
    if (keys.length < 1) {
      return message.warn('没有选中数据')
    }
    const selectIds = []
    keys.forEach((index) => {
      selectIds.push(nodeArr[index].data.id)
    })
    this.deleteRowByIDs(selectIds)
  },
  _firstBlood(_activeTypeID) {
    this.grid.showLoading()
    const activeTypeID = _activeTypeID || this.props.activeTypeID
    const uri = 'print/tpl/sysesbytype'
    const data = {
      pageSize: this.grid.getPageSize(),
      page: 1,
      type: activeTypeID
    }
    ZGet(uri, data, ({d}) => {
      this.grid.setDatasource({
        total: d.total,
        rowData: d.list,
        page: d.page,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = {
              pageSize: params.pageSize,
              page: params.page,
              type: activeTypeID
            }
            ZGet(uri, qData, ({d}) => {
              params.success(d.list)
            }, (m) => {
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
  render() {
    return (
      <div className='flex-column flex-grow'>
        <div className={styles.toolbar}>
          <Button type='dashed' size='small' className='mr10'>
            <Popconfirm title='确定要删除选中？' onConfirm={this.handleDoRemove}>
              <span>删除选中</span>
            </Popconfirm>
          </Button>
        </div>
        <ZGrid setPleaseTip='请先选择左侧【模板类型】' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'print_admin' }} columnDefs={defColumns} paged grid={this} />
      </div>
    )
  }
})

export default connect(state => ({
  activeTypeID: state.print_admin_type_active
}), null, null, { withRef: true })(AdminTable)
