import React from 'react'
import styles from 'components/App.scss'
import Scrollbar from 'components/Scrollbars/index'
import Main from './Main'

class DashBordContainer extends React.Component {
  render() {
    console.log(' -- app DashBord render...')
    return (
      <div className={styles.content}>
        <Scrollbar autoHide>
          <Main />
        </Scrollbar>
      </div>
    )
  }
}

export default DashBordContainer
// export default connect(state => ({
//
// }))(DashBordContainer)
