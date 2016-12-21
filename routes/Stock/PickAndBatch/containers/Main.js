/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-12-08 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Dropdown,
  Button,
  Menu,
  Tooltip,
  message,
  Checkbox,
  Input,
  Popover
} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import Prompt from 'components/Modal/Prompt'
import {
  Icon as Iconfa
} from 'components/Icon'
import Wrapper from 'components/MainWrapper'
import {BatchStatus} from 'constants/PickAndBatch'
import {
  reactCellRendererFactory
} from 'ag-grid-react'


const MixedPickingRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    // ZPost('XyUser/User/UserEnable', {
    //   IDLst: [this.props.data.ID],
    //   Enable: checked
    // }, () => {
    //   this.props.data.MixedPicking = checked
    //   this.props.refreshCell()
    // })
    this.props.data.MixedPicking = checked
    this.props.refreshCell()
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.MixedPicking} />
  }
})
const PickingPrintRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    let uri = ''
    if (checked) {
      uri = 'Batch/MarkPrint'
    } else {
      uri = 'Batch/CancleMarkPrint'
    }
    ZPost(uri, {
      ID: [this.props.data.ID]
    }, ({d}) => {
      if (d.FailIDs.length) {
        message.error(d.FailIDs[0].Reason)
      } else {
        this.props.data.PickingPrint = checked
      }
      this.props.refreshCell()
    })
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.PickingPrint} />
  }
})
const gridOptions = {
  enableSorting: false,
  enableServerSideSorting: false,
  onBeforeSortChanged: function() {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? {
      SortField: sorter.colId,
      SortDirection: sorter.sort.toUpperCase()
    } : {
      SortField: '',
      SortDirection: ''
    }
    this.grid.props.dispatch({type: 'PB_LIAT_CONSITION_UPDATE', update: {
      $merge: conditions
    }})
  },
  getRowClass: function(params) {
    return styles[`fck-${params.data.Status}`]
  },
  getContextMenuItems: function(params) {
    //const data = params.node.data
    let menus = []
    // switch (data.Status) {
    //   case 1: {
    //     break
    //   }
    //   case 6: {
    //     menus = [{
    //       name: '批次 ' + data.ID,
    //       action: function() {
    //         return
    //       }
    //     },
    //     'separator',
    //       {
    //         name: '强制混合拣货',
    //         action: function() {
    //           alert('url redirect')
    //         }
    //       },
    //       'separator',
    //       {
    //         name: '拆分未拣或缺货数商品到新订单',
    //         action: function() {
    //           alert('url redirect')
    //         }
    //       }]
    //     break
    //   }
    //   case 7: {
    //     menus = [{
    //       name: '批次 ' + data.ID,
    //       action: function() {
    //         return
    //       }
    //     },
    //     'separator',
    //       {
    //         name: '我去补货，然后继续拣货',
    //         action: function() {
    //           alert('url redirect')
    //         }
    //       }]
    //     break
    //   }
    //   default: {
    //     break
    //   }
    // }
    return menus
  }
}
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
    headerName: '批次号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100,
    cellRenderer: reactCellRendererFactory(React.createClass({
      handleClick(e) {
        const Yyah = this.props.api.gridOptionsWrapper.gridOptions
        Yyah.grid.toBatchLog(this.props.data.ID)
      },
      render() {
        return <Tooltip placement='right' title='点击查看批次日志' ><a href='javascript: void(0)' onClick={this.handleClick} >{this.props.data.ID}</a></Tooltip>
      }
    }))
  }, {
    headerName: '状态',
    field: 'Status',
    cellStyle: {textAlign: 'center'},
    cellRenderer: function(params) {
      const k = params.data.Status + ''
      return BatchStatus[k] || k
    },
    cellClass: function(params) {
      return styles.Status + ' ' + (styles[`Status${params.data.Status}`] || '')
    },
    width: 70
  }, {
    headerName: '类型',
    field: 'TypeString',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '拣货员',
    field: 'Pickor',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '订单数',
    field: 'OrderQty',
    cellStyle: {textAlign: 'right'},
    cellRenderer: reactCellRendererFactory(React.createClass({
      handleClick(e) {
        const Yyah = this.props.api.gridOptionsWrapper.gridOptions
        Yyah.grid.toSaleOut(this.props.data.ID)
      },
      render() {
        return <Tooltip placement='right' title='点击查看销售出库单' ><a href='javascript: void(0)' onClick={this.handleClick} >{this.props.data.OrderQty}</a></Tooltip>
      }
    })),
    width: 80
  }, {
    headerName: '单品种类数',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    cellRenderer: reactCellRendererFactory(React.createClass({
      handleClick(e) {
        const Yyah = this.props.api.gridOptionsWrapper.gridOptions
        Yyah.grid.toBatchDetail(this.props.data.ID)
      },
      render() {
        return <Tooltip placement='right' title='点击查看拣货明细信息' ><a href='javascript: void(0)' onClick={this.handleClick} >{this.props.data.SkuQty}</a></Tooltip>
      }
    })),
    width: 100
  }, {
    headerName: '商品总数',
    field: 'Qty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '已拣数',
    field: 'PickedQty',
    cellStyle: {textAlign: 'right'},
    width: 80,
    cellRenderer: reactCellRendererFactory(React.createClass({
      handleClick(e) {
        const Yyah = this.props.api.gridOptionsWrapper.gridOptions
        Yyah.grid.toBatchUnique(this.props.data.ID)
      },
      render() {
        return <Tooltip placement='right' title='点击查看拣货唯一码' ><a href='javascript: void(0)' onClick={this.handleClick} >{this.props.data.PickedQty}</a></Tooltip>
      }
    }))
  }, {
    headerName: '未拣数',
    field: 'NotPickedQty',
    cellStyle: {textAlign: 'right'},
    width: 80
  }, {
    headerName: '缺货数',
    field: 'NoQty',
    cellStyle: {textAlign: 'right'},
    width: 80
  }, {
    headerName: '生成日期',
    field: 'CreateDate',
    cellStyle: {textAlign: 'right'},
    width: 130
  }, {
    headerName: '标志',
    field: 'Mark',
    width: 100
  }, {
    headerName: '混合拣货',
    field: 'MixedPicking',
    width: 100,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(MixedPickingRender)
  }, {
    headerName: '拣货单已打印',
    field: 'PickingPrint',
    width: 120,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(PickingPrintRender)
  }]
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
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Batch/GetBatchList'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Batch,
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
              params.success(d.Batch)
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
  toBatchLog(id) {
    this.props.dispatch({ type: 'PB_BATCH_LOG_VIS_SET', payload: id })
  },
  toBatchDetail(id) {
    this.props.dispatch({ type: 'PB_BATCH_DETAIL_VIS_SET', payload: id })
  },
  toBatchUnique(id) {
    this.props.dispatch({ type: 'PB_BATCH_UNIQUE_VIS_SET', payload: id })
  },
  toSaleOut(id) {
    this.props.dispatch({ type: 'PB_SALE_OUT_VIS_SET', payload: id })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleNewEvent() {},
  setPrompt(flag, title, placeholder) {
    if (flag !== 'P') {
      ZGet('Batch/GetConfigure', {
        Type: flag
      }, ({d}) => {
        Prompt({
          title: title,
          placeholder: placeholder,
          value: d,
          onPrompt: ({value}) => {
            return new Promise((resolve, reject) => {
              ZPost('Batch/SetConfigure', {
                Type: flag,
                TypeValue: value
              }, () => {
                resolve()
              }, reject)
            })
          }
        })
      })
    } else {
      Prompt({
        title: title,
        placeholder: placeholder,
        onPrompt: ({value}) => {
          return new Promise((resolve, reject) => {
            ZPost('Batch/ModifyRemarkAll', {
              Remark: value
            }, () => {
              resolve()
              this.refreshDataCallback()
            }, reject)
          })
        }
      })
    }
  },
  handlePickSort(e) {
    switch (e.key) {
      case '1': {
        //this.props.dispatch({type: 'STOCK_VIRTUAL_VIS_SET', payload: 0})
        break
      }
      case '3': {
        this.props.dispatch({type: 'PB_LIMIT_VIS_SET', payload: 1})
        break
      }
      case '4': {
        this.props.dispatch({type: 'PB_LIMIT_VIS_SET', payload: 2})
        break
      }
      case '9': {
        this.setPrompt('A', '设定单件单批最多订单数', '请设定 【单件】 拣货每批次最多订单数')
        break
      }
      case '10': {
        this.setPrompt('B', '设定多件单批最多订单数', '请设定 【多件】 拣货每批次最多订单数')
        break
      }
      case '11': {
        this.setPrompt('C', '设定单件单批单商品（SKU）单独成批数量', '设定单件单批单商品（SKU）单独成批数量，0表示不采用本规则')
        break
      }
      case '12': {
        this.setPrompt('D', '设定不参与多件生成的相同商品订单数（不参与，请输入0）', '当具有相同的多件商品的多个订单数量达到设定值时不会生成到多件批次，拦截多件订单生成，以积累数量组团拣货')
        break
      }
      case '13': {
        this.setPrompt('E', '设定大订单商品总数量（禁止大订单拣货批次，请输入0）', '等于或超过该数量的订单将通过大订单批次拣货发货')
        break
      }
      case '18': {
        this.setPrompt('P', '设定批次日志', '请设定批次标志字符，长度不能大于10')
        break
      }
      default: {
        message.info('not supported yet')
        break
      }
    }
  },
  handleLimitSet(e) {
    switch (e.key) {
      case '1': {
        this.props.dispatch({type: 'PB_LIMIT_SET_VIS_SET', payload: 1})
        break
      }
      case '2': {
        this.props.dispatch({type: 'PB_LIMIT_SET_VIS_SET', payload: 2})
        break
      }
      case '3': {
        this.props.dispatch({type: 'PB_LIMIT_SET_VIS_SET', payload: 3})
        break
      }
      default: {
        message.info('not supported yet')
        break
      }
    }
  },
  handlePrintSet(e) {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length === 0) {
      message.info('请先选择拣货批次')
    } else {
      switch (e.key) {
        case '1': {
          ZPost('Batch/MarkPrint', {
            ID: ids
          }, () => {
            this.refreshDataCallback()
          })
          break
        }
        case '2': {
          ZPost('Batch/CancleMarkPrint', {
            ID: ids
          }, () => {
            this.refreshDataCallback()
          })
          break
        }
        default: {
          message.info('not supported yet')
          break
        }
      }
    }
  },
  ModifyRemark() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length === 0) {
      message.info('请先选择拣货批次')
    } else {
      Prompt({
        title: '修改标志',
        placeholder: '请设定批次标志字符，长度不能大于10',
        onPrompt: ({value}) => {
          return new Promise((resolve, reject) => {
            ZPost('Batch/ModifyRemark', {
              Remark: value,
              ID: ids
            }, () => {
              resolve()
              this.refreshDataCallback()
            }, reject)
          })
        }
      })
    }
  },
  handleSetPickor() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length === 0) {
      message.info('请先选择可分配人员的批次')
    } else {
      this.props.dispatch({type: 'PB_PICKOR_SET_VIS_SET', payload: {ids: ids, re: false}})
    }
  },
  handleReSetPickor() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length === 0) {
      message.info('请先选择可分配人员的批次')
    } else {
      this.props.dispatch({type: 'PB_PICKOR_SET_VIS_SET', payload: {ids: ids, re: true}})
    }
  },
  render() {
    const pickmenu = (
      <Menu onClick={this.handlePickSort}>
        <Menu.Item key='1'>
          <Iconfa type='play' style={{color: '#32cd32', display: 'inner-block'}} />&nbsp;
          <Tooltip placement='right' title='每个订单只有一个数量单品（排除不含赠品），后面数字为待生成拣货任务的订单数'><a style={{display: 'inline-block'}} href='javascript:void'>生成单件: 10</a></Tooltip>
        </Menu.Item>
        <Menu.Item key='2'><Iconfa type='forward' style={{color: '#32cd32'}} />&nbsp;
          <Tooltip placement='right' title='每个订单包含2个及以上数量单品（排除不含赠品），后面数字为待生成拣货任务的订单数'><a style={{display: 'inline-block'}} href='javascript:void'>生成单件: 250</a></Tooltip>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='3'>生成单件（自定义设置条件）</Menu.Item>
        <Menu.Item key='4'>生成多件（自定义设置条件）</Menu.Item>
        <Menu.Item key='5'>选择订单生成任务</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='6'>
          <Tooltip placement='right' title='现场取货：快递公司=[现场取货]，每订单一个批次，拣货完成直接发货.&nbsp;&nbsp;&nbsp;&nbsp;
          大订单：商品总数量等于或超过指定数量，每订单一个批次，拣货完成后打印快递单发货'><a style={{display: 'inline-block'}} href='javascript:void'>生成现场取货或大订单: 250</a></Tooltip>
        </Menu.Item>
        <Menu.Item key='16'>生成整箱拣货</Menu.Item>
        <Menu.Item key='17'>生成补货</Menu.Item>
        <Menu.Item key='7'>生成组团拣货</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='8'>查看待补货或待上架商品情况</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='9'>设定单件单批最多订单数</Menu.Item>
        <Menu.Item key='10'>设定多件单批最多订单数</Menu.Item>
        <Menu.Item key='11'>
          <Tooltip placement='right' title='当单批单商品达到设定数量时不与其它商品混批，单独生成单一的批次'><a style={{display: 'inline-block'}} href='javascript:void'>设定单件单批单商品（SKU）单独成批数量</a></Tooltip>
        </Menu.Item>
        <Menu.Item key='12'><Tooltip placement='right' title='当具有相同的多件商品的多个订单数量达到设定值时不会生成到多件批次
拦截多件订单生成，以积累数量组团拣货'><a style={{display: 'inline-block'}} href='javascript:void'>设定不参与多件生成的相同商品订单数</a></Tooltip></Menu.Item>
        <Menu.Item key='13'>设定大订单商品总数量</Menu.Item>
        <Menu.Item key='18'>设定批次标志</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='15'><Tooltip placement='right' title='系统会根据需求自动获取电子面单，如果无法快速获取电子面单，请点击马上获取'><a style={{display: 'inline-block'}} href='javascript:void'>获取电子面单</a></Tooltip></Menu.Item>
      </Menu>
    )
    const limitmenu = (
      <Menu onClick={this.handleLimitSet}>
        <Menu.Item key='1'>限定生成任务的快递公司</Menu.Item>
        <Menu.Item key='2'>限定生成任务的店铺</Menu.Item>
        <Menu.Item key='3'>限定生成任务的订单</Menu.Item>
      </Menu>
    )
    const markmenu = (
      <Menu onClick={this.handlePrintSet}>
        <Menu.Item key='1'><Iconfa type='pencil' style={{color: '#32cd32'}} />&nbsp;标记拣货单已打</Menu.Item>
        <Menu.Item key='2'>取消标记拣货单已打</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.main}>
        <div className={styles.topOperators}>
          <Dropdown overlay={pickmenu}>
            <Button type='ghost' size='small'>
              <Iconfa type='play' style={{color: '#32cd32'}} />&nbsp;生成拣货批次
            </Button>
          </Dropdown>
          <span className={styles.sliver}>|</span>
          <Button type='ghost' size='small' onClick={this.handleSetPickor}>
            安排拣货任务
          </Button>
          <Button type='ghost' size='small' onClick={this.handleReSetPickor} style={{marginLeft: 10}}>
            重新安排
          </Button>
          <Button type='ghost' size='small' style={{marginLeft: 10}}>
            安排|重新安排播种员
          </Button>
          <span className={styles.sliver}>|</span>
          <Button type='ghost' size='small' >
            <Iconfa type='close' style={{color: 'red'}} />&nbsp;结束任务
          </Button>
          <span className={styles.sliver}>|</span>
          <Dropdown overlay={limitmenu}>
            <Button type='ghost' size='small' >
              限定设定
            </Button>
          </Dropdown>
          <Button type='ghost' size='small' style={{marginLeft: 10}}>
            <Iconfa type='print' style={{color: '#32cd32'}} />&nbsp;打印拣货单
          </Button>
          <Dropdown overlay={markmenu}>
            <Button type='ghost' size='small' style={{marginLeft: 10}}>
              <Iconfa type='pencil' style={{color: '#32cd32'}} />&nbsp;标记&nbsp;|&nbsp;取消标记打印
            </Button>
          </Dropdown>
          <Button type='ghost' size='small' onClick={this.ModifyRemark} style={{marginLeft: 10}}>
              修改标志
          </Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_take' }} columnDefs={columnDefs} grid={this} paged />
      </div>
      )
  }
})
export default connect(state => ({
  conditions: state.pb_list_condition
}))(Wrapper(Main))

