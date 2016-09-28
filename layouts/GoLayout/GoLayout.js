import React from 'react'
import 'styles/core.scss'

const PageLayout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  render() {
    return this.props.children
  }
})

export default PageLayout
