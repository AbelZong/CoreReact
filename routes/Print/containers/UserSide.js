import React from 'react'
import {connect} from 'react-redux'
import appStyles from 'components/App.scss'
//import styles from './Print.scss'
import classNames from 'classnames'
import Scrollbar from 'components/Scrollbars/index'
const UserSide = React.createClass({
  getInitialState: function() {
    return {
      activeID: -1
    }
  },
  handleOpCp(e, {type, id}) {
    this.setState({
      activeID: id * 1
    }, () => {
      this.props.dispatch({type: 'PRINT_USER_TYPE_ACTIVE_SET', payload: type})
    })
  },
  render() {
    const {activeID} = this.state
    const {systypes} = this.props
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <Scrollbar autoHide>
            <div className={appStyles.box}>
              <div className={appStyles.header}>
                <span className={appStyles.name}>模板类型</span>
              </div>
              <div className={appStyles.inner}>
                <ul className={appStyles.items}>
                  {systypes.length ? systypes.map((x) => {
                    const CN = classNames({
                      [`${appStyles.active}`]: activeID === x.id
                    })
                    return (
                      <li className={CN} key={x.id} onClick={(e) => this.handleOpCp(e, x)}><span className={`${appStyles.name} cur`}>{x.name}</span></li>
                    )
                  }) : null}
                </ul>
              </div>
            </div>
          </Scrollbar>
        </div>
      </aside>
    )
  }
})

export default connect(state => ({
  systypes: state.print_systypes
}))(UserSide)
