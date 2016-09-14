import React from 'react'
import {connect} from 'react-redux'
//import { Button, message } from 'antd'
import ZGrid from 'components/Grid/index'
//import {Request} from 'utils/xFetch'
//import styles from 'components/App.scss'

import {endLoading} from 'utils'

//import tableData from 'json/order.json'
import rowData from 'json/rowData.json'
//import columnDefs from 'json/columnDefs.json'

//const moment = window.moment
function MyCellEditor() {}
MyCellEditor.prototype.init = function(params) {
  console.log('init', params)
  this.container = document.createElement('input')
  this.container.value = params.value
  // this.container.addEventListener('keydown', (e) => {
  //   e.stopPropagation()
  // })
  this.container.addEventListener('click', (e) => {
    e.stopPropagation()
  })
}
MyCellEditor.prototype.getGui = function() {
  return this.container
}
MyCellEditor.prototype.afterGuiAttached = function() {
  console.log('afterGuiAttached')
  this.container.focus()
  this.container.select()
}
MyCellEditor.prototype.getValue = function() {
  console.log('getValue')
  return this.container.value
}
MyCellEditor.prototype.destroy = function() {
  console.log('destroy')
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
}
MyCellEditor.prototype.isPopup = function() { //default false
  return true
}

const columnDefs = [{
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
    pinned: true,
    cellEditor: MyCellEditor,
    editable: true,
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
    field: 'shop_buyer_id',
    width: 130
  }, {
    headerName: '应付+运费',
    field: 'pay_amount',
    width: 60
  }, {
    headerName: '已付款',
    field: 'paid_amount',
    width: 60
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
    width: 150
  }, {
    headerName: '卖家备注',
    field: 'remark',
    width: 120
  }, {
    headerName: '便签',
    field: 'node',
    width: 120
  }]
}, {
  headerName: '快递信息',
  children: [{
    headerName: '快递公司',
    field: 'logistics_company',
    width: 100
  }, {
    headerName: '收货地址',
    field: 'address',
    width: 260
  }, {
    headerName: '分销商',
    field: 'drp_co_id_from',
    width: 70
  }, {
    headerName: '重量',
    field: 'weight',
    width: 50
  }, {
    headerName: '发票抬头',
    field: 'invoice_title',
    width: 80
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
class MainTable extends React.Component {
  componentWillMount = () => {
  }
  componentDidMount = () => {
    endLoading()
  }
  handleGridReady = (grid) => {
    //grid.showLoading()
    //获取默认配置
    console.log('ready ', this.props.proxyData)
    grid.setDatasource({
      //total: -1,
      rowData
      //rowData: this.props.proxyData
    })
  }
  selectAll() {
    this.api.selectAll()
  }
  deselectAll() {
    this.api.deselectAll()
  }
  onCellClicked(event) {
    console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex)
    console.dir(event)
  }
  onRowSelected(event) {
    console.log('onRowSelected: ' + event.node.data.name)
  }
  render() {
    //console.log(' -- component {MainTable} render...')
    return (
      <ZGrid onReady={this.handleGridReady} storeConfig={{ prefix: 'test' }} height={500} columnDefs={columnDefs} />
    )
  }
}

export default connect(state => ({
  proxyData: state.proxyData
}))(MainTable)
