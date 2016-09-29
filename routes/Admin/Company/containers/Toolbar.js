import React from 'react'
import {connect} from 'react-redux'
import styles from './Shop.scss'

class Toolbar extends React.Component {

  render() {
    return (
      <div className={styles.toolbars}>
        toolbar
      </div>
    )
  }
}

export default connect()(Toolbar)
