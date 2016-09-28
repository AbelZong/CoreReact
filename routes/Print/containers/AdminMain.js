import React from 'react'
//import classNames from 'classnames'
import {connect} from 'react-redux'
import {Button, message} from 'antd'
import appStyles from 'components/App.scss'
//import styles from './Print.scss'
import AdminCollapseBtn from './AdminCollapseBtn'
import AdminTable from './AdminTable'

class AdminPanel extends React.Component {
  state = {
    data: null
  }
  handleCreateNew = () => {
    const {activeTypeID} = this.props
    if (activeTypeID < 1) {
      return message.info('请先选择左侧【模板类型】')
    }
    const win = window.open(`/page/print/modify?type=${activeTypeID}`)
    const loop = setInterval(() => {
      if (win.closed) {
        clearInterval(loop)
        this.refs.pikaqiu.getWrappedInstance().refreshRowData()
      }
    }, 1000)
  }
  render() {
    return (
      <div className={`${appStyles.main} flex-column`}>
        <div className={appStyles.toolbar}>
          <div className='flex-row'>
            <AdminCollapseBtn />
            <div className={appStyles.tools}>
              <div className='pull-right'>
                <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增预设</Button>
              </div>
            </div>
          </div>
        </div>
        <AdminTable ref='pikaqiu' />
      </div>
    )
  }
}

export default connect(state => ({
  activeTypeID: state.print_admin_type_active
}))(AdminPanel)
