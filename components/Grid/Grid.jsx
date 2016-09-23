import React from 'react'
import {AgGridReact} from 'ag-grid-react'
import {Pagination, Popconfirm, message} from 'antd'
import {Icon} from 'components/Icon'
import store from 'utils/store' //吃相不太好看
import {ZHCN} from 'constants/gridLocaleText'
//const TreeNode = Tree.TreeNode
const gridOptions = {
  //onModelUpdated: () => {
    //console.log('event onModelUpdated received')
  //},
  rowBuffer: 10, // no need to set this, the default is fine for almost all scenarios
  //rowModelType: 'pagination',
  //enableColResize: true,
  localeText: ZHCN
  //paginationPageSize: 20,
  // datasource: {
  //   rowCount: 0,
  //   getRows: function(params) {
  //     console.warn('get frist', params)
  //     params.failCallback()
  //   }
  // }
}
const pageSizeOptions = ['10', '20', '30', '50', '100', '200']

// const formatColumnState = function(states) {
//
// }
// let columnFiledTmp = 0
// const parseColumnSelectNodes = function(node) {
//   //disabled equal stroeState
//   const key = node.colId
//   if (node.children) {
//     return (
//       <TreeNode title={node.headerName} key={key}>
//         {
//           node.children.map((_node, i) => parseColumnSelectNodes(_node))
//         }
//       </TreeNode>
//     )
//   }
//   return (
//     <TreeNode title={node.headerName} key={key} />
//   )
// }

