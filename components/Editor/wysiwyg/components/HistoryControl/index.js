/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-13 16:56:33
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component, PropTypes } from 'react'
import Option from '../Option'
import { EditorState } from 'draft-js'
// import undo from '../../../../images/undo.svg';
// import redo from '../../../../images/redo.svg';
import styles from './styles.scss' // eslint-disable-line no-unused-vars
import Icon from 'components/Icon/index'

class HistoryControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object
  };

  state: Object = {
    undoDisabled: false,
    redoDisabled: false
  };

  componentWillMount(): void {
    const { editorState } = this.props
    if (editorState) {
      this.setState({
        undoDisabled: editorState.getUndoStack().size === 0,
        redoDisabled: editorState.getRedoStack().size === 0
      })
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        undoDisabled: properties.editorState.getUndoStack().size === 0,
        redoDisabled: properties.editorState.getRedoStack().size === 0
      })
    }
  }

  _undo: Function = () => {
    const { editorState, onChange } = this.props
    const newState = EditorState.undo(editorState)
    if (newState) {
      onChange(newState, true)
    }
  };

  _redo: Function = () => {
    const { editorState, onChange } = this.props
    const newState = EditorState.redo(editorState)
    if (newState) {
      onChange(newState, true)
    }
  };

  render(): Object {
    const {
      undoDisabled,
      redoDisabled
    } = this.state
    return (
      <div className='history-wrapper'>
        <Option
          value='unordered-list-item'
          onClick={this._undo}
          disabled={undoDisabled}>
          <Icon type='undo' className='history-icon' role='presentation' />
        </Option>
        <Option
          value='ordered-list-item'
          onClick={this._redo}
          disabled={redoDisabled}>
          <Icon type='repeat' className='history-icon' role='presentation' />
        </Option>
      </div>
    )
  }
}

export default HistoryControl
