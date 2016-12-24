/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 08:57:42
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {Button, Popconfirm, InputNumber, DatePicker, message, Popover, notification} from 'antd'
import moment from 'moment'
import {findDOMNode} from 'react-dom'
import {Icon as Iconfa} from 'components/Icon'
import SkuPicker from 'components/SkuPicker/append'
const Test = React.createClass({
  getInitialState() {
    this._version = 0
    return {
      Purid: 0,
      Purst: -1
    }
  },
  componentWillReceiveProps(nextProps) {
    if (!(Object.keys(nextProps.conditions).length === 1 && Object.keys(this.props.conditions).length === 1 && this.props.conditions.Purid === nextProps.conditions.Purid)) {
      if (nextProps.conditions.Purid > 0) {
        this._version ++
        this._firstBlood(nextProps.conditions, this._version)
      } else {
        this.setState({
          Purid: 0,
          Purst: -1
        })
        this.grid.showNoRows()
      }
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshRowData() {
    this._firstBlood(null, this._version)
  },
  _firstBlood(_conditions, _version) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Purchase/PurchaseDetailList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (_version !== this._version || this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Pur,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood(null, _version)
          } else {
            const qData = Object.assign({
              NumPerPage: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (_version !== this._version || this.ignore) {
                return
              }
              params.success(d.Pur)
            }, (m) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
      this.setState({
        Purid: Number(conditions.Purid),
        Purst: Number(d.status)
      })
    }, this.grid.showNoRows)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleSkusChange(lst) {
    if (lst && lst instanceof Array && lst.length) {
      const ids = lst.map(x => x.ID)
      this.grid.x0pCall(ZPost('Purchase/InsertPurDetail', {ids, purchaseid: this.props.conditions.Purid}, ({d}) => {
        const {successIDs, failIDs} = d
        if (successIDs && successIDs instanceof Array && successIDs.length) {
          const newRows = []
          lst.forEach(x => {
            if (successIDs.indexOf(x.ID) >= 0) {
              newRows.push({
                id: x.ID,
                img: x.Img,
                skuid: x.SkuID,
                skuname: x.SkuName,
                norm: x.Norm,
                goodscode: x.GoodsCode
              })
            }
          })
          this.grid.appendRows(newRows)
        }
        if (failIDs && failIDs instanceof Array && failIDs.length) {
          const des = []
          failIDs.forEach(x => {
            const dd = lst.filter(y => y.ID === x.id)[0]
            des.push(dd.SkuName + ': ' + x.reason)
          })
          notification.info({
            message: '新增明细商品有错',
            description: des.join(';')
          })
        }
      }))
    }
  },
  renderOps() {
    if (this.state.Purid > 0) {
      if (this.state.Purst === 0) {
        return <SkuPicker onChange={this.handleSkusChange} size='small' />
      }
    }
    return null
  },
  render() {
    return (
      <div className={styles.detailTable}>
        <div className='flex-row mt5 mb10'>
          {this.renderOps()}
          <Button type='ghost' size='small' icon='copy' title='复制选中行的到货时间给当前采购单' style={{marginLeft: 5}} disabled={!this.state.Purid || this.state.Purst === 2 || this.state.Purst === 5}>到货时间</Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'purchase2' }} columnDefs={columnDefs} paged grid={this}>
          <Popover content='双击明细行 编辑单元格，按回车键确认'><Iconfa type='question-circle' style={{fontSize: 14, position: 'relative'}} /></Popover>
        </ZGrid>
      </div>
    )
  }
})
const OperatorsRender = React.createClass({
  // '0': '待审核',
  // '1': '已确认',
  // '3': '待发货',
  // '4': '待收货',
  // '5': '已作废',
  // '2': '已完成'
  //handleEditClick(e) {
    //console.log(this.props.node.columnController.gridColumns[5]) //primaryColumns
    //console.log(this.props.node.valueService.getValue(this.props.node.columnController.gridColumns[5], this.props.node))
    // return
    // if (noder) {
    //   const data = noder.data
    //   if (data.id <= 0) {
    //     ZPost({
    //       uri: 'Purchase/InsertQualityRev',
    //       data: {Quality: data},
    //       success: ({d}) => {
    //         noder.setData(Object.assign(noder.data, {id: d.id}))
    //       }
    //     })
    //     return
    //   }
    //   ZPost({
    //     uri: 'Purchase/UpdateQualityRev',
    //     data: {Quality: data},
    //     success: () => {
    //     }
    //   })
    // }
  //},
  handleDeleteClick() {
    const noder = this.props.node
    if (noder) {
      if (noder.data.id <= 0) {
        return this.props.api.removeItems([noder])
      }
      ZPost({
        uri: 'Purchase/DelPurDetail',
        data: {ID: this.props.api.gridOptionsWrapper.gridOptions.grid.props.conditions.Purid, DetailID: [noder.data.id]},
        success: () => {
          this.props.api.removeItems([noder])
        }
      })
    }
  },
  //  <Iconfa type='wrench' onClick={this.handleEditClick} title='更新' />
  render() {
    return (
      <div className='operators'>
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})
const DateEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value ? moment(this.props.value) : ''
    }
  },
  getValue() {
    const {value} = this.state
    return value ? value.format('YYYY-MM-DD') : ''
  },
  afterGuiAttached() {
    //fuck this
  },
  handleChange(value) {
    this.setState({value})
  },
  render() { return <DatePicker refs='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const PriceEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    return this.state.value
  },
  afterGuiAttached() {
    const input = findDOMNode(this.refs.zhang)
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
  },
  handleChange(e) {
    const value = Math.max(e, 0)
    this.setState({ value })
  },
  render() { return <InputNumber ref='zhang' min={0} step={0.01} value={this.state.value} onChange={this.handleChange} /> }
})
const columnDefs = [{
  headerName: 'ID',
  field: 'id',
  width: 65,
  pinned: true
}, {
  headerName: '图片',
  field: 'img',
  width: 50,
  cellStyle: {textAlign: 'center'},
  cellRenderer: function(params) {
    const k = params.data.img
    return k ? '<img src="' + k + '" width=40 height=40>' : '-'
  }
}, {
  headerName: '商品代号',
  field: 'skuid',
  width: 120
  // ,
  // valueGetter: function(params) {
  //   console.log(params)
  //   return 1
  // }
}, {
  headerName: '商品名称',
  field: 'skuname',
  width: 180
}, {
  headerName: '规格',
  field: 'norm',
  width: 120
}, {
  headerName: '采购数量',
  field: 'purqty',
  width: 90,
  cellEditorFramework: PriceEditor,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst === 0
  }
}, {
  headerName: '建议采购数量',
  field: 'suggestpurqty',
  width: 90
}, {
  headerName: '已入库数量',
  field: 'recqty',
  width: 98
}, {
  headerName: '单价',
  field: 'price',
  width: 80,
  cellEditorFramework: PriceEditor,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst === 0
  }
}, {
  headerName: '总金额',
  field: 'puramt',
  width: 80
}, {
  headerName: '备注',
  field: 'remark',
  width: 200,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst !== 2
  }
}, {
  headerName: '款式编码',
  field: 'goodscode',
  width: 100
}, {
  headerName: '供应商款号',
  field: 'supplynum',
  width: 100
}, {
  headerName: '供应商编码',
  field: 'supplycode',
  width: 100
}, {
  headerName: '预计到货数量',
  field: 'planqty',
  width: 110,
  cellEditorFramework: PriceEditor,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst !== 2
  }
}, {
  headerName: '预计到货金额',
  field: 'planamt',
  width: 110
}, {
  headerName: '预计到货日期',
  field: 'recievedate',
  width: 110,
  cellEditorFramework: DateEditor,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst !== 2
  }
}, {
  headerName: '装箱编号',
  field: 'packingnum',
  width: 100,
  editable: function(params) {
    return params.api.gridOptionsWrapper.gridOptions.grid.state.Purst !== 2
  }
}, {
  headerName: '操作',
  pinned: 'right',
  width: 70,
  cellRendererFramework: OperatorsRender
}]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  //singleClickEdit: true,
  editType: 'fullRow',
  onRowValueChanged: function(e) {
    const Purid = this.grid.state.Purid
    if (Purid) {
      this.grid.grid.x0pCall(ZPost('Purchase/UpdatePurDetail', {PurDetail: {
        id: e.data.id,
        purchaseid: this.grid.state.Purid,
        purqty: e.data.purqty || 0,
        price: e.data.price || 0,
        remark: e.data.remark || '',
        planqty: e.data.planqty || 0,
        recievedate: e.data.recievedate || '',
        packingnum: e.data.packingnum || ''
      }}, () => {}, () => {
        this.grid.refreshRowData()
      }))
    } else {
      message.info('请先选中采购单')
    }
  },
  onBeforeSortChanged: function() {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? {
      SortField: sorter.colId,
      SortDirection: sorter.sort.toUpperCase()
    } : {
      SortField: '',
      SortDirection: ''
    }
    this.grid.props.dispatch({type: 'PUR_CONDITIONS2_UPDATE', update: {
      $merge: conditions
    }})
  },
  rowSelection: 'single'
}
export default connect(state => ({
  conditions: state.pur_conditions2
}))(Test)