class ZGrid extends React.Component {
  constructor(props) {
    super(props)
    const {storeConfig} = props
    this.storeConfig = Object.assign({
      prefix: 'zh'
    }, storeConfig)
    if (!this.storeConfig.COLUMNS_KEY) {
      this.storeConfig.COLUMNS_KEY = `${this.storeConfig.prefix}.columns`
    }
    if (!this.storeConfig.PAGESIZE_KEY) {
      this.storeConfig.PAGESIZE_KEY = `${this.storeConfig.prefix}.pagesize`
    }
    if (!this.storeConfig.COLUMNSHIDE_KEY) {
      this.storeConfig.COLUMNSHIDE_KEY = `${this.storeConfig.prefix}.columnsHide`
    }
    // this.cacheColumnStates = store.get(this.storeConfig.COLUMNS_KEY, null)
    // const checkedKeys = []
    // if (this.cacheColumnStates && this.cacheColumnStates.length) {
    //   this.cacheColumnStates.map((item) => {
    //     if (!item.hide) {
    //       checkedKeys.push(item.colId)
    //     }
    //   })
    // }
    this.state = {
      //paged: paged || false, //是否开启分页
      columnsCheckedVisibe: false,
      total: 0,
      rowData: null,
      pageSize: store.get(this.storeConfig.PAGESIZE_KEY, Number(pageSizeOptions[0])),
      current: 1
    }
    this.cacheHideColumns = store.get(this.storeConfig.COLUMNSHIDE_KEY, [])
    this.getRowsFunc = null
  }
  onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi
    const cacheColumnStates = store.get(this.storeConfig.COLUMNS_KEY, null)
    if (cacheColumnStates) {
      this.columnApi.setColumnState(cacheColumnStates)
    }
    //不管分不分页，默认rowData没有数据就是显示没有数据
    if (!this.props.rowData || this.props.rowData.length === 0) {
      this.api.showNoRowsOverlay()
    }
    const {onReady} = this.props
    if (onReady) {
      onReady(this)
    }
  }
  agColumnResized = (e) => {
    if (e.finished) {
      this._saveColumns()
    }
  }
  agColumnMoved = (e) => {
    this._saveColumns()
  }
  agColumnVisible = (e) => {
    const column = {
      name: e.column.colDef.headerName,
      key: e.column.colId
    }
    //findIndex chrome 45+，兼容可以用filter()[0]
    const index = this.cacheHideColumns.findIndex(item => item.key === column.key)
    if (e.visible) { //显示
      if (index > -1) {
        this.cacheHideColumns = this.cacheHideColumns.splice(index, 1)
        this._saveCacheHideColumns()
      }
    } else {
      if (index === -1) {
        this.cacheHideColumns.push(column)
        this._saveCacheHideColumns()
      }
    }
    this._saveColumns()
  }

  showLoading = () => {
    this.api.showLoadingOverlay()
  }
  hideLoading = () => {
    this.api.hideOverlay()
  }
  setRowData = (rowData) => {
    this.setState({
      rowData,
      total: rowData ? rowData.length : 0
    })
  }
  setDatasource = (args) => {
    //args = {total, getRows, page, rowData}
    const _typeRowData = typeof args.rowData
    if (this.props.paged) {
      const _states = {
        total: args.total, current: args.page || 1
      }
      if (_typeRowData !== 'undefined' && args.rowData) {
        _states.rowData = args.rowData
      }
      this.getRowsFunc = args.getRows
      this.setState(_states, () => {
        if (!args.rowData) {
          this.getRows()
        }
      })
    } else {
      if (_typeRowData !== 'object') {
        args.rowData = []
      }
      this.setState({
        rowData: args.rowData,
        total: typeof args.total === 'undefined' ? args.rowData.length : args.total
      })
    }
  }
  _getRowsSuccess = (data) => {
    this.api.setRowData(data)
    this.api.hideOverlay()
  }
  _getRowsFail = (msg) => {
    this.api.hideOverlay()
    this.api.showNoRowsOverlay()
  }
  getRows = (page) => {
    if (this.getRowsFunc !== null) {
      this.api.showLoadingOverlay()
      this.getRowsFunc({
        success: (data) => this._getRowsSuccess(data),
        fail: (msg) => this._getRowsFail(msg),
        page: page > 0 ? page : this.state.current,
        size: this.state.pageSize
      })
    } else {
      message.warn('请先 setDatasource {total, getRows, [current], [rowData]}')
    }
  }
  refreshRowData = () => {
    this.getRows(this.state.current)
  }
  handleColumnFilter = (checkedKeys, e) => {
    this.setState({
      checkedKeys
    }, () => {
      const field = e.node.props.eventKey
      const checked = e.checked || e.selected || false
      this.columnApi.setColumnVisible(field, checked)
      this._saveColumns()
      //console.log(field, checked)
    })
  }
  removeCache = () => {
    store.remove(this.storeConfig.COLUMNSHIDE_KEY)
    store.remove(this.storeConfig.PAGESIZE_KEY)
    store.remove(this.storeConfig.COLUMNS_KEY)
    message.info('重置默认设置成功')
  }
  _saveColumns = () => {
    const cacheColumnStates = this.columnApi.getColumnState()
    store.set(this.storeConfig.COLUMNS_KEY, cacheColumnStates)
  }
  _saveCacheHideColumns = () => {
    store.set(this.storeConfig.COLUMNSHIDE_KEY, this.cacheHideColumns)
  }
    // selectedKeys={this.state.checkedKeys}
    // checkedKeys={this.state.checkedKeys}
  // renderColumnsClosed = () => {
  //   return null
  //   const columnDefs = this.cacheColumnStates
  //   return (
  //     <Tree className='columnChecks' showLine checkable multiple defaultExpandAll
  //       onSelect={this.handleColumnFilter} onCheck={this.handleColumnFilter}
  //       >
  //       {
  //         columnDefs.map((node) => parseColumnSelectNodes(node))
  //       }
  //     </Tree>
  //   )
  // }
  toggleColumnCheckedVisibe = () => {
    this.setState({
      columnsCheckedVisibe: !this.state.columnsCheckedVisibe
    })
  }
  restoreColumn = (key, e) => {
    this.columnApi.setColumnVisible(key, true)
    this.cacheHideColumns = this.cacheHideColumns.filter(column => column.key !== key)
    this._saveColumns()
    this._saveCacheHideColumns()
    if (e) {
      e.target.parentNode.removeChild(e.target)
    }
  }
  renderColumnsChecked = () => {
    const len = this.cacheHideColumns.length
    return (
      <div className='modal'>
        <div className='mask' onClick={this.toggleColumnCheckedVisibe} />
        <div className='modal-inner columns-vv'>
          {len > 0 ? (
            <div className='hasColumns'>
              {
                this.cacheHideColumns.map(column => (
                  <div className='column clearfix' key={column.key}>
                    <span className='column-name'>{column.name}</span> <span className='column-restore'><Icon type='minus' onClick={(e) => this.restoreColumn(column.key, e)} /></span>
                  </div>
                ))
              }
            </div>
          ) : (
            <span>
              没有隐藏列
            </span>
          )}
        </div>
      </div>
    )
  }

  handlePageChange = (current) => {
    this.setState({
      current
    }, () => {
      //重新获取page current
    })
  }
  handlePageShowSizeChange = (index, pageSize) => {
    this.setState({
      pageSize
    }, () => {
      store.set(this.storeConfig.PAGESIZE_KEY, pageSize)
      //重新获取page 1
    })
  }
  render() {
    const {columnDefs, height, paged, className} = this.props
    const rowData = this.state.rowData || this.props.rowData
    const CN = className ? `z-grid ${className}` : 'z-grid'
    return (
      <div className={CN} style={{height: height || 'auto'}}>
        <div className='grid-inner'>
          <div className='ag-fresh'>
            <AgGridReact
              gridOptions={gridOptions}

              onGridReady={this.onGridReady}
              onColumnResized={this.agColumnResized}
              onColumnMoved={this.agColumnMoved}
              onColumnVisible={this.agColumnVisible}

              columnDefs={columnDefs}
              rowData={rowData}

              rowSelection='multiple'
              enableColResize='true'
              groupHeaders='false'
              rowHeight='32'
              debug='false'
            />
          </div>
          <div className='footer'>
            <div className='op-r'>
              {paged && (
                <a title='刷新容器' className='cur' onClick={this.refreshRowData}><Icon type='refresh' spin={false} /></a>
              )}
              <a title='显示隐藏列名' className='cur' onClick={this.toggleColumnCheckedVisibe}><Icon type='eye-slash' /></a>
              <Popconfirm placement='leftBottom' title='确定要恢复容器默认设置吗？下次进入或刷新生效' onConfirm={this.removeCache}><a title='恢复容器默认设置' className='cur'><Icon type='eraser' /></a>
              </Popconfirm>
            </div>
            {paged && (
              <Pagination size='small' current={this.state.current} pageSize={this.state.pageSize} onChange={this.handlePageChange} onShowSizeChange={this.handlePageShowSizeChange} total={this.state.total} showSizeChanger showQuickJumper pageSizeOptions={pageSizeOptions} showTotal={total => `共 ${total} 条`} />
            )}
          </div>
          {this.state.columnsCheckedVisibe && this.renderColumnsChecked()}
        </div>
      </div>
    )
  }
}

export default ZGrid
