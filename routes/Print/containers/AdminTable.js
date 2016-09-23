import React from 'react'
import { Button, message } from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
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
    width: 60
  }, {
    headerName: '模板名',
    field: 'name',
    width: 500
  }, {
    headerName: '最近更新',
    field: 'CreateDate',
    width: 120
  }]

const AdminTable = React.createClass({
  componentDidMount() {
  },
  componentWillUnmount() {
  },
  handleSearch() {
    //这里需要重设 setDatasource
    if (!this.grid) {
      message.warn('请等待容器初始化')
      return
    }
    const data = {
    }
    this.api.setRowData(null)
    ZPost('profile/msg', data, (s, d, m) => {
      console.log(d)
    })
  },
  handleGridReady(grid) {
    grid.showLoading()
    //获取默认配置
    grid.setDatasource({
      total: 100,
      rowData: [],
      getRows: (params) => {
        console.log(params)
      }
    })
    this.grid = grid
  },
  render() {
    return (
      <div className='flex-column flex-grow'>
        <div className={styles.toolbar}>
          <Button type='dashed' size='small' className='mr10'>批量删除</Button>
          <Button type='dashed' size='small' className='mr10'>批量已读</Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'print_admin' }} columnDefs={defColumns} />
      </div>
    )
  }
})

export default connect(state => ({
}))(AdminTable)
