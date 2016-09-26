import React from 'react'
import { Button, message, Popconfirm } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import styles from './Print.scss'

import ZGrid from 'components/Grid/index'

const defColumns = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
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
  }]

const AdminTable = React.createClass({
  componentDidMount() {
  },
  componentWillReceiveProps(nextProps) {
    const {activeTypeID} = nextProps
    this._firstBlood(activeTypeID)
  },
  shouldComponentUpdate() {
    return false
  },
  componentWillUnmount() {
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
    const data = {ids: selectIds}
    this.grid.showLoading()
    ZPost('print/tpl/delsyses', data, (s, d, m) => {
      message.success('删除成功')
      this._firstBlood()
    }, () => {
      this.grid.hideLoading()
    })
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
    ZGet(uri, data, (s, d, m) => {
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
            ZGet(uri, qData, (s, d, m) => {
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
        <ZGrid setPleaseMsg='请先选择左侧【模板类型】' className={styles.zgrid} onReady={this.handleGridReady} paged storeConfig={{ prefix: 'print_admin' }} columnDefs={defColumns} />
      </div>
    )
  }
})

export default connect(state => ({
  activeTypeID: state.print_admin_type_active
}))(AdminTable)
