import React from 'react'
import {
  endLoading
} from 'utils'
import styles from 'components/App.scss'
import Scrollbar from 'components/Scrollbars/index'
import Main from './Main'
export default React.createClass({
  componentDidMount() {
    endLoading()
  },
  render() {
    return (
      <div className={styles.content}>
        <Scrollbar autoHide>
          <div className={styles.zHint}>
            <Main />
          </div>
        </Scrollbar>
      </div>
    )
  }
})
