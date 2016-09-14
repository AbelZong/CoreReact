import React, { Component, PropTypes } from 'react'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  DefaultDraftBlockRenderMap
} from 'draft-js'
import {
  changeDepth,
  handleNewLine,
  customStyleMap
} from 'draftjs-utils'
import { Map } from 'immutable'
import InlineControl from '../InlineControl'
import BlockControl from '../BlockControl'
import FontSizeControl from '../FontSizeControl'
import FontFamilyControl from '../FontFamilyControl'
import ListControl from '../ListControl'
import ColorPicker from '../ColorPicker'
import LinkControl from '../LinkControl'
import ImageControl from '../ImageControl'
import HistoryControl from '../HistoryControl'
import LinkDecorator from '../../Decorators/Link'
import ImageBlockRenderer from '../../Renderer/Image'
import draft from 'styles/draft.scss' // eslint-disable-line no-unused-vars
import styles from './styles.scss' // eslint-disable-line no-unused-vars

class WysiwygEditor extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    rawContent: PropTypes.object,
    toolbarAlwaysVisible: PropTypes.bool,
    toolbarClassName: PropTypes.string,
    editorClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    inlineControlInDropdown: PropTypes.bool,
    listControlInDropdown: PropTypes.bool,
    uploadImageCallBack: PropTypes.func
  }

  static defaultProps = {
    toolbarAlwaysVisible: false
  }

  state: Object = {
    editorState: undefined,
    toolBarMouseDown: false,
    editorFocused: false,
    editorMouseDown: false
  }

  componentWillMount(): void {
    let editorState
    const decorator = new CompositeDecorator([LinkDecorator])
    if (this.props.rawContent) {
      editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromRaw(this.props.rawContent), decorator))
    } else {
      editorState = EditorState.createEmpty(decorator)
    }
    editorState = EditorState.moveFocusToEnd(editorState)
    this.setState({
      editorState
    })
  }

  customBlockRenderMap: Map = DefaultDraftBlockRenderMap
    .merge(new Map({
      unstyled: {
        element: 'div' //old p
      }
    }));

  _onChange: Function = (editorState: Object, focusEditor: boolean): void => {
    this.setState({
      editorState
    }, this._afterChange(focusEditor))
  };

  _afterChange: Function = (focusEditor: Boolean): void => {
    setTimeout(() => {
      if (focusEditor) {
        this._focusEditor()
      }
      if (this.props.onChange) {
        const editorContent = convertToRaw(this.state.editorState.getCurrentContent())
        this.props.onChange(editorContent)
      }
    })
  };

  _setEditorReference: Function = (ref: Object): void => {
    console.log('this.editor setting', ref)
    this.editor = ref
  };

  _onToolbarMouseDown: Function = (): void => {
    this.setState({
      toolBarMouseDown: true
    })
  };

  _onToolbarMouseUp: Function = (): void => {
    this.setState({
      toolBarMouseDown: false,
      editorFocused: true
    })
  };

  _onEditorFocus: Function = (): void => {
    this.setState({
      toolBarMouseDown: false,
      editorFocused: true
    })
  };

  _onEditorBlur: Function = (): void => {
    this.setState({
      editorFocused: false
    })
  };

  _onEditorMouseDown: Function = (): void => {
    this.setState({
      editorMouseDown: true
    })
  };

  _onEditorMouseUp: Function = (): void => {
    this.setState({
      editorMouseDown: false
    })
  };

  _focusEditor: Function = (): void => {
    console.log('this.editor.................', this.editor)
    setTimeout(() => {
      //todo
      // this.editor.focus();
    })
  };

  _handleKeyCommand: Function = (command: Object): boolean => {
    const { editorState } = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this._onChange(newState, this._focusEditor)
      return true
    }
    return false
  };

  _onTab: Function = (event: Object): boolean => {
    event.preventDefault()
    const editorState = changeDepth(this.state.editorState, event.shiftKey ? -1 : 1, 4)
    if (editorState) {
      this._onChange(editorState)
      return true
    }
    return false
  };

  _handleReturn: Function = (event: Object): boolean => {
    const editorState = handleNewLine(this.state.editorState, event)
    if (editorState) {
      this._onChange(editorState)
      return true
    }
    return false
  };

  render() {
    const {
      editorState,
      editorFocused,
      editorMouseDown,
      toolBarMouseDown
     } = this.state

    const {
      toolbarAlwaysVisible,
      inlineControlInDropdown,
      toolbarClassName,
      editorClassName,
      wrapperClassName,
      uploadImageCallBack
    } = this.props

    const hasFocus = editorFocused || toolBarMouseDown || editorMouseDown

    return (
      <div className={`editor-wrapper ${wrapperClassName}`}>
      {
        (hasFocus || toolbarAlwaysVisible) ? (
          <div
            className={`editor-toolbar ${toolbarClassName}`}
            onMouseDown={this._onToolbarMouseDown}
            onMouseUp={this._onToolbarMouseUp}
            onClick={this._focusEditor}
          >
            <InlineControl
              onChange={this._onChange}
              editorState={editorState}
              inDropdown={inlineControlInDropdown}
            />
            <BlockControl
              onChange={this._onChange}
              focusEditor={this._focusEditor}
              editorState={editorState}
            />
            <FontSizeControl
              onChange={this._onChange}
              editorState={editorState}
            />
            <FontFamilyControl
              onChange={this._onChange}
              editorState={editorState}
            />
            <ListControl
              onChange={this._onChange}
              editorState={editorState}
              inDropdown={inlineControlInDropdown}
            />
            <ColorPicker
              onChange={this._onChange}
              editorState={editorState}
              hideModal={editorMouseDown || !hasFocus}
            />
            <LinkControl
              editorState={editorState}
              onChange={this._onChange}
              hideModal={editorMouseDown || !hasFocus}
            />
            <ImageControl
              editorState={editorState}
              onChange={this._onChange}
              uploadImageCallBack={uploadImageCallBack}
              hideModal={editorMouseDown || !hasFocus}
            />
            <HistoryControl
              editorState={editorState}
              onChange={this._onChange}
            />
          </div>
        ) : undefined
      }
        <div
          className={`editor-main ${editorClassName}`}
          onClick={this._focusEditor}
          onFocus={this._onEditorFocus}
          onBlur={this._onEditorBlur}
          onMouseUp={this._onEditorMouseUp}
          onMouseDown={this._onEditorMouseDown}
        >
          <Editor
            ref='editor'
            spellCheck
            onTab={this._onTab}
            editorState={editorState}
            onChange={this._onChange}
            customStyleMap={customStyleMap}
            handleReturn={this._handleReturn}
            blockRendererFn={ImageBlockRenderer}
            blockRenderMap={this.customBlockRenderMap}
            handleKeyCommand={this._handleKeyCommand}
          />
        </div>
      </div>
    )
  }
}

export default WysiwygEditor
// todo: ESC key handling on editor to close modals
