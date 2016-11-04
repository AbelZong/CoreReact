/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-21 08:37:27
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import classNames from 'classnames'
import {Icon as FAIcon} from 'components/Icon'
import styles from './Header.scss'

const Menu = React.createClass({
  getInitialState() {
    return {
      opened: false
    }
  },
  handleMenuClose() {
    if (this.state.opened) {
      window.removeEventListener('click', this.handleMenuClose, false)
      this.setState({
        opened: false
      })
    }
  },
  handleMenuOpen(e) {
    e.stopPropagation()
    if (this.state.opened) {
      this.handleMenuClose()
    } else {
      this.setState({
        opened: true
      })
      window.addEventListener('click', this.handleMenuClose, false)
    }
    return false
  },

  render() {
    const {name, children, ...props} = this.props
    const {opened} = this.state
    const CN = classNames(styles.menuA, styles.menuSev, {
      [`${styles.open}`]: opened
    })
    return (
      <div className={CN} onClick={this.handleMenuOpen}>
        <div {...props}>
          <div className={styles.a}>
            {name}<FAIcon type='caret-down' />
          </div>
          <div className={styles.down}>{children}</div>
        </div>
      </div>
    )
  }
})

export default Menu
