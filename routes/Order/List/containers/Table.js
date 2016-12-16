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
import classNames from 'classnames'
import SkuAppendPicker from 'components/SkuPicker/append'
import SkuPicker from 'components/SkuPicker'
import SkuPickerModal from 'components/SkuPicker/Modal'
import ShopPicker from 'components/ShopPicker'
import BuyerModal from './BuyerModal'
import DistributorModal from 'components/DistributorPicker/Modal'
import ExprSearchModal from 'components/ExprSearch'
import {
  Table,
  Select,
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
  Checkbox,
  Radio,
  Collapse,
  Row,
  Alert,
  Dropdown,
  Menu
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
import ModalPrompt from 'components/Modal/Prompt'
import OrderDetail from 'components/OrderDetail'
const ButtonGroup = Button.Group
const RadioGroup = Radio.Group
const Panel = Collapse.Panel
const Option = Select.Option
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
// const componentParent = function(that) {
//   return that._reactInternalInstance._currentElement._owner._instances
// }
// const SellerNote = createClass({
//   render() {
//     return (
//       <div className={styles.centerWrapper}>
//         <div className={styles.mLeftMiddle}>
//           <div>{this.props.data.SendMessage}</div>
//         </div>
//       </div>
//     )
//   }
// })
const IDrender = createClass({
  _renderType(type, text) {
    return <div className={styles[`custType${type}`]}>{text}</div>
  },
  render() {
    const {data, api} = this.props
    return (
      <div className={styles.centerWrapper}>
        <div className={styles.mLeftMiddle}>
          <div>{data.ID}</div>
          {data.Type > 0 ? this._renderType(data.Type, data.TypeString) : null}
        </div>
        <div className={`${styles.float} ${styles['float-0']}`} onClick={e => {
          api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_DETAIL_1_SET', payload: data.ID})
        }}>
          <span>详</span>
        </div>
      </div>
    )
  }
})
const mLeftRender = function(params) {
  return '<div class=' + styles.centerWrapper + '><div class=' + styles.mLeftMiddle + '><div>' + params.value + '</div></div></div>'
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
    field: 'ID',
    width: 110,
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
        //console.log(this)
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
        if (fck >= 9) {
          SkuListS = SkuList.slice(0, 9)
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
              {fck >= 9 ? (
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
    field: 'Amount', //ExAmount
    width: 100,
    cellRendererFramework: createClass({
      render() {
        const {data} = this.props
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mRightMiddle}>
              <div className='mb5'>{data.Amount}</div>
              <div className={styles.gray}>{data.ExAmount}</div>
            </div>
          </div>
        )
      }
    })
  }, {
    headerName: '已付金额',
    field: 'PaidAmount',
    width: 90,
    cellRendererFramework: createClass({
      render() {
        const {data} = this.props
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
    })
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
    cellClass: function(params) {
      return styles[`orderS${params.value}`] || ''
    },
    cellRendererFramework: createClass({
      render() {
        const {data} = this.props
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mAuto}>
              <div className='tc'>
                <div>{data.StatusDec}</div>
                {data.Status === 7 ? <div className={styles.dtype}>{data.AbnormalStatusDec}</div> : null}
              </div>
            </div>
          </div>
        )
      }
    })
  }, {
    headerName: '买家留言',
    field: 'RecMessage',
    width: 180,
    //cellRenderer: mLeftRender
    cellRendererFramework: createClass({
      render() {
        // <div className={styles.float} onClick={e => {
        //     ZPost('', {}, () => {
        //     })
        // }}>
        //   <span>标</span>
        // </div>
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mLeftMiddle}>
              <div>{this.props.data.RecMessage}</div>
            </div>
          </div>
        )
      }
    })
  }, {
    headerName: '卖家备注',
    field: 'SendMessage',
    width: 180,
    //cellRendererFramework: SellerNote
    cellRendererFramework: createClass({
      render() {
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mLeftMiddle}>
              <div>{this.props.data.SendMessage}</div>
            </div>
            <div className={`${styles.float} ${styles['float-1']}`} onClick={e => {
              this.props.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_SELLERNOTE_1_SET', payload: this.props.rowIndex})
            }}>
              <span>改</span>
            </div>
          </div>
        )
      }
    })
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
    field: 'Express',
    width: 100,
    cellRendererFramework: connect()(createClass({
      render() {
        const {data, rowIndex, dispatch} = this.props
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mAuto}>
              <div className='tc'>{data.Express}</div>
              <div className='tc mt5'><a onClick={() => {
                dispatch({type: 'ORDER_LIST_EXPR_S_1_SET', payload: {
                  pp: data.ExpNamePinyin,
                  ap: data.ExCode
                }})
              }}>{data.ExCode}</a></div>
            </div>
            <div className={`${styles.float} ${styles['float-2']}`} onClick={e => {
              dispatch({type: 'ORDER_LIST_EXPR_1_SET', payload: rowIndex})
            }}>
              <span>设</span>
            </div>
          </div>
        )
      }
    }))
  }, {
    headerName: '收货地址/人',
    field: 'RecAddress',
    width: 260,
    cellRendererFramework: createClass({
      render() {
        const {data, api, rowIndex} = this.props
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mLeftMiddle}>
              <div>{data.RecLogistics} {data.RecCity} {data.RecDistrict} {data.RecAddress}&emsp;<small className={styles.gray}>({data.RecName})</small></div>
            </div>
            <div className={`${styles.float} ${styles['float-3']}`} onClick={e => {
              api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_BUYERADDRESS_1_SET', payload: rowIndex})
            }}>
              <span>改</span>
            </div>
          </div>
        )
      }
    })
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

const parseArea = function(l, c, d) {
  const s6 = []
  if (l) {
    let index = Areas.findIndex(x => x.label === l)
    if (index !== -1) {
      let p1 = Areas[index]
      s6.push(p1.value)
      if (c) {
        let index = p1.children.findIndex(x => x.label === c)
        if (index !== -1) {
          let p2 = p1.children[index]
          s6.push(p2.value)
          if (d) {
            let index = p2.children.findIndex(x => x.label === d)
            if (index !== -1) {
              s6.push(p2.children[index].value)
            }
          }
        }
      }
    }
  }
  return s6
}

