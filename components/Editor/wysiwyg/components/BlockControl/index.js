import React, { Component, PropTypes } from 'react'
import { Dropdown, DropdownOption } from '../Dropdown'
import { getSelectedBlocksType } from 'draftjs-utils'
import { RichUtils } from 'draft-js'
import styles from './styles.scss' // eslint-disable-line no-unused-vars

class BlockControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object
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

  blocksTypes: Array<Object> = [
    { label: '普通', style: 'unstyled' },
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: '引用', style: 'blockquote' }
  ];

  _toggleBlockType: Function = (blockType: string) => {
    const { editorState, onChange } = this.props
    const newState = RichUtils.toggleBlockType(
      editorState,
      blockType
    )
    if (newState) {
      onChange(newState)
    }
  };

  render() {
    let { currentBlockType } = this.state
    if (currentBlockType === 'unordered-list-item' || currentBlockType === 'ordered-list-item') {
      currentBlockType = 'unstyled'
    }
    const currentBlockData = this.blocksTypes.filter((blk) => blk.style === currentBlockType)
    const currentLabel = currentBlockData && currentBlockData[0] && currentBlockData[0].label
    return (
      <div className='block-wrapper'>
        <Dropdown
          className='block-dropdown'
          onChange={this._toggleBlockType}
        >
          <span>{currentLabel}</span>
          {
            this.blocksTypes.map((block, index) =>
              <DropdownOption
                active={currentBlockType === block.style}
                value={block.style}
                key={index}
              >
                {block.label}
              </DropdownOption>)
          }
        </Dropdown>
      </div>
    )
  }
}

export default BlockControl
