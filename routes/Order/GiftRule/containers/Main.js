/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-30 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Button
} from 'antd'
import appStyles from 'components/App.scss'
import CollapseBtn from './CollapseBtn'
import Iconfa from 'components/Icon'
import Table from './Table'

class Main extends React.Component {
  handleCreate = (e) => {
    this.props.dispatch({type: 'ORDER_GIFTRULE_MODAL_1_VIS_SET', payload: 0})
  }
  render() {
    return (
      <div className={`${appStyles.main} flex-column`}>
        <div className={appStyles.toolbar}>
          <div className='flex-row'>
            <CollapseBtn />
            <div className={appStyles.tools}>
              <Button type='ghost' size='small' onClick={this.handleCreate}>
                <Iconfa type='plus' style={{color: 'red'}} />&nbsp;添加新规则
              </Button>
            </div>
          </div>
        </div>
        <Table ref='pikaqiu' />
      </div>
    )
  }
}
export default connect()(Main)
