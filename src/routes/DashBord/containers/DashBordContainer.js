import React from 'react'
import {connect} from 'react-redux'
//import classNames from 'classnames'
import styles from 'components/App.scss'
import {Icon as IconFa} from 'components/Icon'

import Editor from 'components/Editor/index'
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/pie'
//import echarts from 'echarts'
//import Scrollbar from 'components/Scrollbars/index'
  // <Scrollbar style={{ height: '80%', overflow: 'hidden' }}>
  // </Scrollbar>
  // <div style={{height: '20%', overflow: 'hidden'}}>
  //   <h1>封装方法：切换路由/本地缓存数据结构/</h1>
  // </div>
class DashBordContainer extends React.Component {
  // componentWillMount = () => {
  // }
  state: any = {
    editorContent: undefined
  };
  componentDidMount = () => {
    //this.EC = echarts.init(this.refs.EC)
    //this.EC.setOption(options)
    //console.error(_cacheData)
  }
  componentWillUnmount = () => {
  }
  refreshDataCallback = () => {
    console.warn('getFirst Data')
  }
  onEditorChange = (editorContent) => {
    this.setState({
      editorContent
    })
    //draftToHtml(editorContent)
  }
  uploadImageCallBack = (file) => new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://192.168.30.101/api.php?service=new/upload/')
      //xhr.setRequestHeader('Authorization', '')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const j = JSON.parse(xhr.responseText)
        const data = {}
        if (j.s > 0) {
          data.link = j.d.link
        } else {
          data.link = '/b.gif'
        }
        resolve({data})
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    }
  )

  render() {
    console.log(' -- app DashBord render...')
    return (
      <div className={styles.content}>
        首页
        <IconFa spin type='spinner' />
        <div>
          <Editor toolbarClassName='z-toolbar'
            wrapperClassName='z-wrapper'
            editorClassName='z-editor'
            onChange={this.onEditorChange}
            toolbarAlwaysVisible
            uploadImageCallBack={this.uploadImageCallBack} />
        </div>
      </div>
    )
  }
}

export default connect(state => ({

}))(DashBordContainer)
