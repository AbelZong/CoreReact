import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import styles from './styles.scss' // eslint-disable-line no-unused-vars

class DropDownOption extends Component {

  static propTypes = {
    children: PropTypes.any,
    onSelect: PropTypes.func,
    setHighlighted: PropTypes.func,
    index: PropTypes.number,
    value: PropTypes.any,
    active: PropTypes.bool,
    highlighted: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    highlightedClassName: PropTypes.string
  };

  _onClick: Function = (): void => {
    const { onSelect, value } = this.props
    if (onSelect) {
      onSelect(value)
    }
  };

  _setHighlighted: Function = (): void => {
    const { setHighlighted, index } = this.props
    setHighlighted(index)
  };

  _resetHighlighted: Function = (): void => {
    const { setHighlighted } = this.props
    setHighlighted(-1)
  };

  render(): Object {
    const {
      children,
      active,
      highlighted,
      className,
      activeClassName,
      highlightedClassName
     } = this.props
    return (
      <li
        className={classNames(
            'dropdownoption-default',
            className,
            { [`dropdownoption-active ${activeClassName}`]: active,
              [`dropdownoption-highlighted ${highlightedClassName}`]: highlighted
            })
        }
        onMouseEnter={this._setHighlighted}
        onMouseLeave={this._resetHighlighted}
        onClick={this._onClick}>
        {children}
      </li>
    )
  }
}

export default DropDownOption
