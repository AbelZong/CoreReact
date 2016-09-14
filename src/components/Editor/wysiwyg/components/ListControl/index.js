import React, { Component, PropTypes } from 'react'
import { Dropdown, DropdownOption } from '../Dropdown'
import { RichUtils } from 'draft-js'
import { changeDepth, getSelectedBlocksType } from 'draftjs-utils'
import Option from '../Option'
import styles from './styles.scss'
import Icon from 'components/Icon/index'

class ListControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    inDropdown: PropTypes.bool
  };

  state: Object = {
    currentBlockType: 'unstyled'
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(editorState)
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(properties.editorState)
      })
    }
  }

  _onDropdownChange: Function = (value: string): void => {
    if (value === 'unordered-list-item' || value === 'ordered-list-item') {
      this._toggleBlockType(value)
    } else if (value === 'indent') {
      this._indent()
    } else {
      this._outdent()
    }
  };

  _toggleBlockType: Function = (blockType): void => {
    const { onChange, editorState } = this.props
    const newState = RichUtils.toggleBlockType(
      editorState,
      blockType
    )
    if (newState) {
      onChange(newState, true)
    }
  };

  _adjustDepth: Function = (adjustment): void => {
    const { onChange, editorState } = this.props
    const newState = changeDepth(
      editorState,
      adjustment,
      4,
    )
    if (newState) {
      onChange(newState, true)
    }
  };

  _indent: Function = (): void => {
    this._adjustDepth(1)
  };

  _outdent: Function = (): void => {
    this._adjustDepth(-1)
  };

  _renderInFlatList(currentBlockType: string): Object {
    return (
      <div className='list-wrapper'>
        <Option
          value='unordered-list-item'
          onClick={this._toggleBlockType}
          active={currentBlockType === 'unordered-list-item'}>
          <Icon type='list-ul' className='list-icon' role='presentation' />
        </Option>
        <Option
          value='ordered-list-item'
          onClick={this._toggleBlockType}
          active={currentBlockType === 'ordered-list-item'}>
          <Icon type='list-ol' className='list-icon' role='presentation' />
        </Option>
        <Option onClick={this._indent}>
          <Icon type='indent' className='list-icon' role='presentation' />
        </Option>
        <Option onClick={this._outdent}>
          <Icon type='outdent' className='list-icon' role='presentation' />
        </Option>
      </div>
    )
  }

  _renderInDropDown(currentBlockType: string): Object {
    return (
      <Dropdown
        className='list-dropdown'
        onChange={this._onDropdownChange}
      >
        <Icon type='list-ul' className='list-icon' role='presentation' />
        <DropdownOption
          value='unordered-list-item'
          className='list-dropdownOption'
          active={currentBlockType === 'unordered-list-item'}
        >
          <Icon type='list-ul' className='list-icon' role='presentation' />
        </DropdownOption>
        <DropdownOption
          value='ordered-list-item'
          className='list-dropdownOption'
          active={currentBlockType === 'ordered-list-item'}
        >
          <Icon type='list-ol' className='list-icon' role='presentation' />
        </DropdownOption>
        <DropdownOption
          value='indent'
          className='list-dropdownOption'
        >
          <Icon type='indent' className='list-icon' role='presentation' />
        </DropdownOption>
        <DropdownOption
          value='outdent'
          className='list-dropdownOption'
        >
          <Icon type='outdent' className='list-icon' role='presentation' />
        </DropdownOption>
      </Dropdown>
    )
  }

  render(): Object {
    const { inDropdown } = this.props
    const { currentBlockType } = this.state
    if (inDropdown) {
      return this._renderInDropDown(currentBlockType)
    }
    return this._renderInFlatList(currentBlockType)
  }
}

export default ListControl
