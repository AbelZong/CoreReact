import React from 'react'
import { Modal, Checkbox, Radio, Button, message, Rate, Icon } from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
import store from 'utils/store' //吃相不太好看
import styles from './Header.scss'
import NoticeAdd from './NoticeAdd'
import ZGrid from 'components/Grid/index'
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const levels = [
  { label: '严重', value: '3' },
  { label: '重要', value: '2' },
  { label: '普通', value: '1' },
  { label: '不重要', value: '0' }
]
const DEFLEVELS_KEY = 'msg.deflevels'
const DEFREADED_KEY = 'msg.defReaded'
let defLevels = store.get(DEFLEVELS_KEY, ['0', '1', '2', '3'])
let defReaded = store.get(DEFREADED_KEY, '0')
class LevelCellRenderer extends React.Component {
  render() {
    const value = Number(this.props.value)
    return <Rate disabled defaultValue={value} count={3} />
  }
}
class ReadCellRenderer extends React.Component {
  handleClick = (e) => {
    e.stopPropagation()
    const data = {ids: [this.props.data.Id]}
    ZPost('profile/msgread', data, (s, d, m) => {
      this.props.data.Isreaded = true
      this.props.refreshCell()
    })
  }
  render() {
    if (this.props.value) {
      return (
        <div className={styles.readedCell1}><Icon type='check-circle' /></div>
      )
    }
    return (
      <div className={styles.readedCell0} onClick={this.handleClick}><Icon type='check-circle-o' /></div>
    )
  }
}
const defColumns = [
  // {
  //   headerName: 'sdf',
  //   children: [{
  //     headerName: '业务员',
  //     field: 'creator_name',
  //     width: 80
  //   }]
  // },
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: true
  }, {
    headerName: '优先级',
    field: 'MsgLevel',
    width: 68,
    pinned: true,
    cellRendererFramework: LevelCellRenderer
  }, {
    headerName: '消息',
    field: 'Msg',
    width: 500
  }, {
    headerName: '发送时间',
    field: 'CreateDate',
    width: 120
  }, {
    headerName: '已阅',
    field: 'Isreaded',
    width: 40,
    cellRendererFramework: ReadCellRenderer
  }, {
    headerName: '阅读人',
    field: 'Reador',
    width: 70
  }, {
    headerName: '阅读时间',
    field: 'ReadDate',
    cellStyle: { 'text-align': 'center' },
    width: 150
  }]

const Notification = React.createClass({

  getInitialState() {
    return {
      searchLoading: false
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'NOTICE_VISIBEL_SET', payload: false })
  },
  handleLevel(checkedValues) {
    defLevels = checkedValues
    store.set(DEFLEVELS_KEY, checkedValues)
  },
  handleReaded(e) {
    defReaded = e.target.value
    store.set(DEFREADED_KEY, defReaded)
  },
  handleSearch() {
    if (!this.grid) {
      message.warn('请等待容器初始化')
      return
    }
    this._firstBlood()
  },
  handleBatch(event) {
    const nodeArr = this.grid.api.selectionController.selectedNodes
    var selectIds = []
    Object.keys(nodeArr).forEach((index) => {
      selectIds.push(nodeArr[index].data.Id)
    })
    const data = {ids: selectIds}
    ZPost('profile/msgread', data, (s, d, m) => {
      this.handleSearch()
    })
  },
  handleGridReady(grid) {
    this.grid = grid
    this._firstBlood()
  },
  _firstBlood(_data) {
    this.grid.showLoading()
    const data = Object.assign({
      readed: defReaded,
      levels: defLevels,
      pageSize: this.grid.getPageSize(),
      page: 1
    }, _data || {})
    ZPost('profile/msg', data, (s, d, m) => {
      this.grid.setDatasource({
        total: d.total,
        rowData: d.list,
        page: d.page,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = {
              readed: defReaded,
              levels: defLevels,
              pageSize: params.pageSize,
              page: params.page
            }
            ZPost('profile/msg', qData, (s, d, m) => {
              params.success(d.list)
            }, (m) => {
              params.fail(m)
            })
          }
        }
      })
    })
  },
  openNoticeAddWindow() {
    this.props.dispatch({ type: 'NOTICE_ADD_REVER' })
  },
  render() {
    const {visible} = this.props
    if (!visible && !this._firstVisibled) {
      this._firstVisibled = true
      return null
    }
    const {searchLoading} = this.state
    return (
      <Modal wrapClassName='modalTop' width='100%' title='通知' visible={visible} onCancel={this.hideModal} footer='' mname='NotificationModel'>
        <div className='clearfix'>
          <div className={styles.levels}>
            <CheckboxGroup options={levels} defaultValue={defLevels} onChange={this.handleLevel} />
          </div>
          <div className={styles.readed}>
            <RadioGroup onChange={this.handleReaded} defaultValue={defReaded}>
              <Radio key='-1' value=''>全部</Radio>
              <Radio key='1' value={1}>已读</Radio>
              <Radio key='0' value={0}>未读</Radio>
            </RadioGroup>
            <Button type='primary' onClick={this.handleSearch} loading={searchLoading}>检索</Button>
          </div>
        </div>
        <div className='clearfix mt10 mb10'>
          <div className=''>
            <Button type='primary' size='small' className='mr10' onClick={this.openNoticeAddWindow} >新消息</Button>
            <Button type='ghost' size='small' className='mr10' onClick={this.handleBatch}>批量已读</Button>
            <Button type='ghost' size='small' shape='circle-outline' icon='reload' onClick={this.handleSearch} />
          </div>
        </div>
        <ZGrid className={styles.damnGrid} onReady={this.handleGridReady} storeConfig={{ prefix: 'msg' }} paged height={398} columnDefs={defColumns} />
        <NoticeAdd research={this.handleSearch} />
      </Modal>
    )
  }
})

export default connect(state => ({
  visible: state.notice_visibel
}))(Notification)
