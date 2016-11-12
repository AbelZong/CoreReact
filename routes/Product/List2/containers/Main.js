/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-09 PM
* Last Updated:
*          2016-11-11 AM chenjie <827869959@qq.com>
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
import BrandPicker from 'components/BrandPicker'
import ItemCatPicker from 'components/ItemCatPicker'
import {
  Popconfirm,
  Select,
  message,
  Button,
  Form,
  Input,
  Modal,
  Checkbox,
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
const CheckboxGroup = Checkbox.Group
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
    this.props.dispatch({type: 'PRODUCT_LIST2_MODIFY_VIS_SET', payload: id})
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
  _firstBlood(_conditions) {
    console.log(_conditions)
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/CoreSku/GoodsQueryLst'
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
        rowData: d.GoodsLst,
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
              params.success(d.GoodsLst)
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
    this.props.dispatch({type: 'PRODUCT_LIST2_MODIFY_VIS_SET', payload: 0})
  },
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Button type='ghost' onClick={this.handleNewEvent} size='small'>
            <Iconfa type='plus' style={{color: 'red'}} />&nbsp;新商品
          </Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_list2' }} columnDefs={columnDefs} grid={this} paged>
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
  doge: state.product_list2_modify_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      shops: [],
      itemprops: [],
      skuprops: [],
      kindid: 0
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
        ZGet('Shop/getShopEnum', ({d}) => {
          this.setState({
            shops: d
          })
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
    this.props.form.validateFields((errors, v) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      //const {doge} = this.props
      v.KindID = (v.KindID && v.KindID.id) ? v.KindID.id : ''
      v.Brand = (v.Brand && v.Brand.id) ? v.Brand.id : ''
      v.Supplier = (v.Supplier && v.Supplier.id) ? v.Supplier.id : ''
      console.log(v)
      // let uri = ''
      // const data = {}
      // if (doge === 0) {
      //   uri = 'Purchase/InsertPur'
      //   data.id = 0
      // } else {
      //   uri = 'Purchase/UpdatePur'
      //   data.id = doge
      // }
      // ZPost(uri, {
      //   Pur: data
      // }, () => {
      //   this.hideModal()
      //   EE.triggerRefreshMain()
      // }, () => {
      //   this.setState({
      //     confirmLoading: false
      //   })
      // })
    })
  },
  handleKind(e) {
    let kindid = this.state.kindid
    if (kindid !== e.id) {
      this.setState({
        kindid: e.id
      })
      ZGet({
        uri: 'XyComm/Customkind/SkuKindProps',
        data: {
          ID: 365,
          Enable: true
        },
        success: ({d}) => {
          this.setState({
            itemprops: d
          })
          //console.log(JSON.parse(d[2].values).prop_value)
        }
      }).then(endLoading)
      ZGet({
        uri: 'XyComm/CustomKindSkuProps/SkuPropsByKind',
        data: {
          KindID: 365
        },
        success: ({d}) => {
          this.setState({
            skuprops: d
          })
        }
      }).then(endLoading)
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'PRODUCT_LIST2_MODIFY_VIS_SET', payload: -1 })
    requestAnimationFrame(() => this.props.form.resetFields())
  },
  commAttrs(vs) {
    return vs.map(x => {
      return (
        <div key={x.id}>
          <FormItem className={styles.itemSelect} style={{ margin: '5px 0 0 0' }}>
            {this.props.form.getFieldDecorator(`attr-${x.id}`)(
              <Select placeholder={`-选择${x.name}-`} style={{ width: 200 }}>
                {x.values != null ? (JSON.parse(x.values).prop_value.map(y => <Option value={`${y.vid}`} key={y.vid}>{y.name}</Option>)) : <Option key={0} />}
              </Select>
            )}
          </FormItem>
        </div>
      )
    })
  },
  skuChange(e) {
    console.log(e.target.id)
  },
  commSkus(vs) {
    return vs.map(x => {
      return (
        <div key={x.pid}>
          <FormItem label={`${x.name}`} style={{ margin: '5px 0 0 0' }}>
            {
                x.skuprops_values != null ? (x.skuprops_values.map(y => this.props.form.getFieldDecorator(`sku-${y.id}`)(<Checkbox key={y.id} label={`${y.name}`} className={styles.chk} onChange={this.skuChange}>
                  {y.name}
                  <Input style={{display: 'none'}} className={styles.input} value={`${y.name}`} />
                </Checkbox>)
                )
                ) : <Checkbox />
              }
          </FormItem>
        </div>
      )
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const formItemLayout2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>

          <FormItem {...formItemLayout2} label='款式编码(货号)'>
            {getFieldDecorator('GoodsCode', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='品牌'>
            {getFieldDecorator('Brand')(
              <BrandPicker />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='商品名称'>
            {getFieldDecorator('GoodsName', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='商品分类'>
            {getFieldDecorator('KindID')(
              <ItemCatPicker onChange={this.handleKind} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='供应商'>
            {getFieldDecorator('Supplier', {
              rules: [
                { required: true, type: 'object', message: '必选' }
              ]
            })(
              <SupplierPicker />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='供应商货号'>
            {getFieldDecorator('SupplierCode')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='市场|吊牌价'>
            {getFieldDecorator('MarketPrice')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='一口价'>
            {getFieldDecorator('SalePrice')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='成本价(采购价)'>
            {getFieldDecorator('PurPrice')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='重量(KG)'>
            {getFieldDecorator('Weight')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='淘宝模板店铺'>
            {getFieldDecorator('TempShopID')(
              <Select placeholder='-选择店铺-' style={{ width: 200 }}>
                {this.state.shops.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='淘宝宝贝编号'>
            {getFieldDecorator('TempID')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='备注'>
            {getFieldDecorator('Remark')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='商品属性' className={styles.item}>
            {this.commAttrs(this.state.itemprops)}
          </FormItem>
          <FormItem {...formItemLayout} label='商品规格' className={styles.item}>
            {this.commSkus(this.state.skuprops)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
export default connect(state => ({
  conditions: state.product_list2_conditions
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
    headerName: '货号',
    field: 'GoodsCode',
    width: 130
  }, {
    headerName: '货品名称',
    field: 'GoodsName',
    width: 200
  }, {
    headerName: '类目',
    field: 'KindName',
    width: 150
  }, {
    headerName: '出售价',
    field: 'SalePrice',
    width: 100
  }, {
    headerName: '供应商货号',
    field: 'ScoGoodsCode',
    width: 130
  }, {
    headerName: '状态',
    field: 'Enable',
    width: 70,
    cellStyle: {textAlign: 'center'},
    cellRenderer: function(params) {
      console.log(params)
    },
    suppressMenu: true
    //pinned: 'right'
  }, {
    headerName: '操作',
    width: 100,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true
    //pinned: 'right'
  }]
const gridOptions = {
}

// <div>
//   {getFieldDecorator('name', {
//     initialValue: {
//       checked: false,
//       value: ''
//     }
//   })(
//     <SkuCC />
//   )}
// </div>
const SkuCC = React.createClass({
  // getInitialState() {
  //   return {
  //     checked: !!this.props.checked,
  //     value: this.props.value
  //   }
  // },
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.checked !== this.props.checked || nextProps.value !== this.props.value) {
  //     this.setState(nextProps)
  //   }
  // },
  handleCheck(e) {
    this.props.onChange && this.props.onChange({
      checked: e.target.checked,
      value: this.props.value
    })
  },
  handleChange(e) {
    this.props.onChange && this.props.onChange({
      checked: this.props.checked,
      value: e
    })
  },
  render() {
    if (this.props.value.checked) {
      return (
        <div className='not-checked'>
          <Checkbox checked={this.props.value.checked} onChange={this.handleCheck} />
        </div>
      )
    }
    return (
      <div className='checked'>
        <Checkbox checked={this.props.value.checked} onChange={this.handleCheck} />
        <Input size='small' value={this.props.value.value} onChange={this.handleChange} />
      </div>
    )
  }
})
