import React from 'react'
import {
  endLoading
} from 'utils'
import styles from 'components/App.scss'
import Toolbar from './Toolbar'
import Main from './Main'
import ModifyModal from './ModifyModal'
import PwdModal from './PwdModal'

class Container extends React.Component {
  componentDidMount = () => {
    endLoading()
  }
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Toolbar />
        <Main />
        <ModifyModal />
        <PwdModal />
      </div>
    )
  }
}

export default Container
