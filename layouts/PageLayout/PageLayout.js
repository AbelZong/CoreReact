import React from 'react'
import {connect} from 'react-redux'
import {startLoading} from 'utils'
import 'styles/core.scss'
import PageLock from 'components/ToolPages/Lock'
import PageEntering from 'components/ToolPages/Entering'
import PageAccessPermission from 'components/ToolPages/AccessPermission'

const PageLayout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  componentWillMount() {
    startLoading()
  },
  render() {
    const {children, locked, entering, accessLevel} = this.props
    if (entering) {
      return <PageEntering />
    }
    if (locked) {
      return <PageLock />
    }
    if (accessLevel < 1) {
      return <PageAccessPermission />
    }
    return children
  }
})

export default connect(state => ({
  locked: state.locked,
  entering: state.entering,
  accessLevel: state.accessLevel
}))(PageLayout)
