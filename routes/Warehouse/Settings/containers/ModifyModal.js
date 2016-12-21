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
import { Form, Row, Col, Modal, Tree, Popconfirm, Button, message } from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import {
  Icon as Iconfa
} from 'components/Icon'
const createForm = Form.create
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import NewPileModal from './NewPileModal'
import PileSkuModal from './PileSkuModal'
const DEFAULT_TITLE = '设置仓位'
const TreeNode = Tree.TreeNode

const gridOptions = {}
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
    width: 60
  }, {
    headerName: '仓位',
    field: 'PCode',
    cellStyle: {textAlign: 'center'},
    width: 150
  }, {
    headerName: '启用',
    field: 'Enable',
    cellStyle: {textAlign: 'center'},
    width: 60
  }, {
    headerName: '商品编码',
    field: 'SkuID',
    cellStyle: {textAlign: 'center'},
    width: 200
  } ]
const WangWangWang = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      submenu: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge.WarehouseID < 0) {
      this.setState({
        visible: false,
        confirmLoading: false
      })
    } else {
      this.setState({
        visible: true,
        confirmLoading: false
      }, () => {
        this._firstBlood(nextProps)
      })
    }
  },
  _firstBlood(_nextProps) {
    startLoading()
    const conditions = Object.assign({}, this.props.conditions || {}, _nextProps.conditions || {})
    const uri = 'Wmspile/getPileList'
    const data = Object.assign({wareid: _nextProps.doge.WarehouseID}, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      //if (this.state.submenu.length === 0) {
      this.setState({
        submenu: d.submenu,
        WarehouseID: _nextProps.doge.WarehouseID,
        WarehouseName: _nextProps.doge.WarehouseName,
        Type: _nextProps.doge.Type
      })
      //}
      this.grid.setDatasource({
        rowData: d.list,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({}, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.list)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    })).then(endLoading)
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  hideModal() {
    this.props.dispatch({type: 'WARE_PILE_SER_SET', payload: {}})
    this.props.dispatch({ type: 'WARE_PILE_VIS_SET', payload: {WarehouseID: -1} })
    this.props.form.resetFields()
  },
  handleSelect(e) {
    const c = e[0].split('-')
    const len = c.length
    const conditions = {
      area: len > -1 ? c[0] : '',
      row: len > 0 ? c[1] : '',
      col: len > 1 ? c[2] : '',
      storey: len > 2 ? c[3] : '',
      cell: len > 3 ? c[4] : ''
    }
    this.props.dispatch({type: 'WARE_PILE_SER_SET', payload: conditions})
  },
  _getIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length) {
      return ids
    }
    message.info('没有选中')
  },
  handleDelete() {
    const ids = this._getIDs()
    if (ids) {
      this.deleteRowByIDs(ids)
    }
  },
  deleteRowByIDs(ids) {
    this.grid.x0pCall(ZPost('Wmspile/DeletePile', {IDLst: ids}, () => {
      this.refreshDataCallback()
    }))
  },
  refreshDataCallback() {
    this._firstBlood({
      conditions: {},
      doge: {
        WarehouseID: this.state.WarehouseID,
        WarehouseName: this.state.WarehouseName,
        Type: this.state.Type
      }
    })
  },
  renderMenus(menu, idkey) {
    const idString = menu.parent !== '' ? menu.name + '' + menu.parent : ''
    const keyString = idkey !== '' ? idkey + '-' + menu.parent : menu.parent
    const t = true
    if (menu.children) {
      return (
        <TreeNode title={idString} key={keyString} isLeaf={t}>
          {menu.children.map((menu) => this.renderMenus(menu, keyString))}
        </TreeNode>
      )
    } else {
      return <TreeNode title={idString} key={keyString} />
    }
  },
  handleNewPile() {
    this.props.dispatch({type: 'WARE_PILE_NEW_VIS_SET', payload: {
      WarehouseID: this.state.WarehouseID,
      WarehouseName: this.state.WarehouseName,
      Type: this.state.Type
    }})
  },
  handlePileSKu() {
    this.props.dispatch({type: 'WARE_PILE_SKU_VIS_SET', payload: 1})
  },
  render() {
    const {visible, title, confirmLoading, submenu} = this.state
    const t = true
    return (
      <Modal title={title} visible={visible} footer='' onCancel={this.hideModal} confirmLoading={confirmLoading} width={1000} maskClosable={false}>
        <Row>
          <Col span={6}>
            <Tree style={{ width: 200 }} defaultExpandAll={t} autoExpandParent={t} onSelect={this.handleSelect} >
              {submenu.length > 0 ? submenu.map((x) => this.renderMenus(x, '')) : null}
            </Tree>
          </Col>
          <Col span={18}>
            <div className={styles.topOperators}>
              <Button type='ghost' onClick={this.handleNewPile} size='small'>
                <Iconfa type='plus' style={{color: 'red'}} />&nbsp;生成新仓位
              </Button>
              <Button type='ghost' onClick={this.handlePileSKu} style={{marginLeft: 15}} size='small'>
                &nbsp;仓位与商品关系管理
              </Button>
            </div>
            <ZGrid className={`${styles.zgrid} ${styles.rightPart}`} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_feninv' }} columnDefs={columnDefs} grid={this} height={500} >
              批量：
              <Popconfirm title='确定要删除选中吗？' onConfirm={this.handleDelete}>
                <Button type='ghost' size='small'>删除</Button>
              </Popconfirm>
            </ZGrid>
          </Col>
        </Row>
        <NewPileModal />
        <PileSkuModal />
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.ware_pile_vis,
  conditions: state.ware_pile_ser
}))(createForm()(WangWangWang))
