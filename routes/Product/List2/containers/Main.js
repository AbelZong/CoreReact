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
import update from 'react-addons-update'
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
import SkuInfo from './SkuInfo'
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
  Row,
  Col,
  InputNumber
} from 'antd'
import {
  Icon as Iconfa
} from 'components/Icon'
import ShopPicker from 'components/ShopPicker'
const createForm = Form.create
const FormItem = Form.Item
const ButtonGroup = Button.Group
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
    this.grid.x0pCall(ZPost('XyCore/CoreSku/DeleteGoods', {IDLst: ids, IsDelete: true}, () => {
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
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 1}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  handleBackup() {
    const ids = this._getIDs()
    if (ids) {
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 2}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  handleDisable() {
    const ids = this._getIDs()
    if (ids) {
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 0}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  _firstBlood(_conditions) {
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
const skuprops = []
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
      skuProps: [],
      kindid: 0,
      items: [],
      skupid: 0,
      brandid: '',
      brandname: '',
      Supplier: ['', '']
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
          uri: 'XyCore/CoreSku/GoodsQuery',
          data: {
            ID: nextProps.doge
          },
          success: ({d}) => {
            this.autoIndex = 0
            console.log(d)
            this.props.form.setFieldsValue({
              GoodsCode: d.main.GoodsCode,
              GoodsName: d.main.GoodsName,
              KindID: d.main.KindID,
              ScoID: d.main.ScoID,
              ScoGoodsCode: d.main.ScoGoodsCode,
              MarketPrice: d.main.MarketPrice,
              SalePrice: d.main.SalePrice,
              PurPrice: d.main.PurPrice,
              Weight: d.main.Weight,
              TempShopID: d.main.TempShopID,
              TempID: d.main.TempID,
              Remark: d.main.Remark,
              Img: d.main.Img
            })
            const _skuProps = {}
            if (d.skuprops && d.skuprops instanceof Array && d.skuprops.length) {
              for (let sku of d.skuprops) {
                _skuProps[sku.val_id] = sku
              }
            }
            const skuProps = {}
            if (d.skuprops_base && d.skuprops_base instanceof Array && d.skuprops_base.length) {
              for (let sku of d.skuprops_base) {
                let children1 = [] //其它的
                let children0 = [] //内置的 ok
                if (sku.skuprops_values && sku.skuprops_values instanceof Array && sku.skuprops_values.length) {
                  for (let prop of sku.skuprops_values) {
                    let cc = null
                    if (_skuProps && _skuProps[prop.id]) {
                      cc = _skuProps[prop.id]
                      delete _skuProps[prop.id]
                    } else {
                      cc = {
                        Enable: 0,
                        ID: 0,
                        mapping: prop.mapping,
                        pid: prop.pid,
                        val_id: prop.id,
                        val_name: prop.name
                      }
                    }
                    children0.push(cc)
                  }
                }
                if (_skuProps && Object.keys(_skuProps).length) {
                  for (let id in _skuProps) {
                    if (_skuProps[id].pid === sku.pid) {
                      children1.push(_skuProps[id])
                      delete _skuProps[id]
                    }
                  }
                }
                skuProps[sku.pid] = {
                  name: sku.name,
                  pid: sku.pid,
                  children1,
                  children0
                }
              }
            }
            // let skus = []
            // let skupid = d.skuprops_base.length
            // if (d.skuprops_base.length > 0) {
            //   for (let sp of d.skuprops_base) {
            //     let temps = {pid: sp.pid, name: sp.name, skuprops_values: []}
            //     for (let spv of sp.skuprops_values) {
            //       for (let edit of d.skuprops) {
            //         if (sp.pid === edit.pid) {
            //           if (edit.IsOther === 1) {
            //             temps.skuprops_values.push({
            //               ischeck: true,
            //               name: edit.val_name,
            //               fname: sp.name,
            //               id: edit.ID,
            //               mapping: edit.mapping,
            //               IsOther: edit.IsOther,
            //               pid: edit.pid
            //             })
            //           } else {
            //             if (spv.name === edit.val_name) {
            //               temps.skuprops_values.push({
            //                 ischeck: true,
            //                 name: spv.name,
            //                 fname: sp.name,
            //                 id: spv.id,
            //                 mapping: spv.mapping,
            //                 IsOther: 0,
            //                 pid: spv.pid
            //               })
            //             }
            //           }
            //         }
            //       }
            //     }
            //     skus.push(temps)
            //   }
            //   for (let sp of d.skuprops_base) {
            //     for (let spv of sp.skuprops_values) {
            //       for (let edit of skus) {
            //         if (sp.pid === edit.pid) {
            //           if (edit.skuprops_values.findIndex(x => x.name === spv.name) === -1) {
            //             edit.skuprops_values.push({
            //               ischeck: false,
            //               name: spv.name,
            //               fname: sp.name,
            //               id: spv.id,
            //               mapping: spv.mapping,
            //               IsOther: 0,
            //               pid: spv.pid
            //             })
            //           }
            //         }
            //       }
            //     }
            //   }
            // }
            this.setState({
              title: `修改商品：[${d.main.ID}]`,
              visible: true,
              confirmLoading: false,
              itemProps: [], //todo 数据清洗
              skuProps: Object.values(skuProps)
              //itemprops: d.itemprops_base,
              //skuprops: skus,
              //items: d.items,
              //editSp: d.skuprops,
              //editIp: d.itemprops,
              //brandid: d.main.Brand,
              //brandname: d.main.BrandName,
              //skupid: skupid
            }, () => {
              console.log(this.state)
            })
          },
          error: () => {
            this.props.dispatch({type: 'PRODUCT_LIST2_MODIFY_VIS_SET', payload: -1})
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
      console.log(v)
    //  const {doge} = this.props
      v.KindID = (v.KindID && v.KindID.id) ? v.KindID.id : ''
      v.Brand = (v.Brand && v.Brand.id) ? v.Brand.id : ''
      v.Supplier = (v.Supplier && v.Supplier.id) ? v.Supplier.id : ''
      const keys1 = Object.keys(v)
      let Coresku_main = {}
      let itemprops = []
      let items = []
      for (let item of v.items.items) {
        items.push({
          SkuID: item.SkuID,
          SkuName: v.GoodsName,
          SkuSimple: v.GoodsName,
          Norm: item.Color + ';' + item.Size,
          PurPrice: item.PurPrice,
          SalePrice: item.SalePrice,
          Weight: item.Weight,
          Pid1: item.Pid1,
          val_id1: item.val_id1,
          Pid2: item.Pid2,
          val_id2: item.val_id2
        })
      }

      for (let id of keys1) {
        if (v[id] === undefined) continue
        let cc = v[id]
        if (typeof cc === 'object') {
          let a = id.split('-')
          if (cc.value === '') continue
          if (a[0] === 'attr') {
            itemprops.push({
              pid: a[2],
              val_id: a[1],
              val_name: cc.value
            })
          } else {
            if (!cc.checked) continue
            // if (id.indexOf('--') > -1) { //自定义规格
            //   let selfSku = id.split('-')
            //   skuprops.push({
            //     pid: selfSku[3],
            //     val_id: 0,
            //     mapping: 0,
            //     val_name: cc.value
            //   })
            // } else {
            //   skuprops.push({
            //     pid: a[2],
            //     val_id: a[1],
            //     mapping: a[3],
            //     val_name: cc.value
            //   })
            // }
          }
        } else {
          Coresku_main[id] = v[id]
        }
      }
      console.log('items', items)
      console.log('itemprops', itemprops)
      console.log('skuprops', skuprops)
      console.log('Coresku_main', Coresku_main)
      // let uri = ''
      // let data = {
      //   main: Coresku_main,
      //   itemprops: itemprops,
      //   skuprops: skuprops,
      //   items: items
      // }
      // if (doge === 0) {
      //   uri = 'XyCore/CoreSku/InsertGoods'
      // } else {
      //   uri = 'XyCore/CoreSku/UpdateGoods'
      // }
      // ZPost(uri, data, () => {
      //   this.hideModal()
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
          ID: e.id,
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
          KindID: e.id
        },
        success: ({d}) => {
          let skus = []
          let skupid = d.length
          if (skupid > 0) {
            for (let sp of d) {
              let temps = {pid: sp.pid, name: sp.name, skuprops_values: []}
              for (let spv of sp.skuprops_values) {
                temps.skuprops_values.push({
                  ischeck: 0,
                  name: spv.name,
                  fname: sp.name,
                  id: spv.id,
                  mapping: spv.mapping,
                  IsOther: 0,
                  pid: spv.pid
                })
              }
              skus.push(temps)
            }
          }

          this.setState({
            skuprops: skus,
            skupid: skupid
          })
        }
      }).then(endLoading)
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'PRODUCT_LIST2_MODIFY_VIS_SET', payload: -1 })
    this.setState({
      items: [],
      visible: false,
      itemprops: [],
      skuprops: []
    }, () => {
      this.props.form.resetFields()
    })
  },
  commAttrs(vs) {
    if (vs.length > 0) {
      const getFieldDecorator = this.props.form.getFieldDecorator
      //todo 注意下多选是否可以编辑新增
      return vs.map(x => {
        return (
          <FormItem key={x.pid} className={styles.itemSelect} style={{ margin: '5px 0 0 0' }}>
            {getFieldDecorator(`attr.${x.id}-${x.pid}`, {initialValue: {
              value: '',
              values: x.values,
              name: x.name
            }})(
              <AttrCC />
            )}
          </FormItem>
        )
      })
    } else {
      return (
        <div style={{textAlign: 'center'}}>（无）</div>
      )
    }
  },
  handleSkuAdd(pid) {
    console.log('autoIndex', this.autoIndex)
    const index = this.state.skuProps.findIndex(x => x.pid === pid)
    if (index > -1) {
      this.setState(update(this.state, {
        skuProps: {
          [`${index}`]: {
            children1: {
              $push: [
                {
                  Enable: 0,
                  ID: --this.autoIndex,
                  mapping: null,
                  pid: pid,
                  val_id: --this.autoIndex,
                  val_name: '自定义'
                }
                //{pid, id: --this.autoIndex, mapping: null, name: '自定义', IsOther: 1}
              ]
            }
          }
        }
      }))
    }
  },
  skusC(y, index) {
    return (this.props.form.getFieldDecorator(`skus.${y.ID}-${y.pid}-${y.mapping}`, {
      initialValue: {
        checked: y.Enable === 1,
        value: `${y.val_name}`,
        id: y.ID,
        IsOther: y.IsOther
      }
    })(<SkuCC key={y.pid + y.ID + index} />))
  },
  commSkus(vs) {
    return vs.map((x, index) => {
      return (
        <FormItem key={index} label={x.name} style={{ margin: '5px 0 0 0' }}>
          {
            x.children0.length ? x.children0.map((y, i) => this.skusC(y, i)) : null
          }
          <div className={styles.hua}>
            <div>{x.name}->其他：</div>
            {
            x.children1.length ? x.children1.map((y, i) => this.skusC(y, i)) : null
            }
          </div>
          <Button type='primary' size='small' onClick={() => this.handleSkuAdd(x.pid)}>增加自定义</Button>
        </FormItem>
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
    const formItemLayout3 = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={800} maskClosable={false} closable={false}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout2} label='款式编码(货号)'>
            {getFieldDecorator('GoodsCode', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input placeholder='货号，一旦填写尽量不要修改，可另外创建商品' />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label='商品名称'>
            {getFieldDecorator('GoodsName', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input />
            )}
          </FormItem>
          <Row>
            <Col sm={10}>
              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label='商品分类'>
                {getFieldDecorator('KindID', {
                  rules: [
                    { required: true, type: 'object', message: '必选' }
                  ]
                })(
                  <ItemCatPicker onChange={this.handleKind} />
                )}
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label='品牌'>
                {getFieldDecorator('Brand', {initialValue: {
                  id: this.state.brandid,
                  name: this.state.brandname
                }, rules: [
                    { required: true, type: 'object', message: '必选' }
                ]
                })(
                  <BrandPicker />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label='供应商'>
                {getFieldDecorator('ScoID', {
                  rules: [
                    { required: true, type: 'object', message: '必选' }
                  ]
                })(
                  <SupplierPicker />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label='供应商货号'>
                {getFieldDecorator('ScoGoodsCode')(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label='市场/吊牌价'>
                {getFieldDecorator('MarketPrice')(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label='一口价'>
                {getFieldDecorator('SalePrice')(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label='采购成本价'>
                {getFieldDecorator('PurPrice')(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label='重量(KG)'>
                {getFieldDecorator('Weight')(
                  <InputNumber min={0} step={0.01} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label='淘宝模板店铺'>
                {getFieldDecorator('TempShopID', {
                  rules: [{ required: true, message: '必填', type: 'object' }]
                })(
                  <ShopPicker />
                )}
              </FormItem>
            </Col>
            <Col sm={14}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label='淘宝宝贝编号'>
                {getFieldDecorator('TempID')(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label='备注'>
            {getFieldDecorator('Remark')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
          <h3>商品属性</h3>
          <div className='hr' />
          <div className={styles.item}>
            {this.commAttrs(this.state.itemprops)}
          </div>
          <h3>商品规格</h3>
          <div className='hr' />
          <div className={styles.item}>
            {this.props.form.getFieldValue('KindID') === 0 ? (<div style={{textAlign: 'center'}}>(无)</div>) : this.commSkus(this.state.skuProps)}
          </div>
          <FormItem {...formItemLayout3} >
            {getFieldDecorator('items', {initialValue: {
              skuprops: this.state.skuProps,
              goodscode: this.state.GoodsCode,
              salePrice: this.state.SalePrice,
              purPrice: this.state.PurPrice
            }})(
              <SkuInfo />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='商品图片'>
            {getFieldDecorator('Img')(
              <Input placeholder='主图片路径' />
            )}
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
      //console.log(params)
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

const SkuCC = React.createClass({
  getInitialState() {
    return {
      checked: this.props.value.checked,
      value: this.props.value.value,
      id: this.props.value.id,
      fname: this.props.value.fname,
      mapping: this.props.value.mapping,
      IsOther: this.props.value.IsOther
    }
  },
  handleCheck(e) {
    // let id = 0
    // let isNew = false
    // console.log('this.props', this.props)
    // if (this.props.id.indexOf('--') > -1) {
    //   isNew = true
    //   id = this.props.id.split('-')[2]
    // } else {
    //   id = this.props.id.split('-')[1]
    // }
    // let iIndex = skuprops.findIndex(p => p.val_id === id)
    // if (e.target.checked) {
    //   if (!isNew) {
    //     colorAndsize.push(this.props.id.split('-')[2])
    //   } else {
    //     colorAndsize.push(this.props.id.split('-')[3])
    //   }
    //   skuprops.push({
    //     pid: !isNew ? this.props.id.split('-')[2] : this.props.id.split('-')[3],
    //     val_id: !isNew ? this.props.id.split('-')[1] : '-' + this.props.id.split('-')[2],
    //     mapping: !isNew ? this.props.id.split('-')[3] : 0,
    //     val_name: e.target.checked,
    //     value: this.state.value,
    //     IsOther: !isNew ? this.props.value.IsOther : 1
    //   })
    // } else {
    //   skuprops.splice(iIndex, 1)
    //   iIndex = !isNew ? colorAndsize.findIndex(p => p === this.props.id.split('-')[2]) : colorAndsize.findIndex(p => p === this.props.id.split('-')[3])
    //   colorAndsize.splice(iIndex, 1)
    // }
    // if (colorAndsize.toString().indexOf('100016110114201') > -1 && colorAndsize.toString().indexOf('100016110194735') > -1) {
    //   skutable.splice(0, 1)
    //   skutable.push('block')
    // } else {
    //   skutable.splice(0, 1)
    //   skutable.push('none')
    // }
    this.setState({
      checked: e.target.checked
    })

    this.props.onChange && this.props.onChange({
      checked: e.target.checked,
      value: this.state.value,
      id: this.state.id,
      fname: this.state.fname,
      mapping: this.state.mapping,
      IsOther: this.state.IsOther
    })
  },
  handleChange(e) {
    this.setState({
      value: e.target.value
    })
    this.props.onChange && this.props.onChange({
      value: e.target.value,
      checked: this.state.checked,
      id: this.props.value.id,
      fname: this.props.value.fname,
      mapping: this.props.value.mapping,
      IsOther: this.props.value.IsOther
    })
    // let id = 0
    // let isNew = false
    // if (this.props.id.indexOf('--') > -1) {
    //   isNew = true
    //   id = this.props.id.split('-')[2]
    // } else {
    //   id = this.props.id.split('-')[1]
    // }
    // let iIndex = skuprops.findIndex(p => p.val_id === id)
    // skuprops.splice(iIndex, 1)
    // skuprops.push({
    //   pid: !isNew ? this.props.id.split('-')[2] : this.props.id.split('-')[3],
    //   val_id: !isNew ? this.props.id.split('-')[1] : 0,
    //   mapping: !isNew ? this.props.id.split('-')[3] : 0,
    //   val_name: e.target.value,
    //   value: e.target.value,
    //   IsOther: !isNew ? 0 : 1
    // })
  },
  render() {
    if (!this.state.checked) {
      return (
        <div className={styles.not_checked}>
          <Checkbox key={this.props.value.id} checked={this.state.checked} onChange={this.handleCheck} >{this.state.value} </Checkbox>
        </div>
      )
    } else {
      return (
        <div className={styles.checked}>
          <Checkbox key={this.props.value.id} checked={this.state.checked} onChange={this.handleCheck} />
          <Input className={styles.chkInput} size='small' value={this.state.value} onChange={this.handleChange} />
        </div>
      )
    }
  }
})

const AttrCC = React.createClass({
  getInitialState() {
    return {
      value: this.props.value.value,
      values: this.props.value.values ? JSON.parse(this.props.value.values) || [] : [],
      name: this.props.value.name
    }
  },
  // componentWillReceiveProps(nextProps) {
  //   if (this.state.value !== nextProps.value) {
  //     this.setState({
  //       value: nextProps.value
  //     })
  //   }
  // },
  handleCheck(e) {
    this.setState({
      value: e
    }, () => {
      this.props.onChange && this.props.onChange({
        value: this.state.value
      })
    })
  },
  handleChange(e) {
    if (e.target.value !== '') {
      this.setState({
        value: e.target.value
      }, () => {
        this.props.onChange && this.props.onChange({
          value: this.stae.value
        })
      })
    }
  },
  render() {
    if (this.state.value === '') {
      return (
        <div className={styles.checked}>
          <Select size='small' placeholder={`-选择${this.state.name}-`} style={{ width: 200 }} onChange={this.handleCheck}>
            {this.state.values.length ? (this.state.values.prop_value.map(y => <Option value={`${y.name}`} key={y.vid}>{y.name}
            </Option>)
            ) : <Option key={0} />}
          </Select>
        </div>
      )
    } else {
      return (
        <div className={styles.checked}>
          <Select size='small' placeholder={`-选择${this.state.name}-`} style={{ width: 200 }} onChange={this.handleCheck}>
            {this.state.values.length ? (this.state.values.prop_value.map(y => <Option value={`${y.name}`} key={y.vid}>{y.name}
            </Option>)
            ) : <Option key={0} />}
          </Select>
          <Input className={styles.selectInput} size='small' value={this.state.value} onChange={this.handleChange} />
        </div>
      )
    }
  }
})
