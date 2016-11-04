/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-14 09:52:39
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component, PropTypes } from 'react'
import styles from './styles.scss' // eslint-disable-line no-unused-vars
import classNames from 'classnames'

class Optioner extends Component {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    value: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool
  };

  _onClick: Function = () => {
    const { disabled, onClick, value } = this.props
    if (!disabled) {
      onClick(value)
    }
  };

  render() {
    const { children, className, activeClassName, active, disabled } = this.props
    return (
      <div
        className={classNames(
          'option-wrapper',
          className,
          {
            [`option-active ${activeClassName}`]: active,
            'option-disabled': disabled
          }
        )}
        onClick={this._onClick}>
        {children}
      </div>
    )
  }
}

export default Optioner
