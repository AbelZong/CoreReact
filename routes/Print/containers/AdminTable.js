import React from 'react'
import { Button, message, Popconfirm } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import styles from './Print.scss'
import AdminOperatorsRender from './AdminOperatorsRender'
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
  }, {
    headerName: '',
    width: 60,
    cellRendererFramework: AdminOperatorsRender
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
    ZPost('print/tpl/delsyses', data, (s, d, m) => {
      message.success('删除成功')
      this.refreshRowData()
    }, () => {
      this.grid.hideLoading()
    })
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
        <ZGrid setPleaseTip='请先选择左侧【模板类型】' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'print_admin' }} columnDefs={defColumns} paged grid={this} />
      </div>
    )
  }
})

export default connect(state => ({
  activeTypeID: state.print_admin_type_active
}))(AdminTable)

/*
<ZGrid setPleaseTip='请先选择左侧【模板类型】' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'print_admin' }} columnDefs={defColumns} paged grid={this} />
* setPleaseTip: 未执行 setDatasource 但点击了右下角的刷新按钮 所给出的提示消息
* storeConfig: grid配置缓存， prefix未缓存key的前缀，必须唯一
* paged: 开启分页
* grid: 吃相问题，记得加上
*/
