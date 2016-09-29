import React, {createClass} from 'react'
import {connect} from 'react-redux'
import styles from 'components/App.scss'
import classNames from 'classnames'
import UserSide from './UserSide'
import UserMain from './UserMain'
import Wrapper from 'components/MainWrapper'
import {ZGet} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'

export default connect(state => ({
  collapse: state.print_admin_collapse
}))(Wrapper(createClass({
  componentWillMount() {
    this.refreshDataCallback()
  },
  refreshDataCallback() {
    startLoading()
    ZGet({
      uri: 'print/tpl/getallsystypes',
      success: (s, d, m) => {
        this.props.dispatch({type: 'SYSTYPES_SET', payload: d || []})
      }
    }).then(endLoading)
  },
  render() {
    const collapse = this.props.collapse
    const CN = classNames(styles.content, 'flex-row', {
      [`${styles.collapse}`]: collapse
    })
    return (
      <div className={CN}>
        <UserSide />
        <UserMain />
      </div>
    )
  }
})))
