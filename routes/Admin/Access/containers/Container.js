import React from 'react'
import {
  connect
} from 'react-redux'
import {
  endLoading
} from 'utils'
import styles from 'components/App.scss'
import Toolbar from './Toolbar'
import Main from './Main'
export default connect()(React.createClass({
  componentDidMount() {
    endLoading()
  },
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Toolbar />
        <Main />
      </div>
    )
  }
}))
