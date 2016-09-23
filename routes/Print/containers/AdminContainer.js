import React, {createClass} from 'react'
import {connect} from 'react-redux'
import styles from 'components/App.scss'
import classNames from 'classnames'
import AdminSide from './AdminSide'
import AdminMain from './AdminMain'
  //
  // <AdminMain />

export default connect(state => ({
  collapse: state.print_admin_collapse
}))(createClass({
  render() {
    const collapse = this.props.collapse
    const CN = classNames(styles.content, 'flex-row', {
      [`${styles.collapse}`]: collapse
    })
    return (
      <div className={CN}>
        <AdminSide />
        <AdminMain />
      </div>
    )
  }
}))
