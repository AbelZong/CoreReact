/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-17 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Modal, Button, message} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {ZGet} from 'utils/Xfetch'
import Toolbars from './Toolbars'

export default React.createClass({
  getInitialState: function() {
    this.searchConditions = {}
    return {
      dataList: []
    }
  },
  componentWillUnmount() {
    this.ignoreCase = true
  },
  handleOK() {
    const selecter = this.grid.api.getSelectedRows()[0]
    if (selecter) {
      this.props.onOk(selecter)
    } else {
      message.info('没有选择商品')
      this.props.onCancel()
    }
  },
  handleok() {
    this.props.onCancel()
  },
  handleSearch(_conditions) {
    Object.assign(this.searchConditions, _conditions || {})
    this.grid.showLoading()
    const uri = 'Common/CommSkuLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, this.searchConditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.SkuLst,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this.handleSearch()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, this.searchConditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.SkuLst)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    }, () => {
      this.grid.showNoRows()
    })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <Modal wrapClassName={styles.modal} title='选择一个商品' visible={this.props.doge} maskClosable={false} onCancel={this.props.onCancel} footer='' width={950}>
        <div className={styles.hua}>
          <Toolbars onSearch={this.handleSearch} initialValues={this.props.initialValues} />
          <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanghua_3' }} columnDefs={columnDefs} paged grid={this} pagesAlign='left'>
            <div className={styles.footerBtns}>
              <Button type='primary' onClick={this.handleOK}>确认商品</Button>
              <Button onClick={this.handleok}>关闭</Button>
            </div>
          </ZGrid>
        </div>
      </Modal>
    )
  }
})
const EnableRender = function(params) {
  return params.value ? '是' : '否'
}
const columnDefs = [
  {
    headerName: '货品编码',
    field: 'GoodsCode',
    width: 120
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    enableSorting: true,
    width: 120
  }, {
    headerName: '国标条形码',
    field: 'GBCode',
    width: 120
  }, {
    headerName: '商品名字',
    field: 'SkuName',
    width: 180
  }, {
    headerName: '商品品牌',
    field: 'BrandName',
    suppressSorting: true,
    width: 90
  }, {
    headerName: '规格',
    field: 'Norm',
    suppressSorting: true,
    width: 120
  }, {
    headerName: '启用',
    field: 'Enable',
    width: 65,
    suppressSorting: true,
    cellClass: function(params) {
      return styles.status + ' ' + (styles[`status${params.data.Enable}`] || '')
    },
    cellRenderer: EnableRender
  }, {
    headerName: '成本价',
    field: 'CostPrice',
    width: 100
  }, {
    headerName: '销售价',
    field: 'SalePrice',
    width: 100
  }]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  rowSelection: 'single',
  onBeforeSortChanged: function() {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? { SortField: sorter.colId, SortDirection: sorter.sort.toUpperCase() } : { SortField: null, SortDirection: null }
    this.grid.handleSearch(conditions)
  },
  onRowDoubleClicked: function() {
    this.grid.handleOK()
  }
}
