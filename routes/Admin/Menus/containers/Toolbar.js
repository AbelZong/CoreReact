import React from 'react'
import {connect} from 'react-redux'
import styles from './Menus.scss'

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
