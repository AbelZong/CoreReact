import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import styles from './styles.scss' // eslint-disable-line no-unused-vars

class Dropdown extends Component {

  static propTypes = {
    children: PropTypes.array,
    onChange: PropTypes.func,
    className: PropTypes.string,
    optionWrapperClassName: PropTypes.string
  };

  state: Object = {
    expanded: false,
    highlighted: -1
  };

  _onChange: Function = (value: any): void => {
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
    this._toggleExpansion()
  };

  _toggleExpansion: Function = (): void => {
    const expanded = !this.state.expanded
    this.setState({
      highlighted: -1,
      expanded
    })
  };

  _collapse: Function = (): void => {
    this.setState({
      highlighted: -1,
      expanded: false
    })
  };

  _setHighlighted: Function = (highlighted: number): void => {
    this.setState({
      highlighted
    })
  };

  _onKeyDown: Function = (event: Object): void => {
    event.preventDefault()
    const { children } = this.props
    const { expanded, highlighted } = this.state
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      if (!expanded) {
        this._toggleExpansion()
      } else {
        this._setHighlighted((highlighted === children[1].length - 1) ? 0 : highlighted + 1)
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      this._setHighlighted(highlighted <= 0 ? children[1].length - 1 : highlighted - 1)
    } else if (event.key === 'Enter') {
      if (highlighted > -1) {
        this._onChange(this.props.children[1][highlighted].props.value)
      } else {
        this._toggleExpansion()
      }
    } else if (event.key === 'Escape') {
      this._collapse()
    }
  };

  render() {
    const { children, className, optionWrapperClassName } = this.props
    const { expanded, highlighted } = this.state
    const options = children.slice(1, children.length)
    return (
      <div
        tabIndex='0'
        onKeyDown={this._onKeyDown}
        className={`dropdown-wrapper ${className}`}
        onMouseLeave={this._collapse}
      >
        <a
          className='dropdown-selectedtext'
          onMouseEnter={this._toggleExpansion}>
          {children[0]}
          <div
            className={classNames({
              'dropdown-carettoclose': expanded,
              'dropdown-carettoopen': !expanded
            })}
          />
        </a>
        {expanded ? (
          <ul
            className={`dropdown-optionwrapper ${optionWrapperClassName}`}
          >
          {
            React.Children.map(options, (option, index) => {
              const temp = React.cloneElement(
                option, {
                  onSelect: this._onChange,
                  highlighted: highlighted === index,
                  setHighlighted: this._setHighlighted,
                  index
                })
              return temp
            })
          }
          </ul>
        ) : undefined}
      </div>
    )
  }
}

export default Dropdown
