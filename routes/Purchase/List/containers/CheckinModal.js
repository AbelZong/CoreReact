/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 13:41:22
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
//import {findDOMNode} from 'react-dom'
import {Icon as Iconfa} from 'components/Icon'
import { Input, Modal, DatePicker, Button, Popconfirm, Icon } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
//import {startLoading, endLoading} from 'utils'
import moment from 'moment'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
//const Option = Select.Option
//let insertNewID = 0
const WangWangWang = React.createClass({
  getInitialState() {
    return {
      visible: false,
      title: '质检和验货'
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge <= 0) {
        this.setState({
          visible: false
        })
      } else {
        this.setState({
          visible: true
        }, () => {
          this._firstBlood({Purid: nextProps.doge})
        })
      }
    }
  },
  _firstBlood(_conditions) {
    this.grid.showLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Purchase/QualityRevList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1,
      Purid: this.props.doge
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Qua,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({}, data, {
              NumPerPage: params.pageSize,
              PageIndex: params.page
            })
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Qua)
            }, (m) => {
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
  handleInsert() {
    this.grid.appendRows([
      {
        id: -1, //--insertNewID,
        purchaseid: this.props.doge,
        recorddate: '',
        recorder: this.props.username,
        drawrate: '',
        type: '产前质检',
        conclusion: '',
        remark: '',
        status: 0
      }
    ])
  },
  handleok() {
    this.props.dispatch({ type: 'PUR_CI_VIS_SET', payload: -1 })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    const {visible, title} = this.state
    return (
      <Modal title={title} visible={visible} width={980} maskClosable={false} closable={false} footer=''>
        <div className={styles.toolbars4}>
          <Button type='ghost' size='small' onClick={this.handleInsert}>新增质检报告</Button>
          <span className='pull-right help-text'>双击带<Icon type='edit' />的单元格可以修改，然后操作更新<Iconfa type='wrench' /></span>
          <div className='clearfix' />
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} pagesAlign='left' gridOptions={gridOptions} storeConfig={{ prefix: 'purchase3' }} pageSizeDef='50' columnDefs={columnDefs} columnsFited grid={this} paged height={500}>
          <Button onClick={this.handleok}>关闭</Button>
        </ZGrid>
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.pur_ci_vis,
  username: state.user.name
}))(WangWangWang)
const gridOptions = {
  // onCellValueChanged: function(event) {
  //   console.log('onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue)
  // },
  // onRowValueChanged: function(event) {
  //   var data = event.data
  //   console.log('onRowValueChanged: (' + data.make + ', ' + data.model + ', ' + data.price + ')')
  // }
  //singleClickEdit: true
}
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
const DrawrateEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    return this.state.value
  },
  afterGuiAttached() {
    const input = this.refs.zhang.refs.input
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
    input.addEventListener('keypress', (e) => {
      if (!/\d/.test(e.keyCode || e.which)) {
        e.preventDefault()
        input.focus()
      }
    }, false)
  },
  handleChange(e) {
    const value = Math.min(Math.max(e.target.value, 0), 100)
    this.setState({ value })
  },
  render() { return <Input type='number' ref='zhang' min={0} max={100} value={this.state.value} onChange={this.handleChange} /> }
})
// const TypeEditor = React.createClass({
//   getInitialState() {
//     return {
//       value: this.props.value
//     }
//   },
//   getValue() {
//     return this.state.value
//   },
//   afterGuiAttached() {
//     const input = findDOMNode(this.refs.zhang)
//     const evt = (e) => e.stopPropagation()
//     input.addEventListener('dblclick', evt, false)
//   },
//   handleChange(value) {
//     this.setState({ value })
//   },
//   render() {
//     return (
//       <Select placeholder='选择...' style={{width: '100%'}} value={this.state.value || undefined} ref='zhang' onChange={this.handleChange}>
//         <Option value='lucy'>lucy</Option>
//       </Select>
//     )
//   }
// })
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    const noder = this.props.api.getSelectedNodes()[0]
    if (noder) {
      const data = noder.data
      if (data.id <= 0) {
        ZPost({
          uri: 'Purchase/InsertQualityRev',
          data: {Quality: data},
          success: ({d}) => {
            noder.setData(Object.assign(noder.data, {id: d.id}))
          }
        })
        return
      }
      ZPost({
        uri: 'Purchase/UpdateQualityRev',
        data: {Quality: data},
        success: () => {
        }
      })
    }
  },
  handleConfirmClick() {
    const noder = this.props.api.getSelectedNodes()[0]
    if (noder) {
      ZPost({
        uri: 'Purchase/ConfirmQualityRev',
        data: {ID: noder.data.id},
        success: () => {
          noder.setData(Object.assign(noder.data, {status: 1}))
        }
      })
    }
  },
  handleDeleteClick() {
    const noder = this.props.api.getSelectedNodes()[0]
    if (noder) {
      if (noder.data.id <= 0) {
        return this.props.api.removeItems([noder])
      }
      ZPost({
        uri: 'Purchase/DeleteQualityRev',
        data: {ID: noder.data.id},
        success: () => {
          this.props.api.removeItems([noder])
        }
      })
    }
  },
  render() {
    return (
      <div className='operators'>
        {this.props.data.id > 0 && this.props.data.status === 0 ? <Iconfa type='check' onClick={this.handleConfirmClick} title='确定' /> : null}
        {this.props.data.status === 0 ? <Iconfa type='wrench' onClick={this.handleEditClick} title='更新' /> : null}
        {this.props.data.status === 0 ? <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm> : null}
      </div>
    )
  }
})
const columnDefs = [{
  headerName: '#', width: 50, suppressSorting: true, suppressMenu: true, pinned: true, field: 'id'
}, {
  headerName: '检验日期',
  field: 'recorddate',
  width: 110,
  editable: true,
  cellEditorFramework: DateEditor,
  cellClass: 'editable'
}, {
  headerName: '抽签比例%',
  field: 'drawrate',
  width: 90,
  editable: true,
  cellEditorFramework: DrawrateEditor,
  cellClass: 'editable'
}, {
  headerName: '质检员',
  field: 'recorder',
  width: 80,
  editable: true,
  cellClass: 'editable'
}, {
  headerName: '质检类型',
  field: 'type',
  width: 80,
  editable: true,
  cellEditor: 'select',
  cellEditorParams: {
    values: ['产前质检', '产中质检', '产后质检']
  },
  cellClass: 'editable'
}, {
  headerName: '状态',
  field: 'status',
  width: 60,
  cellStyle: {textAlign: 'center'},
  cellRenderer: function(params) {
    return params.data.status === 1 ? '已确认' : '待审核'
  }
}, {
  headerName: '结论',
  field: 'conclusion',
  width: 180,
  editable: true,
  cellEditor: 'largeText',
  cellEditorParams: {
    maxLength: '200',
    cols: '40',
    rows: '3'
  },
  cellClass: 'editable'
}, {
  headerName: '备注',
  field: 'remark',
  width: 180,
  editable: true,
  cellEditor: 'largeText',
  cellEditorParams: {
    maxLength: '200',
    cols: '40',
    rows: '3'
  },
  cellClass: 'editable'
}, {
  headerName: '操作',
  width: 90,
  cellRendererFramework: OperatorsRender
}]
