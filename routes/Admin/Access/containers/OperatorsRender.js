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
  render() {
    return (
      <div className='operators'>
        <Icon type='edit' onClick={this.handleEditClick} title='编辑' />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' />
        </Popconfirm>
      </div>
    )
  }
})
export default connect()(OperatorsRender)
