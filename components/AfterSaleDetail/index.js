/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-12 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
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
import {
  message,
  Button,
  Modal,
  Form,
  Col,
  Input,
  Select,
  Table,
  Row,
  Icon,
  notification,
  Popconfirm
} from 'antd'
import SkuPicker from 'components/SkuPicker/append'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const DetailModal = connect(state => ({
  doge: state.order_after_detail_vis
}))(React.createClass({
  getInitialState() {
    return {
      visible: false,
      showMM: false,
      AfterSale: {},
      AfterSaleItem: null,
      IssueType: null,
      Log: null,
      Type: null,
      Warehouse: null
    }
  },
  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(this.props.doge, nextProps.doge)) {
      if (nextProps.doge === null) {
        this.setState({
          visible: false
        })
      } else {
        this.loadDetail(nextProps.doge.ID)
      }
    }
  },
  loadDetail(RID) {
    startLoading()
    ZGet('AfterSale/GetAfterSaleEdit', {RID}, ({d}) => {
      console.log(d)
      this.setState({
        visible: true,
        ...d
      })
    }).then(endLoading)
  },
  hideModal() {
    if (this.__dirtied && this.props.zch) {
      this.props.zch.refreshRowByIndex(this.props.doge.rowIndex)
    }
    this.props.dispatch({ type: 'ORDER_AFTER_DETAIL_VIS_SET', payload: null })
  },
  _updateStates(d) {
    this.__dirtied = true
    this.setState(d)
  },
  handleUpdateQty(RDetailID, {target}) {
    this._handleUpdateItem({
      RDetailID,
      Qty: target.value
    })
  },
  handleUpdatePrice(RDetailID, {target}) {
    this._handleUpdateItem({
      RDetailID,
      Amount: target.value
    })
  },
  _handleUpdateItem(data) {
    startLoading()
    ZPost('AfterSale/UpdateASItemE', {
      RID: this.state.AfterSale.ID,
      ...data
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  handleRemove(RDetailID) {
    startLoading()
    ZPost('AfterSale/DeleteASItemE', {
      RID: this.state.AfterSale.ID,
      RDetailID
    }, ({d}) => {
      this._updateStates(d)
    }).then(endLoading)
  },
  _appendAfterSaleItem(items) {
    if (!this.state.AfterSaleItem || !this.state.AfterSaleItem.length) {
      this.setState({
        AfterSaleItem: items
      })
    } else {
      this.setState({
        AfterSaleItem: [...this.state.AfterSaleItem, items]
      })
    }
  },
  _renderItems() {
    const {AfterSale, AfterSaleItem} = this.state
    const RID = this.props.doge && this.props.doge.ID ? this.props.doge.ID : 0
    let itemQty1 = 0
    let itemQty2 = 0
    let totalAmount1 = 0
    let totalAmount2 = 0
    let totalAmount3 = 0
    if (AfterSaleItem && AfterSaleItem instanceof Array && AfterSaleItem.length) {
      AfterSaleItem.forEach(x => {
        itemQty1 += Number(x.RegisterQty)
        itemQty2 += Number(x.ReturnQty)
        let Amount = Number(x.Amount)
        switch (x.ReturnType) {
          case 0: {
            totalAmount1 += Amount
            break
          }
          case 1: {
            totalAmount2 += Amount
            break
          }
          case 2: {
            totalAmount3 += Amount
            break
          }
        }
      })
    }
    const Type = AfterSale.Type
    if ([0].indexOf(AfterSale.Status) !== -1) {
      return (
        <div className={styles.items}>
          <h3>订单商品 &emsp;&emsp;&emsp;&emsp;
            <Button onClick={() => {
              this.setState({
                showMM: true
              })
            }} type='ghost' size='small' disabled={this.state.AfterSale.OID === -1 || [0, 2].indexOf(Type) === -1}><Icon type='plus' style={{color: 'red'}} />从订单添加退回来的商品</Button>
            {this.state.AfterSale.OID !== -1 ? (<MM doge={this.state.showMM} onCancel={() => {
              this.setState({
                showMM: false
              })
            }} onChange={(e) => {
              this.setState({
                showMM: false
              }, () => {
                this.grid.x0pCall(ZPost('AfterSale/InsertASItemOrderE', {
                  RID,
                  DetailID: e.map(x => x.ID)
                }, ({d}) => {
                  if (d.SuccessIDs && d.SuccessIDs.length) {
                    this._appendAfterSaleItem(d.SuccessIDs)
                  }
                  parseFailds(d.FailIDs)
                }))
              })
            }} RID={RID} />) : null}
            &nbsp;
            <SkuPicker size='small' disabled={[0, 2, 3].indexOf(Type) === -1} onChange={(e) => {
              ZPost('AfterSale/InsertASItemSkuE', {
                RID,
                SkuID: e.map(x => x.ID),
                ReturnType: 0
              }, ({d}) => {
                if (d.SuccessIDs && d.SuccessIDs.length) {
                  this._appendAfterSaleItem(d.SuccessIDs)
                }
                parseFailds(d.FailIDs)
              })
            }}>从商品库添加退回来的商品</SkuPicker>
            {Type === 2 ? (
              <span>
                &nbsp;
                <SkuPicker size='small' onChange={(e) => {
                  this.grid.x0pCall(ZPost('AfterSale/InsertASItemSkuE', {
                    RID,
                    SkuID: e.map(x => x.ID),
                    ReturnType: 1
                  }, ({d}) => {
                    if (d.SuccessIDs && d.SuccessIDs.length) {
                      this._appendAfterSaleItem(d.SuccessIDs)
                    }
                    parseFailds(d.FailIDs)
                  }))
                }}>添加换货商品</SkuPicker>
              </span>
            ) : null}
            {Type === 3 ? (
              <span>
                &nbsp;
                <SkuPicker size='small' onChange={(e) => {
                  this.grid.x0pCall(ZPost('AfterSale/InsertASItemSkuE', {
                    RID,
                    SkuID: e.map(x => x.ID),
                    ReturnType: 2
                  }, ({d}) => {
                    if (d.SuccessIDs && d.SuccessIDs.length) {
                      this._appendAfterSaleItem(d.SuccessIDs)
                    }
                    parseFailds(d.FailIDs)
                  }))
                }}>添加补发商品</SkuPicker>
              </span>
            ) : null}
          </h3>
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
            width: 300,
            dataIndex: 'SkuID',
            render: function(text, row, index) {
              return (
                <div className={styles._info}>
                  <div>({row.ID})<a>{row.SkuName}</a></div>
                  <div className='mt5'>
                    <span className='gray mr5'>{row.GoodsCode}</span>
                    <strong>{row.SkuID}</strong>
                    <span className='gray ml5'>{row.Norm}</span>
                  </div>
                </div>
              )
            }
          }, {
            title: '登记数量(回车保存)',
            width: 128,
            dataIndex: 'RegisterQty',
            render: (value, record, index) => {
              return <Input min={0} type='number' defaultValue={value} placeholder={`原设：${value}`} onPressEnter={(e) => this.handleUpdateQty(record.ID, e)} />
            }
          }, {
            title: '实退数量',
            width: 72,
            className: 'tc',
            dataIndex: 'ReturnQty'
          }, {
            title: '金额(回车保存)',
            width: 98,
            dataIndex: 'Price',
            render: (value, record, index) => {
              return <Input min={0} type='number' defaultValue={value} placeholder={`原设：${value}`} onPressEnter={(e) => this.handleUpdatePrice(record.ID, e)} />
            }
          }, {
            title: '类型',
            width: 88,
            dataIndex: 'ReturnTypeString',
            className: 'tc'
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
          }]} dataSource={AfterSaleItem} pagination={false} rowKey='ID' />
          <Row className={styles.items_c}>
            <Col span={14}>
              <div className='tr'>
                <span className={styles._ppap}>登记退货总数量:</span><span className={styles.tQty}>{itemQty1}</span>
              </div>
            </Col>
            <Col span={10}>
              <div className='tr'>
                <div><span className={styles._ppap}>实收总数量:</span><span className={styles.bPrice}>{itemQty2}</span></div>
                {totalAmount1 > 0 ? <div><span className={styles._ppap}>退货总金额:</span><span className={styles.bPrice}>{totalAmount1}</span></div> : null}
                {totalAmount2 > 0 ? <div><span className={styles._ppap}>换货总金额:</span><span className={styles.bPrice}>{totalAmount2}</span></div> : null}
                {totalAmount3 > 0 ? <div><span className={styles._ppap}>补发总金额:</span><span className={styles.bPrice}>{totalAmount3}</span></div> : null}
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
            return (
              <div className={styles._info}>
                <div>({row.ID})<a>{row.SkuName}</a></div>
                <div className='mt5'>
                  <span className='gray mr5'>{row.GoodsCode}</span>
                  <strong>{row.SkuID}</strong>
                  <span className='gray ml5'>{row.Norm}</span>
                </div>
              </div>
            )
          }
        }, {
          title: '登记数量',
          width: 98,
          dataIndex: 'RegisterQty'
        }, {
          title: '实退数量',
          width: 98,
          dataIndex: 'ReturnQty'
        }, {
          title: '金额',
          width: 62,
          className: 'tc',
          dataIndex: 'Price'
        }, {
          title: '类型',
          width: 88,
          dataIndex: 'ReturnTypeString',
          className: 'tc'
        }, {
          title: '操作',
          dataIndex: '',
          render: () => {
            return <div className='gray'>不可修改</div>
          }
        }]} dataSource={AfterSaleItem} pagination={false} rowKey='ID' />
        <Row className={styles.items_c}>
          <Col span={14}>
            <div className='tr'>
              <span className={styles._ppap}>登记退货总数量:</span><span className={styles.tQty}>{itemQty1}</span>
            </div>
          </Col>
          <Col span={10}>
            <div className='tr'>
              <div><span className={styles._ppap}>实收总数量:</span><span className={styles.bPrice}>{itemQty2}</span></div>
              {totalAmount1 > 0 ? <div><span className={styles._ppap}>退货总金额:</span><span className={styles.bPrice}>{totalAmount1}</span></div> : null}
              {totalAmount2 > 0 ? <div><span className={styles._ppap}>换货总金额:</span><span className={styles.bPrice}>{totalAmount2}</span></div> : null}
              {totalAmount3 > 0 ? <div><span className={styles._ppap}>补发总金额:</span><span className={styles.bPrice}>{totalAmount3}</span></div> : null}
            </div>
          </Col>
        </Row>
      </div>
    )
  },
  _handleConfirm1() {
    startLoading()
    ZPost('AfterSale/ConfirmAfterSaleE', {RID: this.state.AfterSale.ID}, ({d}) => {
      this.loadDetail(this.state.AfterSale.ID)
    }, endLoading)
  },
  _handleConfirm2() {
    startLoading()
    ZPost('AfterSale/ConfirmGoodsE', {RID: this.state.AfterSale.ID}, ({d}) => {
      this.loadDetail(this.state.AfterSale.ID)
    }, endLoading)
  },
  _renderOps() {
    const {AfterSale} = this.state
    if (!AfterSale || typeof AfterSale.Status === 'undefined') {
      return (
        <div>
          &nbsp;
        </div>
      )
    }
    switch (AfterSale.Status) {
      case 0: {
        return (
          <div>
            <div><Button type='primary' onClick={this._handleConfirm1}>确认</Button></div>
            <div className='mt10'><Button disabled={AfterSale.GoodsStatus === '卖家已经收到退货'} type='primary' size='small' onClick={this._handleConfirm2}>确认收到货物</Button></div>
          </div>
        )
      }
    }
  },
  render() {
    const {AfterSale} = this.state
    return (
      <Modal title='售后详情' visible={this.state.visible} onCancel={this.hideModal} onOk={this.hideModal} width={880}>
        <div className='flex-row'>
          <div className='flex-grow'>
            <h3>售后基本信息</h3>
            <div className={styles.formD}>
              <Row>
                <Col span={3}><div className={styles.label}>售后单号</div></Col>
                <Col span={8}><div className={styles.inpt}>{AfterSale.ID}</div></Col>
                <Col span={3}><div className={styles.label}>订单号</div></Col>
                <Col span={10}><div className={styles.inpt}>{AfterSale.OID}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>店铺</div></Col>
                <Col span={8}><div className={styles.inpt}>{AfterSale.ShopName}</div></Col>
                <Col span={3}><div className={styles.label}>线上单号</div></Col>
                <Col span={10}><div className={styles.inpt}>{AfterSale.SoID}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>状态</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.StatusString}</div></Col>
                <Col span={3}><div className={styles.label}>货物状态</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.GoodsStatus}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>买家帐号</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.BuyerShopID}</div></Col>
                <Col span={3}><div className={styles.label}>收货人</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.RecName}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>电话</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.RecTel}</div></Col>
                <Col span={3}><div className={styles.label}>手机</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.RecPhone}</div></Col>
              </Row>
              <Row className='mt5'>
                <Col span={3}><div className={styles.label}>登记时间</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.RegisterDate}</div></Col>
                <Col span={3}><div className={styles.label}>实退金额</div></Col>
                <Col span={9}><div className={styles.inpt}>{AfterSale.RealReturnAmt}</div></Col>
              </Row>
            </div>
            <_ComDetailForm1 data={AfterSale} Type={this.state.Type} IssueType={this.state.IssueType} Warehouse={this.state.Warehouse} updateStates={this._updateStates} />
          </div>
          <div className={styles.opsArea}>
            {this._renderOps()}
          </div>
        </div>
        {this._renderItems()}
        <div className={styles.logs}>
          <h3>操作进程及日志</h3>
          {this.state.Log && this.state.Log.length ? this.state.Log.map(x => (
            <Row key={x.ID} className='mb5'>
              <Col span={4}><div><time>{x.LogDate}</time></div></Col>
              <Col span={3}><div>{x.UserName}</div></Col>
              <Col span={3}><div>{x.Title}</div></Col>
              <Col span={12}><div>{x.Remark}</div></Col>
            </Row>
          )) : <div className='mt10 gray tc'>(无)</div>}
        </div>
      </Modal>
    )
  }
}))
const _ComDetailForm1 = createForm()(React.createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  componentDidMount() {
    this._refresh(this.props.data)
  },
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this._refresh(nextProps.data)
    }
  },
  _refresh(data) {
    this.props.form.setFieldsValue({
      Type: data.Type + '',
      IssueType: data.IssueType + '',
      SalerReturnAmt: data.SalerReturnAmt,
      BuyerUpAmt: data.BuyerUpAmt,
      ReturnAccount: data.ReturnAccount,
      WarehouseID: data.WarehouseID + '',
      Express: data.Express,
      ExCode: data.ExCode,
      Remark: data.Remark
    })
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      this.setState({ loading: true })
      const data = {
        RID: this.props.data.ID,
        ...values
      }
      ZPost('AfterSale/UpdateAfterSaleE', data, ({d}) => {
        this.props.updateStates(d)
      }).then(() => {
        this.setState({ loading: false })
      })
    })
  },
  render() {
    const {getFieldDecorator} = this.props.form
    const {Type, IssueType, Warehouse} = this.props
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 }
    }
    const formItemLayout2 = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    }
    const disabledAll = [0].indexOf(this.props.data.Status) === -1
    return (
      <div className={styles.noMBForm}>
        <Form horizontal className='pos-form'>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='售后分类'>
                {getFieldDecorator('Type')(
                  <Select size='small' disabled={disabledAll}>
                    {Type && Type.length ? Type.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='问题类型'>
                {getFieldDecorator('IssueType')(
                  <Select size='small' disabled={disabledAll}>
                    {IssueType && IssueType.length ? IssueType.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='卖家应退款'>
                {getFieldDecorator('SalerReturnAmt')(
                  <Input type='number' size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='买家应补款'>
                {getFieldDecorator('BuyerUpAmt')(
                  <Input type='number' size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout1} label='退款账号'>
            {getFieldDecorator('ReturnAccount')(
              <Input size='small' disabled={disabledAll} />
            )}
          </FormItem>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout2} label='仓库'>
                {getFieldDecorator('WarehouseID')(
                  <Select size='small' disabled={disabledAll}>
                    {Warehouse && Warehouse.length ? Warehouse.map(x => <Option key={x.value} value={x.value}>{x.label}</Option>) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout2} label='快递公司'>
                {getFieldDecorator('Express')(
                  <Input type='number' size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout2} label='快递单号'>
                {getFieldDecorator('ExCode')(
                  <Input type='number' size='small' disabled={disabledAll} />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout1} label='备注'>
            {getFieldDecorator('Remark')(
              <Input size='small' type='textarea' disabled={disabledAll} autosize={{minRows: 2, maxRows: 5}} />
            )}
          </FormItem>
          <div className='hr' />
          <div className='clearfix'>
            <Button size='small' loading={this.state.loading} type='primary' className='pull-right' onClick={this.handleOK} disabled={disabledAll}>保存基本信息</Button>
          </div>
        </Form>
      </div>
    )
  }
}))
const shallowEqual = function(objA, objB) {
  if (objA === objB) {
    return true
  }
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }
  let keysA = Object.keys(objA)
  let keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) {
    return false
  }
  let bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB)
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i])) {
      return false
    }
  }
  return true
}
const MM = React.createClass({
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge) {
      this.handleSearch(nextProps.RID)
    }
  },
  componentWillUnmount() {
    this.ignoreCase = true
  },
  handleOK() {
    const selecters = this.grid.api.getSelectedRows()
    if (selecters) {
      this.props.onChange(selecters)
    } else {
      message.info('没有选择商品')
      this.props.onCancel()
    }
  },
  handleok() {
    this.props.onCancel()
  },
  handleSearch(RID) {
    startLoading()
    ZGet('AfterSale/GetASOrdItem', {
      RID: RID || this.props.RID
    }, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        rowData: d
      })
    }, () => {
      this.grid.showNoRows()
    }).then(endLoading)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <Modal wrapClassName={styles.modal} title='选择一个或多个商品' visible={this.props.doge} maskClosable={false} onCancel={this.props.onCancel} footer='' width={950}>
        <div className={styles.hua}>
          <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions1} storeConfig={{ prefix: 'zhanghua_14051' }} columnDefs={columnDefs1} grid={this} pagesAlign='left'>
            <div className={styles.footerBtns}>
              <Button type='primary' onClick={this.handleOK}>确认商品</Button>
              <Button onClick={this.handleok}>关闭</Button>
            </div>
          </ZGrid>
        </div>
      </Modal>
    )
  }
})
const columnDefs1 = [
  {
    headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    width: 120
  }, {
    headerName: '商品名字',
    field: 'SkuName',
    width: 180
  }, {
    headerName: '规格',
    field: 'Norm',
    width: 120
  }, {
    headerName: '数量',
    field: 'Qty',
    cellStyle: {textAlign: 'center'},
    width: 80
  }, {
    headerName: '单价',
    field: 'RealPrice',
    width: 80
  }, {
    headerName: '金额',
    field: 'Amount',
    width: 80
  }, {
    headerName: '基本价',
    field: 'SalePrice',
    width: 80
  }, {
    headerName: '折扣',
    field: 'DiscountRate',
    width: 80
  }, {
    headerName: '是否赠品',
    field: 'IsGift',
    width: 90,
    cellStyle: {textAlign: 'center'},
    cellRenderer: function(params) {
      return params.value ? '是' : '否'
    }
  }]
const gridOptions1 = {
  rowSelection: 'multiple',
  onRowDoubleClicked: function() {
    this.grid.handleOK()
  }
}
const parseFailds = function(FailIDs, errmsg) {
  if (FailIDs && FailIDs instanceof Array && FailIDs.length) {
    const description = (<div className={styles.processDiv}>
      <ul>
        {FailIDs.map(x => {
          return (
            <li key={x.ID}>
              售后单(<strong>{x.ID}</strong>)<span>{x.Reason}</span>
            </li>
          )
        })}
      </ul>
      <div className='hr' />
      <div className='mt5 tr'><small className='gray'>请检查相关售后单或刷新</small></div>
    </div>)
    Modal.warning({
      title: errmsg || '处理结果问题反馈',
      content: description,
      width: 480,
      onOk: function() {
        notification.error({
          message: '异常售后单操作',
          description: <div className='break'>{FailIDs.map(x => x.ID).join(',')}</div>,
          icon: <Icon type='meh-o' />,
          duration: null
        })
      }
    })
  }
}
export {
  DetailModal as default,
  MM
}
