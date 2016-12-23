/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-12-08 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Modal
} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import SaleOutToolBar from './SaleOutToolBar'

const DEFAULT_TITLE = '销售出库单'
const gridOptions = {}
const columnDefs = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    suppressSorting: true,
    enableSorting: true
  }, {
    headerName: '出仓单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '内部订单号',
    field: 'Status',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '线上订单号',
    field: 'TypeString',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '单据日期',
    field: 'Pickor',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '状态',
    field: 'OrderQty',
    cellStyle: {textAlign: 'center'},
    width: 80
  }, {
    headerName: '物流公司',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '物流单号（运单号）',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 160
  }, {
    headerName: '批次号',
    field: 'SkuQty',
    cellStyle: {textAlign: 'center'},
    width: 80
  }, {
    headerName: '订单已打印',
    field: 'SkuQty',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '快递单已打印',
    field: 'SkuQty',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '打印次数',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '买家留言',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '收货地址',
    field: 'SkuQty',
    width: 200
  }, {
    headerName: '收货人',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 70
  }, {
    headerName: '移动电话',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '预估重量',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '货物方式',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '运费',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 60
  }, {
    headerName: '已发货',
    field: 'SkuQty',
    width: 80
  }, {
    headerName: '商品',
    field: 'SkuQty',
    width: 60
  }, {
    headerName: '备注',
    field: 'SkuQty',
    width: 100
  }]
const SaleOut = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
    }
  },
  componentDidMount() {
    this._firstBlood()
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge > 0) {
        this.setState({
          visible: true,
          confirmLoading: false
        }, () => {
          this._firstBlood(nextProps.conditions)
        })
      } else {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      }
    }
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_conditions) {
    //const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    //const uri = 'Batch/GetBatchList'
    // const data = Object.assign({
    //   PageSize: this.grid.getPageSize(),
    //   PageIndex: 1
    // }, conditions)
    // this.grid.x0pCall(ZGet(uri, data, ({d}) => {
    //   if (this.ignore) {
    //     return
    //   }
    //   this.grid.setDatasource({
    //     total: d.Datacnt,
    //     rowData: d.Batch,
    //     page: 1,
    //     getRows: (params) => {
    //       if (params.page === 1) {
    //         this._firstBlood()
    //       } else {
    //         const qData = Object.assign({
    //           PageSize: params.pageSize,
    //           PageIndex: params.page
    //         }, conditions)
    //         ZGet(uri, qData, ({d}) => {
    //           if (this.ignore) {
    //             return
    //           }
    //           params.success(d.Batch)
    //         }, ({m}) => {
    //           if (this.ignore) {
    //             return
    //           }
    //           params.fail(m)
    //         })
    //       }
    //     }
    //   })
    // }))
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_SALE_OUT_VIS_SET', payload: -1 })
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={1200} maskClosable>
        <SaleOutToolBar />
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_batch_sale_out' }} columnDefs={columnDefs} grid={this} paged height={500} />
      </Modal>
      )
  }
})
export default connect(state => ({
  doge: state.pb_sale_out_vis
}))(SaleOut)
