import React from 'react'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Main from './Main'
import ModifyModal from './ModifyModal'
class Container extends React.Component {
  componentDidMount = () => {
    endLoading()
  }
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Main />
        <ModifyModal />
      </div>
    )
  }
}
export default Container
