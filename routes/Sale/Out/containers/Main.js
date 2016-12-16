/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-09 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
import {
  Button,
  message,
  Modal,
  Icon,
  notification
} from 'antd'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils/index'
import IconFa from 'components/Icon'
import OrderDetail from 'components/OrderDetail'
import ExprSearch from 'components/ExprSearch'
const ButtonGroup = Button.Group
const EnableRender = function(params) {
  return params.value ? '&radic;' : '&times;'
}
const defColumns = [
  {
    headerName: '出仓单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '内部订单号',
    cellStyle: {textAlign: 'center'},
    field: 'OID',
    width: 100,
    cellRendererFramework: ({data, value, api}) => {
      return (
        <a onClick={() => {
          api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_DETAIL_1_SET', payload: value})
        }}>{value}</a>
      )
    }
  }, {
    headerName: '线上订单号',
    field: 'SoID',
    width: 100
  }, {
    headerName: '单据日期',
    field: 'DocDate',
    width: 120
  }, {
    headerName: '状态',
    field: 'StatusString',
    width: 90,
    cellClass: function(params) {
      return styles[`status${params.data.Status}`]
    }
  }, {
    headerName: '物流公司',
    field: 'ExpName',
    width: 100
  }, {
    headerName: '物流单号',
    field: 'ExCode',
    width: 100,
    cellRendererFramework: React.createClass({
      handleClick() {
        const {api, data} = this.props
        api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'ORDER_LIST_EXPR_S_1_SET', payload: {
          pp: data.ExpNamePinyin,
          ap: data.ExCode
        }})
      },
      render() {
        const {value} = this.props
        return (
          <a onClick={this.handleClick}>{value}</a>
        )
      }
    })
  }, {
    headerName: '批次号',
    field: 'BatchID',
    width: 100
  }, {
    headerName: '订单已打印',
    field: 'IsOrdPrint',
    width: 100,
    cellStyle: {textAlign: 'center'},
    cellRenderer: EnableRender
  }, {
    headerName: '快递单已打印',
    field: 'IsExpPrint',
    width: 100,
    cellStyle: {textAlign: 'center'},
    cellRenderer: EnableRender
  }, {
    headerName: '买家留言',
    field: 'RecMessage',
    width: 220
  }, {
    headerName: '收货地址',
    field: 'ID',
    width: 280,
    cellRenderer: function(params) {
      const d = params.data
      return `${d.RecLogistics} ${d.RecCity} ${d.RecDistrict} ${d.RecAddress}`
    }
  }, {
    headerName: '收货人',
    field: 'RecName',
    width: 100
  }, {
    headerName: '移动电话',
    field: 'RecPhone',
    width: 100
  }, {
    headerName: '预估重量',
    field: 'ExWeight',
    width: 100
  }, {
    headerName: '实际重量',
    field: 'RealWeight',
    width: 100
  }, {
    headerName: '货物方式',
    field: 'ShipType',
    width: 100
  }, {
    headerName: '运费',
    field: 'ExCost',
    width: 80
  }, {
    headerName: '已发货',
    field: 'IsDeliver',
    width: 100,
    cellStyle: {textAlign: 'center'},
    cellRenderer: EnableRender
  }, {
    headerName: '商品编号',
    field: 'Sku',
    width: 260
  }, {
    headerName: '备注',
    field: 'Remark',
    width: 260
  }, {
    headerName: '操作',
    cellStyle: {textAlign: 'center'},
    width: 100,
    cellRendererFramework: React.createClass({
      showStatus() {
        startLoading()
        ZGet('SaleOut/GetSkuList', {ID: this.props.data.ID}, ({d}) => {
          Modal.info({
            title: '捡货货品情况',
            width: 600,
            content: (
              <div>
                {d && d.length ? d.map(x => (
                  <div className='mb5'>
                    {x.SkuID}：<small>{x.InvLst.join(' ; ')}</small>
                  </div>
                )) : null}
              </div>
            )
          })
        }).then(endLoading)
      },
      render() {
        if (this.props.data.Status) {
          return null
        }
        return (
          <a onClick={this.showStatus}>
            查看捡货货品情况
          </a>
        )
      }
    })
  }]
const gridOptions = {
}
const Main = React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_data) {
    const conditions = _data || this.props.conditions || {}
    this.grid.showLoading()
    const uri = 'SaleOut/GetSaleOutList'
    const data = Object.assign({
      PageIndex: 1,
      NumPerPage: this.grid.getPageSize()
    }, conditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.SaleOut,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageIndex: params.page,
              NumPerPage: params.pageSize
            }, this.props.conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.SaleOut)
            }, ({m}) => {
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
  handleSign1() {
    const nodes = this.grid.api.getSelectedNodes()
    const ids = nodes.map(x => x.data.ID)
    if (!ids.length) {
      return message.info('请先选择')
    }
    if (ids) {
      this.grid.x0pCall(ZPost('SaleOut/MarkExp', {ID: ids}, ({d}) => {
        parseBatchOperatorResult.call(this, d, function(x, qq) {
          x.data.IsExpPrint = qq.IsExpPrint
        }, ['IsExpPrint'], nodes, this.grid)
      }))
    }
  },
  handleSign0() {
    const nodes = this.grid.api.getSelectedNodes()
    const ids = nodes.map(x => x.data.ID)
    if (!ids.length) {
      return message.info('请先选择')
    }
    if (ids) {
      this.grid.x0pCall(ZPost('SaleOut/CancleMarkExp', {ID: ids}, ({d}) => {
        parseBatchOperatorResult.call(this, d, function(x, qq) {
          x.data.IsExpPrint = qq.IsExpPrint
        }, ['IsExpPrint'], nodes, this.grid)
      }))
    }
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanghua_0239411' }} columnDefs={defColumns} paged grid={this}>
          批量：
          <ButtonGroup>
            <Button type='primary' size='small' onClick={this.handleSign1}>标记快递已打印</Button>
            <Button type='ghost' size='small' onClick={this.handleSign0}>取消标记</Button>
          </ButtonGroup>
          &emsp;
          <ButtonGroup>
            <Button size='small'><IconFa type='print' />补打订单</Button>
            <Button size='small'><IconFa type='print' />补打快递单</Button>
            <Button size='small' className='hide'><IconFa type='print' />商品小标签</Button>
          </ButtonGroup>
        </ZGrid>
        <ExprSearch />
        <OrderDetail />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.sale_out_conditions
}))(Main)
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
