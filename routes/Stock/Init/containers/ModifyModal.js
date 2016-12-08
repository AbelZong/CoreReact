/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './index.scss'
import {Modal, message, Button, Input, Tooltip} from 'antd'
import {
  Icon as Iconfa
} from 'components/Icon'
import ZGrid from 'components/Grid/index'
import {ZGet, ZPost} from 'utils/Xfetch'
import Toolbar2 from './Toolbar2'
import AppendProduct from 'components/SkuPicker/append'
import Wrapper from 'components/MainWrapper'

const InvQtyEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0,
      op: true
    }
  },
  getValue() {
    ZPost('XyCore/StockInit/SaveInitQty', {
      ID: this.props.node.data.ID,
      InvQty: this.state.value
    }, ({s, m}) => {
      if (s !== 1) {
        message.error(m)
      }
      const Yyah = this.props.api.gridOptionsWrapper.gridOptions
      Yyah.grid.refreshDataCallback()
    })
    return this.state.value
  },
  afterGuiAttached() {
    const input = this.refs.zhang.refs.input
    const evt = (e) => e.stopPropagation()
    input.addEventListener('click', evt, false)
    input.addEventListener('dblclick', evt, false)
    input.addEventListener('keypress', (e) => {
      if (!/^[0-9]*[1-9][0-9]*$/.test(e.keyCode || e.which)) {
        e.preventDefault()
        input.focus()
      }
    }, false)
  },
  handleChange(e) {
    const value = Math.max(e.target.value, 0)
    if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
      this.setState({ value })
    } else {
      this.setState({ value: this.props.value })
    }
  },
  render() {
    return <Input type='number' ref='zhang' min={0} value={this.state.value} onChange={this.handleChange} />
  }
})

const PriceEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 0
    }
  },
  getValue() {
    ZPost('XyCore/StockInit/SaveInitPrice', {
      ID: this.props.node.data.ID,
      Price: this.state.value
    }, ({s, m}) => {
      if (s !== 1) {
        message.error(m)
      }
      const Yyah = this.props.api.gridOptionsWrapper.gridOptions
      Yyah.grid.refreshDataCallback()
    })

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
    const value = Math.max(e.target.value, 0)
    this.setState({ value })
  },
  render() { return <Input type='number' ref='zhang' min={0} value={this.state.value} onChange={this.handleChange} /> }
})

const gridOptions = {
  groupIncludeFooter: true,
  groupDefaultExpanded: 1,
  groupSuppressAutoColumn: true
}
const defColumns = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: true
  }, {
    headerName: 'ID',
    field: 'ID',
    width: 50
  }, {
    headerName: '图片',
    field: 'Img',
    width: 80
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '商品名称',
    field: 'SkuName',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '颜色及规格',
    field: 'Norm',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '数量',
    field: 'InvQty',
    cellStyle: {textAlign: 'center'},
    width: 60,
    editable: true,
    cellClass: 'editable',
    cellEditorFramework: InvQtyEditor
  }, {
    headerName: '成本价',
    field: 'Price',
    cellStyle: {textAlign: 'center'},
    width: 80,
    editable: true,
    cellClass: 'editable',
    cellEditorFramework: PriceEditor
  }, {
    headerName: '成交金额',
    field: 'Amount',
    cellStyle: {textAlign: 'center'},
    width: 100
  }]
const ModifyModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      btnvisible: 'none',
      title: '',
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge[0] < 0) {
      this.setState({
        visible: false,
        confirmLoading: false
      })
    } else if (nextProps.doge[0] === 0) {
      this.setState({
        visible: true,
        title: '',
        confirmLoading: false
      })
    } else {
      //this.props.dispatch({ type: 'STOCK_INIT_MODIFY_ADD_SET', payload: nextProps.doge[1] })
      this.setState({
        visible: true,
        title: `编辑期初库存 ID[${nextProps.doge}]`,
        confirmLoading: false,
        ParentID: nextProps.doge[0],
        btnvisible: nextProps.doge[1] === 0 ? 'block' : 'none'
      }, () => {
        this._firstB({ParentID: this.state.ParentID})
      })
    }
  },
  refreshDataCallback() {
    // let a = 0
    // let b = 0
    // let c = 0
    // this.grid.api.forEachNode((node) => {
    //   let x = node.data
    //   a += parseInt(x.InvQty)
    //   b += parseFloat(x.Price)
    //   c += parseFloat(x.Amount)
    //   if (node.lastChild) {
    //     console.log(this.grid.api)
    //     node.data.InvQty = a
    //     node.data.Price = b
    //     node.data.Amount = c
    //     this.grid.api.refreshCell()
    //   }
    // })
    this._firstB({ParentID: this.state.ParentID})
  },
  _firstB(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/StockInit/StockInitItemLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.InitItemLst,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstB()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.InitItemLst)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
      this.grid.api.recomputeAggregates()
      // const newRows = []
      // let a = 0
      // let b = 0
      // let c = 0
      // d.InitItemLst.forEach(x => {
      //   a += parseInt(x.InvQty)
      //   b += parseFloat(x.Price)
      //   c += parseFloat(x.Amount)
      // })
      // if (a !== 0 || b !== 0 || c !== 0) {
      //   newRows.push({
      //     InvQty: a,
      //     Price: b,
      //     Amount: c
      //   })
      //   this.grid.api.insertItemsAtIndex(d.InitItemLst.length, newRows)
      //   this.grid.hideOverlay()
      //}
    }))
  },
  handleAppend(lst) {
    if (lst && lst instanceof Array && lst.length) {
      const SkuIDLst = lst.map(x => x.ID)
      this.grid.x0pCall(ZPost('XyCore/StockInit/InsertInitItem', {SkuIDLst, ParentID: this.state.ParentID}, ({s, m}) => {
        if (s === 1) {
          // const newRows = []
          // lst.forEach(x => {
          //   newRows.push({
          //     ID: x.ID,
          //     Img: x.Img,
          //     SkuID: x.SkuID,
          //     SkuName: x.SkuName,
          //     Norm: x.Norm,
          //     InvQty: x.InvQty === null ? 0 : x.InvQty,
          //     Price: x.Price === null ? 0 : x.Price,
          //     Amount: x.Amount === null ? 0 : x.Amount
          //   })
          //})
          //this.grid.appendRows(newRows)
          this.refreshDataCallback()
        } else {
          message.error(m)
        }
      }))
    }
  },
  handleCheckInit() {
    ZPost('XyCore/StockInit/CheckInit',
    {ID: this.state.ParentID}, ({s, m}) => {
      if (s === 1) {
        this.hideModal()
        this.props.dispatch({type: 'STOCK_INIT_CONDITIONS_SET', payload: {}})
      } else {
        message.error(m)
      }
    })
  },
  hideModal() {
    this.props.dispatch({ type: 'STOCK_INIT_MODIFY_VIS_SET', payload: [-1, 0] })
    // this.props.form.resetFields()
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleCancel() {
    this.props.dispatch({type: 'STOCK_INIT_MODIFY_VIS_SET', payload: [0, 0]})
  },
  render() {
    const {visible, title, confirmLoading, btnvisible} = this.state
    return (
      <Modal title={title} visible={visible} footer='' onCancel={this.hideModal} confirmLoading={confirmLoading} width={850} >
        <Toolbar2 />
        <div className={styles.topOperators2} style={{display: btnvisible}}>
          <AppendProduct onChange={this.handleAppend} />
          <Button type='ghost' style={{marginLeft: 314}} onClick={this.handleSearch}> <Iconfa type='refresh' style={{color: '#33ef33'}} />&nbsp;导入期初库存</Button>
          <Button type='ghost' style={{marginLeft: 5}} onClick={this.handleCheckInit}> <Iconfa type='check' style={{color: '#33ef33'}} />&nbsp;确认生效</Button>
          <Button type='ghost' style={{marginLeft: 5}} onClick={this.handleSearch}> 导出商品编码供盘库存</Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'init_item_list' }} columnDefs={defColumns} grid={this} paged height={500} />
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.stock_init_modify_vis,
  conditions: state.stock_init_item_conditions
}))(Wrapper(ModifyModal))
