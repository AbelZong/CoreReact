/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-01 18:16:27
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import {injectReducers} from 'store/reducers'
const reducers = require('./modules/reducers').default

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.any.isRequired,
    store: PropTypes.object.isRequired
  }
  componentWillMount() {
    //holy shit, what happended?! will todo sth
    injectReducers(this.props.store, reducers)
  }
  render() {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <Router history={history} children={routes} />
      </Provider>
    )
  }
}

export default AppContainer
