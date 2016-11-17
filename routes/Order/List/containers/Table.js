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
import React, {
  createClass
} from 'react'
import Areas from 'json/AreaCascader'
//import ReactDOM from 'react-dom'
import classNames from 'classnames'
import SkuAppendPicker from 'components/SkuPicker/append'
import ShopPicker from 'components/ShopPicker'
import BuyerModal from './BuyerModal'
import {
  Button,
  message,
  Cascader,
  Modal,
  Input,
  Form,
  notification,
  Icon,
  Col,
  InputNumber,
  DatePicker,
  Checkbox
} from 'antd'
import {
  connect
} from 'react-redux'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  startLoading,
  endLoading
} from 'utils'
const createForm = Form.create
const FormItem = Form.Item
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
import SkuReplacePicker from 'components/SkuPicker/replace'
const ButtonGroup = Button.Group
const BuyerShop = createClass({
  render() {
    return (
      <div className={styles.centerWrapper}>
        <div className={styles.mAuto}>
          <div className='tc'>
            <div>{this.props.data.BuyerShopID}</div>
            <div className='mt5'>{this.props.data.ShopName}</div>
          </div>
        </div>
      </div>
    )
  }
})
const SellerNote = createClass({
  render() {
    return (
      <div className={styles.centerWrapper}>
        <div className={styles.mLeftMiddle}>
          <div>{this.props.data.SendMessage}</div>
        </div>
      </div>
    )
  }
})
const IDrender = createClass({
  _renderType(type, text) {
    return <div className={styles[`custType${type}`]}>{text}</div>
  },
  render() {
    const {data} = this.props
    return (
      <div className={styles.centerWrapper}>
        <div className={styles.mLeftMiddle}>
          <div>{data.ID}</div>
          {data.Type > 0 ? this._renderType(data.Type, data.TypeString) : null}
        </div>
      </div>
    )
  }
})
const mLeftRender = function(params) {
  return '<div class=' + styles.centerWrapper + '><div class=' + styles.mLeftMiddle + '><div>' + params.value + '</div></div></div>'
  //return '<div class=' + styles.autoLine + '>' + params.value + '</div>'
}
const defColumns = [{
  headerName: '#',
  width: 30,
  checkboxSelection: true,
  pinned: true
}, {
  headerName: '订单',
  children: [{
    headerName: '内部订单号',
    //field: 'ID',
    width: 110,
    //enableRowGroup: true,
    cellRendererFramework: IDrender
  }, {
    headerName: '商品',
    field: 'SkuList',
    width: 180,
    cellClass: styles.zhang,
    cellRendererFramework: createClass({
      // getInitialState() {
      //   return {
      //     opened: false
      //   }
      // },
      refreshRowBySetter(data) {
        //更新数据后刷新 row
        console.log(this)
        //this.props.node.setDataValue('ID', 'sdfsdfsdf') //only refresh `field` setted
        //setData -> refresh all
        this.props.node.setData(Object.assign(this.props.data, data))
        this.props.api.refreshRows([this.props.node])
      },
      render() {
        const data = this.props.data
        const SkuList = data.SkuList || []
        let fck = SkuList.length
        let SkuListS = null
        if (fck >= 10) {
          SkuListS = SkuList.slice(0, 10)
        } else {
          SkuListS = SkuList
        }
        // if (!SkuList || !(SkuList instanceof Array) || !SkuList.length) {
        //   return (
        //     <div className={styles.centerWrapper}>
        //       <div className={styles.mAuto}>
        //         <div>没有商品？!</div>
        //       </div>
        //     </div>
        //   )
        // }
        //
          // api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ITEM_SKU_WRAPPER_DATA_SET', payload: {
          //   rect: e.target.getBoundingClientRect(),
          //   item: data
          // }})
        //   onClick={(e) => {
        //    console.log(this)
        //    this.setState({
        //      opened: true
        //    })
        //  }}
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mLeftMiddle}>
              {SkuListS.length ? SkuListS.map(x => (
                <div className={styles.poster} key={`${data.ID}-${x.SkuAutoID}`} style={{backgroundImage: x.Img ? `url('${x.Img}')` : ''}}>
                  <span>{x.Qty}</span>
                </div>
              )) : <div className={styles.noData}>-添加商品-</div>}
              {fck >= 10 ? (
                <div className={styles.posterCircal}>
                  <span>{fck}</span>
                </div>
              ) : null}
            </div>
            <ItemSKUWrapper item={data} onChange={this.refreshRowBySetter} />
          </div>
        )
      }
    })
  }, {
    headerName: '线上单号',
    field: 'SoID',
    width: 150,
    cellRenderer: mLeftRender
  }, {
    headerName: '应付+运费',
    //field: 'Amount', //ExAmount
    width: 100,
    cellRendererFramework: ({data}) => {
      return (
        <div className={styles.centerWrapper}>
          <div className={styles.mRightMiddle}>
            <div className='mb5'>{data.Amount}</div>
            <div className={styles.gray}>{data.ExAmount}</div>
          </div>
        </div>
      )
    }
  }, {
    headerName: '已付金额',
    //field: 'PaidAmount',
    width: 90,
    cellRendererFramework: ({data}) => {
      return (
        <div className={styles.centerWrapper}>
          <div className={styles.mRightMiddle}>
            {data.IsCOD ? (
              <div className='red'>货到付款</div>
            ) : null}
            <div className='mt5'>{data.PaidAmount}</div>
          </div>
        </div>
      )
    }
  }, {
    headerName: '订单日期',
    field: 'ODate',
    width: 120,
    cellRenderer: mLeftRender
  }, {
    headerName: '付款时间',
    field: 'PayDate',
    width: 124,
    cellRenderer: mLeftRender
  }, {
    headerName: '买家账号+店铺',
    //field: 'ShopName',
    width: 180,
    cellRendererFramework: BuyerShop
  }, {
    headerName: '状态',
    field: 'Status', //AbnormalStatus StatusDec
    width: 100,
    // cellClassRules: {
    //   'rag-green': (params) => { return params.value === '已发货' },
    //   'rag-amber': (params) => { return params.value === '发货中' },
    //   'rag-red': (params) => { return params.value === '待付款' }
    // }
    cellClass: function(params) {
      return styles[`orderS${params.value}`] || ''
    },
    cellRendererFramework: ({data}) => {
      return (
        <div className={styles.centerWrapper}>
          <div className={styles.mAuto}>
            <div className='tc'>
              <div>{data.StatusDec}</div>
              {data.Status === 7 ? <div className='mt5'>{data.AbnormalStatusDec}</div> : null}
            </div>
          </div>
        </div>
      )
    }
  }, {
    headerName: '买家留言',
    field: 'RecMessage',
    width: 180,
    cellRenderer: mLeftRender
  }, {
    headerName: '卖家备注',
    //field: 'remark',
    width: 180,
    cellRendererFramework: SellerNote
  // }, {
  //   headerName: '便签',
  //   field: 'node',
  //   width: 180,
  //   cellRendererFramework: AdminTags
  }]
}, {
  headerName: '快递信息',
  children: [{
    headerName: '快递公司',
    //field: 'Express',
    width: 100,
    cellRendererFramework: ({data}) => {
      return (
        <div className={styles.centerWrapper}>
          <div className={styles.mAuto}>
            <div>{data.Express}</div>
            <div>{data.ExCode}</div>
          </div>
        </div>
      )
    }
  }, {
    headerName: '收货地址/人',
    //field: 'address',
    width: 260,
    cellRendererFramework: ({data}) => {
      //api.gridOptionsWrapper.gridOptions.grid.props.dispatch
      return (
        <div className={styles.centerWrapper}>
          <div className={styles.mLeftMiddle}>
            <div>{data.RecLogistics} {data.RecCity} {data.RecDistrict} {data.RecAddress}&emsp;<small className={styles.gray}>({data.RecName})</small></div>
          </div>
        </div>
      )
    }
  }, {
    headerName: '分销商',
    field: 'Distributor',
    width: 80,
    cellRenderer: mLeftRender
  }, {
    headerName: '供销商',
    field: 'SupDistributor',
    width: 80,
    cellRenderer: mLeftRender
  }, {
    headerName: '重量',
    field: 'ExWeight',
    width: 80,
    cellRenderer: mLeftRender
  }, {
    headerName: '发票抬头',
    field: 'InvoiceTitle',
    width: 160,
    cellRenderer: mLeftRender
  }]
}, {
  headerName: '仓库发货',
  children: [{
    headerName: '发货日期',
    field: 'SendDate',
    width: 120,
    cellRenderer: mLeftRender
  }, {
    headerName: '计划发货日期',
    field: 'PlanDate',
    width: 120,
    cellRenderer: mLeftRender
  }, {
    headerName: '发货仓',
    field: 'SendWarehouse',
    width: 120,
    cellRenderer: mLeftRender
  }]
}, {
  headerName: '',
  children: [{
    headerName: '业务员',
    field: 'Creator',
    width: 90,
    cellRenderer: mLeftRender
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
        <ZGrid gridOptions={gridOptions} rowHeight='75' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'order_list' }} columnDefs={defColumns} paged grid={this}>
          批量 内部订单号 测试用 486741
        </ZGrid>
        <ModalNewEgg refreshRowData={this.refreshRowData} />
      </div>
    )
  }
})
const gridOptions = {
  getContextMenuItems: function(params) {
    const data = params.node.data
    return [
      {
        name: '订单 ' + data.ID + ' 详情'
      },
      {
        name: '查看线上订单，多店铺请注意当前登陆',
        action: function() {
          alert('url redirect')
        }
      },
      'separator',
      {
        name: '审核',
        disabled: data.Status !== 1,
        //shortcut: 'Alt + W',
        checked: true
        //icon: <a >sdf</a>
      },
      {
        name: '转正常单',
        disabled: data.Status !== 7
      },
      {
        name: '转异常单',
        disabled: data.Status === 7
      },
      // {
      //   name: '打标签'
      // },
      // {
      //   name: '改标签'
      // },
      {
        name: '取消订单'
      },
      {
        name: '设快递'
      },
      {
        name: '售后：退货|换货|退款'
      },
      'separator',
      {
        name: '合并订单'
      },
      {
        name: '拆分订单'
      },
      'separator',
      {
        name: '批量预发货已勾选订单',
        disabled: true
      },
      {
        name: '批量强制审单（忽略缺货及异常）'
      },
      'separator',
      'copy'
    ]
  }
}
// const ItemSkus = connect(state => ({
//   data: state.item_sku_wrapper_data
// }))(createClass({
//   render() {
//     const {rect, item} = this.props.data
//     console.log(rect, item)
//     if (!rect || !item) {
//       return null
//     }
//     return (
//       <div className={styles.itemSKUsWrapper} style={{left: rect.left, top: rect.top}}>
//         {item.ShopName}
//       </div>
//     )
//   }
// }))
const ItemSKUWrapper = createClass({
  handleAppendSKU(skus) {
    const ids = skus.map(x => x.ID)
    if (ids.length) {
      startLoading()
      ZPost('Order/InsertOrderDetail', {OID: this.props.item.ID, SkuIDList: ids}, ({d}) => {
        this.props.onChange(d.Order)
        this._noticeFails(d.failIDs)
      }).then(endLoading)
    }
  },
  handleAppendSku(skus) {
    const ids = skus.map(x => x.ID)
    if (ids.length) {
      startLoading()
      ZPost('Order/InsertGift', {OID: this.props.item.ID, SkuIDList: ids}, ({d}) => {
        this.props.onChange(d.Order)
        this._noticeFails(d.failIDs)
      }).then(endLoading)
    }
  },
  _noticeFails(failIDs) {
    if (failIDs && failIDs.length) {
      const description = (<div>
        {failIDs.map(x => {
          return (
            <div key={x.id}>
              {x.id}: {x.reason || '已存在'}
            </div>
          )
        })}
      </div>)
      notification.error({
        message: '订单商品附加错误',
        description,
        icon: <Icon type='meh-o' />
      })
    }
  },
  render() {
    const {item} = this.props
    return (
      <div className={styles.itemSKUsWrapper}>
        <div className={styles.skus}>
          {item.SkuList && item.SkuList.length ? item.SkuList.map(x => <SkuItemsForm key={x.ID} x={x} oid={item.ID} onChange={this.props.onChange} />) : null}
        </div>
        <div className='mt10'>
          <div className='ml20'>
            <SkuAppendPicker onChange={this.handleAppendSKU} size='small' type='primary' />
            &emsp;
            <SkuAppendPicker onChange={this.handleAppendSku} size='small' type='ghost'><span style={{color: '#666'}}>增加赠品</span></SkuAppendPicker>
          </div>
        </div>
      </div>
    )
  }
})
const NUM_PATTERN = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
const SkuItemsForm = createForm()(createClass({
  handleOP1() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      startLoading()
      ZPost('Order/UpdateOrderDetail', {
        OID: this.props.oid,
        ID: this.props.x.ID,
        Price: values.RealPrice,
        Qty: values.Qty,
        SkuName: values.SkuName
      }, ({d}) => {
        this.props.onChange(d)
      }).then(endLoading)
    })
  },
  handleOP3() {
    startLoading()
    ZPost('Order/DeleteOrderDetail', {
      OID: this.props.oid,
      ID: this.props.x.ID
    }, ({d}) => {
      this.props.onChange(d)
    }).then(endLoading)
  },
  handleOP2(x) {
    //console.log(x)
    startLoading()
    ZPost('Order/ChangeOrderDetail', {
      OID: this.props.oid,
      ID: this.props.x.ID,
      SkuID: x.ID
    }, ({d}) => {
      this.props.onChange(d)
    }).then(endLoading)
  },
  render() {
    const {x} = this.props
    const {getFieldDecorator} = this.props.form
    const ZPCN = classNames({
      [`${styles._zp}`]: x.IsGift
    })
    return (
      <Form className='pos-form'>
        <div className={styles.skuer}>
          <div className={styles._poster} style={{backgroundImage: x.Img ? `url(${x.Img})` : 'none'}} />
          <div className={styles._itemid}>
            <div className={styles._ict}>
              <div className={styles._gray2}>{x.GoodsCode}</div>
              <div className={ZPCN}>
                {x.SkuID}
              </div>
            </div>
          </div>
          <div className={styles._price}>
            <div className={styles._text}>
              <div className={styles._red}>{x.RealPrice}</div>
            </div>
            <FormItem className={styles._ipts}>
              {getFieldDecorator('RealPrice', {
                initialValue: x.RealPrice,
                rules: [
                  { required: true, message: '错', pattern: NUM_PATTERN }
                ]
              })(
                <Input size='small' />
              )}
            </FormItem>
          </div>
          <div className={styles._num}>
            <div className={styles._text}>
              <div className={styles._blue}>x{x.Qty}</div>
            </div>
            <FormItem className={styles._ipts}>
              {getFieldDecorator('Qty', {
                initialValue: x.Qty,
                rules: [
                  { required: true, message: '错', pattern: NUM_PATTERN }
                ]
              })(
                <Input size='small' />
              )}
            </FormItem>
          </div>
          <div className={styles._tPrice}>
            <div className={styles._gray}>￥{x.Qty * x.RealPrice}</div>
          </div>
          <div className={styles._info}>
            <div className={styles._text}>
              <div className={styles._in}>
                <div>{x.SkuName}</div>
                <div className={styles._gray2}>{x.Norm}</div>
                <div className={styles._weight}>单品重：{x.Weight}KG</div>
              </div>
            </div>
            <FormItem className={styles._ipts}>
              {getFieldDecorator('SkuName', {
                initialValue: x.SkuName,
                rules: [
                  { required: true, whitespace: true, message: '必填' }
                ]
              })(
                <Input size='small' />
              )}
            </FormItem>
          </div>
          <div className={styles._amount}>
            <div className={styles._text}>
              <div className={styles._am}>可配货库存：{x.InvQty}</div>
            </div>
            <div className={styles._ipts}>
              <ButtonGroup>
                <Button type='primary' size='small' onClick={this.handleOP1}>保存</Button>
                <Button type='ghost' size='small' onClick={this.handleOP2} className='hide'>换货</Button>
                <SkuReplacePicker size='small' initialValues={{GoodsCode: x.GoodsCode}} onChange={this.handleOP2} />
                <Button type='default' icon='delete' size='small' onClick={this.handleOP3} />
              </ButtonGroup>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}))
