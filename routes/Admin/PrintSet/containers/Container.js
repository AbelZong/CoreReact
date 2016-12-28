import React from 'react'
import {connect} from 'react-redux'
import styles from 'components/App.scss'
import {endLoading} from 'utils'
import Wrapper from 'components/MainWrapper'
import Toolbar from './Toolbar'
import Main from './Main'

class Container extends React.Component {
  componentWillMount = () => {
    this.refreshDataCallback()
  }
  componentDidMount = () => {
  }
  componentWillUnmount = () => {
  }
  refreshDataCallback = () => {
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

export default connect()(Wrapper(Container))
