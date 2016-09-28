import React, { Component } from 'react'
import update from 'react-addons-update'
import { Select, Button, Tooltip, Radio, Icon, Modal, Popconfirm, Form, Input } from 'antd'
import {Icon as IconFA} from 'components/Icon'
import { connect } from 'react-redux'
import { changeDomCss, setAct, changeDomExt, modifyTitle, removeDom } from '../../modules/actionsModify'

const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const cssDefault = {
  fontFamily: '', //默认字体,
  fontSize: '12px', //9~60 拖放吧？
  fontWeight: 400, //400 or 700
  fontStyle: 'normal', //oblique italic,
  textDecoration: '', //none underline
  overflow: ''
}

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      css: cssDefault,
      //ext: extDefault,
      modalTitleVisible: false,
      modalTitleValue: ''
    }
  }

  //初始化 state: item改变时
  componentWillReceiveProps(nextProps) {
    //从有到无，或者不是同一个
    if (this.props.item !== null && nextProps.item === null) {
      this._updateState({
        css: {
          $set: cssDefault
        }
      })
      return
    }
    if (JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item)) {
      this._updateState({
        css: {
          $set: Object.assign({}, cssDefault, nextProps.item.css)
        }
      })
    }
  }
  //优化！
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!nextProps.item) { //如果还没有选中的，则制止渲染
  //     return false
  //   }
  //   //状态更新，则要允许渲染
  //   // if (this.state.modalTitleValue !== nextState.modalTitleValue || this.state.modalTitleVisible !== nextState.modalTitleVisible) {
  //   //   return true
  //   // }
  //   // const thisStateKeys = Object.keys(this.state.css)
  //   // const nextStateKeys = Object.keys(nextState.css)
  //   // if (thisStateKeys.length !== nextStateKeys.length) {
  //   //   return true
  //   // }
  //   // if (thisStateKeys.some((k) => this.state.css[k] !== nextState.css[k])) {
  //   //   return true
  //   // }
  //   if (this.state !== nextState || this.state.css !== nextState.css || this.state.ext !== nextState.ext) {
  //     return true
  //   }
  //   //如果item没有改变，则制止渲染
  //   if (!!this.props.item && !!nextProps.item && this.props.item.type === nextProps.item.type && this.props.item.id === nextProps.item.id && this.props.item.actived === nextProps.item.actived && this.props.item.name === nextProps.item.name && this.props.item.act === nextProps.item.act && this.props.item.ext === nextProps.ext) {
  //     return false
  //   }
  //   return true
  // }
  removeDom() {
    if (!this.doAllowed()) { return }
    const { type, id } = this.props.item
    this.props.dispatch(removeDom(type, id))
  }
//是否允许操作
  doAllowed() {
    if (this.props.item === null) {
      return false
    }
    return true
  }
  openModalTitle() {
    if (!this.doAllowed()) { return }
    this._updateState({
      modalTitleValue: {
        $set: this.props.item.name
      },
      modalTitleVisible: {
        $set: true
      }
    })
  }

  changeDomExt(field, value) {
    if (!this.doAllowed()) { return }
    const { id, type } = this.props.item
    this.props.dispatch(changeDomExt(type, id, {
      [field]: value
    }))
  }
  modifyTitle() {
    if (!this.doAllowed()) { return }
    const value = this.refs.modalTitleInput.refs.input.value
    this._updateState({
      modalTitleVisible: {
        $set: false
      }
    }, () => {
      const { id, type } = this.props.item
      this.props.dispatch(modifyTitle(type, id, value))
    })
  }
  closeModalTitle() {
    this._updateState({
      modalTitleValue: {
        $set: this.props.item.name
      },
      modalTitleVisible: {
        $set: false
      }
    })
  }
  modalTitleInputChange(e) {
    this._updateState({
      modalTitleValue: {
        $set: e.target.value
      }
    })
  }
  changeAct(newAct) {
    if (!this.doAllowed()) { return }
    const { id, type, act } = this.props.item
    this.props.dispatch(setAct(type, id, newAct === act ? 0 : newAct))
  }

  _updateCssState(obj, callback) {
    this.setState(update(this.state, {
      css: obj
    }), callback)
  }
  _updateState(obj, callback) {
    this.setState(update(this.state, obj), callback)
  }
  changeStyle(field, value) {
    if (!this.doAllowed()) { return }
    this._updateCssState({
      [field]: {
        $set: value
      }
    }, () => {
      this.props.dispatch(changeDomCss(this.props.item, {
        [field]: this.state.css[field]
      }))
    })
  }
  //修改溢出时样式
  changeTextOvh(value) {
    if (!this.doAllowed()) { return }
    let merge = null
    switch (value) {
      case 'visible': {
        merge = {
          overflow: 'visible',
          wordBreak: 'break-all'
        }
        break
      }
      case 'hidden': {
        merge = {
          overflow: 'hidden',
          wordBreak: 'normal'
        }
        break
      }
      default: {
        merge = {
          overflow: '',
          wordBreak: ''
        }
        break
      }
    }
    if (merge !== null) {
      this._updateCssState({
        $merge: merge
      }, () => {
        this.props.dispatch(changeDomCss(this.props.item, merge))
      })
    }
  }
  changeTextAlign(e) {
    if (!this.doAllowed()) { return }
    let merge = null
    const value = e.target.value === this.state.css.textAlign ? '' : e.target.value
    switch (value) {
      case 'left': {
        merge = {
          textAlign: value,
          marginLeft: '',
          marginRight: ''
        }
        break
      }
      case 'center': {
        merge = {
          textAlign: value,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
        break
      }
      case 'right': {
        merge = {
          textAlign: value,
          marginLeft: 'auto',
          marginRight: ''
        }
        break
      }
      default: {
        merge = {
          textAlign: '',
          marginLeft: '',
          marginRight: ''
        }
        break
      }
    }
    if (merge !== null) {
      this._updateCssState({
        $merge: merge
      }, () => {
        this.props.dispatch(changeDomCss(this.props.item, merge))
      })
    }
  }
  //更新选择状态，当前有 changeTextAlign as => changeTextAlign
  // chooseStyle(field, e) {
  //   if (!this.doAllowed()) { return; }
  //   this._updateCssState({
  //     [field]: {
  //       $set: e.target.value === this.state.css[field] ? '' : e.target.value,
  //     },
  //   }, function callbak() {
  //     this.props.dispatch(changeDomCss(this.props.item, {
  //       [field]: this.state.css[field],
  //     }))
  //   })
  // }
  toggleStyle(field) {
    if (!this.doAllowed()) { return }
    let value = {}
    const oldValue = this.state.css[field]
    switch (field) {
      case 'fontWeight': {
        value = {
          $set: oldValue !== 700 ? 700 : ''
        }
        break
      }
      case 'fontStyle': {
        value = {
          $set: oldValue === 'oblique' ? '' : 'oblique'
        }
        break
      }
      case 'textDecoration': {
        value = {
          $set: oldValue === 'underline' ? '' : 'underline'
        }
        break
      }
      default: break
    }
    //value 为空的时候就是删除
    this._updateCssState({
      [field]: value
    }, () => {
      //console.log(field, this.state.css[field])
      this.props.dispatch(changeDomCss(this.props.item, {
        [field]: this.state.css[field]
      }))
    })
  }

  // &nbsp
  // <Tooltip title="图片" placement="top">
  // <Button type={act === 1 ? 'primary' : 'ghost'} size="small" icon="picture" onClick={this.changeAct.bind(this, 1)} />
  // </Tooltip>
  render() {
    const { item } = this.props
    //const aa = !!item ? Object.assign({}, this.state.css, item.css) : this.state.css
    const { fontFamily, fontSize, fontWeight, fontStyle, textDecoration, textAlign, overflow } = /*!!item ? Object.assign({}, this.state.css, item.css) :*/ this.state.css
    const { modalTitleValue } = this.state
    const act = item ? item.act : -1
    const barcodeWidth = item && item.ext.barcodeWidth ? item.ext.barcodeWidth : ''
    //是否允许条形码 二维码
    const codeEnabled = (() => {
      if (item) {
        return (item.type === 2) || (item.type === 3 && item.actived === 2)
      }
      return false
    })()
    const allDisabled = !item || item.type === 5
    //console.log('reder-->editor;', overflow)
    return (
      <div>
        <Select style={{ width: 110 }} size='small' value={fontFamily} onChange={this.changeStyle.bind(this, 'fontFamily')} disabled={allDisabled}>
          <Option value=''>系统默认字体</Option>
          <Option value='宋体'>宋体</Option>
          <Option value='黑体'>黑体</Option>
          <Option value='Microsoft YaHei'>微软雅黑</Option>
          <Option value='Arial'>Arial</Option>
        </Select>
        &nbsp;
        <Select style={{ width: 80 }} size='small' value={fontSize} onChange={this.changeStyle.bind(this, 'fontSize')} disabled={allDisabled}>
          <Option value='9px'>9px</Option>
          <Option value='10px'>10px</Option>
          <Option value='11px'>11px</Option>
          <Option value='12px'>12px</Option>
          <Option value='14px'>14px</Option>
          <Option value='16px'>16px</Option>
          <Option value='18px'>18px</Option>
          <Option value='22px'>22px</Option>
          <Option value='26px'>26px</Option>
          <Option value='32px'>32px</Option>
          <Option value='40px'>40px</Option>
          <Option value='60px'>60px</Option>
        </Select>
        &emsp;
        <Button type={fontWeight === 700 ? 'primary' : 'ghost'} size='small' onClick={this.toggleStyle.bind(this, 'fontWeight')} disabled={allDisabled}>
          <Tooltip title='粗体' placement='top'><IconFA type='bold' /></Tooltip>
        </Button>
        &nbsp;
        <Button type={fontStyle === 'oblique' ? 'primary' : 'ghost'} size='small' onClick={this.toggleStyle.bind(this, 'fontStyle')} style={{ fontStyle: 'oblique', fontFamily: 'inhert' }} disabled={allDisabled}>
          <Tooltip title='斜体' placement='top'><IconFA type='italic' /></Tooltip>
        </Button>
        &nbsp;
        <Button type={textDecoration === 'underline' ? 'primary' : 'ghost'} size='small' onClick={this.toggleStyle.bind(this, 'textDecoration')} disabled={allDisabled}>
          <Tooltip title='下划线' placement='top'><IconFA type='underline' /></Tooltip>
        </Button>
        &nbsp;
        <RadioGroup value={textAlign} size='small' onChange={this.changeTextAlign.bind(this)} disabled={allDisabled}>
          <RadioButton value='left'><Tooltip title='居左' placement='top'><IconFA type='align-left' /></Tooltip></RadioButton>
          <RadioButton value='center'><Tooltip title='居中' placement='top'><IconFA type='align-center' /></Tooltip></RadioButton>
          <RadioButton value='right'><Tooltip title='居右' placement='top'><IconFA type='align-right' /></Tooltip></RadioButton>
        </RadioGroup>
        &nbsp;
        <Popconfirm title='确定要删除的节点吗' onConfirm={this.removeDom.bind(this)}>
          <Button type='ghost' size='small' disabled={allDisabled && !item}>
            <Tooltip title='删除节点' placement='top'><IconFA type='trash-o' /></Tooltip>
          </Button>
        </Popconfirm>
        &nbsp;
        <Button type='ghost' size='small' onClick={this.openModalTitle.bind(this)} disabled={!item || !(item.type === 4 || (item.type === 3 && item.actived === 1))}>
          <Tooltip title='编辑文本' placement='top'><strong>T</strong></Tooltip>
        </Button>

        <Modal title='修改节点显示文本' wrapClassName='vertical-center-modal' visible={this.state.modalTitleVisible} footer={false} closable={false}>
          <Form horizontal>
            <Form.Item label='文本' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Input ref='modalTitleInput' type='text' placeholder='请输入显示文本...' value={modalTitleValue} onChange={this.modalTitleInputChange.bind(this)} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 7 }}>
              <Button type='ghost' onClick={this.closeModalTitle.bind(this)}>取消</Button>
              &emsp;
              <Button type='primary' onClick={this.modifyTitle.bind(this)}>确定</Button>
            </Form.Item>
          </Form>
        </Modal>
        &nbsp;
        <Button type={act === 2 ? 'primary' : 'ghost'} size='small' disabled={!codeEnabled} onClick={this.changeAct.bind(this, 2)}>
          <Tooltip title='转二维码显示' placement='top'><Icon type='qrcode' /></Tooltip>
        </Button>
        &nbsp;
        <Button type={act === 3 ? 'primary' : 'ghost'} size='small' disabled={!codeEnabled} onClick={this.changeAct.bind(this, 3)}>
          <Tooltip title='转条形码显示' placement='top'><span>||||</span></Tooltip>
        </Button>
        &nbsp;
        <Select style={{ width: 140 }} size='small' value={barcodeWidth} disabled={!codeEnabled || act !== 3} onChange={this.changeDomExt.bind(this, 'barcodeWidth')}>
          <Option value=''>条码线条粗细默认</Option>
          <Option value='1'>条码线条粗细:1像素</Option>
          <Option value='2'>条码线条粗细:2像素</Option>
          <Option value='3'>条码线条粗细:3像素</Option>
        </Select>
        &emsp;
        <Select style={{ width: 120 }} size='small' value={overflow} onChange={this.changeTextOvh.bind(this)} disabled={allDisabled}>
          <Option value=''>内容溢出时默认</Option>
          <Option value='visible'>内容溢出时换行</Option>
          <Option value='hidden'>内容溢出时隐藏</Option>
        </Select>
      </div>
    )
  }
}

export default connect(state => ({
  item: state.pm_editItem
}))(Editor)
