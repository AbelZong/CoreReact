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
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'

const DEFAULT_TITLE = '拣货批次唯一码'
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
    headerName: '唯一码',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '商品编码',
    field: 'Status',
    cellStyle: {textAlign: 'center'},
    width: 70
  }, {
    headerName: '状态',
    field: 'TypeString',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '进货仓单号',
    field: 'Pickor',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '仓位',
    field: 'OrderQty',
    cellStyle: {textAlign: 'right'},
    width: 80
  }, {
    headerName: '修改时间',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }]
const BatchUnique = React.createClass({
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
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Batch/GetBatchList'
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
    this.props.dispatch({ type: 'PB_BATCH_UNIQUE_VIS_SET', payload: -1 })
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={1000} maskClosable>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_batch_unique' }} columnDefs={columnDefs} grid={this} paged height={500} />
      </Modal>
      )
  }
})
export default connect(state => ({
  doge: state.pb_batch_unique_vis
}))(BatchUnique)
