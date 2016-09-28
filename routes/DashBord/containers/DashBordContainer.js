import React from 'react'
import styles from 'components/App.scss'
import Scrollbar from 'components/Scrollbars/index'
import Main from './Main'

class DashBordContainer extends React.Component {
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
}

export default DashBordContainer
