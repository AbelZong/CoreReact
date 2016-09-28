import React from 'react'
import CustLayer from './Main/CustLayer'
import Page from './Main/Page'
import styles from './Main.scss'

export default React.createClass({
  render() {
    return (
      <div className={styles.main}>
        <Page />
        <CustLayer />
      </div>
    )
  }
})
