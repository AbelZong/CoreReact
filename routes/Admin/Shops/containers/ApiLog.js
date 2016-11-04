/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated: HuaZhang
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './Shop.scss'
import { Modal, Tooltip } from 'antd'
import ZGrid from 'components/Grid/index'
import {ZGet} from 'utils/Xfetch'
// const InputGroup = Input.Group;

class LevelCellRenderer extends React.Component {
  render() {
    const value = this.props.value
    return <Tooltip placement='leftBottom' title={value}><span>{value}</span></Tooltip>
  }
}
const gridOptions = {}
const defColumns = [
  {
  //  headerName: '#',
  //  width: 30,
  //  checkboxSelection: true,
  //  cellStyle: {textAlign: 'center'},
  //  pinned: true
  //}, {
    headerName: 'ID',
    field: 'job_id',
    width: 80
  }, {
    headerName: '状态',
    field: 'enabled',
    cellStyle: {textAlign: 'center'},
    width: 70
  }, {
    headerName: '接口名称',
    field: 'api_name',
    width: 120
  }, {
    headerName: '接口',
    field: 'api_key',
    width: 120
  }, {
    headerName: '间隔（秒）',
    field: 'api_interval',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '最近执行时间',
    field: 'run_eof',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '耗时（秒）',
    field: 'run_times',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '处理量',
    field: 'total',
    cellStyle: {textAlign: 'center'},
    width: 90
  }, {
    headerName: '成功（次）',
    field: 'run_total',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '失败（次）',
    field: 'err_total',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '最近出错时间',
    field: 'err_timestamp',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '最近错误代码',
    field: 'err_message',
    cellStyle: {textAlign: 'center'},
    width: 300,
    cellRendererFramework: LevelCellRenderer
  }]
const ApiLog = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: '接口日志',
      disable: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.shopid > 0) {
      this.setState({
        visible: true
      })
      this._firstBlood(nextProps.shopid)
    } else {
      this.setState({
        visible: false
      })
    }
  },
  _firstBlood(_data) {
    const uri = 'Api/getAipLog'
    const data = {
      shopid: _data
    }
    ZGet(uri, data, ({d}) => {
      this.grid.setDatasource({
        rowData: d
      })
    })
  },
  handleOk() {
    this.props.dispatch({type: 'SHOP_API_LOG_id', payload: 0})
  },
  handleCancel() {
    this.props.dispatch({type: 'SHOP_API_LOG_id', payload: 0})
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  //renderFooter() {
    //return (
    //  <div />
      // <div className={styles.footer}>
      //   <div className='clearfix'>
      //     <Button type='primary' onClick={this.handleOk}>确认</Button>
      //   </div>
      // </div>
    //)
  //},
  render() {
    const {visible, title, confirmLoading} = this.state
    return (
      <Modal style={styles.main} title={title} visible={visible} onCancel={this.handleCancel} footer='' confirmLoading={confirmLoading} width={880}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'shop_apilog' }} columnDefs={defColumns} grid={this} height={500} />
      </Modal>
    )
  }
})
export default connect(state => ({
  shopid: state.shop_api_log_id
}))(ApiLog)
