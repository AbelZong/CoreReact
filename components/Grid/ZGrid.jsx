/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-29 14:15:12
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
// author:(wx)goodgods lastUpdated: now
import React from 'react'
import {AgGridReact} from 'ag-grid-react'
import {Pagination, Popconfirm, message} from 'antd'
import {Icon} from 'components/Icon'
import store from 'utils/store'
import {ZHCN} from 'constants/gridLocaleText'
const pageSizeOptions = ['20', '50', '100', '200', '500']
import 'ag-grid-enterprise'
class ZGrid extends React.Component {
  constructor(props) {
    super(props)
    const {storeConfig} = props
    if (storeConfig) {
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
    }
    const defPageSize = Number(this.props.pageSizeDef || pageSizeOptions[0])
    this.state = {
      columnsCheckedVisibe: false,
      total: 0,
      rowData: null,
      pageSize: storeConfig ? store.get(this.storeConfig.PAGESIZE_KEY, defPageSize) : defPageSize,
      current: 1
    }
    this.cacheHideColumns = storeConfig ? store.get(this.storeConfig.COLUMNSHIDE_KEY, []) : []
    this.getRowsFunc = null
  }
  onGridReady = (params) => {
    this.api = params.api
    this.props.columnsFited && this.api.sizeColumnsToFit()
    this.columnApi = params.columnApi
    if (this.storeConfig) {
      const cacheColumnStates = store.get(this.storeConfig.COLUMNS_KEY, null)
      if (cacheColumnStates) {
        this.columnApi.setColumnState(cacheColumnStates)
      }
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
    this.hideOverlay()
  }
  hideOverlay = () => {
    this.api.hideOverlay()
  }
  showNoRows = () => {
    this.setRowData(null)
    this.api.showNoRowsOverlay()
  }
  appendRows = (lst) => {
    this.api.insertItemsAtIndex(0, lst)
    this.hideOverlay()
  }
  setRowData = (rowData, cb) => {
    this.setState({
      rowData,
      total: rowData ? rowData.length : 0
    }, cb)
  }
  setDatasource = (args) => {
    //args = {total, getRows, page, rowData, pageSize, firstBlood}
    if (this.props.paged) {
      const _states = {
        current: args.page || 1
      }
      _states.rowData = (args.rowData && args.rowData instanceof Array) ? args.rowData : []
      _states.total = typeof args.total === 'undefined' ? _states.rowData.length : Number(args.total)
      if (typeof args.pageSize !== 'undefined') {
        _states.pageSize = Number(args.pageSize)
      }
      this.getRowsFunc = args.getRows
      this.setState(_states, () => {
        if (args.firstBlood) {
          this.getRows()
        }
      })
    } else {
      const _states = {
        current: 0
      }
      _states.rowData = (args.rowData && args.rowData instanceof Array) ? args.rowData : []
      _states.total = typeof args.total === 'undefined' ? _states.rowData.length : Number(args.total)
      this.setState(_states, () => {
        if (this.state.total < 1) {
          requestAnimationFrame(() => {
            this.api.showNoRowsOverlay()
          })
        }
      })
    }
  }
  _getRowsSuccess = (data) => {
    this.api.setRowData(data)
    this.api.hideOverlay()
  }
  _getRowsFail = (msg) => {
    this.api.showNoRowsOverlay()
  }
  getPageSize = () => {
    return this.state.pageSize
  }
  getRows = (page) => {
    if (this.getRowsFunc !== null) {
      this.api.showLoadingOverlay()
      this.getRowsFunc({
        success: (data) => this._getRowsSuccess(data),
        fail: (msg) => this._getRowsFail(msg),
        page: page > 0 ? page : this.state.current,
        pageSize: this.state.pageSize
      })
    } else {
      if (this.props.paged) {
        const tips = this.props.setPleaseTip || '开发者注意：请先 setDatasource {total, getRows, [current], [rowData]}'
        message.warn(tips)
      }
    }
  }
  refreshRowData = () => {
    this.getRows(this.state.current)
  }
  x0pCall = (xFetch) => {
    this.showLoading()
    return xFetch.then(this.hideLoading)
  }
  handleColumnFilter = (checkedKeys, e) => {
    this.setState({
      checkedKeys
    }, () => {
      const field = e.node.props.eventKey
      const checked = e.checked || e.selected || false
      this.columnApi.setColumnVisible(field, checked)
      this._saveColumns()
    })
  }
  removeCache = () => {
    if (this.storeConfig) {
      store.remove(this.storeConfig.COLUMNSHIDE_KEY)
      store.remove(this.storeConfig.PAGESIZE_KEY)
      store.remove(this.storeConfig.COLUMNS_KEY)
    }
    this.handlePageShowSizeChange(null, Number(this.props.pageSizeDef || pageSizeOptions[0]))
    this.columnApi.resetColumnState()
    this.cacheHideColumns = []
  }
  _saveColumns = () => {
    if (this.storeConfig) {
      const cacheColumnStates = this.columnApi.getColumnState()
      store.set(this.storeConfig.COLUMNS_KEY, cacheColumnStates)
    }
  }
  _saveCacheHideColumns = () => {
    if (this.storeConfig) {
      store.set(this.storeConfig.COLUMNSHIDE_KEY, this.cacheHideColumns)
    }
  }
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
      this.getRows()
    })
  }
  handlePageShowSizeChange = (index, pageSize) => {
    this.setState({
      pageSize
    }, () => {
      if (this.storeConfig) {
        store.set(this.storeConfig.PAGESIZE_KEY, pageSize)
      }
      this.getRows(1)
    })
  }
  render() {
    const {
  columnDefs,
  height,
  paged,
  className,
  gridOptions,
  children,
  pagesAlign,
  rowHeight
} = this.props
    const rowData = this.state.rowData || this.props.rowData
    const CN = className ? `z-grid ${className}` : 'z-grid'
    const _gridOptions = Object.assign({
      grid: this.props.grid
    }, GOD, gridOptions)
    let footerCN = 'footer clearfix'
    if (pagesAlign === 'left') {
      footerCN = `${footerCN} pages-left`
    }
    //cracked!
    if (columnDefs[0].checkboxSelection && columnDefs[0].headerName === '#') {
      columnDefs[0].headerCellTemplate = headerCellTemplate
    }
    return (
      <div className={CN} style={{height: height || 'auto'}}>
        <div className='grid-inner'>
          <div className='ag-fresh'>
            <AgGridReact gridOptions={_gridOptions} containerStyle={{position: 'absolute', width: '100%'}} onGridReady={this.onGridReady} onColumnResized={this.agColumnResized} onColumnMoved={this.agColumnMoved} onColumnVisible={this.agColumnVisible} columnDefs={columnDefs} rowData={rowData} rowHeight={rowHeight || 32} />
          </div>
          <div className={footerCN}>
            <div className='op-l'>{children}</div>
            <div className='op-r'>
              {paged && (
                <span>
                  <Pagination size='small' current={this.state.current} pageSize={this.state.pageSize} onChange={this.handlePageChange} onShowSizeChange={this.handlePageShowSizeChange} total={this.state.total} showSizeChanger showQuickJumper pageSizeOptions={pageSizeOptions} showTotal={total => `共 ${total} 条`} /><a title='刷新ZGrid容器' className='cur' onClick={this.refreshRowData}><Icon type='refresh' spin={false} /></a>
                </span>
              )}
              <a title='显示隐藏列名' className='cur' onClick={this.toggleColumnCheckedVisibe}><Icon type='eye-slash' /></a>
              <Popconfirm placement='leftBottom' title='确定要恢复ZGrid容器默认设置吗？' onConfirm={this.removeCache}><a title='恢复容器默认设置' className='cur'><Icon type='eraser' /></a>
              </Popconfirm>
            </div>
          </div>
          {this.state.columnsCheckedVisibe && this.renderColumnsChecked()}
        </div>
      </div>
    )
  }
}
const headerCellTemplate = (params) => {
  const cb = document.createElement('input')
  cb.setAttribute('type', 'checkbox')
  cb.setAttribute('id', 'selectAllCheckbox')
  const eHeader = document.createElement('label')
  eHeader.appendChild(cb)
  cb.addEventListener('change', function(e) {
    const selected = e.target.checked
    params.api.forEachNode(function(node) {
      node.setSelected(selected)
    })
  })
  return eHeader
}
const GOD = {
  localeText: ZHCN,
  rowSelection: 'multiple',
  //suppressRowClickSelection: true,
  enableColResize: true,
  enableRangeSelection: true,
  getContextMenuItems: function(params) {
    return ['copy']
  }
}
export default ZGrid
