/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-11 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {Button, message} from 'antd'
import appStyles from 'components/App.scss'
import CollapseBtn from './CollapseBtn'
import Table from './Table'

class AdminPanel extends React.Component {
  state = {
    data: null
  }
  handleCreateNew = () => {
  }
  render() {
    return (
      <div className={`${appStyles.main} flex-column`}>
        <div className={appStyles.toolbar}>
          <div className='flex-row'>
            <CollapseBtn />
            <div className={appStyles.tools}>
              <div className='pull-right'>
                <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增预设</Button>
              </div>
            </div>
          </div>
        </div>
        <Table ref='pikaqiu' />
      </div>
    )
  }
}
export default connect(state => ({
  activeTypeID: state.print_admin_type_active
}))(AdminPanel)
