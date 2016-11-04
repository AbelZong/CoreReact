/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-29 14:19:00
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {Button, message} from 'antd'
import appStyles from 'components/App.scss'
import AdminCollapseBtn from './AdminCollapseBtn'
import UserTable from './UserTable'

class UserMain extends React.Component {
  handleCreateNew = () => {
    const {activeTypeID} = this.props
    if (activeTypeID < 1) {
      return message.info('请先选择左侧【模板类型】')
    }
    const win = window.open(`/page/print/modify?type=${activeTypeID}&my_id=0`)
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
                <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增模板</Button>
              </div>
            </div>
          </div>
        </div>
        <UserTable ref='pikaqiu' />
      </div>
    )
  }
}

export default connect(state => ({
  activeTypeID: state.print_user_type_active
}))(UserMain)
