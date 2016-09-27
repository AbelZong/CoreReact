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
