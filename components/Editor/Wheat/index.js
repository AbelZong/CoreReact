import React from 'react'
import {
  Editor,
  EditorState
} from 'draft-js'
import styles from './index.scss'
import Icon from 'components/Icon'
export default React.createClass({
  getInitialState() {
    return {editorState: EditorState.createEmpty()}
  },
  handleChange(editorState) {
    this.setState({editorState})
    this.props.onChange && this.props.onChange(editorState.getCurrentContent().getPlainText())
  },
  render() {
    const {editorState} = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.toolbars}>
          <Icon type='blod' />
        </div>
        <Editor editorState={editorState} onChange={this.handleChange} />
      </div>
    )
  }
})
