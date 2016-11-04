/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-30 11:17:13
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Icon, Popconfirm} from 'antd'

export default React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.id)
  },
  handleDeleteClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.id])
  },
  handleSetDefedClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.setDefedByID(this.props.data.id)
  },
  renderBtn() {
    const defed = this.props.data.defed
    if (defed) {
      return <Icon type='check-square' />
    }
    return <Icon type='check-square-o' title='设为默认' onClick={this.handleSetDefedClick} />
  },
  render() {
    return (
      <div className='operators'>
        {this.renderBtn()}
        <Icon type='edit' onClick={this.handleEditClick} />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Icon type='delete' />
        </Popconfirm>
      </div>
    )
  }
})