const ModalNewEgg = connect(state => ({
  visible: state.order_list_new_egg_vis
}))(createForm()(createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible >= 0
      })
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const p1 = Areas.filter(x => x.value === values.s6[0])[0]
      const p2 = values.s6[1] ? p1.children.filter(x => x.value === values.s6[1])[0] : null
      const p3 = values.s6[2] && p2 ? p2.children.filter(x => x.value === values.s6[2])[0] : null
      ZPost('Order/InsertOrder', {
        ODate: values.s3 ? values.s3.format() : '',
        BuyerShopID: values.s5,
        SoID: values.s2,
        ExAmount: values.s4,
        ShopID: values.s1 ? values.s1.id : '',
        RecName: values.s5 || '',
        RecLogistics: p1 ? p1.label : '',
        RecCity: p2 ? p2.label : '',
        RecDistrict: p3 ? p3.label : '',
        RecAddress: values.s7 || '',
        RecPhone: values.s10 || '',
        RecTel: values.s9 || '',
        RecMessage: values.s11 || '',
        SendMessage: values.s111 || '',
        IsFaceToFace: values.s99 ? 'true' : 'false'
      }, () => {
        this.props.refreshRowData()
        this.hideModal()
      })
    })
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_NEW_EGG_VIS_SET', payload: -1 })
    this.props.form.resetFields()
    this.props.refreshRowData()
  },
  rendFooter() {
    return (
      <div>
        <span className='gray'>订单商品请在建立订单信息后在订单明细中添加</span>&emsp;
        <Button type='primary' onClick={this.handleSubmit} loading={this.state.confirmLoading}>确定并创建新的订单</Button>
      </div>
    )
  },
  handleBuyer(u) {
    const s6 = []
    if (u.Logistics) {
      let index = Areas.findIndex(x => x.label === u.Logistics)
      if (index !== -1) {
        let p1 = Areas[index]
        s6.push(p1.value)
        if (u.City) {
          let index = p1.children.findIndex(x => x.label === u.City)
          if (index !== -1) {
            let p2 = p1.children[index]
            s6.push(p2.value)
            if (u.District) {
              let index = p2.children.findIndex(x => x.label === u.District)
              if (index !== -1) {
                s6.push(p2.children[index].value)
              }
            }
          }
        }
      }
    }
    this.props.form.setFieldsValue({
      s5: u.BuyerId,
      s6: s6.length ? s6 : undefined,
      s7: u.Address,
      s8: u.Receiver,
      s9: u.Tel,
      s10: u.Phone
    })
    this.props.dispatch({type: 'ORDER_LIST_BUYER_SELECT_VIS_SET', payload: -1})
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title='创建新订单' visible={this.state.visible} onCancel={this.hideModal} width={780} maskClosable={false} footer={this.rendFooter()}>
        <Form horizontal className='pos-form'>
          <h3 className={styles.modalFormTitle}>基本信息</h3>
          <FormItem {...formItemLayout} label='选择店铺'>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('s1', {
                  rules: [
                    { required: true, whitespace: true, message: '必填', type: 'object' }
                  ]
                })(
                  <ShopPicker width={180} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='线上订单号'>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('s2')(
                  <Input placeholder='为空将自动生成线上订单号' />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <span className='gray'>&emsp;授权店铺请尽量避免手工下单</span>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='下单时间'>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('s3', {
                  rules: [
                    { required: true, whitespace: true, message: '必填', type: 'object' }
                  ]
                })(
                  <DatePicker showTime placeholder='点击设置' format='YYYY-MM-DD HH:mm:ss' />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='运费'>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('s4', {
                  rules: [
                    { required: true, whitespace: true, message: '必填', type: 'number' }
                  ]
                })(
                  <InputNumber min={0} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <h3 className={styles.modalFormTitle}>买家及收货地址</h3>
          <FormItem {...formItemLayout} label='选择买家'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s5')(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <Button type='primary' size='small' onClick={() => {
                this.props.dispatch({type: 'ORDER_LIST_BUYER_SELECT_VIS_SET', payload: 1})
              }} className='ml10'>选择买家</Button>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='收货地址'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s6', {
                  rules: [
                    {required: true, whitespace: true, message: '必填', type: 'array'}
                  ]
                })(
                  <Cascader options={Areas} placeholder='选择省/市/区' />
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem>
                {getFieldDecorator('s7', {
                  rules: [
                    {required: true, whitespace: true, message: '必填'}
                  ]
                })(
                  <Input placeholder='详细地址：街区/门牌号' className='ml10' />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='收货人名'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s8', {
                  rules: [
                    {required: true, whitespace: true, message: '必填'}
                  ]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem>
                {getFieldDecorator('s99', { valuePropName: 'checked' })(
                  <Checkbox className='ml20'>现场取货</Checkbox>
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='联系电话'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s9')(
                  <Input />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='手机号码'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s10', {
                  rules: [
                    {required: true, whitespace: true, message: '必填'}
                  ]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <h3 className={styles.modalFormTitle}>补充信息</h3>
          <FormItem {...formItemLayout} label='买家留言'>
            {getFieldDecorator('s11')(
              <Input placeholder='填写买家留言' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='卖家备注'>
            {getFieldDecorator('s111')(
              <Input placeholder='填写卖家备注' />
            )}
          </FormItem>
        </Form>
        <BuyerModal onOk={this.handleBuyer} onCancel={() => {
          this.props.dispatch({type: 'ORDER_LIST_BUYER_SELECT_VIS_SET', payload: -1})
        }} />
      </Modal>
    )
  }
})))
export default connect(state => ({
  conditions: state.order_list_conditions
}), null, null, { withRef: true })(Table)