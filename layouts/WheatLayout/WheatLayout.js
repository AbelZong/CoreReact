import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import Header from 'components/Header'
import Aside from 'components/Aside'
import styles from './WheatLayout.scss'
import 'styles/core.scss'
import {FetchModal} from 'components/Modal/index'
import {startLoading, endLoading} from 'utils'
import {ZGet} from 'utils/Xfetch'
import Navs from 'components/Header/Navs'
import PageLock from 'components/ToolPages/Lock'
import PageEntering from 'components/ToolPages/Entering'

const WheatLayout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

//fuck this
  // childContextTypes: {
  //   location: React.PropTypes.object
  // },
  // getChildContext() {
  //   return { location: this.props.location }
  // },
//fuck end
  componentWillMount() {
    startLoading()
    return ZGet('profile/refresh', (s, d, m) => {
      this.props.dispatch({ 'type': 'ENTERING_SET', payload: false })
      if (d.isLocked && this.props.locked) {
        this.props.dispatch({ type: 'LOCKED_SET', payload: true })
      }
      this.props.dispatch({ type: 'PERMISSIONMENUS_SET', payload: d.permissionMenus })
      this.props.dispatch({ type: 'USER_SET', payload: d.user })
    }, (m, s, d) => {
      if (s !== -10086) {
        this.context.router.push('/go/login')
      } else {
        endLoading()
      }
    })
  },
  render() {
    const {children, collapse, locked, entering, mainFixed} = this.props
    if (entering) {
      return <PageEntering />
    }
    if (locked) {
      return (
        <PageLock />
      )
    }
    const CN = classNames(styles.bbqZH, {
      collapse
    }, {
      mainFixed
    })
    return (
      <div className={CN}>
        <div className={styles.ZHMainHeader}>
          <Header />
        </div>
        <div className={styles.ZHBody}>
          <aside className={styles.ZHAside}>
            <Aside />
          </aside>
          <section className={styles.ZHSesion}>
            <div className={styles.biuNavs}><Navs /></div>
            <div className={styles.biuChildren}>{children}</div>
          </section>
        </div>
        <FetchModal />
      </div>
    )
  }
})
export default connect(state => ({
  locked: state.locked,
  collapse: state.collapse,
  mainFixed: state.mainFixed,
  entering: state.entering
}))(WheatLayout)
