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
import {
  Button,
  message,
  Dropdown,
  Menu
} from 'antd'
import appStyles from 'components/App.scss'
import CollapseBtn from './CollapseBtn'
import Iconfa from 'components/Icon'
import Table from './Table'

class Main extends React.Component {
  handleCreateNew = () => {
  }
  render() {
    return (
      <div className={`${appStyles.main} flex-column`}>
        <div className={appStyles.toolbar}>
          <div className='flex-row'>
            <CollapseBtn />
            <div className={appStyles.tools}>
              <Dropdown overlay={<Menu onClick={this.handleNewEvent}>
                <Menu.Item key='1' title='一般用于手工添加线下订单'><Iconfa type='plus' style={{color: 'red'}} />&nbsp;&nbsp;手工下单</Menu.Item>
                <Menu.Item key='2'><Iconfa type='upload' />&nbsp;&nbsp;导入订单</Menu.Item>
                <Menu.Divider />
                <Menu.Item key='3' title='授权店铺订单接口会自动下载到系统,不需要手工操作`个别情况需要手工操作`可重复下载'>&nbsp;&nbsp;手工下载授权店铺订单[按单号]</Menu.Item>
                <Menu.Item key='4' title='授权店铺订单接口会自动下载到系统,不需要手工操作`个别情况需要手工操作`可重复下载'>&nbsp;&nbsp;手工下载授权店铺订单[按时间]</Menu.Item>
                <Menu.Divider />
                <Menu.Item key='5' disabled>&nbsp;&nbsp;授权店铺订单自动下载到系统，无须操作</Menu.Item>
              </Menu>}>
                <Button type='ghost' size='small'>
                  <Iconfa type='plus' style={{color: 'red'}} />&nbsp;新增订单&nbsp;&nbsp;<Iconfa type='caret-down' />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
        <Table ref='pikaqiu' />
      </div>
    )
  }
}
export default connect()(Main)
