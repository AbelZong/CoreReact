import React, { Component, PropTypes } from 'react'
import { Entity, RichUtils, EditorState, Modifier } from 'draft-js'
import {
  getSelectionText,
  getEntityRange,
  getSelectionEntity
} from 'draftjs-utils'
import Option from '../Option'
//import link from '../../../../images/link.svg';
//import unlink from '../../../../images/unlink.svg';
import styles from './styles.scss' // eslint-disable-line no-unused-vars
import Icon from 'components/Icon/index'

class LinkControl extends Component {

  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    hideModal: PropTypes.bool
  };

  state: Object = {
    showModal: false,
    linkTarget: '',
    linkTitle: ''
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        currentEntity: getSelectionEntity(editorState)
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    const newState = {}
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      newState.currentEntity = getSelectionEntity(properties.editorState)
    }
    if (properties.hideModal && this.state.showModal) {
      newState.showModal = false
    }
    this.setState(newState)
  }

  _toggleLinkModal: Function = (): void => {
    const { editorState } = this.props
    const { showModal, currentEntity } = this.state
    const newState = {}
    newState.showModal = !showModal
    if (newState.showModal) {
      newState.entity = currentEntity
      const entityRange = currentEntity && getEntityRange(editorState, currentEntity)
      newState.linkTarget = currentEntity && Entity.get(currentEntity).get('data').url
      newState.linkTitle = (entityRange && entityRange.text) || getSelectionText(editorState)
    }
    this.setState(newState)
  };

  _updateLinkTitle: Function = (event: Object): void => {
    this.setState({
      linkTitle: event.target.value
    })
  };

  _updateLinkTarget: Function = (event: Object): void => {
    this.setState({
      linkTarget: event.target.value
    })
  };

  _addLink: Function = (): void => {
    const { editorState, onChange } = this.props
    const { linkTitle, linkTarget, currentEntity } = this.state
    let selection = editorState.getSelection()

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity)
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end
      })
    }
    const entityKey = Entity.create('LINK', 'MUTABLE', {
      title: linkTitle,
      url: linkTarget
    })
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'), true)
    this._toggleLinkModal()
  };

  _removeLink: Function = (): void => {
    const { editorState, onChange } = this.props
    const { currentEntity } = this.state
    let selection = editorState.getSelection()
    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity)
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end
      })
      onChange(RichUtils.toggleLink(editorState, selection, null), true)
    }
  };

  _stopPropagation: Function = (event) => {
    event.stopPropagation()
  };

  renderAddLinkModal() {
    const { linkTitle, linkTarget } = this.state
    return (
      <div className='link-modal' onClick={this._stopPropagation}>
        <span className='link-modal-label'>链接标题</span>
        <input
          className='link-modal-input'
          onChange={this._updateLinkTitle}
          onBlur={this._updateLinkTitle}
          value={linkTitle} />
        <span className='link-modal-label'>目标</span>
        <input
          className='link-modal-input'
          onChange={this._updateLinkTarget}
          onBlur={this._updateLinkTarget}
          value={linkTarget} />
        <span className='link-modal-buttonsection'>
          <button
            className='link-modal-btn'
            onClick={this._addLink}
            disabled={!linkTarget || !linkTitle}>确认</button>
          <button className='link-modal-btn' onClick={this._toggleLinkModal}>取消</button>
        </span>
      </div>
    )
  }

  render(): Object {
    const { showModal, currentEntity } = this.state
    return (
      <div className='link-wrapper'>
        <Option
          value='unordered-list-item'
          onClick={this._toggleLinkModal}>
          <Icon type='link' className='link-icon' role='presentation' />
        </Option>
        <Option
          disabled={!currentEntity}
          value='ordered-list-item'
          onClick={this._removeLink}>
          <Icon type='unlink' className='link-icon' role='presentation' />
        </Option>
        {showModal ? this.renderAddLinkModal() : undefined}
      </div>
    )
  }
}

export default LinkControl
