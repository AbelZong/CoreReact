/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-28 17:09:19
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {startLoading} from 'utils'
import 'styles/core.scss'
import PageLock from 'components/ToolPages/Lock'
import PageAccessPermission from 'components/ToolPages/AccessPermission'

const PageLayout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  componentWillMount() {
    startLoading()
    this.props.dispatch({type: 'ENTERING_START'})
  },
  render() {
    const {children, locked, accessLevel} = this.props
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
  accessLevel: state.accessLevel
}))(PageLayout)
