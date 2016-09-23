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
