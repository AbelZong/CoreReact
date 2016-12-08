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
import { Checkbox, Button, message, Modal } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import Toolbar2 from './Toolbar2'
import InvLockModify from './InvLockModify'
import {
  Icon as Iconfa
} from 'components/Icon'
import {
  reactCellRendererFactory
} from 'ag-grid-react'
const DEFAULT_TITLE = '商品库存锁定'

const gridOptions = {
}
const OperatorsRender = React.createClass({
  handleUnlock(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.ID)
  },
  handleDetail() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.handleDetail(this.props.data.ID)
  },
  render() {
    return (
      <div className='operators'>
        <a href='javascript:void(0)' onClick={this.handleDetail} >详情</a>
        <a href='javascript:void(0)' style={{marginLeft: 10}} onClick={this.handleUnlock} >手工解锁</a>
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
    headerName: '锁定编号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 90
  }, {
    headerName: '锁定名称',
    field: 'Name',
    width: 120
  }, {
    headerName: '锁定模式',
    field: 'Type',
    width: 90,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(React.createClass({
      render() {
        if (this.props.value === 1) {
          return <div>百分比%</div>
        } else if (this.props.value === 2) {
          return <div>指定数量</div>
        } else {
          return <div>禁止同步</div>
        }
      }
    }))
  }, {
    headerName: '过期解锁',
    field: 'AutoUnlock',
    width: 90,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(React.createClass({
      render() {
        return <Checkbox checked={this.props.value} disabled />
      }
    }))
  }, {
    headerName: '过期时间',
    field: 'DeadLine',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '已解锁',
    field: 'Unlock',
    width: 75,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(React.createClass({
      render() {
        if (this.props.value === '1') {
          return <Checkbox checked disabled />
        } else {
          return <Checkbox disabled />
        }
      }
    }))
  }, {
    headerName: '解锁时间',
    field: 'UnlockDate',
    width: 120
  }, {
    headerName: '解锁人',
    field: 'Unlocker',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true
  }]
const WangWangWang = React.createClass({
  getInitialState() {
    return {
      visible: false,
      title: DEFAULT_TITLE
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge > 0) {
      this.setState({
        visible: true,
        title: DEFAULT_TITLE
      }, () => {
        this._firstBlood(nextProps.conditions)
      })
    } else {
      this.setState({
        visible: false,
        title: DEFAULT_TITLE
      })
    }
  },
  modifyRowByID(id) {
    ZPost('XyCore/Inventory/HandInvUnLock', {ParentID: id}, ({s, m}) => {
      if (s !== 1) {
        message.error(m)
      } else {
        message.info('成功解除这批商品的上传锁定，系统之后会按全量进行自动同步', 3)
      }
      this.refreshDataCallback()
    })
  },
  handleDetail(id) {
    this.props.dispatch({ type: 'STOCK_INVLOCK_VIS_MOD_SET', payload: id })
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/Inventory/InvLockMainLst'
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
        rowData: d.LockMainLst,
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
              params.success(d.LockMainLst)
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
  refreshDataCallback() {
    this._firstBlood()
  },
  hideModal() {
    this.props.dispatch({ type: 'STOCK_INVLOCK_VIS_SET', payload: -1 })
  },
  handleAppend(lst) {
    if (lst && lst instanceof Array && lst.length) {
      const SkuIDLst = lst.map(x => x.ID)
      this.props.form.setFieldsValue({IDLst: SkuIDLst})
    }
  },
  checkNum(rule, value, callback) {
    if (!/^(0|[1-9][0-9]*)$/.test(value) && value !== undefined && value !== '') {
      callback('请填写整数')
    } else {
      callback()
    }
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleNewInvlock() {
    this.props.dispatch({ type: 'STOCK_INVLOCK_VIS_MOD_SET', payload: 0 })
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    return (
      <Modal title={title} visible={visible} onCancel={this.hideModal} footer='' confirmLoading={confirmLoading} width={1000} maskClosable={false}>
        <Toolbar2 />
        <div className={styles.topOperators}>
          <Button type='ghost' size='small' onClick={this.handleNewInvlock}>
            <Iconfa type='plus' style={{color: 'red'}} />&nbsp;新建库存锁定单
          </Button>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_invlock' }} columnDefs={columnDefs} grid={this} paged height={400} />
        <InvLockModify />
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.stock_invlock_vis,
  conditions: state.stock_invlock_conditions
}))(WangWangWang)
