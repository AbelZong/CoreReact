import React from 'react'
import styles from 'components/App.scss'
import Scrollbar from 'components/Scrollbars/index'
import AdminMain from './AdminMain'

class Container extends React.Component {
  //componentWillMount() {
    //console.log(this.props.params)
  //}
  render() {
    return (
      <div className={styles.content}>
        <Scrollbar autoHide>
          <AdminMain />
        </Scrollbar>
      </div>
    )
  }
}

export default Container
