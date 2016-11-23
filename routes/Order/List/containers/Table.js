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
import update from 'react-addons-update'
import Areas from 'json/AreaCascader'
import classNames from 'classnames'
import SkuAppendPicker from 'components/SkuPicker/append'
import ShopPicker from 'components/ShopPicker'
import BuyerModal from './BuyerModal'
import {
  Table,
  Select,
  Popconfirm,
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
  Steps,
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
//import ScrollerBar from 'components/Scrollbars/index'
import ModalPrompt from 'components/Modal/Prompt'
const ButtonGroup = Button.Group
const Step = Steps.Step
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
//   return that._reactInternalInstance._currentElement._owner._instance
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
                {data.Status === 7 ? <div className='mt5'>{data.AbnormalStatusDec}</div> : null}
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
    cellRendererFramework: createClass({
      render() {
        const {data, api, rowIndex} = this.props
        return (
          <div className={styles.centerWrapper}>
            <div className={styles.mAuto}>
              <div>{data.Express}</div>
              <div>{data.ExCode}</div>
            </div>
            <div className={`${styles.float} ${styles['float-2']}`} onClick={e => {
              api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_EXPR_1_SET', payload: rowIndex})
            }}>
              <span>设</span>
            </div>
          </div>
        )
      }
    })
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
        this.props.zch.grid.x0pCall(ZPost('Order/TransferNormal', {OID: ids}, ({d}) => {
          parseBatchOperatorResult.call(this, d, function(x, qq) {
            x.data.Status = qq.Status
            x.data.StatusDec = qq.StatusDec
          }, ['Status'], nodes, this.grid)
        }))
        // this.grid.x0pCall(ZPost('Order/TransferNormal', {OID: ids}, ({d}) => {
        //   if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        //     const successIDs = {}
        //     const IDs = []
        //     for (let v of d.successIDs) {
        //       successIDs[`${v.ID}`] = v
        //       IDs.push(v.ID)
        //     }
        //     const nodes = this.grid.api.getSelectedNodes()
        //     nodes.forEach(x => {
        //       if (IDs.indexOf(x.data.ID) !== -1) {
        //         let qq = successIDs[`${x.data.ID}`]
        //         x.data.Status = qq.Status
        //         x.data.StatusDec = qq.StatusDec
        //       }
        //     })
        //     this.grid.api.refreshCells(nodes, ['Status'])
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
        //       message: '订单转正常失败IDs',
        //       description,
        //       icon: <Icon type='meh-o' />,
        //       duration: 30
        //     })
        //   }
        // }))
        break
      }
    }
  },
  handleOrderMenuClick1(e) {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (!ids.length) {
      return message.info('请先选择')
    }
    switch (e.key) {
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
  render() {
    return (
      <div className='flex-column flex-grow'>
        <ZGrid gridOptions={gridOptions} rowHeight='75' className={styles.zgrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'order_list' }} columnDefs={defColumns} paged grid={this}>
          批量：
          <ButtonGroup>
            <Button type='ghost' size='small'><Icon type='check' />审核</Button>
            <Button type='ghost' size='small' onClick={this.handleSetExpr}>设快递</Button>
          </ButtonGroup>
          <span className={styles.sliver}>|</span>
          <Dropdown overlay={<Menu onClick={this.handleOrderMenuClick}>
            <Menu.Item key='1'><Icon type='exclamation-circle-o' className='red' /> 转异常单</Menu.Item>
            <Menu.Item key='2'>转正常单</Menu.Item>
            <Menu.Item key='3'>取消订单</Menu.Item>
          </Menu>}>
            <Button type='ghost' size='small'>订单设置<Icon type='down' /></Button>
          </Dropdown>
          &nbsp;
          <Dropdown overlay={<Menu onClick={this.handleOrderMenuClick1}>
            <Menu.Item key='1'>改运费</Menu.Item>
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
           内部Test号 486741
        </ZGrid>
        <ModalNewEgg refreshRowData={this.refreshRowData} />
        <ComSeller1 zch={this} /><ComRecAddress1 zch={this} /><ComDetail1 zch={this} /><ComExpr1 zch={this} /><ExpressModal zch={this} /><Whouse zch={this} /><ToExceptions zch={this} />
      </div>
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
      return message.warning('取消了异常设置')
    }
    this.setState({
      confirmLoading: true
    })
    const nodes = this.props.zch.grid.api.getSelectedNodes()
    this.props.zch.grid.x0pCall(ZPost('Order/SetExp', {OID: this.props.doge, WarehouseID: value}, ({d}) => {
      this.hideModal()
      parseBatchOperatorResult.call(this, d, function(x, qq) {
        Object.assign(x.data, qq)
      }, ['Status'], nodes)
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    }))
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
        <Button type='primary' className='pull-right' onClick={this.handleSubmit} loading={this.state.confirmLoading}>确认</Button>
        <Button type='ghost' size='small' onClick={this.handleModify}>维护自定义异常</Button>
      </div>
    )
  },
  render() {
    return (
      <Modal title='请输入标记异常的类型,输入相关说明' footer={this.rendFooter()} visible={this.state.visible} onOk={this.handleOK} onCancel={this.handleok} width={666}>
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
            <div className='flex-grow'><Input /></div>
          </div>
        </div>
      </Modal>
    )
  }
}))

