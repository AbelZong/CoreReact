/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import {
  endLoading
} from 'utils'
import styles from 'components/App.scss'
import Wrapper from 'components/MainWrapper'
import Toolbar from './Toolbar'
import Main from './Main'
import ApiLog from './ApiLog'

class Container extends React.Component {
  componentWillMount = () => {
    if (this.props.location.query.code !== undefined) {
      window.close()
    }
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
        <Toolbar ref='mytoolbar' />
        <Main />
        <ApiLog />
      </div>
    )
  }
}

export default connect()(Wrapper(Container))
