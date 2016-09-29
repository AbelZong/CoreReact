import React from 'react'
import {connect} from 'react-redux'
import styles from './Shop.scss'

const Main = React.createClass({
  render() {
    return (
      <div className={styles.main}>
        引入 components/grid
      </div>
    )
  }
})

export default connect()(Main)
