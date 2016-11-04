/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-04 09:16:35
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {Popconfirm} from 'antd'
import Prompt from 'components/Modal/Prompt'
const Main = React.createClass({
  // getInitialState() {
  //   return {
  //     coid: 0
  //   }
  // },
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
  handleGridReady(grid) {
    this.grid = grid
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Warehouse/Lst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      const mycoid = Number(d.coid)
      this.grid.setDatasource({
        rowData: d.Lst.map(x => ({...x, mycoid}))
      })
      this.props.dispatch({type: 'WAREHOUSE_SSNO_VIS_SET', payload: d.code})
    }))
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={{
          getRowClass: function(params) {
            return params.data.coid === params.data.mycoid ? 'darkRow' : styles.fengcang
          }
        }} storeConfig={{ prefix: 'goodgods.wx1' }} columnDefs={columnDefs} columnsFited grid={this}>
          <span className={styles.zc}>主仓标识</span>
        </ZGrid>
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.warehouse_filter_conditions
}))(Wrapper(Main))
const OperatorsRender = React.createClass({
  handleRelease(e) {
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.showLoading()
    ZPost('Warehouse/wareCancle', {id: this.props.data.id}, () => {
      this.props.data.enable = 3
      this.props.api.refreshRows([this.props.node])
    }).then(() => {
      this.props.api.gridOptionsWrapper.gridOptions.grid.grid.hideLoading()
    })
  },
  handleCancel() {
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.showLoading()
    ZPost('Warehouse/wareGiveUp', {id: this.props.data.id}, () => {
      this.props.data.enable = 0
      this.props.api.refreshRows([this.props.node])
    }).then(() => {
      this.props.api.gridOptionsWrapper.gridOptions.grid.grid.hideLoading()
    })
  },
  handleConfirm() {
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.showLoading()
    ZPost('Warehouse/passThird', {id: this.props.data.id}, () => {
      this.props.data.enable = 2
      this.props.api.refreshRows([this.props.node])
    }).then(() => {
      this.props.api.gridOptionsWrapper.gridOptions.grid.grid.hideLoading()
    })
  },
  handleMyRemark() {
    Prompt({
      onPrompt: ({value}) => {
        return new Promise((resolve, reject) => {
          ZPost('Warehouse/editRemark', {
            remark: value,
            id: this.props.data.id
          }, () => {
            resolve()
            this.props.data.myremark = value
            this.props.api.refreshRows([this.props.node])
          }, reject)
        })
      }
    })
  },
  render() {
    const {mycoid, coid, enable} = this.props.data
    let btn = null
    switch (enable) {
      case 1: {
        if (mycoid === coid) {
          btn = (
            <Popconfirm onConfirm={this.handleConfirm} title='确定要审核通过吗？'>
              <a>审核通过</a>
            </Popconfirm>
          )
        } else {
          btn = (
            <Popconfirm onConfirm={this.handleCancel} title='确定要取消申请吗？'>
              <a>取消申请</a>
            </Popconfirm>
          )
        }
        break
      }
      case 2: {
        btn = (
          <Popconfirm onConfirm={this.handleRelease} title='确定要终止关系吗？'>
            <a>终止合作</a>
          </Popconfirm>
        )
        break
      }
    }
    return (
      <div className='operators'>
        {enable === 1 || enable === 2 ? <a onClick={this.handleMyRemark} className='mr5' title='修改备注'>备注</a> : null }
        &emsp;{btn}
      </div>
    )
  }
})
// const NoteRender = React.createClass({
//   handleClick(e) {
//     e.stopPropagation()
//     const checked = e.target.checked
//     this.props.api.gridOptionsWrapper.gridOptions.grid.grid.x0pCall(ZPost('/', {
//       IDLst: [this.props.data.ID],
//       Enable: checked
//     }, () => {
//       this.props.data. = checked
//       this.props.refreshCell()
//     }))
//   },
//   render() {
//     return <Icon type='edit' onClick={this.handleClick} />
//   }
// })
const columnDefs = [
  {
    headerName: 'ID',
    field: 'id',
    cellStyle: {textAlign: 'center'},
    enableSorting: true,
    width: 60
  }, {
  //   headerName: '仓储关系',
  //   field: 'warename',
  //   width: 150,
  //   cellRenderer: function(params) {
  //     console.log(params)
  //     return '1'
  //   }
  // }, {
    headerName: '对方商家名',
    field: 'itname',
    width: 150,
    suppressSorting: true
  }, {
    headerName: '我的备注',
    field: 'myremark',
    width: 220,
    suppressSorting: true
  }, {
    headerName: '对方备注',
    field: 'itremark',
    width: 220,
    suppressSorting: true
  }, {
    headerName: '变更时间',
    field: 'mdate',
    width: 130
  }, {
    headerName: '状态',
    field: 'enable',
    width: 60,
    cellStyle: {textAlign: 'center'},
    cellRenderer: function({value}) {
      switch (value) {
        case 1: { return '<span class="dotting" style="color: #7DFF7D">申请中</span>' }
        case 2: { return '<span style="color: #2db7f5">生效</span>' }
        case 3: { return '<small>已终止</small>' }
        default: { return '<del>-</del>' }
      }
    },
    suppressSorting: true
  }, {
    headerName: '操作',
    width: 180,
    cellRendererFramework: OperatorsRender,
    suppressSorting: true
  }]
