/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Icon, Popconfirm} from 'antd'
import {connect} from 'react-redux'
import {Icon as Iconfa} from 'components/Icon'

const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.ID)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.ID])
  },
  handleShowLog() {
    this.props.dispatch({type: 'SHOP_API_LOG_id', payload: this.props.data.ID})
    // const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    // Yyah.grid.modifyPwdByID(this.props.data.ID)
  },
  render() {
    return (
      <div className='operators'>
        <Icon type='file-text' title='接口日志' onClick={this.handleShowLog} />
        <Icon type='edit' onClick={this.handleEditClick} title='编辑' />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})
export default connect()(OperatorsRender)
