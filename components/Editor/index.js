/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-13 16:06:10
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
//import Editor from './Editor'
//import Editor from './Wheat/index'
//export default Editor

//todo optimization damnit
import React from 'react'
import {Editor} from './wysiwyg/index'
import './wysiwyg.scss'
export default React.createClass({
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.refs.wheat.setContent(nextProps.value)
    }
  },
  handleChange(html, editorState) {
    this.props.onChange && this.props.onChange(html)
  },
  render() {
    return <Editor toolbarAlwaysVisible onChange={this.handleChange} ref='wheat' />
  }
})
// import React from 'react'
// import { Editor } from 'react-draft-wysiwyg'
// import {convertFromHTML, convertToHTML} from 'draft-convert'
// import './wysiwyg.scss'
// export default React.createClass({
//   componentWillReceiveProps(nextProps) {
//     if (this.props.value !== nextProps.value) {
//       console.log(nextProps)
//     }
//   },
//   handleChange(editorState) {
//     console.log(editorState)
//     this.props.onChange && this.props.onChange(convertToHTML(editorState))
//   },
//   render() {
//     return <Editor toolbarAlwaysVisible onChange={this.handleChange} />
//   }
// })
