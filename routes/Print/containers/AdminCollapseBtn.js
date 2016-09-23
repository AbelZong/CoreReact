import React from 'react'
import {connect} from 'react-redux'
import {Icon} from 'antd'
import appStyles from 'components/App.scss'

export default connect(state => ({
  collapse: state.print_admin_collapse
}))(React.createClass({
  handleCollapseChange() {
    this.props.dispatch({type: 'PRINT_ADMIN_COLLAPSE_REVER'})
  },
  render() {
    const {collapse} = this.props
    const type = collapse ? 'double-right' : 'double-left'
    return (
      <div className={appStyles.collapseBtn}>
        <Icon type={type} className='cur' onClick={this.handleCollapseChange} />
      </div>
    )
  }
}))
