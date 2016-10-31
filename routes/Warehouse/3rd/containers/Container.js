import React from 'react'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Main from './Main'
import ModifyModal from './ModifyModal'
import Toolbar from './Toolbar'
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
      </div>
    )
  }
}
export default Container
