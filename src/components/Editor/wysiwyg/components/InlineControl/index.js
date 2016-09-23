import React, { Component, PropTypes } from 'react'
import { RichUtils } from 'draft-js'
import Option from '../Option'
import { Dropdown, DropdownOption } from '../Dropdown'
import { getSelectionInlineStyle } from 'draftjs-utils'
import Icon from 'components/Icon/index'

//import styles from './styles.scss'

class InlineControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    inDropdown: PropTypes.bool
  };

  state: Object = {
    currentStyles: {}
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        currentStyles: getSelectionInlineStyle(editorState)
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentStyles: getSelectionInlineStyle(properties.editorState)
      })
    }
  }

  stylesMap: Array<Object> = [{
    value: 'BOLD',
    icon: 'bold'
  }, {
    value: 'ITALIC',
    icon: 'italic'
  }, {
    value: 'UNDERLINE',
    icon: 'underline'
  }, {
    value: 'STRIKETHROUGH',
    icon: 'strikethrough'
  }, {
    value: 'CODE',
    icon: 'text-width' //monospace
  }];

  _toggleInlineStyle: Function = (style: string): void => {
    const { editorState, onChange } = this.props
    const newState = RichUtils.toggleInlineStyle(
      editorState,
      style
    )
    if (newState) {
      onChange(newState, true)
    }
  };

  _renderInFlatList(currentStyles: string): Object {
    return (
      <div className='inline-wrapper'>
        {
          this.stylesMap.map((style, index) =>
            <Option
              key={index}
              value={style.value}
              onClick={this._toggleInlineStyle}
              active={currentStyles[style.value] === true}>
              <Icon type={style.icon} className='inline-icon' role='presentation' />
            </Option>
          )
        }
      </div>
    )
  }

  _renderInDropDown(currentStyles: string): Object {
    return (
      <Dropdown className='inline-dropdown' onChange={this._toggleInlineStyle}>
        <Icon type='bold' role='presentation' className='inline-icon' />
        {
          this.stylesMap.map((style, index) =>
            <DropdownOption
              key={index}
              value={style.value}
              className='inline-dropdownoption'
              active={currentStyles[style.value] === true}
            >
              <Icon type={style.icon} role='presentation' className='inline-icon' />
            </DropdownOption>)
          }
      </Dropdown>
    )
  }

  render(): Object {
    const { inDropdown } = this.props
    const { currentStyles } = this.state
    if (inDropdown) {
      return this._renderInDropDown(currentStyles)
    }
    return this._renderInFlatList(currentStyles)
  }
}

export default InlineControl
