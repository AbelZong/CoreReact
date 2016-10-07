import React from 'react'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Toolbar from './Toolbar'
import Main from './Main'

class Container extends React.Component {
  componentDidMount = () => {
    endLoading()
  }
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Toolbar />
        <Main />
      </div>
    )
  }
}

export default Container
