import React from 'react'
import styles from './AccessPermission.scss'

export default React.createClass({
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.center}>
          <h5>Warning</h5>
          <div>抱歉，无法访问<em>!</em></div>
          <div><a href='/' target='_blank'>去登入</a></div>
        </div>
      </div>
    )
  }
})
