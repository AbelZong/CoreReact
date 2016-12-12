/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-06 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {startLoading, endLoading} from 'utils/index'
import {
  ZGet
} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  Button,
  message,
  Modal
} from 'antd'
export default React.createClass({
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      this.handleSearch(nextProps.RID)
    }
  },
  componentWillUnmount() {
    this.ignoreCase = true
  },
  handleOK() {
    const selecters = this.grid.api.getSelectedRows()
    if (selecters) {
      this.props.onChange(selecters)
    } else {
      message.info('没有选择商品')
      this.props.onCancel()
    }
  },
  handleok() {
    this.props.onCancel()
  },
  handleSearch(RID) {
    startLoading()
    ZGet('AfterSale/GetASOrdItem', {
      RID: RID || this.props.RID
    }, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        rowData: d
      })
    }, () => {
      this.grid.showNoRows()
    }).then(endLoading)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <Modal wrapClassName={styles.modal} title='选择一个或多个商品' visible={this.props.doge} maskClosable={false} onCancel={this.props.onCancel} footer='' width={950}>
        <div className={styles.hua}>
          <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions1} storeConfig={{ prefix: 'zhanghua_14051' }} columnDefs={columnDefs1} grid={this} pagesAlign='left'>
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
const columnDefs1 = [
  {
    headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    width: 120
  }, {
    headerName: '商品名字',
    field: 'SkuName',
    width: 180
  }, {
    headerName: '规格',
    field: 'Norm',
    width: 120
  }, {
    headerName: '数量',
    field: 'Qty',
    cellStyle: {textAlign: 'center'},
    width: 80
  }, {
    headerName: '单价',
    field: 'RealPrice',
    width: 80
  }, {
    headerName: '金额',
    field: 'Amount',
    width: 80
  }, {
    headerName: '基本价',
    field: 'SalePrice',
    width: 80
  }, {
    headerName: '折扣',
    field: 'DiscountRate',
    width: 80
  }, {
    headerName: '是否赠品',
    field: 'IsGift',
    width: 90,
    cellStyle: {textAlign: 'center'},
    cellRenderer: function(params) {
      return params.value ? '是' : '否'
    }
  }]
const gridOptions1 = {
  rowSelection: 'multiple',
  onRowDoubleClicked: function() {
    this.grid.handleOK()
  }
}
