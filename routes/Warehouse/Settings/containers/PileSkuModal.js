/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-12 10:16:04
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Form, Modal, Popconfirm, Button, message, Row, Col, Input } from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import EE from 'utils/EE'
import {
  Icon as Iconfa
} from 'components/Icon'
const createForm = Form.create
const FormItem = Form.Item
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
const DEFAULT_TITLE = '设置仓位与商品关系'

const OperatorsRender = React.createClass({
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.ID])
  },
  render() {
    return (
      <div className='operators'>
        <Popconfirm title='确定要删除吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' title='删除' />
        </Popconfirm>
      </div>
    )
  }
})
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
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 60
  }, {
    headerName: '图片',
    field: 'Img',
    cellStyle: {textAlign: 'center'},
    width: 80,
    cellRenderer: function(params) {
      const k = params.data.img
      return k ? '<img src="' + k + '" width=40 height=40>' : '-'
    }
  }, {
    headerName: '款式编码（货号）',
    field: 'GoodsCode',
    cellStyle: {textAlign: 'center'},
    width: 150
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    cellStyle: {textAlign: 'center'},
    width: 200
  }, {
    headerName: '商品名',
    field: 'SkuName',
    cellStyle: {textAlign: 'center'},
    width: 200
  }, {
    headerName: '仓位',
    field: 'PCode',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '操作',
    width: 100,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true
    //pinned: 'right'
  } ]
const PileSkuModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      submenu: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else {
        this.setState({
          visible: true,
          confirmLoading: false
        }, () => {
          this._firstBlood(nextProps)
        })
      }
    }
  },
  _firstBlood() {
    startLoading()
    const uri = 'Wmspile/pileAndSku'
    const data = Object.assign({
      pageSize: this.grid.getPageSize(),
      page: 1
    })
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.pageCount,
        rowData: d.list,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              pageSize: params.pageSize,
              page: params.page})
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.list)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    })).then(endLoading)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  hideModal() {
    this.props.dispatch({ type: 'WARE_PILE_SKU_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  _getIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length) {
      return ids
    }
    message.info('没有选中')
  },
  handleDelete() {
    const ids = this._getIDs()
    if (ids) {
      this.deleteRowByIDs(ids)
    }
  },
  deleteRowByIDs(ids) {
    this.grid.x0pCall(ZPost('Wmspile/delPileSKu', {IDLst: ids}, () => {
      this.refreshDataCallback()
    }))
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  handleSubmit() {
    startLoading()
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      const data = {
        PCode: vs.PCode,
        SkuID: vs.SkuID
      }

      ZPost('Wmspile/insertPileSKu', data, () => {
        this.refreshDataCallback()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state

    return (
      <Modal title={title} visible={visible} footer='' onCancel={this.hideModal} confirmLoading={confirmLoading} width={1000} maskClosable={false}>
        <Form inline className={`${styles.row} pos-form`}>
          <FormItem label='仓位'>
            {getFieldDecorator('PCode', {
              rules: [
                { required: true, message: '必填' }
              ]
            })(
              <Input placeholder='' style={{width: '100px'}} />
            )}
          </FormItem>
          <FormItem label='商品编码'>
            {getFieldDecorator('SkuID', {
              rules: [
                { required: true, message: '必填' }
              ]
            })(
              <Input placeholder='' style={{width: '200px'}} />
            )}
          </FormItem>
          <FormItem>
            <Button type='primary' onClick={this.handleSubmit} >确定</Button>
          </FormItem>
        </Form>
        <ZGrid paged className={`${styles.zgrid} ${styles.rightPart}`} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_pile_sku' }} columnDefs={columnDefs} grid={this} height={500} >
          批量：
          <Popconfirm title='确定要删除选中吗？' onConfirm={this.handleDelete}>
            <Button type='ghost' size='small'>删除</Button>
          </Popconfirm>
        </ZGrid>
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.ware_pile_sku_vis
}))(createForm()(PileSkuModal))
