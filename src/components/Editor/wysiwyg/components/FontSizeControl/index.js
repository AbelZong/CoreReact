import React, { Component, PropTypes } from 'react'
import { Dropdown, DropdownOption } from '../Dropdown'
import {
  fontSizes,
  toggleInlineStyle,
  getSelectionCustomInlineStyle
} from 'draftjs-utils'
//import fontSizeIcon from '../../../../images/font-size.svg';
import styles from './styles.scss' // eslint-disable-line no-unused-vars
import Icon from 'components/Icon/index'

class FontSizeControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object
  };

  state: Object = {
    currentFontSize: undefined
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        currentFontSize:
          getSelectionCustomInlineStyle(editorState, ['FONTSIZE']).FONTSIZE
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentFontSize:
          getSelectionCustomInlineStyle(properties.editorState, ['FONTSIZE']).FONTSIZE
      })
    }
  }

  _toggleFontSize: Function = (fontSize: number) => {
    const { editorState, onChange } = this.props
    const fontSizeStr = fontSize && fontSize.toString() || ''
    const newState = toggleInlineStyle(
      editorState,
      'fontSize',
      fontSizeStr,
    )
    if (newState) {
      onChange(newState)
    }
  };

  render() {
    let { currentFontSize } = this.state
    currentFontSize = currentFontSize && Number(currentFontSize.substring(9, currentFontSize.length))
    return (
      <div className='fontsize-wrapper'>
        <Dropdown className='fontsize-dropdown' onChange={this._toggleFontSize}>
          {currentFontSize ? <span>{currentFontSize}</span>
          : <Icon type='text-height' className='fontsize-icon' role='presentation' />
          }
          {
            fontSizes.map((size, index) =>
              <DropdownOption
                className='fontsize-option'
                active={currentFontSize === size}
                value={`fontsize-${size}`}
                key={index}
              >
                {size}
              </DropdownOption>
            )
          }
        </Dropdown>
      </div>
    )
  }
}

export default FontSizeControl
