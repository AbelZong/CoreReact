import React from 'react'
import {connect} from 'react-redux'
import {Icon} from 'antd'

export default connect()(React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    //const Yyah = this.props.api.gridOptionsWrapper.gridOptions //agGrid的吃相真不好看！
    //Yyah.grid.refreshRowData()
    const id = this.props.data.id
    console.log(id)
  },
  handleDeleteClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions //agGrid的吃相真不好看！
    Yyah.grid.deleteRowByID([this.props.data.id])
  },
  render() {
    return (
      <div className='operators'>
        <Icon type='edit' onClick={this.handleEditClick} />
        <Icon type='delete' onClick={this.handleDeleteClick} />
      </div>
    )
  }
}))
