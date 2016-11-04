/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-13 17:37:30
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component, PropTypes } from 'react'
import { Dropdown, DropdownOption } from '../Dropdown'
import {
  fontFamilies,
  toggleInlineStyle,
  getSelectionCustomInlineStyle
} from 'draftjs-utils'
import styles from './styles.scss' // eslint-disable-line no-unused-vars

class FontFamilyControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object
  };

  state: Object = {
    currentFontFamily: undefined
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        currentFontFamily: getSelectionCustomInlineStyle(editorState, ['FONTFAMILY']).FONTFAMILY
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentFontFamily:
          getSelectionCustomInlineStyle(properties.editorState, ['FONTFAMILY']).FONTFAMILY
      })
    }
  }

  _toggleFontFamily: Function = (fontFamily: string) => {
    const { editorState, onChange } = this.props
    const newState = toggleInlineStyle(
      editorState,
      'fontFamily',
      fontFamily,
    )
    if (newState) {
      onChange(newState)
    }
  };

  render() {
    let { currentFontFamily } = this.state
    currentFontFamily = currentFontFamily && currentFontFamily.substring(11, currentFontFamily.length)
    return (
      <div className='fontfamily-wrapper'>
        <Dropdown
          className='fontfamily-dropdown'
          onChange={this._toggleFontFamily}
          optionWrapperClassName='fontfamily-optionwrapper'
        >
          <span className='fontfamily-placeholder'>
            {currentFontFamily || '字体'}
          </span>
          {
            fontFamilies.map((family, index) =>
              <DropdownOption
                className='fontfamily-option'
                active={currentFontFamily === family}
                value={`fontfamily-${family}`}
                key={index}
              >
                {family}
              </DropdownOption>)
          }
        </Dropdown>
      </div>
    )
  }
}

export default FontFamilyControl