export default connect(state => ({
  conditions: state.order_list_conditions
}), null, null, { withRef: true })(React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  shouldComponentUpdate() {
    return false
  },
  refreshRowData() {
    this._firstBlood()
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
      //console.log(d)
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
            }, ({m}) => {
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
  getSelectIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length) {
      return ids
    }
    message.info('请先选择')
    return false
  },
  handleSetExpr() {
    const ids = this.getSelectIDs()
    if (ids === false) {
      return
    }
    this.props.dispatch({type: 'ORDER_LIST_EXPR_2_SET', payload: ids})
  },
  refreshRow(OID) {
    const nodes = this.grid.api.getSelectedNodes()
    const index = nodes.findIndex(x => x.data.ID === OID)
    if (index !== -1) {
      const node = nodes[index]
      startLoading()
      ZGet('Order/GetOrderListSingle', {OID}, ({d}) => {
        node.setData(d.Ord[0])
        this.grid.api.refreshRows([node])
      }).then(endLoading)
    } else {
      this.refreshRowData()
    }
  },
  handleOrderMenuClick(e) {
    const ids = this.getSelectIDs()
    if (ids === false) {
      return
    }
    switch (e.key) {
      case '1': {
        this.props.dispatch({type: 'ORDER_LIST_TO_EXCEPTION_1_SET', payload: ids})
        break
      }
      case '3': {
        this.props.dispatch({type: 'ORDER_LIST_TO_CANCEL_1_SET', payload: ids})
        break
      }
      case '2': {
        const nodes = this.grid.api.getSelectedNodes()
        this.grid.x0pCall(ZPost('Order/TransferNormal', {OID: ids}, ({d}) => {
          parseBatchOperatorResult.call(this, d, function(x, qq) {
            x.data.Status = qq.Status
            x.data.StatusDec = qq.StatusDec
          }, ['Status'], nodes, this.grid)
        }))
        break
      }
    }
  },
  handleOrderMenuClick1(e) {
    switch (e.key) {
      case '10': {
        const ids = this.grid.api.getSelectedRows().map(x => x.ID)
        return this.props.dispatch({type: 'ORDER_LIST_RECOUNT_GIFT_VIS_1_SET', payload: ids})
      }
      case '4': {
        return this.props.dispatch({type: 'ORDER_LIST_BATCH_CUSTOM_EXCEPTIONS_1_SET', payload: 1})
      }
      case '5': {
        const ids = this.grid.api.getSelectedRows().map(x => x.ID)
        return this.props.dispatch({type: 'ORDER_LIST_MERGE_RESTORE_1_SET', payload: ids})
      }
      case '6': {
        const nodes = this.grid.api.getSelectedNodes()
        const len = nodes.length
        if (!len) {
          return message.info('请先选择')
        }
        const T = nodes[0].data.Type
        if ([0, 3].indexOf(T) === -1 || (len > 1 && !nodes.every(e => e.data.Type === T))) {
          return Modal.error({
            title: '选择订单的类型有误',
            content: '转换仅允许统一选择【普通订单】或【天猫分销订单】'
          })
        }
        const ids = nodes.map(x => x.data.ID)
        const content = T === 0 ? '确定要从【普通订单】转化为【天猫分销订单】吗' : '确定要从【天猫分销订单】转化为【普通订单】吗'
        Modal.confirm({
          title: '订单类型转换确认',
          content,
          onOk: () => {
            this.grid.x0pCall(ZPost('Order/ComDisExchange', {OID: ids}, ({d}) => {
              parseBatchOperatorResult.call(this, d, function(x, qq) {
                x.data.Status = qq.Status
                x.data.StatusDec = qq.StatusDec
                x.data.Type = qq.Type
                x.data.TypeString = qq.TypeString
              }, ['Status', 'Type'], nodes, this.grid)
            }))
          }
        })
        return
      }
      case '7': {
        const nodes = this.grid.api.getSelectedNodes()
        const len = nodes.length
        if (!len) {
          return message.info('请先选择')
        }
        const ids = nodes.map(x => x.data.ID)
        Modal.confirm({
          title: '确定选定的订单 转成分销+订单，由供销商发货？',
          onOk: () => {
            this.grid.x0pCall(ZPost('Order/SetOrdType', {OID: ids}, ({d}) => {
              parseBatchOperatorResult.call(this, d, function(x, qq) {
                Object.assign(x.data, qq)
              }, ['ID', 'Status'], nodes, this.grid)
            }))
          }
        })
        return
      }
      case '8': {
        const nodes = this.grid.api.getSelectedNodes()
        const len = nodes.length
        if (!len) {
          return message.info('请先选择')
        }
        const ids = nodes.map(x => x.data.ID)
        Modal.confirm({
          title: '确定选定的订单 取消分销+属性，由自己发货？',
          onOk: () => {
            this.grid.x0pCall(ZPost('Order/CancleSetOrdType', {OID: ids}, ({d}) => {
              parseBatchOperatorResult.call(this, d, function(x, qq) {
                Object.assign(x.data, qq)
              }, ['ID', 'Status'], nodes, this.grid)
            }))
          }
        })
        return
      }
    }
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (!ids.length) {
      return message.info('请先选择')
    }
    switch (e.key) {
      case '9': {
        this.props.dispatch({type: 'ORDER_LIST_DISTRIBUTOR_VIS_1_SET', payload: ids})
        break
      }
      case '3': {
        this.props.dispatch({type: 'ORDER_LIST_BATCH_GIFTS_1_SET', payload: ids})
        break
      }
      case '2': {
        this.props.dispatch({type: 'ORDER_LIST_BATCH_SKUS_1_SET', payload: ids})
        break
      }
      case '1': {
        ModalPrompt({
          onPrompt: ({value}) => {
            const nodes = this.grid.api.getSelectedNodes()
            return new Promise((resolve, reject) => {
              this.grid.x0pCall(ZPost('Order/ModifyFreight', {
                OID: ids,
                Freight: value
              }, ({d}) => {
                resolve()
                parseBatchOperatorResult.call(this, d, function(x, qq) {
                  Object.assign(x.data, qq)
                }, ['Amount', 'Status'], nodes, this.grid)
              }, reject))
            })
          },
          children: (
            <div className='mb10'>
              请输入新的运费
            </div>
          ),
          placeholder: '格式：0.00'
        })
        break
      }
    }
  },
  handleAudit() {
    const nodes = this.grid.api.getSelectedNodes()
    const ids = nodes.map(x => x.data.ID)
    if (!ids.length) {
      message.info('请先选择')
      return
    }
    this.grid.x0pCall(ZPost('Order/ConfirmOrder', {OID: ids}, ({d}) => {
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        x.data.Status = qq.Status
        x.data.StatusDec = qq.StatusDec
      }, ['Status'], nodes)
    }))
  },
  render() {
    return (
      <div className='flex-column flex-grow'>
        <ZGrid gridOptions={gridOptions} rowHeight='75' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'order_list' }} columnDefs={defColumns} paged grid={this}>
          批量：
          <ButtonGroup>
            <Button type='ghost' size='small' onClick={this.handleAudit}><Icon type='check' />审核</Button>
            <Button type='ghost' size='small' onClick={this.handleSetExpr}>设快递</Button>
          </ButtonGroup>
          <span className={styles.sliver}>|</span>
          <Dropdown overlay={<Menu onClick={this.handleOrderMenuClick}>
            <Menu.Item key='1'><Icon type='exclamation-circle-o' className='red' /> 转异常单</Menu.Item>
            <Menu.Item key='2'><Icon type='check-square-o' /> 转正常单</Menu.Item>
            <Menu.Item key='3'><Icon type='check-square-o' /> 取消订单</Menu.Item>
          </Menu>}>
            <Button type='ghost' size='small'>订单设置<Icon type='down' /></Button>
          </Dropdown>
          &nbsp;
          <Dropdown overlay={<Menu onClick={this.handleOrderMenuClick1}>
            <Menu.Item key='1'><Icon type='check-square-o' /> 改运费</Menu.Item>
            <Menu.Item key='2'><Icon type='check-square-o' /> 改商品</Menu.Item>
            <Menu.Item key='3'><Icon type='check-square-o' /> 添赠品</Menu.Item>
            <Menu.Item key='10'> 重新计算并添加商品</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='6'><Icon type='check-square-o' /> 普通订单与天猫分销订单互相转换</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='5'>合并订单还原成 合并前</Menu.Item>
            <Menu.Item key='4'>按商品信息标识自定义异常</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='7'><Icon type='check-square-o' /> 转成分销+订单属性，由供销商发货</Menu.Item>
            <Menu.Item key='8'><Icon type='check-square-o' /> 取消分销+订单属性，自己发货</Menu.Item>
            <Menu.Item key='9'><Icon type='check-square-o' /> 强制指定分销订单的供销商</Menu.Item>
          </Menu>}>
            <Button type='ghost' size='small'>
              <Icon type='edit' />修改&标记<Icon type='down' />
            </Button>
          </Dropdown>
          <span className={styles.sliver}>|</span>
          <Button type='ghost' size='small' onClick={() => {
            const ids = this.getSelectIDs()
            if (ids === false) {
              return
            }
            this.props.dispatch({type: 'ORDER_LIST_WHOUSE_1_SET', payload: ids})
          }}>修改发货仓库</Button>
        </ZGrid><BatchDistributor1 zch={this} /><BatchRecountGifts zch={this} />
        <ModalNewEgg refreshRowData={this.refreshRowData} />
        <ComSeller1 zch={this} /><ComRecAddress1 zch={this} /><OrderDetail zch={this} /><ComExpr1 zch={this} /><ExpressModal zch={this} /><Whouse zch={this} /><ToExceptions zch={this} /><ToCancel1 zch={this} /><BatchSkus1 zch={this} /><OrderSplit zch={this} />
        <ExprSearchModal /><BatchGift1 zch={this} /><BatchCustomException zch={this} /><OrderMerge zch={this} /><OrderMergeRestore zch={this} /><CreateModal zch={this} />
      </div>
    )
  }
}))
const CreateModal = connect(state => ({
  doge: state.order_list_create_vis_1
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      confirmLoading: false,
      visible: false,
      data: {}
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge !== this.props.doge) {
      if (nextProps.doge === 0) {
        return this.setState({
          visible: false,
          data: {}
        })
      }
      startLoading()
      ZGet('AfterSale/InsertASInit', ({d}) => {
        this.setState({
          visible: true,
          data: d
        })
      }).then(endLoading)
    }
  },
  handleHide() {
    this.props.dispatch({type: 'ORDER_LIST_CREATE_VIS_1_SET', payload: 0})
    this.props.form.resetFields()
  },
  handleOk() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return
      }
      const data = Object.assign({}, values)
      data.OID = this.props.doge
      data.DocumentType = 'A'
      this.setState({
        confirmLoading: true
      })
      ZPost('AfterSale/InsertAfterSale', data, ({d}) => {
        this.props.zch.refreshRowData()
        this.handleHide()
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const {data} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal width={699} title='订单转售后' visible={this.state.visible} onCancel={this.handleHide} onOk={this.handleOk}>
        <Form horizontal className='pos-form form-sm'>
          转售后订单(内部订单号)：{this.props.doge}
          <div className='hr' />
          <FormItem {...formItemLayout} label='选择退货仓库'>
            {getFieldDecorator('WarehouseID', {
              initialValue: data.DefaultWare ? data.DefaultWare + '' : undefined,
              rules: [
                {required: true, message: '必选'}
              ]
            })(
              <Select style={{width: 180}} size='small' placeholder='请选择退货仓'>
                {data.Warehouse && data.Warehouse.length ? data.Warehouse.map(x => <Option value={x.value} key={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <Row>
            <Col span={4}>
              <div className='tr'>
                <div className='ant-form-item-label'>
                  <label>买家退回快递</label>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='ant-form-item-control'>
                <FormItem>
                  {getFieldDecorator('Express')(
                    <Input size='small' />
                  )}
                </FormItem>
              </div>
            </Col>
            <Col span={5}>
              <div className='tr'>
                <div className='ant-form-item-label'>
                  <label>买家退回快递单号</label>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='ant-form-item-control'>
                <FormItem>
                  {getFieldDecorator('ExCode')(
                    <Input size='small' />
                  )}
                </FormItem>
              </div>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label='售后问题分类'>
            {getFieldDecorator('IssueType', {
              rules: [
                {required: true, message: '必选'}
              ]
            })(
              <Select style={{width: 180}} size='small' placeholder='请选择售后问题分类'>
                {data.IssueType && data.IssueType.length ? data.IssueType.map(x => <Option value={x.value} key={x.value}>{x.label}</Option>) : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='售后类型'>
            {getFieldDecorator('Type', {
              rules: [
                {required: true, message: '必选'}
              ]
            })(
              <RadioGroup size='small'>
                {data.Type && data.Type.length ? data.Type.map(x => <Radio key={x.value} value={x.value}>{x.label}</Radio>) : null}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='问题描述'>
            {getFieldDecorator('Remark')(
              <Input type='textarea' autosize={{minRows: 1, maxRows: 3}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='卖家应退金额'>
            {getFieldDecorator('SalerReturnAmt')(
              <InputNumber step={0.01} size='small' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='买家补偿金额'>
            {getFieldDecorator('BuyerUpAmt')(
              <InputNumber step={0.01} size='small' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
const BatchRecountGifts = connect(state => ({
  doge: state.order_list_recount_gift_vis_1
}))(createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      OidType: 'A',
      DateType: 'A',
      IsSplit: true,
      IsDelGift: true,
      IsDelPrice: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      this._dirtied = false
      if (nextProps.doge === null) {
        return this.setState({
          visible: false
        })
      }
      this.setState({
        visible: true,
        OidType: 'A'
      })
    }
  },
  handleOK() {
    const data = {
      OidType: this.state.OidType,
      DateType: this.state.DateType,
      IsSplit: this.state.IsSplit,
      IsDelGift: this.state.IsDelGift,
      IsDelPrice: this.state.IsDelPrice
    }
    if (data.OidType === 'A') {
      data.OID = this.props.doge
    } else { //B
      console.log(this.props.zch.props.conditions)
      Object.assign(data, this.props.zch.props.conditions)
    }
    startLoading()
    ZPost('Order/CalGift', data, () => {
      this.handleok()
      this.props.zch.refreshRowData()
    }).then(endLoading)
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_RECOUNT_GIFT_VIS_1_SET', payload: null})
  },
  render() {
    return (
      <Modal title='重新计算赠品' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={646}>
        <Alert message='系统只会计算未进入发货流程（待付款，已付款待审核，已审核待配快递，异常）的订单' type='info' />
        <div className={styles.sColumn}>
          <RadioGroup value={this.state.OidType} onChange={e => {
            this.setState({
              OidType: e.target.value
            })
          }}>
            <Radio value='A'>计算列表页勾选的订单</Radio>
            <Radio value='B'>计算所有符合条件的订单：（加入搜索条件过滤后）</Radio>
          </RadioGroup>
        </div>
        <div className='hr mt10 mb10' />
        <div className={styles.sColumn}>
          <RadioGroup value={this.state.DateType} onChange={e => {
            this.setState({
              DateType: e.target.value
            })
          }}>
            <Radio value='A'>按下单时间先后计算</Radio>
            <Radio value='B'>按付款时间先后计算</Radio>
          </RadioGroup>
        </div>
        <div className='hr mt10 mb15' />
        <div className='mb5'>
          <Checkbox checked={this.state.IsSplit} onChange={e => {
            this.setState({
              IsSplit: e.target.checked
            })
          }}>排除已拆分的订单（拆分前的订单送的赠品拆分后可能不符合条件不送，或者作为多个订单多送）</Checkbox>
        </div>
        <div className='mt15'>
          <Checkbox disabled checked={this.state.IsDelGift} onChange={e => {
            this.setState({
              IsDelGift: e.target.checked
            })
          }}>删除原有赠品，即订单商品带有赠品标记的赠品（线上送的将不会自动删除）</Checkbox>
        </div>
        <div className='mt5'>
          <Checkbox checked={this.state.IsDelPrice} onChange={e => {
            this.setState({
              IsDelPrice: e.target.checked
            })
          }}>删除未标记为赠品，但实际销售单价为0的商品（线上下的商品改价为0也不会自动删除）</Checkbox>
        </div>
      </Modal>
    )
  }
}))
const OrderMergeRestore = connect(state => ({
  doge: state.order_list_merge_restore_1
}))(createClass({
  contextTypes: {
    store: React.PropTypes.object
  },
  getInitialState() {
    return {
      visible: false,
      value: 'A',
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    this._dirtied = false
    if (nextProps.doge) {
      this.setState({
        value: nextProps.doge.length ? 'A' : 'B',
        visible: true
      })
    } else {
      this.setState({
        visible: false,
        value: 'A',
        confirmLoading: false
      })
    }
  },
  handleOK() {
    this.setState({
      confirmLoading: true
    })
    const Conditions = this.context.store.getState().order_list_conditions
    ZPost('Order/CancleOrdMerge', {OID: this.props.doge, Type: this.state.value, Conditions}, () => {
      this._dirtied = true
      this.handleok()
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    if (this._dirtied === true) {
      this.props.zch.refreshRowData()
    }
    this.props.dispatch({type: 'ORDER_LIST_MERGE_RESTORE_1_SET', payload: null})
  },
  handleChange(e) {
    const value = e.target.value
    this.setState({
      value
    })
  },
  render() {
    const disabledA = this.props.doge !== null && this.props.doge.length === 0
    return (
      <Modal title='合并订单还原成合并前' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={666}>
        <Alert message='请确认需要合并订单还原成合并前，该操作不可撤销，还原过程中请勿做审单以及拆分合并订单等其它操作' type='warning' />
        <div className={styles.radios1}>
          <div className='ml25'>
            <RadioGroup value={this.state.value} onChange={this.handleChange}>
              <Radio value='A' disabled={disabledA}>还原订单列表页勾选的订单</Radio>
              <Radio value='B'>还原所有符合条件的订单（加入搜索条件过滤后，只允许还原待审核的订单）</Radio>
            </RadioGroup>
          </div>
        </div>
      </Modal>
    )
  }
}))
const OrderSplit = connect(state => ({
  doge: state.order_list_split_1
}))(createClass({
  getInitialState() {
    return {
      visible: false,
      dataList: null,
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      this._dirtied = {}
      this.setState({
        visible: true,
        dataList: nextProps.doge.Skus
      })
    } else {
      this._dirtied = false
      this.setState({
        visible: false,
        dataList: null,
        confirmLoading: false
      })
    }
  },
  handleOK() {
    this.setState({
      confirmLoading: true
    })
    const SplitOrd = []
    for (let sku of this.state.dataList) {
      SplitOrd.push({
        Skuid: sku.ID,
        Qty: sku.Qty,
        QtyNew: this._dirtied[`${sku.ID}`] || 0,
        Price: sku.RealPrice,
        Weight: sku.Weight
      })
    }
    ZPost('Order/OrdSplit', {OID: this.props.doge.OID, SplitOrd}, () => {
      this._dirtied = true
      this.handleok()
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    if (this._dirtied === true) {
      this.props.zch.refreshRowData()
    }
    this.props.dispatch({type: 'ORDER_LIST_SPLIT_1_SET', payload: null})
  },
  handleChange(v, k) {
    this._dirtied[`${k}`] = v
  },
  render() {
    const {dataList} = this.state
    return (
      <Modal title='请在需要拆分成新订单的商品中输入拆分的数量' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={866}>
        <Alert message='拆分订单后请勿线上发货或其它ERP发货，拆分订单线上发货，线下不会同步发货' type='warning' />
        <div className={styles.mergeOTable}>
          <Table size='middle' rowKey='ID' columns={[{
            title: '图片',
            dataIndex: 'Img',
            width: 100,
            render: function(value, record, index) {
              return (
                <div className={styles.img} style={{backgroundImage: value ? `url(${value})` : ''}}>
                  <span>{record.Qty}</span>
                </div>
              )
            }
          }, {
            title: '商品编码/货号',
            dataIndex: 'SkuID',
            width: 150,
            render: function(value, record, index) {
              return (
                <div>
                  <div>{value}</div>
                  <div className='gray'>{record.GoodsCode}</div>
                </div>
              )
            }
          }, {
            title: '名称',
            dataIndex: 'SkuName',
            width: 220
          }, {
            title: '颜色规格',
            width: 100,
            dataIndex: 'Norm'
          }, {
            title: '原有数量',
            width: 90,
            dataIndex: 'Qty'
          }, {
            title: '可配货库存',
            width: 100,
            dataIndex: 'InvQty'
          }, {
            title: '拆分数量',
            width: 120,
            render: (value, record) => {
              return <Input type='number' size='small' min={0} max={record.Qty} onChange={(e) => this.handleChange(e.target.value, record.ID)} />
            }
          }]} dataSource={dataList} pagination={false} />
        </div>
      </Modal>
    )
  }
}))
const OrderMerge = connect(state => ({
  doge: state.order_list_merge_1
}))(createClass({
  getInitialState() {
    return {
      selectedRowKeys: null,
      visible: false,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      this._dirtied = false
      this._getData(nextProps.doge)
    } else {
      this.setState({
        visible: false,
        selectedRowKeys: null,
        dataList: [],
        confirmLoading: false
      })
    }
  },
  _getData(OID) {
    startLoading()
    ZGet({
      uri: 'Order/GetMergeOrd',
      data: {OID},
      success: ({d}) => {
        const lst = d && d instanceof Array ? d : []
        const zch = []
        for (let mod of lst) {
          let type = 0
          switch (mod.type) {
            case 'A': {
              type = 1
              break
            }
            case 'L': {
              type = 2
              break
            }
            case 'M': {
              type = 3
              break
            }
            case 'H': {
              type = 4
              break
            }
          }
          if (mod.MOrd instanceof Array && mod.MOrd.length) {
            for (let ord of mod.MOrd) {
              ord._zch_ = type
              zch.push(ord)
            }
          }
        }
        if (zch.length) {
          zch.sort(function(a, b) {
            return a._zch_ > b._zch_ ? 1 : -1
          })
        }
        this.setState({
          visible: true,
          dataList: zch
        })
      }
    }).then(endLoading)
  },
  handleToNormal(OID) {
    startLoading()
    ZPost('Order/TransferNormal', {OID: [OID]}, ({d}) => {
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        //const obj = d.SuccessIDs[0]
        this._dirtied = true
        this._getData(this.props.doge)
        // this.setState(update(this.state, {
        //   dataList: {
        //     [`${index}`]: {
        //       $merge: {
        //         Status: obj.Status,
        //         StatusDec: obj.StatusDec
        //       }
        //     }
        //   }
        // }))
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(endLoading)
  },
  handleOK() {
    const ids = this.state.selectedRowKeys
    if (!ids || !ids.length || !ids.some(x => x === this.props.doge)) {
      return message.error('请确保【主订单】有选中')
    }
    this.setState({
      confirmLoading: true
    })
    ZPost('Order/OrdMerger', {OID: this.props.doge, MerID: ids}, () => {
      this._dirtied = true
      this.handleok()
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_MERGE_1_SET', payload: null})
    if (this._dirtied) {
      this.props.zch.refreshRowData()
    }
  },
  render() {
    return (
      <Modal title='请选择需要被合并的订单，即被合并到当前选择的备选订单' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={996}>
        <div className={styles.mergeOtip}>
          <span className={styles.s1}>当前订单</span>&nbsp;
          <span className={styles.s2}><strong>推荐合并项</strong>(客户及收货地址均相同且已支付)</span>&nbsp;
          <span className={styles.s3}><strong>中风险合并项</strong>(收货地址不相同且已支付或者收货地址相同但不是同一买家)</span>&nbsp;
          <span className={styles.s4}><strong>高风险不能合并</strong>(没支付)</span>
        </div>
        <div className={styles.mergeOTable}>
          <Table size='middle' rowKey='ID' columns={[{
            title: '订单号',
            dataIndex: 'ID',
            width: 100,
            render: function(value, record, index) {
              return (
                <div className=''>
                  {value}
                  {record._zch_ === 1 ? (
                    <div><span className={styles.tag}>主订单</span></div>
                  ) : null}
                </div>
              )
            }
          }, {
            title: '线上订单号',
            dataIndex: 'SoID',
            width: 150,
            render: function(value, record, index) {
              return (
                <div>
                  <div>{value}</div>
                  <div className='mt5 red' title='应付款（运费）'>{record.Amount}({record.ExAmount})</div>
                </div>
              )
            }
          }, {
            title: '店铺&买家账号',
            dataIndex: 'ShopName',
            width: 220,
            render: function(value, record, index) {
              return (
                <div>
                  <div>{value}</div>
                  <div>{record.BuyerShopID}</div>
                </div>
              )
            }
          }, {
            title: '付款时间',
            width: 100,
            dataIndex: 'PayDate'
          }, {
            title: '收货地址',
            width: 300,
            dataIndex: 'RecAddress',
            render: function(value, record, index) {
              return (
                <div>
                  {record.RecLogistics} {record.RecCity} {record.RecDistrict} {record.RecAddress} {record.RecPhone}
                </div>
              )
            }
          }, {
            title: '收货人',
            width: 100,
            dataIndex: 'RecName'
          }, {
            title: '支付',
            dataIndex: 'IsPaid',
            width: 70,
            render: function(value) {
              return value ? <Icon type='check-circle-o' /> : <Icon type='close-circle-o' />
            }
          }, {
            title: '订单状态',
            width: 120,
            dataIndex: 'StatusDec'
          }, {
            title: '商品',
            width: 460,
            dataIndex: 'Sku',
            render: function(value) {
              if (value instanceof Array && value.length) {
                return (
                  <div className={styles.imgs}>
                    {value.map(x => <div key={x.ID} className={styles.img} style={{backgroundImage: x.Img ? `url(${x.Img})` : ''}}><span>{x.Qty}</span></div>)}
                  </div>
                )
              }
              return null
            }
          }, {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (value, record) => {
              return record.Status === 7 ? (
                <div className='tc'>
                  <Button type='primary' size='small' onClick={() => this.handleToNormal(record.ID)}>转正常单</Button>
                </div>
              ) : null
            }
          }]} rowClassName={OMergeClassName} rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys) => {
              this.setState({ selectedRowKeys })
            },
            getCheckboxProps: function(record) {
              return {
                checked: record._zch_ === 1,
                disabled: record._zch_ === 4
              }
            }
          }} dataSource={this.state.dataList} pagination={false} scroll={{x: 1620}} />
        </div>
      </Modal>
    )
  }
}))
const OMergeClassName = function(record) {
  return styles[`s${record._zch_}`]
}
const BatchCustomException = connect(state => ({
  doge: state.order_list_batch_custom_exceptions_1
}))(createForm()(createClass({
  getInitialState: function() {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      this.setState({
        visible: true
      })
    } else {
      this.setState({
        visible: false
      })
    }
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      const data = Object.assign({}, values, {
        OrdDateStart: data.OrdDate[0].format(),
        OrdDateEnd: data.OrdDate[1].format(),
        Status: data.Status instanceof Array && data.Status.length ? data.Status : ''
      })
      delete data.OrdDate
      this.setState({
        confirmLoading: true
      })
      ZPost('Order/MarkCustomAbnormal', data, () => {
        this.handleok()
        this.props.zch.refreshRowData()
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_BATCH_CUSTOM_EXCEPTIONS_1_SET', payload: null})
    this.props.form.resetFields()
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title='按商品信息标识自定义异常' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={646}>
        <Alert message={<div>本身异常类型为：<strong>特殊单</strong>，<strong>用户已申请退款</strong>，<strong>等待订单合并</strong> ，<strong>线上锁定</strong> 等异常类型的订单将不参与标识，如需标识，请先转正常单。其它异常类型均可能被转异常。</div>} type='info' />
        <div className={styles.noMBForm}>
          <Form horizontal className='pos-form'>
            <div className={styles.sChks}>
              <FormItem {...formItemLayout} label='订单状态'>
                {getFieldDecorator('Status')(
                  <Checkbox.Group options={[
                    {label: '待付款', value: '0'},
                    {label: '已付款待审核', value: '1'},
                    {label: '已审核待配快递', value: '2'},
                    {label: '异常', value: '7'}
                  ]} size='small' />
                )}
              </FormItem>
            </div>
            <FormItem {...formItemLayout} label='下单时间'>
              {getFieldDecorator('OrdDate', {
                rules: [
                  {required: true, message: '必选', type: 'array'}
                ]
              })(
                <DatePicker.RangePicker size='small' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='款号（货号）'>
              {getFieldDecorator('GoodsCode')(
                <Input size='small' placeholder='多个逗号分隔，包含其中一个编码即标异常' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='商品编码'>
              {getFieldDecorator('SkuID')(
                <Input size='small' placeholder='多个逗号分隔，包含其中一个编码即标异常。款码（货号）自动失效' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='商品名称关键字'>
              {getFieldDecorator('SkuName')(
                <Input size='small' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='规格关键字'>
              {getFieldDecorator('Norm')(
                <Input size='small' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='买家留言关键字'>
              {getFieldDecorator('RecMessage')(
                <Input size='small' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='卖家备注关键字'>
              {getFieldDecorator('SendMessage')(
                <Input size='small' />
              )}
            </FormItem>
            <div className='hr' />
            <FormItem {...formItemLayout} label='标记异常'>
              {getFieldDecorator('Abnormal', {
                rules: [
                  {required: true, whitespace: true, message: '必填'}
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
})))
const BatchDistributor1 = connect(state => ({
  doge: state.order_list_distributor_vis_1
}))(createClass({
  handleModalOk(value) {
    if (typeof value === 'undefined') {
      return message.error('请选择供销商')
    }
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    this.props.zch.grid.x0pCall(ZPost('Order/SetSupDistributor', {OID: this.props.doge, SupDistributor: value}, ({d}) => {
      this.handleModalCancel()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        Object.assign(x.data, qq)
      }, ['Status', 'SupDistributor'], nodes, this.props.zch.grid)
    }))
  },
  handleModalCancel() {
    this.props.dispatch({type: 'ORDER_LIST_DISTRIBUTOR_VIS_1_SET', payload: null})
  },
  render() {
    return (
      <DistributorModal hideClear visible={this.props.doge !== null} onOk={this.handleModalOk} onCancel={this.handleModalCancel} />
    )
  }
}))
const BatchGift1 = connect(state => ({
  doge: state.order_list_batch_gifts_1
}))(createClass({
  handleModalOk(selecter) {
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    this.props.zch.grid.x0pCall(ZPost('Order/InsertGiftMulti', {OID: this.props.doge, SkuIDList: [selecter.ID]}, ({d}) => {
      this.handleModalCancel()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        Object.assign(x.data, qq)
      }, null, nodes, this.props.zch.grid)
    }))
  },
  handleModalCancel() {
    this.props.dispatch({type: 'ORDER_LIST_BATCH_GIFTS_1_SET', payload: null})
  },
  render() {
    const doge = this.props.doge === null ? '0' : '1'
    return (
      <SkuPickerModal doge={doge} onOk={this.handleModalOk} onCancel={this.handleModalCancel} />
    )
  }
}))
const BatchSkus1 = connect(state => ({
  doge: state.order_list_batch_skus_1
}))(createForm()(createClass({
  getInitialState: function() {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      this.setState({
        visible: true
      })
    } else {
      this.setState({
        visible: false
      })
    }
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return false
      }
      const data = Object.assign({}, values, {
        AddSku: values.AddSku && values.AddSku.id ? values.AddSku.id : '',
        ModifySku: values.ModifySku && values.ModifySku.id ? values.ModifySku.id : '',
        DeleteSku: values.DeleteSku && values.DeleteSku.id ? values.DeleteSku.id : '',
        OID: this.props.doge
      })
      if (!data.AddSku && !data.ModifySku && !data.DeleteSku) {
        return message.error('请设置批量修改商品')
      }
      if (data.ModifySku && (typeof data.ModifyPrice === 'undefined' || data.ModifyPrice === '')) {
        return message.error('请设置【修改商品单价】的【目标单价】')
      }
      if (data.AddSku && (typeof data.AddPrice === 'undefined' || data.AddPrice === '')) {
        return message.error('请设置【添加指定商品】的【目标单价】')
      }
      const des = (
        <div>
          {data.AddSku ? (
            <div className='mt5'>新增商品：{values.AddSku.data.SkuID}</div>
          ) : null}
          {data.ModifySku ? (
            <div className='mt5'>修改商品：{values.ModifySku.data.SkuID}</div>
          ) : null}
          {data.DeleteSku ? (
            <div className='mt5'>删除商品：{values.DeleteSku.data.SkuID}</div>
          ) : null}
        </div>
      )
      Modal.confirm({
        title: '确认商品批量修改',
        content: des,
        onOk: () => {
          this.setState({ loading: true })
          const nodes = this.props.zch.grid.api.getSelectedNodes()
          ZPost('Order/ModifySku', data, ({d}) => {
            this.handleok()
            parseBatchOperatorResult.call(this, d, function(x, qq) {
              Object.assign(x.data, qq)
            }, null, nodes, this.props.zch.grid)
          }).then(() => {
            this.setState({ loading: false })
          })
        },
        onCancel() {}
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_BATCH_SKUS_1_SET', payload: null})
    this.props.form.resetFields()
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const chkFieldRequired = (field) => {
      const value = this.props.form.getFieldValue('ModifySku')
      return value && value.id
    }
    return (
      <Modal title='批量修改订单商品' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={646}>
        <div className={styles.noMBForm}>
          <Form horizontal className='pos-form'>
            <div className='flex-row'>
              <div className='tc' style={{width: 96}}>
                修改商品单价
              </div>
              <FormItem>
                {getFieldDecorator('ModifySku')(
                  <SkuPicker width={260} size='small' placeholder='指定商品' nameField='SkuID' />
                )}
              </FormItem>
              <div className='flex-grow'>
                <div className='ml5'>
                  <FormItem>
                    {getFieldDecorator('ModifyPrice', {
                      rules: [
                        {required: chkFieldRequired('ModifySku'), pattern: NUM_PATTERN, message: '错'}
                      ]
                    })(
                      <Input size='small' placeholder='目标单价' />
                    )}
                  </FormItem>
                </div>
              </div>
            </div>
            <div className='flex-row mt10'>
              <div className='tc' style={{width: 96}}>
                删除指定商品
              </div>
              <FormItem>
                {getFieldDecorator('DeleteSku')(
                  <SkuPicker width={260} size='small' placeholder='指定商品' nameField='SkuID' />
                )}
              </FormItem>
              <div className='flex-grow'>
                &nbsp;
              </div>
            </div>
            <div className='flex-row mt10'>
              <div className='tc' style={{width: 96}}>
                添加指定商品
              </div>
              <FormItem>
                {getFieldDecorator('AddSku')(
                  <SkuPicker width={260} size='small' placeholder='指定商品' nameField='SkuID' />
                )}
              </FormItem>
              <div className='flex-grow'>
                <div className='flex-row'>
                  <div className='ml5'>
                    <FormItem>
                      {getFieldDecorator('AddPrice', {
                        rules: [
                          {required: chkFieldRequired('AddSku'), message: '必填'}
                        ]
                      })(
                        <Input size='small' placeholder='目标单价' title='如果单价为0，则直接添加赠品;如果单价为-1，则添加实际单价为0且不标记为赠品的普通商品' />
                      )}
                    </FormItem>
                  </div>
                  <div className='ml5'>
                    <FormItem>
                      {getFieldDecorator('AddQty', {
                        rules: [
                          {required: chkFieldRequired('AddSku'), pattern: NUM_PATTERN, message: '必填'}
                        ]
                      })(
                        <Input size='small' placeholder='数量默认1' />
                      )}
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex-row mt10'>
              <div className='tc' style={{width: 96}}>
                添加商品规则
              </div>
              <div className='flex-grow'>
                <div className={styles.sColumn}>
                  <FormItem>
                    {getFieldDecorator('AddType', {
                      initialValue: 'A',
                      rules: [
                        {required: true, whitespace: true, message: '必选'}
                      ]
                    })(
                      <RadioGroup>
                        <Radio key='A' value='A'>订单已存在该商品则不添加</Radio>
                        <Radio key='B' value='B'>直接添加,如果重复,数量累加</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className='mt20 clearfix' />
        <Alert message={<div>如果订单中不存在需要[修改单价]或[删除]的商品,则该订单不操作<br />所有操作都可能改变订单的应付总金额,一些原来已付款的订单可能变成[等待付款]</div>} type='warning' />
      </Modal>
    )
  }
})))
const ToCancel1 = connect(state => ({
  doge: state.order_list_to_cancel_1
}))(createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: null,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      startLoading()
      ZGet({
        uri: 'Order/GetCancleList',
        success: ({d}) => {
          const lst = d && d instanceof Array ? d : []
          this.setState({
            visible: true,
            dataList: lst
          })
        }
      }).then(endLoading)
    } else {
      this.setState({
        visible: false,
        value: null,
        dataList: [],
        confirmLoading: false
      })
    }
  },
  handleOK() {
    const {value} = this.state
    if (!value) {
      return message.warning('请选择取消原因')
    }
    this.setState({
      confirmLoading: true
    })
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    const Remark = this.refs.zch.refs.input.value
    ZPost('Order/CancleOrder', {OID: this.props.doge, CancleReason: value, Remark}, ({d}) => {
      this.handleok()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        x.data.Status = qq.Status
        x.data.StatusDec = qq.StatusDec
        x.data.AbnormalStatus = qq.AbnormalStatus
        x.data.AbnormalStatusDec = qq.AbnormalStatusDec
      }, ['Status'], nodes)
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_TO_CANCEL_1_SET', payload: null})
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value
    })
  },
  render() {
    return (
      <Modal title='取消描述' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={676}>
        <Alert message='您正在取消订单,注意订单一旦取消将会同步到线上,请仔细考虑操作' type='warning' />
        <div className={styles.hua1}>
          <div className='flex-grow'>
            <RadioGroup onChange={this.handleRadio} value={this.state.value}>
              {this.state.dataList.map(x => <Radio key={x.value} value={x.value}>{x.label}</Radio>)}
            </RadioGroup>
          </div>
          <div className='flex-row' style={{height: 30}}>
            <div style={{ lineHeight: '28px' }}><span>取消原因：</span></div>
            <div className='flex-grow'><Input ref='zch' /></div>
          </div>
        </div>
      </Modal>
    )
  }
}))
const ToExceptions = connect(state => ({
  doge: state.order_list_to_exception_1
}))(createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: null,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        startLoading()
        ZGet({
          uri: 'Order/GetAbnormalList',
          success: ({d}) => {
            const lst = d && d instanceof Array ? d : []
            this.setState({
              visible: true,
              dataList: lst,
              value: null
            })
          }
        }).then(endLoading)
      }
    }
  },
  handleOK() {
    const {value} = this.state
    if (!value) {
      return message.warning('请选择异常状态')
    }
    this.setState({
      confirmLoading: true
    })
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    const AbnormalStatusDec = this.refs.zch.refs.input.value
    ZPost('Order/TransferAbnormal', {OID: this.props.doge, AbnormalStatus: value, AbnormalStatusDec}, ({d}) => {
      this.handleok()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        Object.assign(x.data, qq)
      }, ['Status'], nodes)
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_TO_EXCEPTION_1_SET', payload: null})
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value
    })
  },
  handleModify() {
    ModalPrompt({
      onPrompt: ({value}) => {
        const OrderAbnormal = value !== '' ? value.split(/,|，/).join(',') : ''
        return new Promise((resolve, reject) => {
          startLoading()
          ZPost('Order/InsertOrderAbnormal', {
            OrderAbnormal
          }, ({d}) => {
            resolve()
            this.setState({
              dataList: d
            })
          }, reject).then(endLoading)
        })
      },
      children: (
        <div className='mb10'>
          请输入自定义异常，逗号分隔多个异常。<br />请不要输入特殊字符，单个异常长度不能超过20。<br />灰色带下划线为自定义异常。
        </div>
      ),
      value: this.state.dataList.length ? this.state.dataList.reduce(function(a, b) {
        if (b.iscustom) {
          a.push(b.label)
        }
        return a
      }, []).join(',') : ''
    })
  },
  rendFooter() {
    return (
      <div className='clearfix tl'>
        <Button type='primary' className='pull-right' onClick={this.handleOK} loading={this.state.confirmLoading}>确认</Button>
        <Button type='ghost' size='small' onClick={this.handleModify}>维护自定义异常</Button>
      </div>
    )
  },
  render() {
    return (
      <Modal title='请输入标记异常的类型,输入相关说明' footer={this.rendFooter()} visible={this.state.visible} onCancel={this.handleok} width={666}>
        <div className={styles.hua1}>
          <div className='flex-grow'>
            <RadioGroup onChange={this.handleRadio} value={this.state.value}>
              {this.state.dataList.map(x => {
                if (x.iscustom) {
                  return <Radio key={x.value} value={x.value} className={styles.customExcecption}>{x.label}</Radio>
                }
                return <Radio key={x.value} value={x.value}>{x.label}</Radio>
              })}
            </RadioGroup>
          </div>
          <div className='flex-row' style={{height: 30}}>
            <div style={{ lineHeight: '28px' }}><span>异常描述：</span></div>
            <div className='flex-grow'><Input ref='zch' /></div>
          </div>
        </div>
      </Modal>
    )
  }
}))
const Whouse = connect(state => ({
  doge: state.order_list_whouse_1
}))(createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: null,
      dataList: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        startLoading()
        ZGet({
          uri: 'Order/GetWarehouse',
          success: ({d}) => {
            const lst = d && d instanceof Array ? d : []
            this.setState({
              visible: true,
              dataList: lst,
              value: nextProps.value
            })
          }
        }).then(endLoading)
      }
    }
  },
  handleOK() {
    const {value} = this.state
    if (!value) {
      return message.warning('取消了发货仓库的设置')
    }
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    this.props.zch.grid.x0pCall(ZPost('Order/SetWarehouse', {OID: this.props.doge, WarehouseID: value}, ({d}) => {
      this.handleok()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        x.data.SendWarehouse = qq.Warehouse
      }, ['SendWarehouse'], nodes)
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    }))
    //startLoading()
    //const valueName = this.state.dataList.filter(x => x.value === value)[0].label
    // ZPost('Order/SetWarehouse', {OID: this.props.doge, WarehouseID: value}, ({d}) => {
    //   if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
    //     const successIDs = {}
    //     const IDs = []
    //     for (let v of d.successIDs) {
    //       successIDs[`${v.ID}`] = v
    //       IDs.push(v.ID)
    //     }
    //     const nodes = this.props.zch.grid.api.getSelectedNodes()
    //     nodes.forEach(x => {
    //       if (IDs.indexOf(x.data.ID) !== -1) {
    //         let qq = successIDs[`${x.data.ID}`]
    //         x.data.SendWarehouse = qq.SendWarehouse
    //       }
    //     })
    //     this.props.zch.grid.api.refreshCells(nodes, ['SendWarehouse'])
    //   }
    //   if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
    //     const description = (<div>
    //       {d.FailIDs.map(x => {
    //         return (
    //           <div key={x.ID}>
    //             {x.ID}: {x.Reason}
    //           </div>
    //         )
    //       })}
    //       <div className='hr' />
    //       <div>请检查相关订单或刷新</div>
    //     </div>)
    //     notification.error({
    //       message: '发货仓库修改错误问题',
    //       description,
    //       icon: <Icon type='meh-o' />,
    //       duration: 30
    //     })
    //   }
    // }).then(endLoading)
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_LIST_WHOUSE_1_SET', payload: null})
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value
    })
  },
  render() {
    const style = {display: 'block'}
    return (
      <Modal title='选择仓库' visible={this.state.visible} onOk={this.handleOK} onCancel={this.handleok} width={320}>
        <div className={`${styles.hua} h-scroller`}>
          <RadioGroup onChange={this.handleRadio} value={this.state.value}>
            {this.state.dataList.map(x => <Radio style={style} key={x.value} value={x.value}>{x.label}</Radio>)}
          </RadioGroup>
        </div>
      </Modal>
    )
  }
}))
const ComRecAddress1 = connect(state => ({
  doge: state.order_list_buyerAddress_1
}))(createForm()(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        this.setState({
          visible: true
        }, () => {
          const u = this.props.zch.grid.api.getModel().getRow(nextProps.doge).data
          const s6 = parseArea(u.RecLogistics, u.RecCity, u.RecDistrict)
          this.props.form.setFieldsValue({
            s6: s6.length ? s6 : undefined,
            s7: u.RecAddress,
            s8: u.RecName,
            s9: u.RecTel,
            s10: u.RecPhone
          })
        })
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_BUYERADDRESS_1_SET', payload: null })
    this.props.form.resetFields()
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      this.setState({ loading: true })
      const node = this.props.zch.grid.api.getModel().getRow(this.props.doge)
      const p1 = Areas.filter(x => x.value === values.s6[0])[0]
      const p2 = values.s6[1] ? p1.children.filter(x => x.value === values.s6[1])[0] : null
      const p3 = values.s6[2] && p2 ? p2.children.filter(x => x.value === values.s6[2])[0] : null
      const data = {
        RecName: values.s8 || '',
        RecLogistics: p1 ? p1.label : '',
        RecCity: p2 ? p2.label : '',
        RecDistrict: p3 ? p3.label : '',
        RecAddress: values.s7 || '',
        RecPhone: values.s10 || '',
        RecTel: values.s9 || ''
      }
      ZPost('Order/ModifyAddress', {
        OID: node.data.ID,
        ...data
      }, () => {
        this.hideModal()
        Object.assign(node.data, data)
        this.props.zch.grid.api.refreshCells([node], ['RecAddress'])
      }).then(() => {
        this.setState({ loading: false })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title='查看或编辑备注' confirmLoading={this.state.loading} visible={this.state.visible} onOk={this.handleOK} onCancel={this.hideModal} width={720}>
        <Form horizontal className='pos-form'>
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
        </Form>
      </Modal>
    )
  }
})))
const ComSeller1 = connect(state => ({
  doge: state.order_list_sellerNote_1
}))(createForm()(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        this.setState({
          visible: true
        }, () => {
          this.props.form.setFieldsValue({
            zch: this.props.zch.grid.api.getModel().getRow(nextProps.doge).data.SendMessage
          })
        })
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_SELLERNOTE_1_SET', payload: null })
    this.props.form.resetFields()
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return false
      }
      this.setState({ loading: true })
      const node = this.props.zch.grid.api.getModel().getRow(this.props.doge)
      ZPost('Order/ModifyRemark', {OID: node.data.ID, SendMessage: values.zch}, () => {
        this.hideModal()
        node.data.SendMessage = values.zch
        this.props.zch.grid.api.refreshCells([node], ['SendMessage'])
      }).then(() => {
        this.setState({ loading: false })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Modal title='查看或编辑备注' confirmLoading={this.state.loading} visible={this.state.visible} onOk={this.handleOK} onCancel={this.hideModal} width={480}>
        <Form horizontal className='pos-form'>
          <FormItem>
            {getFieldDecorator('zch')(
              <Input type='textarea' placeholder='填写卖家备注/可空' autosize={{minRows: 6, maxRows: 12}} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
const DATA_EXPR_TYPE_EDNTEDS = {
  'A': ['{清空已设快递}', 'red'],
  'B': ['{让系统自动计算}', 'green'],
  'C': ['{菜鸟智选物流}', 'green']
}
const ComExpr1 = connect(state => ({
  doge: state.order_list_expr_1
}))(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false,
      address: '',
      value: '',
      exps: [],
      expers: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false,
          address: '',
          value: '',
          exps: [],
          expers: []
        })
      } else {
        startLoading()
        const u = this.props.zch.grid.api.getModel().getRow(nextProps.doge).data
        ZGet('Order/GetExp', {
          Logistics: u.RecLogistics,
          City: u.RecCity,
          District: u.RecDistrict,
          IsQuick: true
        }, ({d}) => {
          const address = `${u.RecLogistics} ${u.RecCity} ${u.RecDistrict} ${u.RecAddress}`
          if (d.LogisticsNetwork && d.LogisticsNetwork.length) {
            const expers = {}
            for (let er of d.LogisticsNetwork) {
              if (!expers[er.kd_name]) {
                expers[er.kd_name] = {
                  count: 0,
                  name: er.kd_name,
                  children: []
                }
              }
              expers[er.kd_name].count ++
              expers[er.kd_name].children.push({
                cp_name: er.cp_name_raw,
                cp_loc: er.cp_location,
                delivery_area_1: er.delivery_area_1,
                delivery_area_0: er.delivery_area_0,
                delivery_contact: er.delivery_contact
              })
            }
            this.setState({ visible: true, value: u.ExID, exps: d.Express, expers: Object.values(expers), address })
          } else {
            this.setState({ visible: true, value: u.ExID, exps: d.Express, expers: null, address })
          }
        }).then(endLoading)
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_EXPR_1_SET', payload: null })
  },
  handleOK() {
    const value = this.state.value
    if (!value) {
      return message.error('请选择快递方式')
    }
    let ExpName = ''
    if (Object.keys(DATA_EXPR_TYPE_EDNTEDS).indexOf(value) === -1) {
      const index = this.state.exps.findIndex(x => x.ID === value)
      if (index === -1) {
        return message.error('不存在的快递方式')
      }
      ExpName = this.state.exps[index].Name
    } else {
      ExpName = DATA_EXPR_TYPE_EDNTEDS[value][0]
    }
    const node = this.props.zch.grid.api.getModel().getRow(this.props.doge)
    const data = {
      OID: [node.data.ID],
      ExpID: value,
      ExpName
    }
    const nodes = [node]
    this.props.zch.grid.x0pCall(ZPost('Order/SetExp', data, ({d}) => {
      this.hideModal()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        x.data.ExID = qq.ExID
        x.data.Express = qq.Express
      }, ['Express'], nodes)
    }))
  },
  render() {
    return (
      <Modal title='请选择需要设定的物流(快递)公司' confirmLoading={this.state.loading} visible={this.state.visible} onOk={this.handleOK} onCancel={this.hideModal} width={820}>
        <div className={styles.experWrapper}>
          <div className={styles.exps}>
            <Alert message={this.state.address} type='warning' />
            <Collapse>
              {this.state.expers && this.state.expers.length ? this.state.expers.map((x, i) => (
                <Panel header={`${x.name} (${x.count})`} key={i}>
                  <div className={styles.pch}>
                    {x.children && x.children.length ? x.children.map((y, j) => (
                      <div className={styles.row} key={j}>
                        <Row>
                          <Col span={4} className='tr'>网店名：</Col>
                          <Col span={20}><strong>{y.cp_name}</strong></Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>地址：</Col>
                          <Col span={20}>{y.cp_loc}</Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>联系：</Col>
                          <Col span={20}>{y.delivery_contact}</Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>到达区域：</Col>
                          <Col span={20}><span className='green'>{y.delivery_area_1}</span></Col>
                        </Row>
                        <Row>
                          <Col span={4} className='tr'>不达区域：</Col>
                          <Col span={20}>{y.delivery_area_0}</Col>
                        </Row>
                      </div>
                    )) : null}
                  </div>
                </Panel>
              )) : null}
            </Collapse>
          </div>
          <div className={styles.radios}>
            <RadioGroup onChange={(e) => {
              this.setState({
                value: e.target.value
              })
            }} value={`${this.state.value}`}>
              {this.state.exps.length ? this.state.exps.map(x => <Radio key={x.ID} value={x.ID}>{x.Name}</Radio>) : null}
              <div className='hr' />
              {Object.keys(DATA_EXPR_TYPE_EDNTEDS).map(k => <Radio key={k} value={k}><span className={DATA_EXPR_TYPE_EDNTEDS[k][1]}>{DATA_EXPR_TYPE_EDNTEDS[k][0]}</span></Radio>)}
            </RadioGroup>
          </div>
        </div>
      </Modal>
    )
  }
}))
const ExpressModal = connect(state => ({
  doge: state.order_list_expr_2
}))(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false,
      value: '',
      exps: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false,
          exps: [],
          value: ''
        })
      } else {
        startLoading()
        ZGet('Order/GetExp', {
          Logistics: '',
          City: '',
          District: '',
          IsQuick: false
        }, ({d}) => {
          this.setState({ visible: true, exps: d.Express, value: '' })
        }).then(endLoading)
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_EXPR_2_SET', payload: null })
  },
  handleOK() {
    const value = this.state.value
    if (!value) {
      return message.error('请选择快递方式')
    }
    let ExpName = ''
    if (Object.keys(DATA_EXPR_TYPE_EDNTEDS).indexOf(value) === -1) {
      const index = this.state.exps.findIndex(x => x.ID === value)
      if (index === -1) {
        return message.error('不存在的快递方式')
      }
      ExpName = this.state.exps[index].Name
    } else {
      ExpName = DATA_EXPR_TYPE_EDNTEDS[value][0]
    }
    const data = {
      OID: this.props.doge,
      ExpID: value,
      ExpName
    }
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    this.props.zch.grid.x0pCall(ZPost('Order/SetExp', data, ({d}) => {
      this.hideModal()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        x.data.ExID = qq.ExID
        x.data.Express = qq.Express
      }, ['Express'], nodes)
    }))
    //startLoading()
    //ZPost('Order/SetExp', data, ({d}) => {
    //  this.hideModal()
      // if (d.length) {
      //   const nodes = this.props.zch.grid.api.getSelectedNodes()
      //   let failIDs = []
      //   let i = 0
      //   nodes.forEach(x => {
      //     if (d.indexOf(x.data.ID) !== -1) {
      //       x.data.ExID = data.ExpID
      //       x.data.Express = data.ExpName
      //       i++
      //     } else {
      //       failIDs.push(x.data.ID)
      //     }
      //   })
      //   if (i > 0) {
      //     this.props.zch.grid.api.refreshCells(nodes, ['Express'])
      //   }
      //   if (failIDs.length) {
      //     const description = (<div>
      //       {failIDs.map(x => {
      //         return (
      //           <div key={x}>
      //             订单内部号：{x}
      //           </div>
      //         )
      //       })}
      //     </div>)
      //     notification.error({
      //       message: '订单快递更新失败ID',
      //       description,
      //       icon: <Icon type='meh-o' />,
      //       duration: 30
      //     })
      //   }
      // } else {
      //   message.error('订单快递更新失败，请重新尝试')
      // }
    //}).then(endLoading)
  },
  render() {
    return (
      <Modal title='请选择需要设定的物流(快递)公司' confirmLoading={this.state.loading} visible={this.state.visible} onOk={this.handleOK} onCancel={this.hideModal} width={350}>
        <div className={styles.radios1}>
          <RadioGroup onChange={(e) => {
            this.setState({
              value: e.target.value
            })
          }} value={`${this.state.value}`}>
            {this.state.exps.length ? this.state.exps.map(x => <Radio key={x.ID} value={x.ID}>{x.Name}</Radio>) : null}
            <div className='hr' />
            {Object.keys(DATA_EXPR_TYPE_EDNTEDS).map(k => <Radio key={k} value={k}><span className={DATA_EXPR_TYPE_EDNTEDS[k][1]}>{DATA_EXPR_TYPE_EDNTEDS[k][0]}</span></Radio>)}
          </RadioGroup>
        </div>
      </Modal>
    )
  }
}))
const gridOptions = {
  getRowClass: function(params) {
    return styles[`fck-${params.data.Status}`]
  },
  getContextMenuItems: function(params) {
    console.log(params)
    const data = params.node.data
    return [
      {
        name: '订单 ' + data.ID + ' 详情',
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_DETAIL_1_SET', payload: data.ID})
        }
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
        disabled: data.Status !== 7,
        action: function() {
          const grid = params.api.gridOptionsWrapper.gridOptions.grid.grid
          console.log(grid)
          grid.x0pCall(ZPost('Order/TransferNormal', {OID: [data.ID]}, ({d}) => {
            parseBatchOperatorResult.call(this, d, function(x, qq) {
              x.data.Status = qq.Status
              x.data.StatusDec = qq.StatusDec
            }, ['Status'], [params.node], grid)
          }))
        }
      },
      {
        name: '转异常单',
        disabled: [0, 1, 2, 3, 8].indexOf(data.Status) === -1
      },
      // {
      //   name: '打标签'
      // },
      // {
      //   name: '改标签'
      // },
      {
        name: '取消订单',
        disabled: [0, 1, 2, 3, 7, 8].indexOf(data.Status) === -1,
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_TO_CANCEL_1_SET', payload: [data.ID]})
        }
      },
      {
        name: '设快递',
        disabled: [0, 1, 2, 7].indexOf(data.Status) === -1,
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_EXPR_1_SET', payload: params.node.childIndex})
        }
      },
      {
        name: '售后：退货|换货|退款',
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_CREATE_VIS_1_SET', payload: data.ID})
        }
      },
      'separator',
      {
        name: '合并订单',
        disabled: [1, 2].indexOf(data.Status) === -1,
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_MERGE_1_SET', payload: data.ID})
        }
      },
      {
        name: '拆分订单',
        disabled: [1, 2].indexOf(data.Status) === -1,
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_SPLIT_1_SET', payload: {
            OID: data.ID,
            Skus: data.SkuList
          }})
        }
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
      ZPost('Order/InsertOrderDetail', {OID: this.props.item.ID, SkuIDList: ids, isQuick: true}, ({d}) => {
        this.props.onChange(d.Order)
        this._noticeFails(d.failIDs)
      }).then(endLoading)
    }
  },
  handleAppendSku(skus) {
    const ids = skus.map(x => x.ID)
    if (ids.length) {
      startLoading()
      ZPost('Order/InsertGift', {OID: this.props.item.ID, SkuIDList: ids, isQuick: true}, ({d}) => {
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
        {[0, 1, 7].indexOf(item.Status) !== -1 ? (
          <div className={styles.quickModify}>
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
        ) : (
          <div className={styles.skus}>
            {item.SkuList && item.SkuList.length ? item.SkuList.map(x => <SkuItemsFormNoModify key={x.ID} x={x} />) : null}
          </div>
        )}
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
        SkuName: values.SkuName,
        isQuick: true
      }, ({d}) => {
        this.props.onChange(d)
      }).then(endLoading)
    })
  },
  handleOP3() {
    startLoading()
    ZPost('Order/DeleteOrderDetail', {
      OID: this.props.oid,
      ID: this.props.x.ID,
      isQuick: true
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
const SkuItemsFormNoModify = createClass({
  render() {
    const {x} = this.props
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
          </div>
          <div className={styles._num}>
            <div className={styles._text}>
              <div className={styles._blue}>x{x.Qty}</div>
            </div>
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
          </div>
          <div className={styles._amount}>
            <div className={styles._text}>
              <div className={styles._am}>可配货库存：{x.InvQty}</div>
            </div>
          </div>
        </div>
      </Form>
    )
  }
})
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
        RecName: values.s8 || '',
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
      }).then(() => {
        this.setState({
          confirmLoading: false
        })
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
const parseBatchOperatorResult = function(d, cb, fields, nodes, grid, errmsg) {
  if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
    const successIDs = {}
    const IDs = []
    for (let v of d.SuccessIDs) {
      successIDs[`${v.ID}`] = v
      IDs.push(v.ID)
    }
    const _nodes = nodes || (grid ? grid.api.getSelectedNodes() : this.props.zch.grid.api.getSelectedNodes())
    _nodes.forEach(x => {
      if (IDs.indexOf(x.data.ID) !== -1) {
        cb(x, successIDs[`${x.data.ID}`])
      }
    })
    if (fields === null) {
      if (grid) {
        grid.api.refreshRows(_nodes)
      } else {
        this.props.zch.grid.api.refreshRows(_nodes)
      }
    } else {
      if (grid) {
        grid.api.refreshCells(_nodes, fields)
      } else {
        this.props.zch.grid.api.refreshCells(_nodes, fields)
      }
    }
    //const refresh = fields === null ? (grid ? grid.api.refreshRows : this.props.zch.grid.api.refreshRows) : (grid ? grid.api.refreshCells : this.props.zch.grid.api.refreshCells)
    //refresh(_nodes, fields)
  }
  if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
    const description = (<div className={styles.processDiv}>
      <ul>
        {d.FailIDs.map(x => {
          return (
            <li key={x.ID}>
              订单号(<strong>{x.ID}</strong>)<span>{x.Reason}</span>
            </li>
          )
        })}
      </ul>
      <div className='hr' />
      <div className='mt5 tr'><small className='gray'>请检查相关订单或刷新</small></div>
    </div>)
    Modal.warning({
      title: errmsg || '处理结果问题反馈',
      content: description,
      width: 480,
      onOk: function() {
        notification.error({
          message: '异常订单号',
          description: <div className='break'>{d.FailIDs.map(x => x.ID).join(',')}</div>,
          icon: <Icon type='meh-o' />,
          duration: null
        })
      }
    })
  }
}
