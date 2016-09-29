import React from 'react'
import {connect} from 'react-redux'
import {Icon, Popconfirm} from 'antd'

export default connect()(React.createClass({
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
  handleSetDefedClick(e) {
    e.stopPropagation()
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
}))
