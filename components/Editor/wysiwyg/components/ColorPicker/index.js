import React, { Component, PropTypes } from 'react'
import styles from './styles.scss' // eslint-disable-line no-unused-vars
import Option from '../Option'
import classNames from 'classnames'
import {
  colors,
  toggleInlineStyle,
  getSelectionCustomInlineStyle
} from 'draftjs-utils'
import colorIcon from 'styles/i/color.svg'
//import Icon from 'components/Icon/index'

class ColorPicker extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    hideModal: PropTypes.bool
  };

  state: Object = {
    currentColor: undefined,
    currentBgColor: undefined,
    showModal: false,
    currentStyle: 'color'
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        currentColor: getSelectionCustomInlineStyle(editorState, ['COLOR']).COLOR,
        currentBgColor: getSelectionCustomInlineStyle(editorState, ['BGCOLOR']).BGCOLOR
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    const newState = {}
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      newState.currentColor = getSelectionCustomInlineStyle(properties.editorState, ['COLOR']).COLOR
      newState.currentBgColor = getSelectionCustomInlineStyle(properties.editorState, ['BGCOLOR']).BGCOLOR
    }
    if (properties.hideModal && this.state.showModal) {
      newState.showModal = false
    }
    this.setState(newState)
  }

  _setCurrentStyleColor: Function = (): void => {
    this.setState({
      currentStyle: 'color'
    })
  };

  _setCurrentStyleBgcolor: Function = (): void => {
    this.setState({
      currentStyle: 'bgcolor'
    })
  };

  _toggleColor: Function = (color: string): void => {
    const { editorState, onChange } = this.props
    const { currentStyle } = this.state
    const newState = toggleInlineStyle(
      editorState,
      currentStyle,
      `${currentStyle}-${color}`
    )
    if (newState) {
      onChange(newState, true)
    }
  };

  _toggleModal: Function = (): void => {
    const showModal = !this.state.showModal
    this.setState({
      showModal
    })
  };

  _stopPropagation: Function = (event: Object): void => {
    event.stopPropagation()
  };

  renderModal: Function = (): Object => {
    const { currentColor, currentBgColor, currentStyle } = this.state
    const currentSelectedColor = (currentStyle === 'color') ? currentColor : currentBgColor
    return (
      <div
        className='colorpicker-modal'
        onClick={this._stopPropagation}
      >
        <span className='colorpicker-modal-header'>
          <span
            className={classNames(
              'colorpicker-modal-style-label',
              { 'colorpicker-modal-style-label-active': currentStyle === 'color' }
            )}
            onClick={this._setCurrentStyleColor}
          >
            文本色
          </span>
          <span
            className={classNames(
              'colorpicker-modal-style-label',
              { 'colorpicker-modal-style-label-active': currentStyle === 'bgcolor' }
            )}
            onClick={this._setCurrentStyleBgcolor}
          >
            背景色
          </span>
        </span>
        <span className='colorpicker-modal-options'>
          {
            colors.map((color, index) =>
              <Option
                value={color}
                key={index}
                className='colorpicker-option'
                activeClassName='colorpicker-option-active'
                active={currentSelectedColor === `${currentStyle}-${color}`}
                onClick={this._toggleColor}
              >
                <span
                  style={{ backgroundColor: color }}
                  className='colorpicker-cube'
                />
              </Option>)
          }
        </span>
      </div>
    )
  };

  render(): Object {
    const { showModal } = this.state
    return (
      <div className='colorpicker-wrapper'>
        <Option onClick={this._toggleModal}>
          <img src={colorIcon} role='presentation' className='colorpicker-icon' />
        </Option>
        {showModal ? this.renderModal() : undefined}
      </div>
    )
  }
}

export default ColorPicker
