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
import React, {createClass} from 'react'
import {
  Button,
  message,
  Popconfirm
} from 'antd'
import {
  connect
} from 'react-redux'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
const BuyerShop = createClass({
  render() {
    return (
      <div>
        <div>{this.props.BuyerShopID}</div>
        <div>{this.props.ShopName}</div>
      </div>
    )
  }
})
const defColumns = [{
  headerName: '#',
  width: 30,
  checkboxSelection: true,
  pinned: true
}, {
  headerName: '订单',
  children: [{
    headerName: '内部订单号',
    field: 'o_id',
    width: 100,
    enableRowGroup: true
  }, {
    headerName: '商品',
    field: 'its',
    width: 112
  }, {
    headerName: '线上单号',
    field: 'so_id',
    width: 114
  }, {
    headerName: '订单日期',
    field: 'order_date',
    width: 120
  }, {
    headerName: '付款时间',
    field: 'pay_date',
    width: 124
  }, {
    headerName: '买家账号+店铺',
    //field: 'ShopName',
    width: 130,
    cellRendererFramework: BuyerShop
  }, {
    headerName: '应付+运费',
    field: 'pay_amount',
    width: 100
  }, {
    headerName: '已付款',
    field: 'paid_amount',
    width: 80
  }, {
    headerName: '状态',
    field: 'status',
    width: 80,
    cellClassRules: {
      'rag-green': (params) => { return params.value === '已发货' },
      'rag-amber': (params) => { return params.value === '发货中' },
      'rag-red': (params) => { return params.value === '待付款' }
    }
    // cellRenderer: function(params) {
    //   switch(params.value){
    //     case '发货中': {
    //       return '<span style="background-color: lightgreen;">'+params.value+'</span>'
    //     }
    //     default: return params.value
    //   }
    // }
  }, {
    headerName: '买家留言',
    field: 'buyer_message',
    width: 180
  }, {
    headerName: '卖家备注',
    field: 'remark',
    width: 180
  }, {
    headerName: '便签',
    field: 'node',
    width: 180
  }]
}, {
  headerName: '快递信息',
  children: [{
    headerName: '快递公司',
    field: 'Express',
    width: 100
  }, {
    headerName: '收货地址',
    field: 'address',
    width: 260
    //cellRendererFramework
  }, {
    headerName: '分销商',
    field: 'drp_co_id_from',
    width: 90
  }, {
    headerName: '重量',
    field: 'ExWeight',
    width: 80
  }, {
    headerName: '发票抬头',
    field: 'invoice_title',
    width: 180
  }]
}, {
  headerName: '仓库发货',
  children: [{
    headerName: '发货日期',
    field: 'send_date',
    width: 120
  }, {
    headerName: '计划发货日期',
    field: 'plan_delivery_date',
    width: 120
  }, {
    headerName: '发货仓',
    field: 'wms_co_name',
    width: 120
  }]
}, {
  headerName: '',
  children: [{
    headerName: '业务员',
    field: 'creator_name',
    width: 80
  }]
}]
//cellRendererFramework
const Table = React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
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
  _firstBlood(_conditions) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Order/OrderList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      console.log(d)
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Ord,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              NumPerPage: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Ord)
            }, (m) => {
              if (this.ignore) {
                return
              }
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
        <ZGrid gridOptions={gridOptions} rowHeight='75' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'order_list' }} columnDefs={defColumns} paged grid={this} />
      </div>
    )
  }
})
const gridOptions = {
}
export default connect(state => ({
  conditions: state.order_list_conditions
}), null, null, { withRef: true })(Table)
