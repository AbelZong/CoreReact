import React, { Component, PropTypes } from 'react'
import { Entity, AtomicBlockUtils } from 'draft-js'
import classNames from 'classnames'
import Option from '../Option'
import Spinner from '../Spinner'
import styles from './styles.scss' // eslint-disable-line no-unused-vars
//import image from '../../../../images/image.svg';
import Icon from 'components/Icon/index'

class ImageControl extends Component {

  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uploadImageCallBack: PropTypes.func,
    hideModal: PropTypes.bool
  };

  state: Object = {
    imgSrc: '',
    showModal: false,
    dragEnter: false,
    showImageUpload: !!this.props.uploadImageCallBack,
    showImageLoading: false
  };

  componentWillReceiveProps(properties: Object): void {
    if (properties.hideModal && this.state.showModal) {
      this.setState({
        showModal: false
      })
    }
  }

  _showImageUploadOption: Function = (): void => {
    this.setState({
      showImageUpload: true
    })
  };

  _showImageURLOption: Function = (): void => {
    this.setState({
      showImageUpload: false
    })
  };

  _toggleShowImageLoading: Function = (): void => {
    const showImageLoading = !this.state.showImageLoading
    this.setState({
      showImageLoading
    })
  };

  _updateImageSrc: Function = (event: Object): void => {
    this.setState({
      imgSrc: event.target.value
    })
  };

  _toggleModal: Function = (): void => {
    const { showModal } = this.state
    const newState = {}
    newState.showModal = !showModal
    newState.imgSrc = undefined
    this.setState(newState)
  };

  _selectImage: Function = (event: Object): void => {
    if (event.target.files && event.target.files.length > 0) {
      this._uploadImage(event.target.files[0])
    }
  };

  _onImageDrop: Function = (event: Object): void => {
    event.preventDefault()
    event.stopPropagation()
    this._uploadImage(event.dataTransfer.files[0])
  };

  _uploadImage: Function = (file: Object): void => {
    this._toggleShowImageLoading()
    const { uploadImageCallBack } = this.props
    uploadImageCallBack(file)
      .then(({ data }) => {
        this.setState({
          showImageLoading: false,
          dragEnter: false
        })
        this._addImage(undefined, data.link)
      })
  };

  _addImage: Function = (event: Object, imgSrc: string): void => {
    const { editorState, onChange } = this.props
    const src = imgSrc || this.state.imgSrc
    const entityKey = Entity.create('IMAGE', 'MUTABLE', { src })
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    )
    onChange(newEditorState)
    this._toggleModal()
  };

  _onDragEnter: Function = (event: Object): void => {
    this._stopPropagation(event)
    this.setState({
      dragEnter: true
    })
  };

  _stopPropagationPreventDefault: Function = (event: Object): void => {
    event.preventDefault()
    event.stopPropagation()
  };

  _stopPropagation: Function = (event: Object): void => {
    event.stopPropagation()
  };

  renderAddImageModal(): Object {
    const { imgSrc, showImageUpload, showImageLoading, dragEnter } = this.state
    const { uploadImageCallBack } = this.props
    return (
      <div className='image-modal' onClick={this._stopPropagation}>
        <div className='image-modal-header'>
          {uploadImageCallBack ? (
            <div
              onClick={this._showImageUploadOption}
              className={classNames(
                  'image-modal-header-option',
                  { 'active': showImageUpload }
                )}>
              图片上传
            </div>
          ) : undefined }
          <div
            onClick={this._showImageURLOption}
            className={classNames(
                'image-modal-header-option',
                { 'active': !showImageUpload }
              )}>
            URL
          </div>
        </div>
        {
          showImageUpload && uploadImageCallBack ? (
            <div>
              <div
                onDragEnter={this._stopPropagationPreventDefault}
                onDragOver={this._stopPropagationPreventDefault}
                onDrop={this._onImageDrop}
                className={classNames(
                'image-modal-upload-option',
                { 'image-modal-upload-option-highlighted': dragEnter })}>
                <label
                  htmlFor='file'
                  className='image-modal-upload-option-label'>
                  拖拽或点击
                </label>
              </div>
              <input
                type='file'
                id='file'
                onChange={this._selectImage}
                className='image-modal-upload-option-input' />
            </div>
          ) : (
            <div className='image-modal-url-section'>
              <input
                className='image-modal-url-input'
                placeholder='输入URL'
                onChange={this._updateImageSrc}
                onBlur={this._updateImageSrc}
                value={imgSrc} />
            </div>
          )
        }
        <span className='image-modal-btn-section'>
          <button
            className='image-modal-btn'
            onClick={this._addImage}
            disabled={!imgSrc}>
            确认
          </button>
          <button
            className='image-modal-btn'
            onClick={this._toggleModal}>
            取消
          </button>
        </span>
        {showImageLoading ? (
          <div className='image-modal-spinner'>
            <Spinner />
          </div>
        ) : undefined}
      </div>
    )
  }

  render(): Object {
    const { showModal } = this.state
    return (
      <div className='image-wrapper'>
        <Option
          value='unordered-list-item'
          onClick={this._toggleModal}>
          <Icon type='image' className='image-icon' role='presentation' />
        </Option>
        {showModal ? this.renderAddImageModal() : undefined}
      </div>
    )
  }
}

export default ImageControl
