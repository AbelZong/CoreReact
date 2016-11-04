/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-28 17:09:19
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {Icon, Popconfirm} from 'antd'

export default connect()(React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions //agGrid的吃相真不好看！
    Yyah.grid.modifyRowByID(this.props.data.id)
  },
  handleDeleteClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions //agGrid的吃相真不好看！
    Yyah.grid.deleteRowByIDs([this.props.data.id])
  },
  render() {
    return (
      <div className='operators'>
        <Icon type='edit' onClick={this.handleEditClick} />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Icon type='delete' />
        </Popconfirm>
      </div>
    )
  }
}))
