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
import {
  Form,
  Input,
  Modal,
  Button,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  message} from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import EE from 'utils/EE'
import {findDOMNode} from 'react-dom'
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group
import AppendProduct from 'components/SkuPicker/append'
import ShopPicker from 'components/ShopPicker'
import {startLoading, endLoading} from 'utils'
import {
  Icon as Iconfa
} from 'components/Icon'
import moment from 'moment'

const DEFAULT_TITLE = '添加虚拟库存'

const gridOptions = {}
const OperatorsRender = React.createClass({
  handleRemove(e) {
    const noder = this.props.node
    if (noder) {
      return this.props.api.removeItems([noder])
    }
  },
  render() {
    return (
      <div className='operators'>
        <a href='javascript:void(0)' style={{marginLeft: 10}} onClick={this.handleRemove} ><Iconfa type='remove' /></a>
      </div>
    )
  }
})

const PercentEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || 100
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
    const value = Math.min(Math.max(e.target.value, 0), 100)
    this.setState({ value })
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const CountEditor = React.createClass({
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
    const value = Math.max(e.target.value, 0)
    if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
      this.setState({ value })
    } else {
      this.setState({ value: this.props.value })
    }
  },
  render() { return <Input ref='zhang' value={this.state.value} onChange={this.handleChange} /> }
})
const WangWang = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      type: 1,
      edit: false,
      ID: 0
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else if (nextProps.doge === 0) {
        this.setState({
          visible: true,
          title: DEFAULT_TITLE,
          confirmLoading: false,
          edit: true,
          ID: nextProps.doge
        })
      } else {
        startLoading()
        ZGet('XyCore/Inventory/InvLockMain', {ID: nextProps.doge}, ({d}) => {
          const formData = {
            Name: d.Main.Name,
            AutoUnlock: d.Main.AutoUnlock,
            DeadLine: moment(d.Main.DeadLine),
            ShopID: {
              id: d.Main.ShopID,
              name: d.Main.ShopName
            }
          }
          this.setState({
            visible: true,
            title: DEFAULT_TITLE,
            confirmLoading: false,
            edit: false,
            type: d.Main.Type,
            ID: nextProps.doge
          }, () => {
            this.props.form.setFieldsValue(formData)
            const newRows = []
            d.ItemLst.forEach(x => {
              newRows.push({
                SkuID: x.SkuID,
                SkuName: x.SkuName,
                Qty: x.Qty,
                Qty2: x.Qty,
                StockQty: x.StockQty === 0 ? 0 : x.StockQty,
                Percent: x.StockQty === 0 ? 0 : x.StockQty % x.Qty,
                Count: x.Qty,
                Forbiden: 0,
                ID: x.ID,
                Skuautoid: x.Skuautoid
              })
            })
            this.grid.appendRows(newRows)
          })
        }).then(endLoading)
      }
    }
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleSubmit() {
    const rows = this.grid.api.rowModel.rowsToDisplay
    if (rows.length === 0) {
      message.info('请先添加商品')
    }
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }

      const main = {
        Name: vs.Name ? vs.Name : '',
        Type: vs.Type ? vs.Type : '',
        DeadLine: vs.DeadLine ? vs.DeadLine.format() : '',
        AutoUnlock: vs.AutoUnlock ? 1 : 0,
        ShopID: vs.ShopID && vs.ShopID.id ? vs.ShopID.id : ''
      }
      const itemLst = []
      rows.forEach(y => {
        const x = y.data
        if (this.state.type === 1) {
          itemLst.push({
            ID: x.ID,
            Skuautoid: x.Skuautoid,
            Qty: x.Qty,
            StockQty: Math.ceil(x.Qty * x.Percent / 100)
          })
        }
        if (this.state.type === 2) {
          itemLst.push({
            ID: x.ID,
            Skuautoid: x.Skuautoid,
            Qty: x.Qty,
            StockQty: x.Count
          })
        }
        if (this.state.type === 3) {
          itemLst.push({
            ID: x.ID,
            Skuautoid: x.Skuautoid,
            Qty: x.Qty,
            StockQty: 0
          })
        }
      })
      ZPost('XyCore/Inventory/InsertInvLock', {main: main, itemLst: itemLst}, () => {
        this.hideModal()
        EE.triggerRefreshMain()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },

  hideModal() {
    this.grid.setRowData([])
    this.props.dispatch({ type: 'STOCK_INVLOCK_VIS_MOD_SET', payload: -1 })
    this.props.form.resetFields()
  },
  handleAppend(lst) {
    if (lst && lst instanceof Array && lst.length) {
      const rows = this.grid.api.rowModel.rowsToDisplay
      const SkuIDLst = lst.map(x => x.ID)
      this.grid.x0pCall(ZPost('XyCore/Inventory/CheckInvQtyByID', {IDLst: SkuIDLst, Type: this.state.type}, ({s, d, m}) => {
        if (s === 1) {
          const newRows = []
          d.forEach(x => {
            let flag = false
            rows.forEach(y => {
              if (y.data.ID === x.ID) {
                flag = true
              }
            })
            if (!flag) {
              newRows.push({
                SkuID: x.SkuID,
                SkuName: x.SkuName,
                Qty: x.Qty,
                Qty2: x.Qty,
                StockQty: x.StockQty === null ? 0 : x.StockQty,
                Percent: 100,
                Count: x.Qty,
                Forbiden: 0,
                ID: x.ID,
                Skuautoid: x.Skuautoid
              })
            }
          })
          this.grid.appendRows(newRows)
        } else {
          message.error(m)
        }
      }))
    }
  },
  checkNum(rule, value, callback) {
    if (!/^(0|[1-9][0-9]*)$/.test(value) && value !== undefined && value !== '') {
      callback('请填写整数')
    } else {
      callback()
    }
  },
  radioChange(e) {
    this.setState({
      type: e.target.value
    })
  },
  render() {
    const columnDefs = [{
      headerName: '商品编码',
      field: 'SkuID',
      cellStyle: {textAlign: 'center'},
      width: 150
    }, {
      headerName: '商品名称',
      field: 'SkuName',
      cellStyle: {textAlign: 'center'},
      width: 150
    }, {
      headerName: '可用数',
      field: 'Qty',
      hide: !this.state.edit,
      cellStyle: {textAlign: 'center'},
      width: 70
    }, {
      headerName: '锁定数',
      field: 'Qty2',
      hide: this.state.edit,
      cellStyle: {textAlign: 'center'},
      width: 70
    }, {
      headerName: '本次锁定数',
      field: 'StockQty',
      hide: !this.state.edit,
      cellStyle: {textAlign: 'center'},
      width: 100
    }, {
      headerName: '百分比',
      field: 'Percent',
      hide: !(this.state.type === 1) || !this.state.edit,
      cellStyle: {textAlign: 'center'},
      width: 90,
      editable: true,
      cellClass: 'editable',
      cellEditorFramework: PercentEditor
    }, {
      headerName: '指定数量',
      field: 'Count',
      hide: !(this.state.type === 2) || !this.state.edit,
      cellStyle: {textAlign: 'center'},
      width: 90,
      editable: true,
      cellClass: 'editable',
      cellEditorFramework: CountEditor
    }, {
      headerName: '禁止同步',
      field: 'Forbiden',
      hide: !(this.state.type === 3) || !this.state.edit,
      cellStyle: {textAlign: 'center'},
      width: 90
    }, {
      headerName: 'ID',
      field: 'ID',
      hide: true,
      width: 90
    }, {
      headerName: 'Skuautoid',
      field: 'Skuautoid',
      hide: true,
      width: 90
    }, {
      headerName: '操作',
      width: 120,
      hide: !this.state.edit,
      cellRendererFramework: OperatorsRender,
      suppressMenu: true
    }]
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const display = this.state.edit ? 'block' : 'none'
    const foot = this.state.ID > 0 ? '' : [
      <div>
        <Button type='ghost' onClick={this.hideModal} >
        取消
        </Button>
        <Button type='primary' onClick={this.handleSubmit} style={{ marginLeft: 15 }}>
          提交商品库存锁定
        </Button>
      </div>]
    return (
      <Modal title={title} visible={visible} onCancel={this.hideModal} footer={foot} confirmLoading={confirmLoading} width={900} maskClosable={false}>
        <Form horizontal className='pos-form'>
          <Row>
            <Col sm={16}>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{span: 15}} label='锁定名称'>
                {getFieldDecorator('Name', {
                  rules: [
                { required: true, type: '', message: '必填' }
                  ]
                })(
                  <Input type='text' disabled={!this.state.edit} />
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <div className={styles.searchTip} >如: 双十一库存锁定</div>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label='分配模式'>
            {getFieldDecorator('Type', {
              initialValue: this.state.type
            })(
              <RadioGroup onChange={this.radioChange} disabled={!this.state.edit}>
                <Radio value={1}>百分比%</Radio>
                <Radio value={2}>指定数量</Radio>
                <Radio value={3}>禁止同步</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <Row>
            <Col sm={8}>
              <FormItem labelCol={{ span: 12 }} wrapperCol={{span: 8}} label='过期解锁' >
                {getFieldDecorator('AutoUnlock', {
                  valuePropName: 'checked',
                  initialValue: false
                })(
                  <Checkbox disabled={!this.state.edit} />
                )}
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem labelCol={{ span: 12 }} wrapperCol={{span: 8}} label='过期时间'>
                {getFieldDecorator('DeadLine', {rules: [
                { required: true, type: 'object', message: '必填' }
                ]})(
                  <DatePicker disabled={!this.state.edit} />
                )}
              </FormItem>
            </Col>
          </Row>

          <FormItem {...formItemLayout} label='锁定店铺' disabled={this.state.edit}>
            {getFieldDecorator('ShopID')(
              <ShopPicker disabled={!this.state.edit} />
            )}
          </FormItem>
        </Form>
        <div className={styles.topOperators} style={{display: display}}>
          <AppendProduct onChange={this.handleAppend} />
          <Button type='ghost' style={{marginLeft: 15}} size='small' onClick={this.handleNewInvlock}>
            导入列表
          </Button>
          <div className={styles.divTip}>
            (注意：仅限有库存的商品，最多10000个商品)
          </div>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_invlock' }} columnDefs={columnDefs} grid={this} height={400} />
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.stock_invlock_mod_vis
}))(createForm()(WangWang))
