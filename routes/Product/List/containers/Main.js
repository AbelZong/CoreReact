/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-08 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import {startLoading, endLoading} from 'utils'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import SupplierPicker from 'components/SupplierPicker'
import ItemCatPicker from 'components/ItemCatPicker'
import {
  Popconfirm,
  Select,
  message,
  Button,
  Form,
  Input,
  Modal,
  Radio
} from 'antd'
import {
  Icon as Iconfa
} from 'components/Icon'
import {
  reactCellRendererFactory
} from 'ag-grid-react'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
const ButtonGroup = Button.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const Main = React.createClass({
  componentDidMount() {
    this._firstBlood()
  },
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
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
  modifyRowByID(id) {
    this.props.dispatch({type: 'PRODUCT_LIST_MODIFY_VIS_SET', payload: id})
  },
  _getIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length) {
      return ids
    }
    message.info('没有选中')
  },
  deleteRowByIDs(ids) {
    this.grid.x0pCall(ZPost('XyCore/CoreSku/UptGoodsDel', {GoodsLst: ids, IsDelete: true}, () => {
      this.refreshDataCallback()
    }))
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleDelete() {
    const ids = this._getIDs()
    if (ids) {
      this.deleteRowByIDs(ids)
    }
  },
  handleEnable() {
    const ids = this._getIDs()
    if (ids) {
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 'true'}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  handleDisable() {
    const ids = this._getIDs()
    if (ids) {
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 'false'}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  _mergeData(d) {
    const {SkuLst} = d
    const BrandLst = d.BrandLst || {}
    const ScoLst = d.ScoLst || {}
    if (SkuLst && SkuLst instanceof Array) {
      SkuLst.forEach(x => {
        x.Brand = BrandLst[x.Brand] ? BrandLst[x.Brand].Name : ''
        x.SCoID = x.SCoID > 0 && ScoLst[x.SCoID] ? ScoLst[x.SCoID].Name : ''
      })
    }
    return SkuLst
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/CoreSku/SkuQueryLst'
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
        rowData: this._mergeData(d),
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(this._mergeData(d))
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    }))
  },
  handleNewEvent() {
    this.props.dispatch({type: 'PRODUCT_LIST_MODIFY_VIS_SET', payload: 0})
  },
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Button type='ghost' onClick={this.handleNewEvent} size='small'>
            <Iconfa type='plus' style={{color: 'red'}} />&nbsp;新商品
          </Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_list' }} columnDefs={columnDefs} grid={this} paged>
          批量：
          <Popconfirm title='确定要删除选中吗？' onConfirm={this.handleDelete}>
            <Button type='ghost' size='small'>删除</Button>
          </Popconfirm>
          <span className='ml10' />
          <ButtonGroup>
            <Popconfirm title='确定要启用吗？' onConfirm={this.handleEnable}>
              <Button type='primary' size='small'>启用</Button>
            </Popconfirm>
            <Popconfirm title='确定要备用吗？' onConfirm={this.handleBackup}>
              <Button size='small'>备用</Button>
            </Popconfirm>
            <Popconfirm title='确定要禁用吗？' onConfirm={this.handleDisable}>
              <Button type='ghost' size='small'>禁用</Button>
            </Popconfirm>
          </ButtonGroup>
        </ZGrid>
        <ModifyModal modalCB1={this.modalCB1} modalCB2={this.modalCB2} />
      </div>
    )
  }
})
const DEFAULT_TITLE = '创建新商品'
const ModifyModal = connect(state => ({
  doge: state.product_list_modify_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
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
          confirmLoading: false
        })
      } else {
        startLoading()
        ZGet({
          uri: 'Purchase/PurchaseSingle',
          data: {
            ID: nextProps.doge
          },
          success: ({d}) => {
            this.setState({
              title: `修改采购单：[${d.id}]`,
              visible: true,
              confirmLoading: false
            })
          },
          error: () => {
            this.props.dispatch({type: 'PRODUCT_LIST_MODIFY_VIS_SET', payload: -1})
          }
        }).then(endLoading)
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const {doge} = this.props
      let uri = ''
      const data = {}
      if (doge === 0) {
        uri = 'Purchase/InsertPur'
        data.id = 0
      } else {
        uri = 'Purchase/UpdatePur'
        data.id = doge
      }
      ZPost(uri, {
        Pur: data
      }, () => {
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
    this.props.dispatch({ type: 'PRODUCT_LIST_MODIFY_VIS_SET', payload: -1 })
    requestAnimationFrame(() => this.props.form.resetFields())
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <FormItem>
            <ItemCatPicker />
          </FormItem>
          <FormItem {...formItemLayout} label='商品类型'>
            {getFieldDecorator('s2', {
              initialValue: '0'
            })(
              <RadioGroup>
                <Radio key='0' value='0'>成品</Radio>
                <Radio key='1' value='1'>组合商品</Radio>
                <Radio key='3' value='3'>非成品</Radio>
                <Radio key='2' value='2'>原物料</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='供应商'>
            {getFieldDecorator('s3', {
              rules: [
                { required: true, type: 'object', message: '必选' }
              ]
            })(
              <SupplierPicker size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='合同条款'>
            {getFieldDecorator('s6')(
              <Input type='textarea' autosize={{minRows: 3, maxRows: 6}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='备注'>
            {getFieldDecorator('s7')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='详细地址'>
            {getFieldDecorator('s9', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input placeholder='小区、街道、楼门牌号等' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))

export default connect(state => ({
  conditions: state.product_list_conditions
}))(Wrapper(Main))
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.ID)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.ID])
  },
  render() {
    return (
      <div className='operators'>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑' />
        <Popconfirm title='确定要删除吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' title='删除' />
        </Popconfirm>
      </div>
    )
  }
})
const AbledRender = React.createClass({
  handleChange(e) {
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {
      IDLst: [this.props.data.ID],
      Enable: e
    }, () => {
      this.props.data.Enable = e
      this.forceUpdate()
    }))
  },
  render() {
    return (
      <Select value={this.props.data.Enable} size='small' onChange={this.handleChange}>
        <Option value='1'>启用</Option>
        <Option value='2'>备用</Option>
        <Option value='0'>禁用</Option>
      </Select>
    )
  }
})
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
    width: 80
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    width: 130
  }, {
    headerName: '货号',
    field: 'GoodsCode',
    width: 130
  }, {
    headerName: '名称',
    field: 'SkuName',
    width: 300
  }, {
    headerName: '规格',
    field: 'Norm',
    width: 100
  }, {
    headerName: '商品简称',
    field: 'SkuSimple',
    width: 200
  }, {
    headerName: '国编',
    field: 'GBCode',
    width: 130
  }, {
    headerName: '品牌',
    field: 'Brand',
    width: 120
  }, {
    headerName: '基本价',
    field: 'PurPrice',
    width: 90
  }, {
    headerName: '市场价',
    field: 'MarketPrice',
    width: 90
  }, {
    headerName: '成本价',
    field: 'CostPrice',
    width: 90
  }, {
    headerName: '出售价',
    field: 'SalePrice',
    width: 90
  }, {
    headerName: '重量',
    field: 'Weight',
    width: 90
  }, {
    headerName: '供应商编码',
    field: 'SCoID',
    width: 150
  }, {
    headerName: '供应商货号',
    field: 'ScoGoodsCode',
    width: 150
  }, {
    headerName: '供应商商品编码',
    field: 'ScoSku',
    width: 150
  }, {
    headerName: '最后修改时间',
    field: 'ModifyDate',
    width: 120
  }, {
    headerName: '状态',
    field: 'Enable',
    width: 70,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(AbledRender),
    suppressMenu: true,
    pinned: 'right'
  }, {
    headerName: '操作',
    width: 100,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true,
    pinned: 'right'
  }]
const gridOptions = {
}