const ToExceptions3 = createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: this.props.AbnormalStatus,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      startLoading()
      ZGet({
        uri: 'Order/GetAbnormalList',
        success: ({d}) => {
          const lst = d && d instanceof Array ? d : []
          this.setState({
            visible: true,
            dataList: lst,
            value: nextProps.AbnormalStatus
          })
        }
      }).then(endLoading)
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
    const AbnormalStatusDec = this.refs.zch.refs.input.value
    //const index = this.state.dataList.findIndex(x => x.value === value)
    //const name = this.state.dataList[index].label
    ZPost('Order/TransferAbnormal', {OID: [this.props.OID], AbnormalStatus: value, AbnormalStatusDec}, ({d}) => {
      this.handleok()
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.props.onChange({
          Status: obj.Status,
          StatusDec: obj.StatusDec,
          AbnormalStatus: obj.AbnormalStatus,
          AbnormalStatusDec: obj.AbnormalStatusDec
        })
        // this.props.onChange({
        //   Status: 7,
        //   AbnormalStatus: value,
        //   AbnormalStatusDec: name
        // })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.setState({
      visible: false,
      value: null,
      dataList: [],
      confirmLoading: false
    })
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
})
const ToCancel3 = createClass({
  getInitialState: function() {
    return {
      visible: false,
      value: null,
      dataList: [],
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
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
    const Remark = this.refs.zch.refs.input.value
    ZPost('Order/CancleOrder', {OID: [this.props.OID], CancleReason: value, Remark}, ({d}) => {
      this.handleok()
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.props.onChange({
          Status: obj.Status,
          StatusDec: obj.StatusDec,
          AbnormalStatus: obj.AbnormalStatus,
          AbnormalStatusDec: obj.AbnormalStatusDec
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(() => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleok() {
    this.setState({
      visible: false,
      value: null,
      dataList: [],
      confirmLoading: false
    })
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value
    })
  },
  render() {
    return (
      <Modal title='请输入标记异常的类型,输入相关说明' confirmLoading={this.state.confirmLoading} onOk={this.handleOK} visible={this.state.visible} onCancel={this.handleok} width={666}>
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
})
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
const ComDetail1 = connect(state => ({
  doge: state.order_list_detail_1
}))(createForm()(createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false,
      order: {},
      logs: [],
      payments: [],
      items: [],
      expr_vis: false,
      toe_vis: false
    }
  },
  componentDidMount() {
    this.setState({
      visible: true
    }, () => {
      this.componentWillReceiveProps({doge: 10873})
    })
  },
  componentWillReceiveProps(nextProps) {
    //if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        this.loadDetail(nextProps.doge)
      }
    //}
  },
  loadDetail(OID) {
    startLoading()
    ZGet('Order/GetOrderSingle', {OID}, ({d}) => {
      console.log(d)
      this.setState({
        visible: true,
        order: d.Order,
        logs: d.Log,
        payments: d.Pay,
        items: d.OrderItem
      })
    }).then(endLoading)
  },
  hideModal() {
    if (this.__dirtied) {
      this.props.zch.refreshRow(this.props.doge)
    }
    this.props.dispatch({ type: 'ORDER_LIST_DETAIL_1_SET', payload: null })
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
  _updateStates(d) {
    const states = {}
    if (typeof d.Order !== 'undefined') {
      states.order = d.Order
    }
    if (typeof d.OrderItem !== 'undefined') {
      states.items = d.OrderItem
    }
    if (typeof d.Log !== 'undefined') {
      states.logs = d.Log
    }
    if (typeof d.Pay !== 'undefined') {
      states.payments = d.Pay
    }
    this.__dirtied = true
    this.setState(states)
  },
  handleAppendSKU(skus) {
    const ids = skus.map(x => x.ID)
    if (ids.length) {
      startLoading()
      ZPost('Order/InsertOrderDetail', {OID: this.state.order.ID, SkuIDList: ids, isQuick: false}, ({d}) => {
        this._updateStates(d.Order)
        this._noticeFails(d.failIDs)
      }).then(endLoading)
    }
  },
  handleUpdateQty(ID, {target}) {
    this._handleUpdateItem({
      ID,
      Qty: target.value
    })
  },
  handleUpdatePrice(ID, {target}) {
    this._handleUpdateItem({
      ID,
      Price: target.value
    })
  },
  _handleUpdateItem(data) {
    startLoading()
    ZPost('Order/UpdateOrderDetail', {
      OID: this.state.order.ID,
      isQuick: false,
      ...data
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  handleRemove(ID) {
    startLoading()
    ZPost('Order/DeleteOrderDetail', {
      OID: this.state.order.ID,
      ID,
      isQuick: false
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __payOP0(PayID) {
    startLoading()
    ZPost('Order/CancleConfirmPay', {
      OID: this.state.order.ID,
      PayID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __payOP1(PayID) {
    startLoading()
    ZPost('Order/ConfirmPay', {
      OID: this.state.order.ID,
      PayID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __payOP2(PayID) {
    startLoading()
    ZPost('Order/CanclePay', {
      OID: this.state.order.ID,
      PayID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  __renderPayOp(x) {
    switch (x.Status) {
      case 0: {
        return (
          <ButtonGroup>
            <Button type='primary' size='small' onClick={() => this.__payOP1(x.ID)}>审核通过</Button>
            <Popconfirm title='确定将该笔支付作废吗？' onConfirm={() => this.__payOP2(x.ID)}>
              <Button size='small'>作废</Button>
            </Popconfirm>
          </ButtonGroup>
        )
      }
      case 1: {
        return (
          <Button type='primary' size='small' onClick={() => this.__payOP0(x.ID)}>重新审核</Button>
        )
      }
    }
  },
  _renderPays() {
    const {order, payments} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div className={styles.pays}>
          <h3>订单支付情况</h3>
          <div className='mt10 tc'>(无)</div>
        </div>
      )
    }
    if ([0, 1, 7].indexOf(order.Status) !== -1) {
      return (
        <div className={styles.pays}>
          <h3>订单支付情况 &emsp;&emsp;&emsp;&emsp;<Button type='primary' size='small' onClick={() => {
            this.props.dispatch({type: 'ORDER_LIST_DO_PAY_1_SET', payload: this.state.order.ID})
          }}>添加手工支付</Button>&emsp;<Button type='dashed' size='small' onClick={() => {
            startLoading()
            ZPost('Order/QuickPay', {OID: this.state.order.ID}, ({d}) => {
              this._updateStates(d)
            }).then(endLoading)
          }}>快速支付</Button></h3>
          {payments && payments.length ? payments.map(x => (
            <Row key={x.ID} className='mt5'>
              <Col span={4}><div className={styles.ppap0}>{x.Payment}</div></Col>
              <Col span={5}><div className={styles.ppap1}>{x.PayNbr}</div></Col>
              <Col span={4}><div className={styles.ppap2}>&yen;&nbsp;{x.PayAmount}</div></Col>
              <Col span={6}><div className={styles.ppap3}>{x.PayDate}</div></Col>
              <Col span={5}><div className={styles.ppap4}>{this.__renderPayOp(x)}</div></Col>
            </Row>
          )) : <div className='tc mt5'>(无)</div>}
          <ManualOrderPay updateStates={this._updateStates} />
        </div>
      )
    }
    return (
      <div className={styles.pays}>
        <h3>订单支付情况</h3>
        {payments && payments.length ? payments.map(x => (
          <Row key={x.ID} className='mt10'>
            <Col span={4}><div className={styles.ppap0}>{x.Payment}</div></Col>
            <Col span={5}><div className={styles.ppap1}>{x.PayNbr}</div></Col>
            <Col span={4}><div className={styles.ppap2}>&yen;&nbsp;{x.PayAmount}</div></Col>
            <Col span={6}><div className={styles.ppap3}>{x.PayDate}</div></Col>
          </Row>
        )) : <div className='tc mt5'>(无)</div>}
      </div>
    )
  },
  _renderItems() {
    const {order, items} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div className={styles.items}>
          <h3>订单商品</h3>
          <div className='mt10 tc'>(无)</div>
        </div>
      )
    }
    const itemQty = items.reduce(function(a, b) {
      return a + b.Qty
    }, 0)
    if ([0, 1, 7].indexOf(order.Status) !== -1) {
      return (
        <div className={styles.items}>
          <h3>订单商品 &emsp;&emsp;&emsp;&emsp;<SkuAppendPicker onChange={this.handleAppendSKU} size='small' type='primary' />&emsp;<Button className='hide' type='dashed' size='small'>导入商品</Button></h3>
          <Table columns={[{
            title: '图片',
            width: 68,
            className: 'tc',
            dataIndex: 'img',
            render: function(img, record, index) {
              return (
                <div className={styles._poster} style={{backgroundImage: img ? `url(${img})` : 'none'}} />
              )
            }
          }, {
            title: '名称',
            width: 280,
            dataIndex: 'SkuID',
            render: function(text, row, index) {
              const ZPCN = classNames({
                [`${styles._zp}`]: row.IsGift
              })
              return (
                <div className={styles._info}>
                  <div>({row.ID})<a>{row.SkuName}</a></div>
                  <div className='mt5'>
                    <span className='gray mr5'>{row.GoodsCode}</span>
                    <strong className={ZPCN}>{row.SkuID}</strong>
                    <span className='gray ml5'>{row.Norm}</span>
                  </div>
                </div>
              )
            }
          }, {
            title: '数量(回车保存)',
            width: 98,
            dataIndex: 'Qty',
            render: (value, record, index) => {
              return <Input min={0} type='number' defaultValue={value} placeholder={`原设：${value}`} onPressEnter={(e) => this.handleUpdateQty(record.ID, e)} />
            }
          }, {
            title: '单价(回车保存)',
            width: 98,
            dataIndex: 'RealPrice',
            render: (value, record, index) => {
              return <Input min={0} type='number' defaultValue={value} placeholder={`原设：${value}`} onPressEnter={(e) => this.handleUpdatePrice(record.ID, e)} />
            }
          }, {
            title: '原价',
            width: 62,
            className: 'tc',
            dataIndex: 'SalePrice'
          }, {
            title: '成交金额',
            width: 88,
            className: 'tc',
            render: function(text, row, index) {
              const price = row.RealPrice * row.Qty
              return <span>{price}</span>
            }
          }, {
            title: '可配库存',
            width: 85,
            className: 'tc',
            dataIndex: 'InvQty'
          }, {
            title: '操作',
            dataIndex: '',
            render: (text, row, index) => {
              return (
                <Popconfirm title='确定要删除吗' onConfirm={() => this.handleRemove(row.ID)}>
                  <Button size='small' type='ghost'>删除</Button>
                </Popconfirm>
              )
            }
          }]} dataSource={items} pagination={false} rowKey='ID' />
          <Row className={styles.items_c}>
            <Col span={14}>
              <div className='tr'>
                <span className={styles._ppap}>商品总数量:</span><span className={styles.tQty}>{itemQty}</span>
              </div>
            </Col>
            <Col span={10}>
              <div className='tr'>
                <div><span className={styles._ppap}>商品总金额:</span><span className={styles.bPrice}>{order.SkuAmount}</span></div>
                <div className='hide'><span className={styles._ppap}>-优惠及抵扣金额:</span><span className={styles.bPrice}>0</span></div>
                <div className='hide'><span className={styles._ppap}>取消商品总金额:</span><span className={styles.bPrice}>0</span></div>
                <div><span className={styles._ppap}>+运费:</span><span className={styles.bPrice}>{order.ExAmount}</span></div>
                <div className={styles.hr}>
                  <div><span className={styles._ppap}>应付总金额:</span><span className={styles.rPrice}>{order.Amount}</span></div>
                  <div><span className={styles._ppap}>实际已付（支付已审核）:</span><span className={styles.rPrice}>{order.PaidAmount}</span></div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )
    }
    return (
      <div className={styles.items}>
        <h3>订单商品</h3>
        <Table columns={[{
          title: '图片',
          width: 68,
          className: 'tc',
          dataIndex: 'img',
          render: function(img, record, index) {
            return (
              <div className={styles._poster} style={{backgroundImage: img ? `url(${img})` : 'none'}} />
            )
          }
        }, {
          title: '名称',
          width: 280,
          dataIndex: 'SkuID',
          render: function(text, row, index) {
            const ZPCN = classNames({
              [`${styles._zp}`]: row.IsGift
            })
            return (
              <div className={styles._info}>
                <div>({row.ID})<a>{row.SkuName}</a></div>
                <div className='mt5'>
                  <span className='gray mr5'>{row.GoodsCode}</span>
                  <strong className={ZPCN}>{row.SkuID}</strong>
                  <span className='gray ml5'>{row.Norm}</span>
                </div>
              </div>
            )
          }
        }, {
          title: '数量(回车保存)',
          width: 98,
          dataIndex: 'Qty'
        }, {
          title: '单价(回车保存)',
          width: 98,
          dataIndex: 'RealPrice'
        }, {
          title: '原价',
          width: 62,
          className: 'tc',
          dataIndex: 'SalePrice'
        }, {
          title: '成交金额',
          width: 88,
          className: 'tc',
          render: function(text, row, index) {
            const price = row.RealPrice * row.Qty
            return <span>{price}</span>
          }
        }, {
          title: '可配库存',
          width: 85,
          className: 'tc',
          dataIndex: 'InvQty'
        }, {
          title: '操作',
          dataIndex: '',
          render: () => {
            return <div className='gray'>不可修改</div>
          }
        }]} dataSource={items} pagination={false} rowKey='ID' />
        <Row className={styles.items_c}>
          <Col span={14}>
            <div className='tr'>
              <span className={styles._ppap}>商品总数量:</span><span className={styles.tQty}>{itemQty}</span>
            </div>
          </Col>
          <Col span={10}>
            <div className='tr'>
              <div><span className={styles._ppap}>商品总金额:</span><span className={styles.bPrice}>{order.SkuAmount}</span></div>
              <div className='hide'><span className={styles._ppap}>-优惠及抵扣金额:</span><span className={styles.bPrice}>0</span></div>
              <div className='hide'><span className={styles._ppap}>取消商品总金额:</span><span className={styles.bPrice}>0</span></div>
              <div><span className={styles._ppap}>+运费:</span><span className={styles.bPrice}>{order.ExAmount}</span></div>
              <div className={styles.hr}>
                <div><span className={styles._ppap}>应付总金额:</span><span className={styles.rPrice}>{order.Amount}</span></div>
                <div><span className={styles._ppap}>实际已付（支付已审核）:</span><span className={styles.rPrice}>{order.PaidAmount}</span></div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  },
  _handleExceptionOrder() {
    this.setState({
      toe_vis: true
    })
  },
  _handleCancelOrder() {
    this.props.dispatch({type: 'ORDER_LIST_TO_CANCEL_1_SET', payload: [this.state.order.ID]})
  },
  _handleConfirmOrder() {
    startLoading()
    ZPost('Order/ConfirmOrder', {OID: [this.state.order.ID]}, () => {
      this.loadDetail(this.state.order.ID)
    }).then(endLoading)
  },
  _handleExpressOrder() {
    this.setState({
      expr_vis: true
    })
  },
  _handleCancelException() {
    startLoading()
    ZPost('Order/TransferNormal', {OID: [this.state.order.ID]}, ({d}) => {
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.setState(update(this.state, {
          order: {
            $merge: {
              Status: obj.Status,
              StatusDec: obj.StatusDec
            }
          }
        }), () => {
          this._dirtied = true
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    }).then(endLoading)
  },
  _renderOps() {
    const {order} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div>
          &nbsp;
        </div>
      )
    }
    const status = order.Status
    switch (status) {
      case 1: {
        return (
          <div>
            <div><Button type='primary' onClick={this._handleConfirmOrder}>审核确认</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExpressOrder}>设定快递公司</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExceptionOrder}>标记异常</Button></div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleCancelOrder}>取消订单</Button></div>
            <div className='mt25 hide'>todo print order</div>
          </div>
        )
      }
      case 0: {
        return (
          <div>
            <div><Button type='ghost' size='small' onClick={this._handleExceptionOrder}>标记异常</Button></div>
            <div className='mt20'><Button type='ghost' size='small' onClick={this._handleCancelOrder}>取消订单</Button></div>
          </div>
        )
      }
      case 7: {
        return (
          <div>
            <div className='mt10'><Button type='ghost' size='small' onClick={this._handleExpressOrder}>设定快递公司</Button></div>
            <div className='mt25'>
              (当前异常:{order.AbnormalStatusDec})
            </div>
            <div className='mt5'><Button type='primary' size='small' onClick={this._handleCancelException}>取消异常标记</Button></div>
          </div>
        )
      }
    }
  },
  _renderProcesses() {
    const {order} = this.state
    if (!order || typeof order.Status === 'undefined') {
      return (
        <div className={styles.process}>
          <div className='mt10 tc'>...</div>
        </div>
      )
    }
    const status = order.Status
    if (status === 7) {
      return (
        <div className={styles.process}>
          <div className={styles.exception}>
            {order.AbnormalStatusDec}
          </div>
        </div>
      )
    }
    return (
      <Steps current={order.Status}>
        <Step title='待付款' />
        <Step title='已付款待审核' />
        <Step title='已审核待配快递' />
        <Step title='发货中' />
        <Step title='已发货' />
      </Steps>
    )
  },
  render() {
    const {order} = this.state
    const formData = {
      areas: parseArea(order.RecLogistics, order.RecCity, order.RecDistrict),
      address: order.RecAddress,
      tel: order.RecTel,
      phone: order.RecPhone,
      name: order.RecName,
      sendMessage: order.SendMessage,
      invoiceTitle: order.InvoiceTitle,
      freight: order.ExAmount,
      oid: order.ID,
      status: order.Status
    }
    const expr3Address = {
      RecAddress: this.state.order.RecAddress,
      RecCity: this.state.order.RecCity,
      RecDistrict: this.state.order.RecDistrict,
      RecLogistics: this.state.order.RecLogistics,
      ExID: this.state.order.ExID
    }
    //todo 异常单
    return (
      <Modal title='查看或编辑备注' confirmLoading={this.state.loading} visible={this.state.visible} onCancel={this.hideModal} width={980} footer=''>
        {this._renderProcesses()}
        <div className='flex-row mt25'>
          <div className='flex-grow'>
            <h3>订单基本信息</h3>
            <div className={styles.formD}>
              <Row>
                <Col span={3}><div className={styles.label}>订单编号</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.ID}</div></Col>
                <Col span={3}><div className={styles.label}>店铺</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.ShopName}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>下单时间</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.ODate}</div></Col>
                <Col span={3}><div className={styles.label}>订单来源</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.OSource}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>线上单号</div></Col>
                <Col span={21}><div className={styles.inpt}>{order.SoID}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>买家帐号</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.BuyerShopID}</div></Col>
                <Col span={3}><div className={styles.label}>付款时间</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.PayDate}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>买家留言</div></Col>
                <Col span={21}><div className={styles.inpt}>{order.RecMessage || '(无)'}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>快递公司</div></Col>
                <Col span={6}><div className={styles.inpt}>{order.Express}</div></Col>
                <Col span={3}><div className={styles.label}>快递单号</div></Col>
                <Col span={12}><div className={styles.inpt}>{order.ExCode}</div></Col>
              </Row>
            </div>
            <_ComDetailForm1 data={formData} updateStates={this._updateStates} />
          </div>
          <div className={styles.opsArea}>
            {this._renderOps()}
          </div>
        </div>
        {this._renderPays()}
        {this._renderItems()}
        <div className={styles.logs}>
          <h3>订单操作进程及日志</h3>
          {this.state.logs && this.state.logs.length ? this.state.logs.map(x => (
            <Row key={x.ID} className='mb5'>
              <Col span={4}><div><time>{x.LogDate}</time></div></Col>
              <Col span={3}><div>{x.UserName}</div></Col>
              <Col span={3}><div>{x.Title}</div></Col>
              <Col span={12}><div>{x.Remark}</div></Col>
            </Row>
          )) : <div className='mt10 gray tc'>(无)</div>}
        </div>
        <ComExpr3 visible={this.state.expr_vis} OID={this.state.order.ID} address={expr3Address} onChange={(d) => {
          this.setState(update(this.state, {
            order: {
              $merge: d
            },
            expr_vis: {
              $set: false
            }
          }), () => {
            this.__dirtied = true
          })
        }} />
        <ToExceptions3 visible={this.state.toe_vis} OID={this.state.order.ID} AbnormalStatus={this.state.order.AbnormalStatus} onChange={(d) => {
          this.setState(update(this.state, {
            order: {
              $merge: d
            },
            toe_vis: {
              $set: false
            }
          }), () => {
            this.__dirtied = true
          })
        }} />
      </Modal>
    )
  }
})))
//const PAYMENT_WAYS = ['支付宝']
const ManualOrderPay = connect(state => ({
  doge: state.order_list_do_pay_1
}))(createForm()(createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_DO_PAY_1_SET', payload: null })
    this.props.form.resetFields()
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      const data = Object.assign({}, values, {
        PayDate: values.PayDate.format(),
        OID: this.props.doge
      })
      this.setState({ loading: true })
      ZPost('Order/InsertManualPay', data, ({d}) => {
        this.hideModal()
        this.props.updateStates(d)
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
      <Modal title='添加新的支付' confirmLoading={this.state.loading} visible={this.props.doge !== null} onOk={this.handleOK} onCancel={this.hideModal} width={478}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='支付方式'>
            <FormItem>
              {getFieldDecorator('Payment', {
                initialValue: '支付宝',
                rules: [
                  {required: true, whitespace: true, message: '必选'}
                ]
              })(
                <Select>
                  <Option value='支付宝'>支付宝</Option>
                  <Option value='快钱'>快钱</Option>
                  <Option value='招行直连'>招行直连</Option>
                  <Option value='财付通'>财付通</Option>
                  <Option value='现金支付'>现金支付</Option>
                  <Option value='银行转帐'>银行转帐</Option>
                  <Option value='其它'>其它</Option>
                  <Option value='供销支付'>供销支付</Option>
                  <Option value='快速支付'>快速支付</Option>
                  <Option value='微信支付'>微信支付</Option>
                  <Option value='授信'>授信</Option>
                  <Option value='预支付'>预支付</Option>
                </Select>
              )}
            </FormItem>
          </FormItem>
          <FormItem {...formItemLayout} label='支付日期'>
            {getFieldDecorator('PayDate', {
              rules: [
                {required: true, whitespace: true, message: '必填', type: 'object'}
              ]
            })(
              <DatePicker showTime placeholder='点击设置' format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='支付单号'>
            {getFieldDecorator('PayNbr', {
              rules: [
                {required: this.props.form.getFieldValue('Payment') !== '现金支付', whitespace: true, message: '必填'}
              ]
            })(
              <Input placeholder='除现金支付外必填' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='支付金额'>
            {getFieldDecorator('PayAmount', {
              rules: [
                {required: true, whitespace: true, message: '必填'}
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='买家帐号'>
            {getFieldDecorator('PayAccount')(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
const _ComDetailForm1 = createForm()(createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.props.form.setFieldsValue({
        s1: nextProps.data.freight,
        s2: nextProps.data.sendMessage,
        s3: nextProps.data.invoiceTitle,
        s6: nextProps.data.areas.length ? nextProps.data.areas : undefined,
        s7: nextProps.data.address,
        s8: nextProps.data.name,
        s9: nextProps.data.tel,
        s10: nextProps.data.phone
      })
    }
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      this.setState({ loading: true })
      const p1 = Areas.filter(x => x.value === values.s6[0])[0]
      const p2 = values.s6[1] ? p1.children.filter(x => x.value === values.s6[1])[0] : null
      const p3 = values.s6[2] && p2 ? p2.children.filter(x => x.value === values.s6[2])[0] : null
      const data = {
        OID: this.props.data.oid,
        ExAmount: values.s1,
        SendMessage: values.s2,
        InvoiceTitle: values.s3,
        RecName: values.s8 || '',
        RecLogistics: p1 ? p1.label : '',
        RecCity: p2 ? p2.label : '',
        RecDistrict: p3 ? p3.label : '',
        RecAddress: values.s7 || '',
        RecPhone: values.s10 || '',
        RecTel: values.s9 || ''
      }
      ZPost('Order/UpdateOrder', data, ({d}) => {
        this.props.updateStates(d)
      }).then(() => {
        this.setState({ loading: false })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 }
    }
    const disabledAll = [0, 1, 7].indexOf(this.props.data.status) === -1
    return (
      <div className={styles.noMBForm}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='运费'>
            {getFieldDecorator('s1')(
              <Input size='small' disabled={disabledAll} style={{width: 100}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='卖家备注'>
            {getFieldDecorator('s2')(
              <Input size='small' type='textarea' disabled={disabledAll} autosize={{minRows: 2, maxRows: 5}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='发票抬头'>
            {getFieldDecorator('s3')(
              <Input size='small' disabled={disabledAll} />
            )}
          </FormItem>
          <h3>收货地址信息</h3>
          <FormItem {...formItemLayout} label='收货地址'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s6', {
                  rules: [
                    {required: true, whitespace: true, message: '必填', type: 'array'}
                  ]
                })(
                  <Cascader size='small' options={Areas} disabled={disabledAll} placeholder='选择省/市/区' />
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
                  <Input size='small' disabled={disabledAll} placeholder='详细地址：街区/门牌号' className='ml10' />
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
                  <Input size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label='联系电话'>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('s9')(
                  <Input size='small' disabled={disabledAll} />
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
                  <Input size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </FormItem>
          <div className='hr' />
          <div className='clearfix'>
            <Button size='small' loading={this.state.loading} type='primary' className='pull-right' onClick={this.handleOK} disabled={disabledAll}>保存订单基本信息</Button>
          </div>
        </Form>
      </div>
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
const ComExpr3 = createClass({
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
    if (nextProps.visible) {
      startLoading()
      const u = nextProps.address
      ZGet('Order/GetExp', {
        Logistics: u.RecLogistics,
        City: u.RecCity,
        District: u.RecDistrict,
        IsQuick: false
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
  },
  hideModal() {
    this.setState({
      visible: false,
      address: '',
      value: '',
      exps: [],
      expers: []
    })
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
      OID: [this.props.OID],
      ExpID: value,
      ExpName
    }
    ZPost('Order/SetExp', data, ({d}) => {
      this.hideModal()
      if (d.SuccessIDs && d.SuccessIDs instanceof Array && d.SuccessIDs.length) {
        const obj = d.SuccessIDs[0]
        this.props.onChange({
          ExID: obj.ExID,
          ExpNamePinyin: obj.ExpNamePinyin,
          Express: obj.Express
        })
      } else {
        if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
          message.error(d.FailIDs[0].Reason)
        }
      }
    })
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
})
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
        disabled: [0, 1, 2, 3].indexOf(data.Status) === -1
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
        name: '设快递',
        action: function() {
          params.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_EXPR_1_SET', payload: params.node.childIndex})
        }
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
        {[0, 1].indexOf(item.Status) !== -1 ? (
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
    if (grid) {
      grid.api.refreshCells(_nodes, fields)
    } else {
      this.props.zch.grid.api.refreshCells(_nodes, fields)
    }
  }
  if (d.FailIDs && d.FailIDs instanceof Array && d.FailIDs.length) {
    const description = (<div>
      {d.FailIDs.map(x => {
        return (
          <div key={x.ID}>
            订单号({x.ID}): {x.Reason}
          </div>
        )
      })}
      <div className='hr' />
      <div className='mt5'><small>请检查相关订单或刷新</small></div>
    </div>)
    notification.error({
      message: errmsg || '处理结果问题反馈',
      description,
      icon: <Icon type='meh-o' />,
      duration: 30
    })
  }
}
