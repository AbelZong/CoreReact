import React, { PropTypes, Component } from 'react'
import { Entity } from 'draft-js'
import styles from './styles.scss' // eslint-disable-line no-unused-vars
import Option from '../../components/Option'
import classNames from 'classnames'

class Imager extends Component {

  static propTypes: Object = {
    block: PropTypes.object.isRequired
  };

  state: Object = {
    hovered: false
  }

  _toggleHovered: Function = (): void => {
    const hovered = !this.state.hovered
    this.setState({
      hovered
    })
  };

  _setEntityAlignmentLeft: Function = (): void => {
    this._setEntityAlignment('left')
  };

  _setEntityAlignmentRight: Function = (): void => {
    this._setEntityAlignment('right')
  };

  _setEntityAlignmentCenter: Function = (): void => {
    this._setEntityAlignment('none')
  };

  _setEntityAlignment: Function = (alignment): void => {
    const { block } = this.props
    const entityKey = block.getEntityAt(0)
    Entity.mergeData(
      entityKey,
      { alignment }
    )
    this.setState({
      dummy: true
    })
  };

  _renderAlignmentOptions(): Object {
    return (
      <div className='image-alignment-options-popup'>
        <Option onClick={this._setEntityAlignmentLeft} className='image-alignment-option'>L</Option>
        <Option onClick={this._setEntityAlignmentCenter} className='image-alignment-option'>C</Option>
        <Option onClick={this._setEntityAlignmentRight} className='image-alignment-option'>R</Option>
      </div>
    )
  }

  render(): Object {
    const { block } = this.props
    const { hovered } = this.state
    const entity = Entity.get(block.getEntityAt(0))
    const { src, alignment } = entity.getData()
    return (
      <span
        onMouseEnter={this._toggleHovered}
        onMouseLeave={this._toggleHovered}
        className={classNames(
          'image-alignment',
          {
            'image-left': alignment === 'left',
            'image-right': alignment === 'right',
            'image-center': !alignment || alignment === 'none'
          }
        )}
      >
        <span className='image-imagewrapper'>
          <img src={src} role='presentation' />
          {
            hovered ? this._renderAlignmentOptions() : undefined
          }
        </span>
      </span>
    )
  }
}

export default Imager
