import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import styles from 'components/App.scss'

import MainWrapper from 'components/MainWrapper'

import Side from './Side'
import Main from './Main'

class TestContainer extends React.Component {
  componentWillMount = () => {
  }
  componentDidMount = () => {
  }
  componentWillUnmount = () => {
  }
  refreshDataCallback = () => {
    console.warn('getFirst Data')
  }
  render() {
    const CN = classNames(styles.content)
    return (
      <div className={CN}>
        <Side />
        <Main />
      </div>
    )
  }
}

export default connect(state => ({collapse: state.ShopCollapseA}))(MainWrapper(TestContainer))
